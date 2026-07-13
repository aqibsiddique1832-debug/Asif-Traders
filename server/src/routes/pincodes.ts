import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { param, query, validationResult } from 'express-validator';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../middleware/errorHandler.js';

const router: Router = Router();
const prisma = new PrismaClient();

// Admin authentication middleware
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
// Public Routes
// ============================================

/**
 * GET /api/v1/pincodes/check/:pincode
 * Check if a pincode is serviceable
 */
router.get('/check/:pincode', [
  param('pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Invalid pincode format'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pincode } = req.params;

    const pincodeData = await prisma.pincode.findUnique({
      where: { pincode },
    });

    if (!pincodeData) {
      res.json({
        success: true,
        data: {
          isServiceable: false,
          message: 'Delivery not available to this area',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        isServiceable: pincodeData.isServiceable,
        areaName: pincodeData.areaName,
        city: pincodeData.city,
        state: pincodeData.state,
        deliveryDays: pincodeData.deliveryDays,
        deliveryCharge: pincodeData.deliveryCharge,
        isFreeDelivery: pincodeData.isFreeDelivery,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/pincodes/bulk
 * Check multiple pincodes at once
 */
router.get('/bulk', [
  query('pincodes')
    .matches(/^[1-9][0-9]{5}(,[1-9][0-9]{5})*$/)
    .withMessage('Invalid pincodes format. Use comma-separated 6-digit pincodes'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pincodes } = req.query;
    const pincodeList = (pincodes as string).split(',');

    const results = await Promise.all(
      pincodeList.map(async (pin) => {
        const pincodeData = await prisma.pincode.findUnique({
          where: { pincode: pin },
        });

        if (!pincodeData) {
          return {
            pincode: pin,
            isServiceable: false,
            message: 'Delivery not available to this area',
          };
        }

        return {
          pincode: pin,
          isServiceable: pincodeData.isServiceable,
          areaName: pincodeData.areaName,
          city: pincodeData.city,
          state: pincodeData.state,
          deliveryDays: pincodeData.deliveryDays,
          deliveryCharge: pincodeData.deliveryCharge,
          isFreeDelivery: pincodeData.isFreeDelivery,
        };
      })
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/pincodes/search
 * Search pincodes by name or code
 */
router.get('/search', [
  query('q')
    .isLength({ min: 3, max: 50 })
    .withMessage('Search query must be 3-50 characters'),
  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name too long'),
  query('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name too long'),
  query('isServiceable')
    .optional()
    .isBoolean()
    .withMessage('isServiceable must be boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be 1-50'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, city, state, isServiceable } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Search by pincode, area name, or city
    if (q) {
      where.OR = [
        { pincode: { contains: q as string } },
        { areaName: { contains: q as string } },
        { city: { contains: q as string } },
      ];
    }

    if (city) {
      where.city = { contains: city as string };
    }

    if (state) {
      where.state = { contains: state as string };
    }

    if (isServiceable !== undefined) {
      where.isServiceable = isServiceable === 'true';
    }

    const [pincodes, total] = await Promise.all([
      prisma.pincode.findMany({
        where,
        orderBy: [
          { isServiceable: 'desc' },
          { city: 'asc' },
          { areaName: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.pincode.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        pincodes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Admin Routes
// ============================================

/**
 * GET /api/v1/admin/pincodes
 * Get all pincodes (admin)
 */
router.get('/', authenticate, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be 1-100'),
  query('isServiceable')
    .optional()
    .isBoolean()
    .withMessage('isServiceable must be boolean'),
  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  query('state')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  query('sortBy')
    .optional()
    .isIn(['pincode', 'areaName', 'city', 'state', 'deliveryDays', 'deliveryCharge'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || 'pincode';
    const sortOrder = (req.query.sortOrder as string) || 'asc';

    const where: any = {};

    if (req.query.isServiceable !== undefined) {
      where.isServiceable = req.query.isServiceable === 'true';
    }

    if (req.query.city) {
      where.city = { contains: req.query.city as string };
    }

    if (req.query.state) {
      where.state = { contains: req.query.state as string };
    }

    const [pincodes, total] = await Promise.all([
      prisma.pincode.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.pincode.count({ where }),
    ]);

    // Get statistics
    const stats = await prisma.pincode.aggregate({
      _count: true,
      where: { isServiceable: true, isActive: true },
    });

    res.json({
      success: true,
      data: {
        pincodes,
        stats: {
          totalServiceable: stats._count,
          total: total,
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/pincodes/:id
 * Get single pincode (admin)
 */
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const pincode = await prisma.pincode.findUnique({
      where: { id },
    });

    if (!pincode) {
      throw new NotFoundError('Pincode');
    }

    res.json({
      success: true,
      data: pincode,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/pincodes
 * Create new pincode (admin)
 */
router.post('/', authenticate, [
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      pincode,
      areaName,
      city,
      state,
      isServiceable,
      deliveryDays,
      deliveryCharge,
      isFreeDelivery,
    } = req.body;

    // Validate pincode format
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      throw new ValidationError('Validation failed', {
        pincode: ['Please enter a valid 6-digit pincode'],
      });
    }

    // Check if already exists
    const existing = await prisma.pincode.findUnique({
      where: { pincode },
    });

    if (existing) {
      throw new ValidationError('Validation failed', {
        pincode: ['This pincode already exists'],
      });
    }

    const newPincode = await prisma.pincode.create({
      data: {
        pincode,
        areaName,
        city: city || 'Navi Mumbai',
        state: state || 'Maharashtra',
        isServiceable: isServiceable ?? true,
        deliveryDays: deliveryDays ?? 2,
        deliveryCharge: deliveryCharge ?? 0,
        isFreeDelivery: isFreeDelivery ?? true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pincode created successfully',
      data: newPincode,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/pincodes/:id
 * Update pincode (admin)
 */
router.put('/:id', authenticate, [
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await prisma.pincode.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Pincode');
    }

    const updatedPincode = await prisma.pincode.update({
      where: { id },
      data: {
        ...(req.body.areaName !== undefined && { areaName: req.body.areaName }),
        ...(req.body.city !== undefined && { city: req.body.city }),
        ...(req.body.state !== undefined && { state: req.body.state }),
        ...(req.body.isServiceable !== undefined && { isServiceable: req.body.isServiceable }),
        ...(req.body.deliveryDays !== undefined && { deliveryDays: req.body.deliveryDays }),
        ...(req.body.deliveryCharge !== undefined && { deliveryCharge: req.body.deliveryCharge }),
        ...(req.body.isFreeDelivery !== undefined && { isFreeDelivery: req.body.isFreeDelivery }),
        ...(req.body.isActive !== undefined && { isActive: req.body.isActive }),
      },
    });

    res.json({
      success: true,
      message: 'Pincode updated successfully',
      data: updatedPincode,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/admin/pincodes/:id
 * Delete pincode (admin)
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await prisma.pincode.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Pincode');
    }

    await prisma.pincode.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Pincode deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/pincodes/bulk
 * Bulk import pincodes (admin)
 */
router.post('/bulk', authenticate, [
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pincodes } = req.body;

    if (!Array.isArray(pincodes) || pincodes.length === 0) {
      throw new ValidationError('Validation failed', {
        pincodes: ['Please provide an array of pincodes'],
      });
    }

    // Validate and prepare data
    const validPincodes: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < pincodes.length; i++) {
      const p = pincodes[i];
      if (!p.pincode || !/^[1-9][0-9]{5}$/.test(p.pincode)) {
        errors.push(`Row ${i + 1}: Invalid pincode format`);
        continue;
      }
      if (!p.areaName) {
        errors.push(`Row ${i + 1}: Missing area name`);
        continue;
      }

      validPincodes.push({
        pincode: p.pincode,
        areaName: p.areaName,
        city: p.city || 'Navi Mumbai',
        state: p.state || 'Maharashtra',
        isServiceable: p.isServiceable ?? true,
        deliveryDays: p.deliveryDays ?? 2,
        deliveryCharge: p.deliveryCharge ?? 0,
        isFreeDelivery: p.isFreeDelivery ?? true,
      });
    }

    // Upsert pincodes
    const results = await Promise.all(
      validPincodes.map(async (p) => {
        return prisma.pincode.upsert({
          where: { pincode: p.pincode },
          update: {
            areaName: p.areaName,
            city: p.city,
            state: p.state,
            isServiceable: p.isServiceable,
            deliveryDays: p.deliveryDays,
            deliveryCharge: p.deliveryCharge,
            isFreeDelivery: p.isFreeDelivery,
          },
          create: p,
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `Imported ${results.length} pincodes`,
      data: {
        imported: results.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
