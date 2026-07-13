import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { ValidationError } from '../middleware/errorHandler.js';
import { authenticateCustomer } from '../middleware/customerAuth.js';
import { logger } from '../utils/logger.js';
import {
  createRazorpayOrder,
  handlePaymentSuccess,
  handlePaymentFailure,
  getPaymentDetails,
  initiateRefund,
} from '../services/payment.service.js';
import { createInvoiceFromOrder, generateInvoicePDF } from '../services/invoice.service.js';
import { sendPaymentReceived, sendInvoiceReady } from '../services/whatsapp.service.js';
import path from 'path';
import fs from 'fs';

const router: Router = Router();
const prisma = new PrismaClient();

// ============================================
// Validation Middleware
// ============================================
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed',
      errors.array().reduce((acc, err: any) => {
        const field = err.path || 'unknown';
        acc[field] = [...(acc[field] || []), err.msg];
        return acc;
      }, {} as Record<string, string[]>)
    );
  }
  next();
};

// ============================================
// Customer Routes
// ============================================

/**
 * POST /api/v1/orders/:orderId/payment/create
 * Create Razorpay order for payment
 */
router.post('/orders/:orderId/payment/create', authenticateCustomer, [
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customerId!;

    // Verify order belongs to customer
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: customerId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    // Check if already paid
    if (order.paymentStatus === 'PAID') {
      res.status(400).json({
        success: false,
        error: 'Order is already paid',
      });
      return;
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment && existingPayment.status === 'created') {
      // Return existing Razorpay order
      res.json({
        success: true,
        data: {
          paymentId: existingPayment.id,
          razorpayOrderId: existingPayment.gatewayOrderId,
          amount: existingPayment.amount,
        },
      });
      return;
    }

    // Create new Razorpay order
    const result = await createRazorpayOrder(orderId, order.totalAmount);

    res.json({
      success: true,
      data: {
        paymentId: result.paymentId,
        razorpayOrderId: result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/orders/:orderId/payment/verify
 * Verify and confirm payment
 */
router.post('/orders/:orderId/payment/verify', authenticateCustomer, [
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const customerId = req.customerId!;

    // Verify order belongs to customer
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: customerId },
      include: { user: true },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    // Handle payment verification
    const result = await handlePaymentSuccess(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    // Create invoice
    const invoiceId = await createInvoiceFromOrder(orderId);

    // Generate PDF
    const pdfDir = path.join(process.cwd(), 'public', 'invoices');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `invoice-${order.orderNumber}.pdf`);
    await generateInvoicePDF(invoiceId, pdfPath);

    // Update invoice with PDF URL
    const pdfUrl = `/invoices/invoice-${order.orderNumber}.pdf`;
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { pdfUrl },
    });

    // Send WhatsApp notification
    try {
      if (order.user?.phone) {
        await sendPaymentReceived(orderId, order.user.phone);
        await sendInvoiceReady(orderId, order.user.phone, (await prisma.invoice.findUnique({ where: { id: invoiceId } }))?.invoiceNumber || '');
      }
    } catch (whatsappError) {
      logger.warn('WhatsApp notification failed', { orderId, error: (whatsappError as Error).message });
    }

    logger.info('Payment verified', { orderId, paymentId: result.paymentId });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: result.orderId,
        paymentId: result.paymentId,
        invoiceNumber: (await prisma.invoice.findUnique({ where: { id: invoiceId } }))?.invoiceNumber,
        pdfUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/orders/:orderId/payment
 * Get payment details for an order
 */
router.get('/orders/:orderId/payment', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customerId!;

    // Verify order belongs to customer
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: customerId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        refunds: true,
      },
    });

    if (!payment) {
      res.json({
        success: true,
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        method: payment.method,
        gatewayOrderId: payment.gatewayOrderId,
        gatewayPaymentId: payment.gatewayPaymentId,
        createdAt: payment.createdAt,
        refunds: payment.refunds,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/orders/:orderId/invoice
 * Get invoice for an order
 */
router.get('/orders/:orderId/invoice', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customerId!;

    // Verify order belongs to customer
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: customerId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    const invoice = await prisma.invoice.findUnique({
      where: { orderId },
    });

    if (!invoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
      });
      return;
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Webhook Routes (no auth - Razorpay will call these)
// ============================================

/**
 * POST /api/v1/webhooks/razorpay
 * Handle Razorpay webhook events
 */
router.post('/webhooks/razorpay', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'] as string;

    if (webhookSecret && signature) {
      const crypto = await import('crypto');
      const expectedSignature = crypto.createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        logger.warn('Invalid webhook signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    logger.info('Razorpay webhook received', { event });

    switch (event) {
      case 'payment.captured':
        const capturedOrderId = payload.payment.entity.notes?.orderId;
        if (capturedOrderId) {
          const payment = await prisma.payment.findFirst({
            where: { gatewayOrderId: payload.order.entity.id },
          });
          if (payment && payment.status !== 'captured') {
            await handlePaymentSuccess(
              payload.order.entity.id,
              payload.payment.entity.id,
              ''
            );
          }
        }
        break;

      case 'payment.failed':
        const failedOrderId = payload.payment.entity.notes?.orderId;
        if (failedOrderId) {
          await handlePaymentFailure(
            payload.order.entity.id,
            payload.payment.entity.error_code,
            payload.payment.entity.error_description
          );
        }
        break;

      case 'refund.created':
        const refundPaymentId = payload.refund.entity.payment_id;
        const refundId = payload.refund.entity.id;
        const refundAmount = payload.refund.entity.amount / 100;

        // Find payment record
        const payment = await prisma.payment.findFirst({
          where: { gatewayPaymentId: refundPaymentId },
        });

        if (payment) {
          // Update refund status
          await prisma.paymentRefund.updateMany({
            where: {
              paymentId: payment.id,
              gatewayRefundId: refundId,
            },
            data: {
              status: 'completed',
              processedAt: new Date(),
            },
          });
        }
        break;

      default:
        logger.info('Unhandled webhook event', { event });
    }

    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/webhooks/whatsapp
 * Handle WhatsApp webhook (for message status updates)
 */
router.post('/webhooks/whatsapp', async (req: Request, res: Response) => {
  try {
    const { entry } = req.body;

    for (const change of entry?.[0]?.changes || []) {
      const value = change.value;

      if (value?.statuses) {
        for (const status of value.statuses) {
          const messageId = status.id;
          const newStatus = status.status;

          // Map WhatsApp status to our status
          let dbStatus: string;
          switch (newStatus) {
            case 'delivered':
              dbStatus = 'delivered';
              break;
            case 'read':
              dbStatus = 'read';
              break;
            case 'failed':
              dbStatus = 'failed';
              break;
            default:
              continue;
          }

          // Update message status
          await prisma.whatsAppLog.updateMany({
            where: { providerMessageId: messageId },
            data: {
              status: dbStatus,
              ...(dbStatus === 'delivered' && { deliveredAt: new Date() }),
              ...(dbStatus === 'read' && { readAt: new Date() }),
            },
          });
        }
      }
    }

    // Respond with 200 to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    logger.error('WhatsApp webhook error', { error: (error as Error).message });
    res.sendStatus(500);
  }
});

/**
 * GET /api/v1/webhooks/whatsapp
 * WhatsApp webhook verification (GET request for verification)
 */
router.get('/webhooks/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('WhatsApp webhook verified');
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

export default router;
