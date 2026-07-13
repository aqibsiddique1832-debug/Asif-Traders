import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { AppError, UnauthorizedError, ValidationError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();
const prisma = new PrismaClient();

// JWT Token generation
const generateTokens = (adminId: string, email: string) => {
  const accessToken = jwt.sign(
    { sub: adminId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { sub: adminId, email, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
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
 * POST /api/v1/auth/login
 * Admin login
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!admin.isActive) {
      throw new UnauthorizedError('Account is deactivated. Contact support.');
    }

    // Check if 2FA is enabled
    if (admin.is2FAEnabled && admin.twoFASecret) {
      // Return partial success - require 2FA code
      return res.json({
        success: true,
        requires2FA: true,
        tempToken: jwt.sign(
          { sub: admin.id, type: '2fa' },
          process.env.JWT_SECRET!,
          { expiresIn: '5m' }
        ),
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(admin.id, admin.email);

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('Admin login successful', { email: admin.email });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/verify-2fa
 * Verify 2FA code and complete login
 */
router.post('/verify-2fa', [
  body('tempToken').notEmpty(),
  body('code').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tempToken, code } = req.body;

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any;
    if (decoded.type !== '2fa') {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Find admin and verify 2FA
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
    });

    if (!admin || !admin.twoFASecret) {
      throw new UnauthorizedError('Invalid authentication');
    }

    // Verify TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret: admin.twoFASecret,
    });

    if (!isValid) {
      throw new UnauthorizedError('Invalid 2FA code');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(admin.id, admin.email);

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN_2FA',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('Admin login with 2FA successful', { email: admin.email });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
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

    // Find admin
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Account not found or inactive');
    }

    // Generate new tokens
    const tokens = generateTokens(admin.id, admin.email);

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
router.post('/logout', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ============================================
// 2FA Setup Routes
// ============================================

/**
 * POST /api/v1/auth/setup-2fa
 * Generate 2FA secret and QR code
 */
router.post('/setup-2fa', async (req: Request, res: Response, next: NextFunction) => {
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

    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    // Generate new secret
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      admin.email,
      process.env.TOTP_ISSUER || 'ASIF TRADERS',
      secret
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Store temp secret (not enabled yet)
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { twoFASecret: secret },
    });

    logger.info('2FA setup initiated', { email: admin.email });

    res.json({
      success: true,
      data: {
        secret,
        qrCode,
        otpauthUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/enable-2fa
 * Enable 2FA after verification
 */
router.post('/enable-2fa', [
  body('code').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { code } = req.body;

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
    });

    if (!admin || !admin.twoFASecret) {
      throw new UnauthorizedError('2FA setup not initiated');
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: admin.twoFASecret,
    });

    if (!isValid) {
      throw new ValidationError('Invalid verification code');
    }

    // Enable 2FA
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { is2FAEnabled: true },
    });

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: admin.id,
        action: 'ENABLE_2FA',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('2FA enabled', { email: admin.email });

    res.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/disable-2fa
 * Disable 2FA
 */
router.post('/disable-2fa', [
  body('code').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { code } = req.body;

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
    });

    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    // Verify current 2FA code
    if (admin.is2FAEnabled && admin.twoFASecret) {
      const isValid = authenticator.verify({
        token: code,
        secret: admin.twoFASecret,
      });

      if (!isValid) {
        throw new ValidationError('Invalid verification code');
      }
    }

    // Disable 2FA
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { is2FAEnabled: false },
    });

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: admin.id,
        action: 'DISABLE_2FA',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info('2FA disabled', { email: admin.email });

    res.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/me
 * Get current admin profile
 */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
