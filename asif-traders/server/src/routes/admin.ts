import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { AppError, UnauthorizedError, ForbiddenError, ValidationError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// ============================================
// Authentication Middleware
// ============================================
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Invalid authentication');
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

// Role check middleware
const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as any).admin;
    if (!roles.includes(admin.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

// Log activity helper
const logActivity = async (adminId: string, action: string, details?: any, req?: Request) => {
  await prisma.adminActivityLog.create({
    data: {
      adminId,
      action,
      details: details ? JSON.stringify(details) : null,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    },
  });
};

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
// Dashboard
// ============================================

/**
 * GET /api/v1/admin/dashboard
 * Get dashboard stats
 */
router.get('/dashboard', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      totalCategories,
      pendingQuotes,
      totalQuotes,
      newContacts,
      totalContacts,
      recentQuotes,
      recentLeads,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
      prisma.quoteRequest.count(),
      prisma.contactSubmission.count({ where: { status: 'NEW', createdAt: { gte: today } } }),
      prisma.contactSubmission.count(),
      prisma.quoteRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
      }),
      prisma.leadEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Get quote stats for last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const quoteStats = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: true,
      where: { createdAt: { gte: weekAgo } },
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          pendingQuotes,
          totalQuotes,
          newContacts,
          totalContacts,
        },
        recentQuotes,
        recentLeads,
        quoteStats,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Categories Management
// ============================================

/**
 * GET /api/v1/admin/categories
 * List all categories
 */
router.get('/categories', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
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
 * POST /api/v1/admin/categories
 * Create category
 */
router.post('/categories', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, icon, sortOrder } = req.body;
    const slug = slugify(name, { lower: true });

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        sortOrder: sortOrder || 0,
      },
    });

    await logActivity((req as any).admin.id, 'CREATE_CATEGORY', { categoryId: category.id });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/categories/:id
 * Update category
 */
