import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { authenticateCustomer, optionalAuth } from '../middleware/customerAuth.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// ============================================
// Helper Functions
// ============================================

// Get or create cart for user/guest
const getOrCreateCart = async (userId?: string, sessionId?: string) => {
  let cart;

  if (userId) {
    // Get existing user cart
    cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: true,
        },
      });
    }
  } else if (sessionId) {
    // Get existing guest cart
    cart = await prisma.cart.findFirst({
      where: { sessionId, userId: null },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: true,
        },
      });
    }
  }

  return cart;
};

// Calculate cart totals
const calculateCartTotals = (items: any[]) => {
  let subtotal = 0;
  let itemCount = 0;

  items.forEach(item => {
    if (item.variant && item.variant.isActive) {
      subtotal += item.variant.sellingPrice * item.quantity;
      itemCount += item.quantity;
    }
  });

  return { subtotal, itemCount };
};

// Format cart response
const formatCartResponse = (cart: any) => {
  const { subtotal, itemCount } = calculateCartTotals(cart?.items || []);

  return {
    id: cart?.id,
    items: (cart?.items || []).map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      addedAt: item.addedAt,
      variant: item.variant ? {
        id: item.variant.id,
        size: item.variant.size,
        mrp: item.variant.mrp,
        sellingPrice: item.variant.sellingPrice,
        stock: item.variant.stock,
        sku: item.variant.sku,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          image: item.variant.product.images[0]?.url || null,
        },
      } : null,
    })),
    subtotal,
    itemCount,
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
// Public Routes (with optional auth)
// ============================================

/**
 * GET /api/v1/cart
 * Get current cart
 */
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.customerId;

    const cart = await getOrCreateCart(userId, sessionId || (userId ? undefined : uuidv4()));

    res.json({
      success: true,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/cart/add
 * Add item to cart
 */
router.post('/add', [
  body('variantId').notEmpty().withMessage('Variant ID is required'),
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  validateRequest,
], optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId, quantity } = req.body;
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.customerId;

    // Verify variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundError('Product variant');
    }

    if (!variant.isActive) {
      throw new ValidationError('This product is currently unavailable');
    }

    if (variant.stock < quantity) {
      throw new ValidationError(`Only ${variant.stock} items available in stock`);
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart!.id,
          variantId,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > variant.stock) {
        throw new ValidationError(`Only ${variant.stock} items available in stock`);
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { variant: { include: { product: true } } },
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart!.id,
          variantId,
          quantity,
        },
        include: { variant: { include: { product: true } } },
      });
    }

    // Log lead event for authenticated users
    if (userId) {
      await prisma.leadEvent.create({
        data: {
          userId,
          eventType: 'ADD_TO_CART',
          metadata: JSON.stringify({
            productId: variant.productId,
            variantId,
            quantity,
          }),
          source: req.headers['referer'] || 'direct',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart!.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    logger.info('Item added to cart', { variantId, quantity, userId });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: formatCartResponse(updatedCart),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/cart/update
 * Update cart item quantity
 */
router.put('/update', [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('quantity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Quantity must be between 0 and 100'),
  validateRequest,
], optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.customerId;

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundError('Cart item');
    }

    // Verify ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new ValidationError('Cannot update item in another user\'s cart');
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      // Check stock
      const variant = await prisma.productVariant.findUnique({
        where: { id: cartItem.variantId },
      });

      if (!variant || !variant.isActive) {
        throw new ValidationError('This product is currently unavailable');
      }

      if (variant.stock < quantity) {
        throw new ValidationError(`Only ${variant.stock} items available in stock`);
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    logger.info('Cart updated', { itemId, quantity, userId });

    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      data: formatCartResponse(updatedCart),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/cart/clear
 * Clear entire cart
 */
router.delete('/clear', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.customerId;

    if (userId) {
      await prisma.cartItem.deleteMany({
        where: { cart: { userId } },
      });
    } else if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: { cart: { sessionId, userId: null } },
      });
    }

    logger.info('Cart cleared', { userId, sessionId });

    res.json({
      success: true,
      message: 'Cart cleared',
      data: formatCartResponse(null),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/cart/merge
 * Merge guest cart with user cart (on login)
 */
router.post('/merge', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.customerId!;

    if (!sessionId) {
      throw new ValidationError('Session ID required for cart merge');
    }

    // Get guest cart
    const guestCart = await prisma.cart.findFirst({
      where: { sessionId, userId: null },
      include: {
        items: {
          include: { variant: true },
        },
      },
    });

    if (!guestCart || guestCart.items.length === 0) {
      // No guest cart to merge, just return user cart
      const userCart = await getOrCreateCart(userId);
      return res.json({
        success: true,
        message: 'No guest cart to merge',
        data: formatCartResponse(userCart),
      });
    }

    // Get or create user cart
    const userCart = await getOrCreateCart(userId);

    // Merge items
    for (const guestItem of guestCart.items) {
      // Check if variant exists in user cart
      const existingItem = userCart!.items.find(
        item => item.variantId === guestItem.variantId
      );

      if (existingItem) {
        // Combine quantities (respect stock limits)
        const variant = await prisma.productVariant.findUnique({
          where: { id: guestItem.variantId },
        });

        if (variant && variant.isActive) {
          const newQuantity = Math.min(
            existingItem.quantity + guestItem.quantity,
            variant.stock,
            100
          );

          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity },
          });
        }
      } else {
        // Add new item to user cart
        await prisma.cartItem.create({
          data: {
            cartId: userCart!.id,
            variantId: guestItem.variantId,
            quantity: Math.min(guestItem.quantity, guestItem.variant?.stock || 1),
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    // Get merged cart
    const mergedCart = await prisma.cart.findUnique({
      where: { id: userCart!.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    logger.info('Cart merged', { userId, guestCartItems: guestCart.items.length });

    res.json({
      success: true,
      message: 'Cart merged successfully',
      data: formatCartResponse(mergedCart),
    });
  } catch (error) {
    next(error);
  }
});

// Import uuid for session ID generation
import { v4 as uuidv4 } from 'uuid';

export default router;
