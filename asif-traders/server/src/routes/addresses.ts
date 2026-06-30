import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { param, query, validationResult } from 'express-validator';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const prisma = new PrismaClient();

// Admin authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ValidationError('Authentication required', { auth: ['Bearer token required'] });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new ValidationError('Invalid authentication', { auth: ['User not found'] });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ValidationError('Invalid token', { auth: ['Invalid or expired token'] }));
    } else {
      next(error);
    }
  }
};

// Validation middleware
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
// User Address Routes
// ============================================

/**
 * GET /api/v1/addresses
 * Get all addresses for authenticated user
 */
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
        isActive: true,
      },
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
 * GET /api/v1/addresses/:id
 * Get single address
 */
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!address) {
      throw new NotFoundError('Address');
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/addresses
 * Create new address
 */
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault = false,
      addressType = 'home',
    } = req.body;

    // Validate required fields
    if (!name?.trim()) {
      throw new ValidationError('Validation failed', { name: ['Name is required'] });
    }
    if (!phone?.trim()) {
      throw new ValidationError('Validation failed', { phone: ['Phone is required'] });
    }
    if (!addressLine1?.trim()) {
      throw new ValidationError('Validation failed', { addressLine1: ['Address is required'] });
    }
    if (!city?.trim()) {
      throw new ValidationError('Validation failed', { city: ['City is required'] });
    }
    if (!state?.trim()) {
      throw new ValidationError('Validation failed', { state: ['State is required'] });
    }
    if (!pincode?.trim() || !/^[1-9][0-9]{5}$/.test(pincode)) {
      throw new ValidationError('Validation failed', { pincode: ['Invalid pincode format'] });
    }

    // If setting as default, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, isActive: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault,
        addressType,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/addresses/:id
 * Update address
 */
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Validate optional fields if provided
    if (req.body.pincode && !/^[1-9][0-9]{5}$/.test(req.body.pincode)) {
      throw new ValidationError('Validation failed', { pincode: ['Invalid pincode format'] });
    }

    // Check address exists and belongs to user
    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Address');
    }

    // If setting as default, unset others
    if (req.body.isDefault === true && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, isActive: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(req.body.name !== undefined && { name: req.body.name }),
        ...(req.body.phone !== undefined && { phone: req.body.phone }),
        ...(req.body.addressLine1 !== undefined && { addressLine1: req.body.addressLine1 }),
        ...(req.body.addressLine2 !== undefined && { addressLine2: req.body.addressLine2 }),
        ...(req.body.city !== undefined && { city: req.body.city }),
        ...(req.body.state !== undefined && { state: req.body.state }),
        ...(req.body.pincode !== undefined && { pincode: req.body.pincode }),
        ...(req.body.isDefault !== undefined && { isDefault: req.body.isDefault }),
        ...(req.body.addressType !== undefined && { addressType: req.body.addressType }),
      },
    });

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
 * DELETE /api/v1/addresses/:id
 * Soft delete address
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Check address exists and belongs to user
    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Address');
    }

    // Soft delete
    await prisma.address.update({
      where: { id },
      data: { isActive: false },
    });

    // If deleted was default, set first remaining as default
    if (existing.isDefault) {
      const firstRemaining = await prisma.address.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'asc' },
      });

      if (firstRemaining) {
        await prisma.address.update({
          where: { id: firstRemaining.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/addresses/:id/default
 * Set address as default
 */
router.put('/:id/default', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Check address exists and belongs to user
    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Address');
    }

    // Unset all defaults
    await prisma.address.updateMany({
      where: { userId, isDefault: true, isActive: true },
      data: { isDefault: false },
    });

    // Set this as default
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json({
      success: true,
      message: 'Default address updated',
      data: address,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
