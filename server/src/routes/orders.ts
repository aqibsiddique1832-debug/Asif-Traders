import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { authenticateCustomer } from '../middleware/customerAuth.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// ============================================
// Constants
// ============================================
const GST_PERCENT = 18; // 18% GST
const DEFAULT_DELIVERY_CHARGE = 0; // Free delivery for building materials orders

// ============================================
// Helper Functions
// ============================================

// Generate order number
const generateOrderNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const sequence = String(count + 1).padStart(5, '0');
  return `AT-${year}-${sequence}`;
};

// Format order response
const formatOrderResponse = (order: any) => {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    gstAmount: order.gstAmount,
    deliveryCharge: order.deliveryCharge,
    totalAmount: order.totalAmount,
    deliveryAddress: JSON.parse(order.deliveryAddress || '{}'),
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: (order.items || []).map((item: any) => ({
      id: item.id,
      productName: item.productNameSnapshot,
      variantSize: item.variantSizeSnapshot,
      quantity: item.quantity,
      unitPrice: item.unitPriceSnapshot,
      gstPercent: item.gstPercentSnapshot,
      lineTotal: item.lineTotal,
    })),
  };
};

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
// Customer Routes (Authenticated)
// ============================================

/**
 * POST /api/v1/orders
 * Create new order from cart
 */
router.post('/', authenticateCustomer, [
  body('addressId')
    .optional()
    .isUUID()
    .withMessage('Invalid address ID'),
  body('deliveryAddress')
    .optional()
    .isObject()
    .withMessage('Delivery address must be an object'),
  body('deliveryAddress.fullAddress')
    .if(body('deliveryAddress').exists())
    .notEmpty()
    .withMessage('Full address is required'),
  body('deliveryAddress.pincode')
    .if(body('deliveryAddress').exists())
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Invalid pincode'),
  body('deliveryAddress.city')
    .if(body('deliveryAddress').exists())
    .notEmpty()
    .withMessage('City is required'),
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'UPI', 'CARD', 'NET_BANKING', 'RAZORPAY'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be under 500 characters'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId, deliveryAddress: directAddress, paymentMethod, notes } = req.body;
    const userId = req.customerId!;

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
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
    });

    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Your cart is empty');
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.variant.isActive) {
        throw new ValidationError(`${item.variant.product.name} is currently unavailable`);
      }
      if (item.variant.stock < item.quantity) {
        throw new ValidationError(
          `Only ${item.variant.stock} units of ${item.variant.product.name} (${item.variant.size}) available`
        );
      }
    }

    // Get delivery address
    let address: any = null;
    if (addressId) {
      address = await prisma.address.findFirst({
        where: { id: addressId, userId },
      });
      if (!address) {
        throw new NotFoundError('Address');
      }
    }

    const finalAddress = directAddress || (address ? {
      label: address.label,
      fullAddress: address.fullAddress,
      landmark: address.landmark,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
    } : null);

    if (!finalAddress) {
      throw new ValidationError('Delivery address is required');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of cart.items) {
      const unitPrice = item.variant.sellingPrice;
      const gstAmount = (unitPrice * item.quantity * GST_PERCENT) / 100;
      const lineTotal = unitPrice * item.quantity + gstAmount;

      subtotal += unitPrice * item.quantity;

      orderItems.push({
        variantId: item.variantId,
        productNameSnapshot: item.variant.product.name,
        variantSizeSnapshot: item.variant.size,
        quantity: item.quantity,
        unitPriceSnapshot: unitPrice,
        gstPercentSnapshot: GST_PERCENT,
        lineTotal,
      });
    }

    const deliveryCharge = subtotal >= 10000 ? DEFAULT_DELIVERY_CHARGE : DEFAULT_DELIVERY_CHARGE; // Free delivery
    const totalGst = (subtotal * GST_PERCENT) / 100;
    const totalAmount = subtotal + totalGst + deliveryCharge;

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order with items in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal,
          gstAmount: totalGst,
          deliveryCharge,
          totalAmount,
          deliveryAddress: JSON.stringify(finalAddress),
          paymentStatus: 'UNPAID',
          paymentMethod,
          notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Update inventory (deduct stock)
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Log inventory change
        await tx.inventoryLog.create({
          data: {
            variantId: item.variantId,
            change: -item.quantity,
            reason: 'SALE',
            referenceId: newOrder.id,
            notes: `Order ${orderNumber}`,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Log lead event
    await prisma.leadEvent.create({
      data: {
        userId,
        eventType: 'ORDER_PLACED',
        metadata: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount,
          itemCount: orderItems.length,
        }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('Order created', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: formatOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/orders
 * Get user's orders
 */
router.get('/', authenticateCustomer, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid status'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.customerId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders: orders.map(formatOrderResponse),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/orders/:id
 * Get order by ID
 */
router.get('/:id', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.customerId!;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    res.json({
      success: true,
      data: formatOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/orders/number/:orderNumber
 * Get order by order number
 */
router.get('/number/:orderNumber', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.customerId!;

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    res.json({
      success: true,
      data: formatOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
