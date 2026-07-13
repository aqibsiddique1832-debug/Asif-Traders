import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { authenticateCustomer } from '../middleware/customerAuth.js';
import { logger } from '../utils/logger.js';

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
// Address Routes
// ============================================

/**
 * GET /api/v1/profile/addresses
 * Get user's addresses
 */
router.get('/addresses', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.customerId!;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/profile/addresses
 * Add new address
 */
router.post('/addresses', authenticateCustomer, [
  body('label')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Label must be 1-50 characters'),
  body('fullAddress')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Full address must be 10-500 characters'),
  body('landmark')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Landmark must be under 100 characters'),
  body('pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please enter a valid 6-digit pincode'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be under 100 characters'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.customerId!;
    const { label, fullAddress, landmark, pincode, city, state, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address (make it default)
    const addressCount = await prisma.address.count({ where: { userId } });

    const address = await prisma.address.create({
      data: {
        userId,
        label,
        fullAddress,
        landmark,
        pincode,
        city,
        state: state || 'Maharashtra',
        isDefault: isDefault || addressCount === 0,
      },
    });

    logger.info('Address added', { userId, addressId: address.id });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/profile/addresses/:id
 * Update address
 */
router.put('/addresses/:id', authenticateCustomer, [
  body('label')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Label must be 1-50 characters'),
  body('fullAddress')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Full address must be 10-500 characters'),
  body('landmark')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Landmark must be under 100 characters'),
  body('pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please enter a valid 6-digit pincode'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be under 100 characters'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.customerId!;

    // Find existing address
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundError('Address');
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(req.body.label !== undefined && { label: req.body.label }),
        ...(req.body.fullAddress !== undefined && { fullAddress: req.body.fullAddress }),
        ...(req.body.landmark !== undefined && { landmark: req.body.landmark }),
        ...(req.body.pincode !== undefined && { pincode: req.body.pincode }),
        ...(req.body.city !== undefined && { city: req.body.city }),
        ...(req.body.state !== undefined && { state: req.body.state }),
        ...(req.body.isDefault !== undefined && { isDefault: req.body.isDefault }),
      },
    });

    logger.info('Address updated', { userId, addressId: id });

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/profile/addresses/:id
 * Delete address
 */
router.delete('/addresses/:id', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.customerId!;

    // Find existing address
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundError('Address');
    }

    await prisma.address.delete({
      where: { id },
    });

    // If deleted address was default, make another one default
    if (existingAddress.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    logger.info('Address deleted', { userId, addressId: id });

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/profile/addresses/:id/default
 * Set address as default
 */
router.put('/addresses/:id/default', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.customerId!;

    // Find existing address
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundError('Address');
    }

    // Unset all defaults
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set this as default
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    logger.info('Default address set', { userId, addressId: id });

    res.json({
      success: true,
      message: 'Default address updated',
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Testimonial Routes (Customer-facing)
// ============================================

/**
 * POST /api/v1/profile/testimonials
 * Submit a testimonial
 */
router.post('/testimonials', authenticateCustomer, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be 10-1000 characters'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be under 100 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.customerId!;
    const { rating, content, companyName, location } = req.body;

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const testimonial = await prisma.testimonial.create({
      data: {
        userId,
        customerName: user?.name || 'Anonymous',
        companyName,
        location,
        rating,
        content,
        isApproved: false, // Requires admin approval
        isFeatured: false,
      },
    });

    logger.info('Testimonial submitted', { userId, testimonialId: testimonial.id });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your testimonial will be reviewed before publishing.',
      data: {
        id: testimonial.id,
        rating: testimonial.rating,
        content: testimonial.content,
        isApproved: testimonial.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/profile/testimonials
 * Get user's testimonials
 */
router.get('/testimonials', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.customerId!;

    const testimonials = await prisma.testimonial.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
