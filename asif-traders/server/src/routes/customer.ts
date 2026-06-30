import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { AppError, UnauthorizedError, ValidationError } from '../middleware/errorHandler.js';
import { authenticateCustomer } from '../middleware/customerAuth.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// ============================================
// Constants
// ============================================
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_REQUESTS = 3;
const MAX_VERIFY_ATTEMPTS = 5;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

// ============================================
// Helper Functions
// ============================================

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP with bcrypt
const hashOTP = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

// Verify OTP
const verifyOTP = async (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};

// Generate customer tokens
const generateCustomerTokens = (userId: string, phone: string) => {
  const accessToken = jwt.sign(
    { sub: userId, phone, type: 'customer' },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { sub: userId, phone, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

// Generate mock MSG91 response (simulated for development)
const sendMockOTP = async (phone: string, otp: string): Promise<boolean> => {
  // In production, replace with actual MSG91/Twilio integration
  // For development, we'll log the OTP
  logger.info(`[DEV] OTP for ${phone}: ${otp}`);
  return true;
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
 * POST /api/v1/auth/request-otp
 * Request OTP for login/registration
 */
router.post('/request-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    // Check rate limiting - max 3 OTP requests per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentRequests = await prisma.otpRequest.count({
      where: {
        phone,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentRequests >= MAX_OTP_REQUESTS) {
      throw new ValidationError('Too many OTP requests. Please try again after 10 minutes.');
    }

    // Delete any existing unused OTPs for this phone
    await prisma.otpRequest.updateMany({
      where: {
        phone,
        isUsed: false,
        isVerified: false,
      },
      data: {
        isUsed: true, // Mark as used (expired)
      },
    });

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Create new user (registration)
      user = await prisma.user.create({
        data: {
          phone,
          isPhoneVerified: false,
        },
      });

      logger.info('New user registration initiated', { phone });
    }

    // Create OTP request
    await prisma.otpRequest.create({
      data: {
        phone,
        otpHash,
        expiresAt,
        userId: user.id,
      },
    });

    // Log lead event
    await prisma.leadEvent.create({
      data: {
        userId: user.id,
        eventType: 'OTP_REQUEST',
        source: req.headers['referer'] || 'direct',
        sourceUrl: req.originalUrl,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Send OTP (mock in development)
    await sendMockOTP(phone, otp);

    logger.info('OTP requested', { phone, userId: user.id });

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        expiresIn: OTP_EXPIRY_MINUTES * 60, // seconds
        remainingRequests: MAX_OTP_REQUESTS - recentRequests - 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/verify-otp
 * Verify OTP and login/register
 */
router.post('/verify-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;

    // Find valid OTP request
    const otpRequest = await prisma.otpRequest.findFirst({
      where: {
        phone,
        isUsed: false,
        isVerified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRequest) {
      throw new UnauthorizedError('OTP expired or not found. Please request a new OTP.');
    }

    // Check max attempts
    if (otpRequest.attempts >= MAX_VERIFY_ATTEMPTS) {
      await prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { isUsed: true },
      });
      throw new UnauthorizedError('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // Increment attempts
    await prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { attempts: otpRequest.attempts + 1 },
    });

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRequest.otpHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid OTP. Please try again.');
    }

    // Mark OTP as verified and used
    await prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: {
        isVerified: true,
        isUsed: true,
      },
    });

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Create user if not exists (shouldn't happen but safety check)
      user = await prisma.user.create({
        data: {
          phone,
          isPhoneVerified: true,
        },
      });
    } else {
      // Update phone verification status
      await prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true },
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateCustomerTokens(user.id, phone);

    // Log lead event
    await prisma.leadEvent.create({
      data: {
        userId: user.id,
        eventType: 'OTP_VERIFY',
        source: req.headers['referer'] || 'direct',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('OTP verified, user logged in', { phone, userId: user.id });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          isPhoneVerified: true,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', [
  body('refreshToken').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account not found or inactive');
    }

    // Generate new tokens
    const tokens = generateCustomerTokens(user.id, user.phone);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired refresh token'));
    } else {
      next(error);
    }
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', authenticateCustomer, async (req: Request, res: Response) => {
  // In a production app, you might want to blacklist the token
  // For now, client-side logout is sufficient
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/v1/auth/me
 * Get current customer profile
 */
router.get('/me', authenticateCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstin: true,
        isPhoneVerified: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/auth/profile
 * Update customer profile
 */
router.put('/profile', authenticateCustomer, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('gstin')
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Please enter a valid GSTIN'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, gstin } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: req.userId },
        },
      });

      if (existingUser) {
        throw new ValidationError('Email already registered with another account');
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(gstin !== undefined && { gstin }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstin: true,
        isPhoneVerified: true,
      },
    });

    logger.info('Profile updated', { userId: req.userId });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