router.put('/categories/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('name').optional().trim(),
  body('description').optional().trim(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, icon, isActive, sortOrder } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_CATEGORY', { categoryId: category.id });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/admin/categories/:id
 * Delete category
 */
router.delete('/categories/:id', authenticate, requireRole('SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: req.params.id },
    });

    if (productCount > 0) {
      throw new ValidationError('Cannot delete category with products. Remove products first.');
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    await logActivity((req as any).admin.id, 'DELETE_CATEGORY', { categoryId: req.params.id });

    res.json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Brands Management
// ============================================

/**
 * GET /api/v1/admin/brands
 * List all brands
 */
router.get('/brands', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
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
 * POST /api/v1/admin/brands
 * Create brand
 */
router.post('/brands', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('name').notEmpty().trim(),
  body('logo').optional().trim(),
  body('website').optional().trim(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, logo, website, description } = req.body;
    const slug = slugify(name, { lower: true });

    const brand = await prisma.brand.create({
      data: { name, slug, logo, website, description },
    });

    await logActivity((req as any).admin.id, 'CREATE_BRAND', { brandId: brand.id });

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/brands/:id
 * Update brand
 */
router.put('/brands/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, logo, website, description, isActive } = req.body;

    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
        ...(website !== undefined && { website }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_BRAND', { brandId: brand.id });

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Products Management
// ============================================

/**
 * GET /api/v1/admin/products
 * List products with filters
 */
router.get('/products', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (category) where.category = { slug: category as string };
    if (brand) where.brand = { slug: brand as string };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          variants: true,
          _count: { select: { images: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
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
 * POST /api/v1/admin/products
 * Create product
 */
router.post('/products', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('name').notEmpty().trim(),
  body('categoryId').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, features, specifications, unit, categoryId, brandId, tags, variants } = req.body;
    const slug = slugify(name, { lower: true }) + '-' + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        features: features || [],
        specifications: specifications || {},
        unit: unit || 'pieces',
        categoryId,
        brandId: brandId || null,
        tags: tags || [],
      },
    });

    // Create variants if provided
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: variant.size,
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            stock: variant.stock || 0,
            sku: variant.sku || null,
          },
        });
      }
    }

    await logActivity((req as any).admin.id, 'CREATE_PRODUCT', { productId: product.id });

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { category: true, brand: true, variants: true },
    });

    res.status(201).json({
      success: true,
      data: fullProduct,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/products/:id
 * Update product
 */
router.put('/products/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, features, specifications, unit, categoryId, brandId, tags, isFeatured, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features }),
        ...(specifications !== undefined && { specifications }),
        ...(unit !== undefined && { unit }),
        ...(categoryId && { categoryId }),
        ...(brandId !== undefined && { brandId }),
        ...(tags !== undefined && { tags }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_PRODUCT', { productId: product.id });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/admin/products/:id
 * Delete product
 */
router.delete('/products/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    await logActivity((req as any).admin.id, 'DELETE_PRODUCT', { productId: req.params.id });

    res.json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    next(error);
  }
});

// Product Variants
/**
 * POST /api/v1/admin/products/:id/variants
 * Add variant to product
 */
router.post('/products/:id/variants', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('size').notEmpty().trim(),
  body('mrp').isNumeric(),
  body('sellingPrice').isNumeric(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { size, mrp, sellingPrice, stock, sku } = req.body;

    const variant = await prisma.productVariant.create({
      data: {
        productId: req.params.id,
        size,
        mrp,
        sellingPrice,
        stock: stock || 0,
        sku: sku || null,
      },
    });

    // Create inventory log
    if (stock > 0) {
      await prisma.inventoryLog.create({
        data: {
          variantId: variant.id,
          change: stock,
          reason: 'INITIAL_STOCK',
          adminId: (req as any).admin.id,
          notes: 'Initial stock on variant creation',
        },
      });
    }

    res.status(201).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/products/:id/variants/:variantId
 * Update variant
 */
router.put('/products/:id/variants/:variantId', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { size, mrp, sellingPrice, stock, sku, isActive } = req.body;

    const currentVariant = await prisma.productVariant.findUnique({
      where: { id: req.params.variantId },
    });

    if (!currentVariant) {
      throw new AppError('Variant not found', 404);
    }

    const variant = await prisma.productVariant.update({
      where: { id: req.params.variantId },
      data: {
        ...(size && { size }),
        ...(mrp !== undefined && { mrp }),
        ...(sellingPrice !== undefined && { sellingPrice }),
        ...(sku !== undefined && { sku }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // Handle stock update
    if (stock !== undefined && stock !== currentVariant.stock) {
      const change = stock - currentVariant.stock;
      await prisma.inventoryLog.create({
        data: {
          variantId: variant.id,
          change,
          reason: change > 0 ? 'ADJUSTMENT' : 'ADJUSTMENT',
          adminId: (req as any).admin.id,
          notes: `Stock adjustment from ${currentVariant.stock} to ${stock}`,
        },
      });

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock },
      });
    }

    res.json({
      success: true,
      data: variant,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Quote Management
// ============================================

/**
 * GET /api/v1/admin/quotes
 * List quotes with filters
 */
router.get('/quotes', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status as string;
    if (search) {
      where.OR = [
        { referenceNo: { contains: search as string, mode: 'insensitive' } },
        { userName: { contains: search as string, mode: 'insensitive' } },
        { userPhone: { contains: search as string } },
      ];
    }

    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: {
          items: true,
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: quotes,
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
 * GET /api/v1/admin/quotes/:id
 * Get quote details
 */
router.get('/quotes/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await prisma.quoteRequest.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        user: true,
        events: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!quote) {
      throw new AppError('Quote not found', 404);
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/quotes/:id
 * Update quote status
 */
router.put('/quotes/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, totalAmount, validUntil, notes } = req.body;

    const currentQuote = await prisma.quoteRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!currentQuote) {
      throw new AppError('Quote not found', 404);
    }

    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(totalAmount !== undefined && { totalAmount }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
      },
      include: {
        items: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    // Create status change event
    if (status && status !== currentQuote.status) {
      await prisma.quoteEvent.create({
        data: {
          quoteId: quote.id,
          eventType: 'STATUS_CHANGE',
          oldStatus: currentQuote.status,
          newStatus: status,
          notes: notes || `Status changed to ${status}`,
          adminId: (req as any).admin.id,
        },
      });
    }

    await logActivity((req as any).admin.id, 'UPDATE_QUOTE', {
      quoteId: quote.id,
      status,
      totalAmount,
    });

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/quotes/:id/assign
 * Assign quote to admin
 */
router.post('/quotes/:id/assign', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId } = req.body;

    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data: { assignedToId: adminId },
    });

    await prisma.quoteEvent.create({
      data: {
        quoteId: quote.id,
        eventType: 'ASSIGNED',
        notes: `Assigned to admin ${adminId}`,
        adminId: (req as any).admin.id,
      },
    });

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Contact Submissions
// ============================================

/**
 * GET /api/v1/admin/contacts
 * List contact submissions
 */
router.get('/contacts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;

    const [contacts, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    res.json({
      success: true,
      data: contacts,
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
 * PUT /api/v1/admin/contacts/:id
 * Update contact status
 */
router.put('/contacts/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, response } = req.body;

    const contact = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(response && { response, respondedAt: new Date() }),
      },
    });

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Testimonials
// ============================================

/**
 * GET /api/v1/admin/testimonials
 * List testimonials
 */
router.get('/testimonials', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/testimonials
 * Create testimonial
 */
router.post('/testimonials', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), [
  body('customerName').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, location, rating, content, image } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        location,
        rating: rating || 5,
        content,
        image,
        isApproved: true,
      },
    });

    await logActivity((req as any).admin.id, 'CREATE_TESTIMONIAL', { testimonialId: testimonial.id });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/testimonials/:id
 * Update testimonial
 */
router.put('/testimonials/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, location, rating, content, image, isApproved, isFeatured } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        ...(customerName && { customerName }),
        ...(location !== undefined && { location }),
        ...(rating !== undefined && { rating }),
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image }),
        ...(isApproved !== undefined && { isApproved }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/admin/testimonials/:id
 * Delete testimonial
 */
router.delete('/testimonials/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Testimonial deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Leads Analytics
// ============================================

/**
 * GET /api/v1/admin/leads
 * Get lead events with analytics
 */
router.get('/leads', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, from, to, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (type) where.eventType = type;
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as any).gte = new Date(from as string);
      if (to) (where.createdAt as any).lte = new Date(to as string);
    }

    const [events, total] = await Promise.all([
      prisma.leadEvent.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.leadEvent.count({ where }),
    ]);

    // Get event type counts
    const eventCounts = await prisma.leadEvent.groupBy({
      by: ['eventType'],
      _count: true,
      where: where,
    });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        eventCounts: eventCounts.reduce((acc, e) => {
          acc[e.eventType] = e._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Admin Users Management
// ============================================

/**
 * GET /api/v1/admin/admins
 * List admins (SUPER_ADMIN only)
 */
router.get('/admins', authenticate, requireRole('SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        is2FAEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/admins
 * Create admin user
 */
router.post('/admins', authenticate, requireRole('SUPER_ADMIN'), [
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['ADMIN', 'MANAGER', 'STAFF']),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await logActivity((req as any).admin.id, 'CREATE_ADMIN', { newAdminId: admin.id });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/admins/:id
 * Update admin
 */
router.put('/admins/:id', authenticate, requireRole('SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, role, isActive, password } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (role) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (password) data.password = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_ADMIN', { updatedAdminId: admin.id });

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Activity Logs
// ============================================

/**
 * GET /api/v1/admin/activity
 * Get activity logs
 */
router.get('/activity', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, action, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (adminId) where.adminId = adminId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.adminActivityLog.findMany({
        where,
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.adminActivityLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
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

// ============================================
// Settings
// ============================================

/**
 * GET /api/v1/admin/settings
 * Get all settings
 */
router.get('/settings', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
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
 * PUT /api/v1/admin/settings/:key
 * Update setting
 */
router.put('/settings/:key', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { value } = req.body;

    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value },
      create: { key: req.params.key, value },
    });

    await logActivity((req as any).admin.id, 'UPDATE_SETTING', { key: req.params.key });

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
