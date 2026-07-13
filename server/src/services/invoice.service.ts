import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Company details for invoice
const COMPANY_DETAILS = {
  name: 'ASIF TRADERS',
  address: 'Shop No. 12, Industrial Area, Airoli, Navi Mumbai - 400708',
  phone: '+91 98765 43210',
  email: 'info@asiftraders.com',
  gstin: '27AAACP1234C1ZB',
  state: 'Maharashtra',
  stateCode: '27',
};

/**
 * Get next invoice sequence number for a financial year
 */
export async function getNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const financialYear = `${currentYear}-${String(nextYear).slice(-2)}`;

  // Upsert the sequence
  const sequence = await prisma.invoiceSequence.upsert({
    where: { financialYear },
    update: {
      lastSequence: { increment: 1 },
    },
    create: {
      financialYear,
      lastSequence: 1,
    },
  });

  // Format: AT/2026-27/0001
  const sequenceStr = String(sequence.lastSequence).padStart(4, '0');
  return `AT/${financialYear}/${sequenceStr}`;
}

/**
 * Generate invoice PDF
 */
export async function generateInvoicePDF(
  invoiceId: string,
  outputPath: string
): Promise<string> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      order: {
        include: {
          user: true,
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
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text(COMPANY_DETAILS.name, 50, 50);
      doc.fontSize(10).font('Helvetica').text(COMPANY_DETAILS.address, 50, 75);
      doc.text(`Phone: ${COMPANY_DETAILS.phone}`, 50, 88);
      doc.text(`Email: ${COMPANY_DETAILS.email}`, 50, 101);
      doc.text(`GSTIN: ${COMPANY_DETAILS.gstin}`, 50, 114);

      // Invoice title
      doc.fontSize(16).font('Helvetica-Bold')
        .text('TAX INVOICE', 450, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica')
        .text(`Invoice No: ${invoice.invoiceNumber}`, 450, 70, { align: 'right' })
        .text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`, 450, 83, { align: 'right' });

      // Divider
      doc.moveTo(50, 135).lineTo(560, 135).stroke();

      // Customer details
      let y = 145;
      doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50, y);
      doc.font('Helvetica').text(invoice.customerName || invoice.order.user?.name || 'Customer', 50, y + 15);

      if (invoice.customerAddress) {
        doc.text(invoice.customerAddress, 50, y + 30, { width: 250 });
      }

      if (invoice.customerGstin) {
        doc.text(`GSTIN: ${invoice.customerGstin}`, 50, y + 55);
      }

      // Order details on right side
      doc.font('Helvetica-Bold').text('Order Details:', 400, y);
      doc.font('Helvetica')
        .text(`Order No: ${invoice.order.orderNumber}`, 400, y + 15)
        .text(`Order Date: ${new Date(invoice.order.createdAt).toLocaleDateString('en-IN')}`, 400, y + 30)
        .text(`Payment: ${invoice.order.paymentStatus}`, 400, y + 45);

      // Products table header
      y = 230;
      doc.moveTo(50, y).lineTo(560, y).stroke();

      // Table headers
      const tableHeaders = [
        { label: 'Item', x: 50, width: 200 },
        { label: 'HSN', x: 250, width: 60 },
        { label: 'Qty', x: 310, width: 50 },
        { label: 'Rate', x: 360, width: 80 },
        { label: 'Amount', x: 440, width: 80 },
        { label: 'GST', x: 520, width: 40 },
      ];

      doc.font('Helvetica-Bold').fontSize(9);
      tableHeaders.forEach((h) => {
        doc.text(h.label, h.x, y + 8, { width: h.width });
      });

      y += 25;
      doc.moveTo(50, y).lineTo(560, y).stroke();

      // Table rows
      doc.font('Helvetica').fontSize(9);
      let subtotal = 0;
      let totalGst = 0;

      for (const item of invoice.order.items) {
        const itemSubtotal = item.lineTotal / (1 + item.gstPercentSnapshot / 100);
        const itemGst = item.lineTotal - itemSubtotal;

        doc.text(item.productNameSnapshot, 50, y, { width: 200 });
        doc.text(item.hsnCode || '-', 250, y, { width: 60 });
        doc.text(String(item.quantity), 310, y, { width: 50 });
        doc.text(`₹${itemSubtotal.toFixed(2)}`, 360, y, { width: 80 });
        doc.text(`₹${item.lineTotal.toFixed(2)}`, 440, y, { width: 80 });
        doc.text(`${item.gstPercentSnapshot}%`, 520, y, { width: 40 });

        subtotal += itemSubtotal;
        totalGst += itemGst;
        y += 22;
      }

      // Table footer line
      y += 5;
      doc.moveTo(50, y).lineTo(560, y).stroke();

      // Totals section
      y += 15;

      // Subtotal
      doc.text('Subtotal:', 360, y);
      doc.text(`₹${subtotal.toFixed(2)}`, 440, y, { width: 80 });
      y += 18;

      // GST breakdown
      if (invoice.isIgst) {
        doc.text(`IGST (${invoice.gstRate}%):`, 360, y);
        doc.text(`₹${invoice.igstAmount.toFixed(2)}`, 440, y, { width: 80 });
      } else {
        doc.text(`CGST (${invoice.gstRate / 2}%):`, 360, y);
        doc.text(`₹${invoice.cgstAmount.toFixed(2)}`, 440, y, { width: 80 });
        y += 18;
        doc.text(`SGST (${invoice.gstRate / 2}%):`, 360, y);
        doc.text(`₹${invoice.sgstAmount.toFixed(2)}`, 440, y, { width: 80 });
      }
      y += 18;

      // Delivery charge
      if (invoice.order.deliveryCharge > 0) {
        doc.text('Delivery Charge:', 360, y);
        doc.text(`₹${invoice.order.deliveryCharge.toFixed(2)}`, 440, y, { width: 80 });
        y += 18;
      }

      // Grand total
      y += 5;
      doc.moveTo(350, y).lineTo(560, y).stroke();
      y += 10;
      doc.font('Helvetica-Bold').fontSize(11);
      doc.text('TOTAL:', 360, y);
      doc.text(`₹${invoice.totalAmount.toFixed(2)}`, 440, y, { width: 80 });

      // Amount in words
      y += 30;
      doc.font('Helvetica').fontSize(9);
      const amountInWords = numberToWords(Math.round(invoice.totalAmount));
      doc.text(`Amount in Words: ${amountInWords} Only`, 50, y);

      // Tax breakdown summary
      y += 40;
      doc.font('Helvetica-Bold').fontSize(10).text('Tax Summary:', 50, y);
      y += 18;

      if (invoice.isIgst) {
        doc.font('Helvetica').fontSize(9)
          .text(`Inter-State Supply (IGST @ ${invoice.gstRate}%)`, 50, y);
      } else {
        doc.font('Helvetica').fontSize(9)
          .text(`Intra-State Supply (CGST + SGST @ ${invoice.gstRate / 2}% each)`, 50, y);
      }

      // Footer
      doc.fontSize(8).text(
        'This is a computer-generated invoice. No signature required.',
        50,
        doc.page.height - 80,
        { align: 'center' }
      );

      doc.text(
        'Thank you for your business!',
        50,
        doc.page.height - 65,
        { align: 'center' }
      );

      // Terms
      doc.fontSize(7).text(
        'Terms: 1) Goods once sold will not be taken back. 2) Payment due within 15 days.',
        50,
        doc.page.height - 45,
        { align: 'center' }
      );

      doc.end();

      stream.on('finish', () => {
        logger.info('Invoice PDF generated', {
          invoiceId,
          invoiceNumber: invoice.invoiceNumber,
          path: outputPath,
        });
        resolve(outputPath);
      });

      stream.on('error', reject);
    } catch (error) {
      logger.error('Invoice PDF generation failed', {
        invoiceId,
        error: (error as Error).message,
      });
      reject(error);
    }
  });
}

/**
 * Create invoice record from order
 */
export async function createInvoiceFromOrder(orderId: string): Promise<string> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
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
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Parse delivery address
  let deliveryAddress = '';
  let customerPincode = '';
  try {
    const addr = typeof order.deliveryAddress === 'string'
      ? JSON.parse(order.deliveryAddress)
      : order.deliveryAddress;
    deliveryAddress = addr.fullAddress || addr.address || '';
    customerPincode = addr.pincode || '';
  } catch {
    deliveryAddress = String(order.deliveryAddress);
  }

  // Determine if inter-state (for GST calculation)
  const isIgst = !!(customerPincode && !customerPincode.startsWith('4'));

  // Calculate GST breakdown
  const subtotal = order.subtotal;
  const gstRate = 18; // Default 18% GST
  const totalGst = order.gstAmount;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isIgst) {
    igstAmount = totalGst;
  } else {
    cgstAmount = totalGst / 2;
    sgstAmount = totalGst / 2;
  }

  // Get next invoice number
  const invoiceNumber = await getNextInvoiceNumber();

  // Create invoice record
  const invoice = await prisma.invoice.create({
    data: {
      orderId,
      invoiceNumber,
      subtotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGst,
      totalAmount: order.totalAmount,
      customerName: order.user?.name,
      customerAddress: deliveryAddress,
      customerGstin: order.user?.gstin,
      gstRate,
      isIgst,
    },
  });

  logger.info('Invoice created', {
    invoiceId: invoice.id,
    invoiceNumber,
    orderId,
  });

  return invoice.id;
}

/**
 * Get invoice with PDF URL
 */
export async function getInvoiceWithPDF(orderId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          user: true,
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
    },
  });

  return invoice;
}

// Helper function: Convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  num %= 100;
  const ten = Math.floor(num);

  const twoDigit = (n: number) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };

  let result = '';

  if (crore) result += twoDigit(crore) + ' Crore ';
  if (lakh) result += twoDigit(lakh) + ' Lakh ';
  if (thousand) result += twoDigit(thousand) + ' Thousand ';
  if (hundred) result += ones[hundred] + ' Hundred ';
  if (ten) result += twoDigit(ten);

  return result.trim();
}

export default {
  generateInvoicePDF,
  createInvoiceFromOrder,
  getInvoiceWithPDF,
  getNextInvoiceNumber,
};
