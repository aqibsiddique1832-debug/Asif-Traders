import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import profileRoutes from './routes/profile.js';
import analyticsRoutes from './routes/analytics.js';
import paymentsRoutes from './routes/payments.js';
import pincodesRoutes from './routes/pincodes.js';
import seoRoutes from './routes/seo.js';
import addressesRoutes from './routes/addresses.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './utils/logger.js';

// __dirname for ESM compatibility
const __dirname = path.resolve();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/v1/auth', authLimiter);

// Request logging
app.use(requestLogger);

// ============================================
// Routes
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', customerRoutes);  // Customer OTP auth (request-otp, verify-otp, refresh, logout, me)
app.use('/api/v1/admin/auth', authRoutes);  // Admin auth (login, logout, refresh, me)
app.use('/api/v1', publicRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);

// Customer-facing routes
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/addresses', addressesRoutes);
app.use('/api/v1/payments', paymentsRoutes);

// Public routes
app.use('/api/v1/pincodes', pincodesRoutes);
app.use('/api/v1/seo', seoRoutes);

// SEO static routes
app.get('/sitemap.xml', seoRoutes);
app.get('/robots.txt', seoRoutes);

// Webhooks
app.use('/api/v1/webhooks', paymentsRoutes);

// Serve static admin panel
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// ============================================
// Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 ASIF TRADERS API Server                      ║
║                                                   ║
║   Server running on port ${PORT}                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   API Base: http://localhost:${PORT}/api/v1            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
