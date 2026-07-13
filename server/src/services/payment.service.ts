import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Initialize Razorpay lazily
let razorpay: Razorpay | null = null;

const getRazorpay = () => {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      logger.warn('Razorpay credentials not configured');
      return null;
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

/**
 * Create a Razorpay order for payment
 */
export async function createRazorpayOrder(orderId: string, amount: number) {
  try {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
    }

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId,
      },
    });

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        gateway: 'razorpay',
        gatewayOrderId: order.id,
        amount,
        status: 'created',
      },
    });

    logger.info('Razorpay order created', {
      orderId,
      razorpayOrderId: order.id,
      amount,
    });

    return {
      success: true,
      paymentId: payment.id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error: any) {
    logger.error('Failed to create Razorpay order', {
      orderId,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Verify payment signature (server-side)
 */
export async function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(razorpaySignature),
      Buffer.from(expectedSignature)
    );

    return isValid;
  } catch (error) {
    logger.error('Signature verification failed', { razorpayOrderId, razorpayPaymentId });
    return false;
  }
}

/**
 * Handle successful payment verification
 */
export async function handlePaymentSuccess(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: { gatewayOrderId: razorpayOrderId },
      include: { order: true },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Verify signature
    const isValid = await verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      // Mark payment as failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          errorCode: 'INVALID_SIGNATURE',
          errorDescription: 'Payment signature verification failed',
        },
      });
      throw new Error('Invalid payment signature');
    }

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        gatewayPaymentId: razorpayPaymentId,
        gatewaySignature: razorpaySignature,
        status: 'captured',
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    // Update inventory (deduct stock)
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: payment.orderId },
    });

    for (const item of orderItems) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        // Log inventory change
        await prisma.inventoryLog.create({
          data: {
            variantId: item.variantId,
            change: -item.quantity,
            reason: 'SALE',
            referenceId: payment.orderId,
            notes: `Order ${payment.order?.orderNumber}`,
          },
        });
      }
    }

    logger.info('Payment verified and order confirmed', {
      paymentId: payment.id,
      orderId: payment.orderId,
      razorpayPaymentId,
    });

    return {
      success: true,
      paymentId: payment.id,
      orderId: payment.orderId,
    };
  } catch (error: any) {
    logger.error('Payment success handling failed', {
      razorpayOrderId,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Handle payment failure from webhook
 */
export async function handlePaymentFailure(
  razorpayOrderId: string,
  errorCode: string,
  errorDescription: string
) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { gatewayOrderId: razorpayOrderId },
    });

    if (!payment) {
      logger.warn('Payment not found for failure webhook', { razorpayOrderId });
      return;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        errorCode,
        errorDescription,
      },
    });

    // Update order status
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'UNPAID',
        },
      });
    }

    logger.info('Payment marked as failed', {
      paymentId: payment.id,
      errorCode,
    });
  } catch (error: any) {
    logger.error('Payment failure handling failed', {
      razorpayOrderId,
      error: error.message,
    });
  }
}

/**
 * Initiate a refund
 */
export async function initiateRefund(
  paymentId: string,
  amount: number,
  reason: string,
  initiatedById?: string
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'captured') {
      throw new Error('Payment has not been captured');
    }

    if (!payment.gatewayPaymentId) {
      throw new Error('No gateway payment ID found');
    }

    // Create refund record
    const refund = await prisma.paymentRefund.create({
      data: {
        paymentId,
        amount,
        reason,
        status: 'initiated',
        initiatedById,
      },
    });

    // Initiate refund with Razorpay
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      throw new Error('Razorpay is not configured. Cannot process refund.');
    }

    const razorpayRefund = await razorpayInstance.payments.refund(payment.gatewayPaymentId, {
      amount: Math.round(amount * 100), // Amount in paise
      notes: {
        refundReason: reason,
      },
    });

    // Update refund record
    await prisma.paymentRefund.update({
      where: { id: refund.id },
      data: {
        gatewayRefundId: razorpayRefund.id,
        status: 'completed',
        processedAt: new Date(),
      },
    });

    // Check if full refund
    const allRefunds = await prisma.paymentRefund.aggregate({
      where: { paymentId, status: 'completed' },
      _sum: { amount: true },
    });

    const totalRefunded = (allRefunds._sum.amount || 0) + amount;

    if (totalRefunded >= payment.amount) {
      // Full refund
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'refunded' },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'REFUNDED' },
      });
    } else {
      // Partial refund
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'partial_refund' },
      });
    }

    logger.info('Refund initiated successfully', {
      refundId: refund.id,
      razorpayRefundId: razorpayRefund.id,
      amount,
    });

    return {
      success: true,
      refundId: refund.id,
      razorpayRefundId: razorpayRefund.id,
      status: razorpayRefund.status,
    };
  } catch (error: any) {
    logger.error('Refund initiation failed', {
      paymentId,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Get payment details
 */
export async function getPaymentDetails(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      },
      refunds: true,
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return payment;
}

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  handlePaymentSuccess,
  handlePaymentFailure,
  initiateRefund,
  getPaymentDetails,
};
