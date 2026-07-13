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
// Orders Management
// ============================================

/**
 * GET /api/v1/admin/orders
 * List all orders with filters
 */
router.get('/orders', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, paymentStatus, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status as string;
    if (paymentStatus) where.paymentStatus = paymentStatus as string;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { user: { phone: { contains: search as string } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders.map(order => ({
        ...order,
        deliveryAddress: JSON.parse(order.deliveryAddress || '{}'),
      })),
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
 * GET /api/v1/admin/orders/:id
 * Get order details
 */
router.get('/orders/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true, gstin: true } },
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({
      success: true,
      data: {
        ...order,
        deliveryAddress: JSON.parse(order.deliveryAddress || '{}'),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/orders/:id/status
 * Update order status
 */
router.put('/orders/:id/status', authenticate, [
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;

    const currentOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!currentOrder) {
      throw new AppError('Order not found', 404);
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(notes && { notes: currentOrder.notes ? `${currentOrder.notes}\n\n${notes}` : notes }),
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: true,
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_ORDER_STATUS', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      oldStatus: currentOrder.status,
      newStatus: status,
    });

    logger.info('Order status updated', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      oldStatus: currentOrder.status,
      newStatus: status,
      adminId: (req as any).admin.id,
    });

    res.json({
      success: true,
      message: 'Order status updated',
      data: {
        ...order,
        deliveryAddress: JSON.parse(order.deliveryAddress || '{}'),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/orders/:id/payment
 * Update payment status
 */
router.put('/orders/:id/payment', authenticate, [
  body('paymentStatus')
    .isIn(['UNPAID', 'PAID', 'PARTIAL', 'REFUNDED'])
    .withMessage('Invalid payment status'),
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'UPI', 'CARD', 'NET_BANKING', 'RAZORPAY', 'BANK_TRANSFER'])
    .withMessage('Invalid payment method'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;

    const currentOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!currentOrder) {
      throw new AppError('Order not found', 404);
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentStatus,
        ...(paymentMethod && { paymentMethod }),
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: true,
      },
    });

    await logActivity((req as any).admin.id, 'UPDATE_ORDER_PAYMENT', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus,
    });

    res.json({
      success: true,
      message: 'Payment status updated',
      data: {
        ...order,
        deliveryAddress: JSON.parse(order.deliveryAddress || '{}'),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/orders/:id/cancel
 * Cancel order
 */
router.post('/orders/:id/cancel', authenticate, [
  body('reason').optional().trim(),
  body('refund').optional().isBoolean(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason, refund = false } = req.body;

    const currentOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new AppError('Order not found', 404);
    }

    if (['DELIVERED', 'CANCELLED'].includes(currentOrder.status)) {
      throw new ValidationError(`Cannot cancel order with status: ${currentOrder.status}`);
    }

    // Restore stock
    await prisma.$transaction(async (tx) => {
      for (const item of currentOrder.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          await tx.inventoryLog.create({
            data: {
              variantId: item.variantId,
              change: item.quantity,
              reason: 'CANCELLED',
              referenceId: currentOrder.id,
              notes: `Order ${currentOrder.orderNumber} cancelled`,
              adminId: (req as any).admin.id,
            },
          });
        }
      }

      await tx.order.update({
        where: { id: req.params.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: refund && currentOrder.paymentStatus === 'PAID' ? 'REFUNDED' : currentOrder.paymentStatus,
          notes: currentOrder.notes ? `${currentOrder.notes}\n\nCancelled: ${reason || 'No reason provided'}` : `Cancelled: ${reason || 'No reason provided'}`,
        },
      });
    });

    await logActivity((req as any).admin.id, 'CANCEL_ORDER', {
      orderId: currentOrder.id,
      orderNumber: currentOrder.orderNumber,
      reason,
      stockRestored: true,
    });

    logger.info('Order cancelled', {
      orderId: currentOrder.id,
      orderNumber: currentOrder.orderNumber,
      adminId: (req as any).admin.id,
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/customers
 * List customers (users with orders)
 */
router.get('/customers', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {
      orders: { some: {} }, // Only users with orders
    };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              orders: true,
              addresses: true,
            },
          },
          orders: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { totalAmount: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate total spending per user
    const usersWithSpending = await Promise.all(
      users.map(async (user) => {
        const spending = await prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { userId: user.id, paymentStatus: 'PAID' },
        });
        return {
          ...user,
          totalSpending: spending._sum.totalAmount || 0,
        };
      })
    );

    res.json({
      success: true,
      data: usersWithSpending,
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
 * GET /api/v1/admin/customers/:id
 * Get customer details with order history
 */
router.get('/customers/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!user) {
      throw new AppError('Customer not found', 404);
    }

    // Calculate total spending
    const spending = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { userId: user.id, paymentStatus: 'PAID' },
    });

    res.json({
      success: true,
      data: {
        ...user,
        totalSpending: spending._sum.totalAmount || 0,
        deliveryAddress: user.addresses.find(a => a.isDefault) || user.addresses[0],
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

// ============================================
// Payments Management
// ============================================

/**
 * GET /api/v1/admin/payments
 * List all payments
 */
router.get('/payments', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, gateway, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status as string;
    if (gateway) where.gateway = gateway as string;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              user: { select: { name: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      success: true,
      data: payments,
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
 * GET /api/v1/admin/payments/:id
 * Get payment details
 */
router.get('/payments/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true, email: true } },
            items: true,
          },
        },
        refunds: {
          include: {
            initiatedBy: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/payments/order/:orderId
 * Get payment for specific order
 */
router.get('/payments/order/:orderId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId: req.params.orderId },
      include: {
        refunds: {
          include: {
            initiatedBy: { select: { name: true, email: true } },
          },
        },
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
      data: payment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/payments/:id/refund
 * Initiate refund (admin)
 */
router.post('/payments/:id/refund', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('reason').notEmpty().trim().withMessage('Reason is required'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, reason } = req.body;
    const adminId = (req as any).admin.id;

    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.status !== 'captured') {
      throw new ValidationError('Cannot refund: payment has not been captured');
    }

    if (!payment.gatewayPaymentId) {
      throw new ValidationError('Cannot refund: no gateway payment ID');
    }

    // Check if full refund exceeds payment amount
    const existingRefunds = await prisma.paymentRefund.aggregate({
      where: { paymentId: payment.id, status: 'completed' },
      _sum: { amount: true },
    });

    const alreadyRefunded = existingRefunds._sum.amount || 0;
    if (amount > payment.amount - alreadyRefunded) {
      throw new ValidationError(`Refund amount exceeds available amount (Max: ₹${(payment.amount - alreadyRefunded).toFixed(2)})`);
    }

    // Import and use payment service
    const { initiateRefund } = await import('../services/payment.service.js');

    const result = await initiateRefund(payment.id, amount, reason, adminId);

    await logActivity(adminId, 'INITIATE_REFUND', {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount,
      reason,
    });

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Invoices Management
// ============================================

/**
 * GET /api/v1/admin/invoices
 * List all invoices
 */
router.get('/invoices', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
        { order: { orderNumber: { contains: search as string, mode: 'insensitive' } } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              user: { select: { name: true, phone: true } },
            },
          },
        },
        orderBy: { invoiceDate: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      success: true,
      data: invoices,
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
 * GET /api/v1/admin/invoices/:id
 * Get invoice details
 */
router.get('/invoices/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true, email: true, gstin: true } },
            items: {
              include: {
                variant: {
                  include: {
                    product: { select: { name: true, slug: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/orders/:id/invoice
 * Generate invoice for order
 */
router.post('/orders/:id/invoice', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId: order.id },
    });

    if (existingInvoice) {
      res.json({
        success: true,
        message: 'Invoice already exists',
        data: existingInvoice,
      });
      return;
    }

    // Generate invoice
    const { createInvoiceFromOrder, generateInvoicePDF } = await import('../services/invoice.service.js');
    const fs = await import('fs');
    const path = await import('path');

    const invoiceId = await createInvoiceFromOrder(order.id);

    // Generate PDF
    const pdfDir = path.join(process.cwd(), 'public', 'invoices');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `invoice-${order.orderNumber}.pdf`);
    await generateInvoicePDF(invoiceId, pdfPath);

    // Update invoice with PDF URL
    const pdfUrl = `/invoices/invoice-${order.orderNumber}.pdf`;
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { pdfUrl },
    });

    await logActivity((req as any).admin.id, 'GENERATE_INVOICE', {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      orderId: order.id,
    });

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// WhatsApp Logs
// ============================================

/**
 * GET /api/v1/admin/whatsapp-logs
 * Get WhatsApp message logs
 */
router.get('/whatsapp-logs', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, template, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status as string;
    if (template) where.templateName = template as string;

    const [logs, total] = await Promise.all([
      prisma.whatsAppLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.whatsAppLog.count({ where }),
    ]);

    // Get unique templates
    const templates = await prisma.whatsAppLog.groupBy({
      by: ['templateName'],
      _count: true,
    });

    res.json({
      success: true,
      data: {
        logs,
        templates: templates.map(t => ({ name: t.templateName, count: t._count })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/whatsapp-logs/order/:orderId
 * Get WhatsApp logs for specific order
 */
router.get('/whatsapp-logs/order/:orderId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.whatsAppLog.findMany({
      where: { relatedOrderId: req.params.orderId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/whatsapp-logs/test
 * Send test WhatsApp message (admin)
 */
router.post('/whatsapp-logs/test', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), [
  body('phone').matches(/^[1-9][0-9]{9}$/).withMessage('Valid 10-digit phone number required'),
  body('templateName').notEmpty(),
  body('variables').isObject(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, templateName, variables } = req.body;

    const { sendWhatsAppMessage } = await import('../services/whatsapp.service.js');

    const result = await sendWhatsAppMessage(
      phone,
      templateName,
      variables
    );

    await logActivity((req as any).admin.id, 'TEST_WHATSAPP', {
      phone,
      templateName,
      result,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
