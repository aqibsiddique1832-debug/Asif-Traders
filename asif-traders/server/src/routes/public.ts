import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { AppError, ValidationError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// Validation helper
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
// Lead Tracking
// ============================================

/**
 * POST /api/v1/leads
 * Track a lead event
 */
router.post('/leads', [
  body('eventType').notEmpty().isString(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventType, source, sourceUrl, metadata, userId } = req.body;

    // Create or find user by phone if provided
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (req.body.phone) {
      user = await prisma.user.findUnique({
        where: { phone: req.body.phone },
      });
      if (!user && req.body.name) {
        user = await prisma.user.create({
          data: {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email || null,
          },
        });
      }
    }

    const leadEvent = await prisma.leadEvent.create({
      data: {
        userId: user?.id,
        eventType: eventType as any,
        source,
        sourceUrl,
        metadata: metadata || {},
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      success: true,
      data: { id: leadEvent.id },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Categories
// ============================================

/**
 * GET /api/v1/categories
 * Get all active categories
 */
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/categories/:slug
 * Get category by slug
 */
router.get('/categories/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            variants: { where: { isActive: true } },
            images: { where: { isPrimary: true } },
            brand: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Brands
// ============================================

/**
 * GET /api/v1/brands
 * Get all active brands
 */
router.get('/brands', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/brands/:slug
 * Get brand by slug
 */
router.get('/brands/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            variants: { where: { isActive: true } },
            images: { where: { isPrimary: true } },
            category: true,
          },
        },
      },
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Products
// ============================================

/**
 * GET /api/v1/products
 * Get all active products with filters
 */
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      brand,
      featured,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: category as string };
    }
    if (brand) {
      where.brand = { slug: brand as string };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          variants: { where: { isActive: true } },
          images: { where: { isPrimary: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/products/featured
 * Get featured products
 */
router.get('/products/featured', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { where: { isPrimary: true } },
      },
      take: 8,
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/products/:slug
 * Get product by slug
 */
router.get('/products/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Track product view
    if (req.body.track !== 'false') {
      await prisma.leadEvent.create({
        data: {
          eventType: 'PRODUCT_VIEW',
          sourceUrl: req.originalUrl,
          metadata: JSON.stringify({ productId: product.id, productName: product.name }),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Quote Requests
// ============================================

/**
 * POST /api/v1/quotes
 * Submit a new quote request
 */
router.post('/quotes', [
  body('items').isArray({ min: 1 }),
  body('userName').notEmpty().trim(),
  body('userPhone').notEmpty().matches(/^\+?[0-9]{10,13}$/),
  body('userEmail').optional().isEmail(),
  body('gstin').optional().isLength({ min: 15, max: 15 }),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, userName, userPhone, userEmail, gstin, notes } = req.body;

    // Generate reference number
    const referenceNo = `QT${Date.now().toString(36).toUpperCase()}`;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: userPhone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userName,
          phone: userPhone,
          email: userEmail || null,
          gstin: gstin || null,
        },
      });
    } else {
      // Update user info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userName,
          email: userEmail || user.email,
          gstin: gstin || user.gstin,
        },
      });
    }

    // Create quote request
    const quote = await prisma.quoteRequest.create({
      data: {
        referenceNo,
        userId: user.id,
        userName,
        userPhone,
        userEmail,
        gstin,
        notes,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            variantId: item.variantId || null,
            productName: item.productName,
            variantSize: item.variantSize || null,
            quantity: item.quantity,
            unit: item.unit || null,
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create lead event
    await prisma.leadEvent.create({
      data: {
        userId: user.id,
        eventType: 'QUOTE_SUBMIT',
        metadata: JSON.stringify({ quoteId: quote.id, referenceNo: quote.referenceNo }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Create initial quote event
    await prisma.quoteEvent.create({
      data: {
        quoteId: quote.id,
        eventType: 'CREATED',
        newStatus: 'PENDING',
        notes: 'Quote request submitted via website',
      },
    });

    logger.info('New quote request submitted', {
      referenceNo: quote.referenceNo,
      userPhone,
      itemCount: items.length,
    });

    res.status(201).json({
      success: true,
      data: {
        id: quote.id,
        referenceNo: quote.referenceNo,
        message: 'Quote request submitted successfully! We will call you within 2 hours.',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/quotes/:referenceNo
 * Get quote by reference number (public - limited info)
 */
router.get('/quotes/:referenceNo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await prisma.quoteRequest.findUnique({
      where: { referenceNo: req.params.referenceNo },
      include: {
        items: true,
      },
    });

    if (!quote) {
      throw new AppError('Quote not found', 404);
    }

    // Return limited info for public view
    res.json({
      success: true,
      data: {
        referenceNo: quote.referenceNo,
        status: quote.status,
        items: quote.items,
        createdAt: quote.createdAt,
        validUntil: quote.validUntil,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Contact Submissions
// ============================================

/**
 * POST /api/v1/contact
 * Submit contact form
 */
router.post('/contact', [
  body('name').notEmpty().trim(),
  body('phone').notEmpty().matches(/^\+?[0-9]{10,13}$/),
  body('message').notEmpty().trim(),
  body('email').optional().isEmail(),
  body('subject').optional().isString(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          phone,
          email: email || null,
        },
      });
    }

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        userId: user.id,
        name,
        phone,
        email,
        subject,
        message,
        status: 'NEW',
      },
    });

    // Create lead event
    await prisma.leadEvent.create({
      data: {
        userId: user.id,
        eventType: 'CONTACT_SUBMIT',
        metadata: JSON.stringify({ submissionId: submission.id }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('New contact submission', { name, phone, subject });

    res.status(201).json({
      success: true,
      data: {
        id: submission.id,
        message: 'Thank you for your message! We will get back to you soon.',
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Testimonials
// ============================================

/**
 * GET /api/v1/testimonials
 * Get approved testimonials
 */
router.get('/testimonials', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 10,
    });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Settings
// ============================================

/**
 * GET /api/v1/settings
 * Get public settings
 */
router.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.setting.findMany();

    const formattedSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    res.json({
      success: true,
      data: formattedSettings,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/settings/:key
 * Get specific setting
 */
router.get('/settings/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key },
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    res.json({
      success: true,
      data: setting.value,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Search
// ============================================

/**
 * GET /api/v1/search
 * Search products
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, category, limit = '20' } = req.query;
    const limitNum = parseInt(limit as string);

    if (!q) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { tags: { has: q as string } },
      ],
    };

    if (category) {
      where.category = { slug: category as string };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { where: { isPrimary: true } },
      },
      take: limitNum,
    });

    // Track search
    await prisma.leadEvent.create({
      data: {
        eventType: 'SEARCH',
        sourceUrl: req.originalUrl,
        metadata: JSON.stringify({ query: q, resultCount: products.length }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
