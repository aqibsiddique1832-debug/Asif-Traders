import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// WhatsApp Cloud API configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

/**
 * WhatsApp template messages
 */
export const WHATSAPP_TEMPLATES = {
  // Order confirmation
  ORDER_CONFIRMED: 'order_confirmation',
  // Payment received
  PAYMENT_RECEIVED: 'payment_received',
  // Order shipped
  ORDER_SHIPPED: 'order_shipped',
  // Order delivered
  ORDER_DELIVERED: 'order_delivered',
  // Invoice ready
  INVOICE_READY: 'invoice_ready',
  // OTP
  OTP_MESSAGE: 'otp_message',
  // Quote received
  QUOTE_RECEIVED: 'quote_received',
  // Quote accepted
  QUOTE_ACCEPTED: 'quote_accepted',
  // Reminder
  QUOTE_REMINDER: 'quote_reminder',
};

/**
 * Send WhatsApp message via Cloud API
 */
export async function sendWhatsAppMessage(
  recipientPhone: string,
  templateName: string,
  templateVariables: Record<string, string>,
  relatedOrderId?: string,
  relatedQuoteId?: string
) {
  try {
    // Format phone number (ensure it has country code)
    const formattedPhone = formatPhoneNumber(recipientPhone);

    // Create log entry
    const log = await prisma.whatsAppLog.create({
      data: {
        recipientPhone: formattedPhone,
        templateName,
        templateVariables: JSON.stringify(templateVariables),
        relatedOrderId,
        relatedQuoteId,
        status: 'pending',
      },
    });

    // Build message body based on template
    const messageBody = buildTemplateMessage(templateName, templateVariables);

    // Update log with message content
    await prisma.whatsAppLog.update({
      where: { id: log.id },
      data: { messageContent: messageBody },
    });

    // Send via WhatsApp Cloud API
    const response = await fetch(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US',
          },
          components: buildTemplateComponents(templateName, templateVariables),
        },
      }),
    });

    const responseData = await response.json() as {
      messages?: Array<{ id: string }>;
      error?: { code: string; message: string };
    };

    if (response.ok && responseData.messages?.[0]?.id) {
      const messageId = responseData.messages[0].id;
      // Success
      await prisma.whatsAppLog.update({
        where: { id: log.id },
        data: {
          status: 'sent',
          providerMessageId: messageId,
          sentAt: new Date(),
        },
      });

      logger.info('WhatsApp message sent', {
        logId: log.id,
        recipientPhone: formattedPhone,
        templateName,
        messageId,
      });

      return {
        success: true,
        messageId,
        logId: log.id,
      };
    } else {
      // Error from WhatsApp API
      const errorCode = responseData.error?.code;
      const errorMessage = responseData.error?.message;

      await prisma.whatsAppLog.update({
        where: { id: log.id },
        data: {
          status: 'failed',
          errorCode: String(errorCode),
          errorMessage,
        },
      });

      logger.error('WhatsApp message failed', {
        logId: log.id,
        errorCode,
        errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        errorCode,
        logId: log.id,
      };
    }
  } catch (error: any) {
    logger.error('WhatsApp send error', {
      recipientPhone,
      templateName,
      error: error.message,
    });

    throw error;
  }
}

/**
 * Build message body from template
 */
