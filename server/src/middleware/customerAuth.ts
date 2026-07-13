import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from './errorHandler.js';

const prisma = new PrismaClient();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      customerId?: string;
    }
  }
}

// Customer authentication middleware
export const authenticateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Check token type - customer tokens have type: 'customer'
      if (decoded.type && decoded.type !== 'customer') {
        throw new UnauthorizedError('Invalid token type');
      }

      // Verify user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, isActive: true, phone: true },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated');
      }

      req.userId = decoded.sub;
      req.customerId = decoded.sub;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (decoded.type !== 'customer') {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, isActive: true },
      });

      if (user && user.isActive) {
        req.userId = decoded.sub;
        req.customerId = decoded.sub;
      }
    } catch {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};