function buildTemplateMessage(templateName: string, variables: Record<string, string>): string {
  const { orderNumber, customerName, amount, items, trackingLink, invoiceNumber, otp, validUntil } = variables;

  switch (templateName) {
    case WHATSAPP_TEMPLATES.ORDER_CONFIRMED:
      return `Hello ${customerName}! Your order ${orderNumber} has been confirmed. Total: ₹${amount}. We'll notify you when it ships. - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.PAYMENT_RECEIVED:
      return `Payment of ₹${amount} received for order ${orderNumber}. Thank you! - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.ORDER_SHIPPED:
      return `Great news! Your order ${orderNumber} has been shipped${trackingLink ? `. Track: ${trackingLink}` : ''}. - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.ORDER_DELIVERED:
      return `Your order ${orderNumber} has been delivered. We hope you love it! Please share your feedback. - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.INVOICE_READY:
      return `Your invoice ${invoiceNumber} for order ${orderNumber} is ready. Check your email or order history in the app. - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.OTP_MESSAGE:
      return `Your ASIF TRADERS verification code is ${otp}. Valid for 10 minutes. Don't share this code with anyone.`;

    case WHATSAPP_TEMPLATES.QUOTE_RECEIVED:
      return `Thank you ${customerName}! We received your quote request. Our team will get back to you within 24 hours. - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.QUOTE_ACCEPTED:
      return `Great! Your quote ${orderNumber} is accepted. Total: ₹${amount}. Valid until ${validUntil}. Place your order now! - ASIF TRADERS`;

    case WHATSAPP_TEMPLATES.QUOTE_REMINDER:
      return `Reminder: Your quote ${orderNumber} (₹${amount}) is valid until ${validUntil}. Place your order before it expires! - ASIF TRADERS`;

    default:
      return `Message from ASIF TRADERS: ${JSON.stringify(variables)}`;
  }
}

/**
 * Build WhatsApp template components (header, body, buttons)
 */
function buildTemplateComponents(
  templateName: string,
  variables: Record<string, string>
): any[] {
  const components: any[] = [];

  // For OTP template, use buttons
  if (templateName === WHATSAPP_TEMPLATES.OTP_MESSAGE) {
    components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [
        {
          type: 'text',
          text: variables.otp || '',
        },
      ],
    });
  }

  return components;
}

/**
 * Format phone number to WhatsApp format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Add country code if not present
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  } else if (digits.length === 10) {
    return '91' + digits;
  }

  return digits;
}

/**
 * Send order confirmation message
 */
export async function sendOrderConfirmation(orderId: string, userPhone: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return sendWhatsAppMessage(
    userPhone,
    WHATSAPP_TEMPLATES.ORDER_CONFIRMED,
    {
      customerName: order.user?.name || 'Customer',
      orderNumber: order.orderNumber,
      amount: order.totalAmount.toFixed(2),
    },
    orderId
  );
}

/**
 * Send payment received message
 */
export async function sendPaymentReceived(orderId: string, userPhone: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return sendWhatsAppMessage(
    userPhone,
    WHATSAPP_TEMPLATES.PAYMENT_RECEIVED,
    {
      orderNumber: order.orderNumber,
      amount: order.totalAmount.toFixed(2),
    },
    orderId
  );
}

/**
 * Send OTP message
 */
export async function sendOTP(phone: string, otp: string) {
  return sendWhatsAppMessage(
    phone,
    WHATSAPP_TEMPLATES.OTP_MESSAGE,
    { otp }
  );
}

/**
 * Send quote received message
 */
export async function sendQuoteReceived(quoteId: string, userPhone: string, userName: string) {
  return sendWhatsAppMessage(
    userPhone,
    WHATSAPP_TEMPLATES.QUOTE_RECEIVED,
    { customerName: userName },
    undefined,
    quoteId
  );
}

/**
 * Send invoice ready message
 */
export async function sendInvoiceReady(orderId: string, userPhone: string, invoiceNumber: string) {
  return sendWhatsAppMessage(
    userPhone,
    WHATSAPP_TEMPLATES.INVOICE_READY,
    {
      invoiceNumber,
      orderNumber: (await prisma.order.findUnique({ where: { id: orderId } }))?.orderNumber || orderId,
    },
    orderId
  );
}

/**
 * Update WhatsApp message status (webhook)
 */
export async function updateMessageStatus(providerMessageId: string, status: string) {
  try {
    const updateData: any = { status };

    switch (status) {
      case 'delivered':
        updateData.deliveredAt = new Date();
        break;
      case 'read':
        updateData.readAt = new Date();
        break;
    }

    await prisma.whatsAppLog.updateMany({
      where: { providerMessageId },
      data: updateData,
    });

    logger.info('WhatsApp message status updated', { providerMessageId, status });
  } catch (error) {
    logger.error('Failed to update WhatsApp message status', {
      providerMessageId,
      status,
      error: (error as Error).message,
    });
  }
}

/**
 * Get WhatsApp logs for an order
 */
export async function getWhatsAppLogsForOrder(orderId: string) {
  return prisma.whatsAppLog.findMany({
    where: { relatedOrderId: orderId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get WhatsApp logs for a quote
 */
export async function getWhatsAppLogsForQuote(quoteId: string) {
  return prisma.whatsAppLog.findMany({
    where: { relatedQuoteId: quoteId },
    orderBy: { createdAt: 'desc' },
  });
}

export default {
  sendWhatsAppMessage,
  sendOrderConfirmation,
  sendPaymentReceived,
  sendOTP,
  sendQuoteReceived,
  sendInvoiceReady,
  updateMessageStatus,
  getWhatsAppLogsForOrder,
  getWhatsAppLogsForQuote,
  WHATSAPP_TEMPLATES,
};
