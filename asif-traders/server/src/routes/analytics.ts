import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { query, validationResult } from 'express-validator';
import { ValidationError } from '../middleware/errorHandler.js';
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
// Analytics Routes (Admin)
// ============================================

/**
 * GET /api/v1/admin/analytics/overview
 * Get dashboard overview metrics
 */
router.get('/overview', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    // Run all queries in parallel
    const [
      totalUsers,
      newUsersThisMonth,
      totalOrders,
      pendingOrders,
      totalRevenue,
      quoteRequests,
      pendingQuotes,
      contactSubmissions,
      unreadContacts,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Orders
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } },
      }),

      // Revenue
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startDate },
        },
      }),

      // Quotes
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({
        where: { status: { in: ['PENDING', 'REVIEWING'] } },
      }),

      // Contacts
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({
        where: { status: 'NEW' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisPeriod: newUsersThisMonth,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
        },
        revenue: {
          total: totalRevenue._sum.totalAmount || 0,
          currency: 'INR',
        },
        quotes: {
          total: quoteRequests,
          pending: pendingQuotes,
        },
        contacts: {
          total: contactSubmissions,
          unread: unreadContacts,
        },
        period: {
          startDate,
          endDate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/analytics/revenue
 * Get revenue analytics
 */
router.get('/revenue', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '365d', 'all'])
    .withMessage('Invalid period'),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) || '30d';
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365d':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    // Get daily revenue
    const dailyRevenue = await prisma.$queryRaw`
      SELECT
        DATE(createdAt) as date,
        COUNT(*) as orderCount,
        SUM(totalAmount) as revenue,
        SUM(gstAmount) as gstAmount
      FROM Order
      WHERE paymentStatus = 'PAID'
        AND createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

    // Get total revenue
    const totals = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
        gstAmount: true,
        subtotal: true,
      },
      _count: true,
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startDate },
      },
    });

    // Calculate average order value
    const avgOrderValue = totals._count > 0
      ? (totals._sum.totalAmount || 0) / totals._count
      : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: totals._sum.totalAmount || 0,
          totalGst: totals._sum.gstAmount || 0,
          totalSubtotal: totals._sum.subtotal || 0,
          orderCount: totals._count,
          averageOrderValue: Math.round(avgOrderValue * 100) / 100,
        },
        daily: (dailyRevenue as any[]).map((d: any) => ({
          date: d.date,
          revenue: d.revenue || 0,
          gstAmount: d.gstAmount || 0,
          orderCount: d.orderCount,
        })),
        period: {
          startDate,
          endDate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/analytics/leads
 * Get lead analytics
 */
router.get('/leads', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '365d'])
    .withMessage('Invalid period'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) || '30d';
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365d':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get event counts by type
    const eventCounts = await prisma.leadEvent.groupBy({
      by: ['eventType'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: {
        _count: { eventType: 'desc' },
      },
    });

    // Get lead sources
    const leadSources = await prisma.$queryRaw`
      SELECT
        COALESCE(NULLIF(source, ''), 'direct') as source,
        COUNT(*) as count
      FROM LeadEvent
      WHERE createdAt >= ${startDate}
        AND eventType IN ('OTP_REQUEST', 'QUOTE_START', 'CONTACT_SUBMIT')
      GROUP BY COALESCE(NULLIF(source, ''), 'direct')
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get conversion funnel
    const funnelEvents = ['PAGE_VIEW', 'OTP_REQUEST', 'OTP_VERIFY', 'QUOTE_START', 'QUOTE_SUBMIT', 'ORDER_PLACED'];
    const funnel = await Promise.all(
      funnelEvents.map(async (eventType) => {
        const count = await prisma.leadEvent.count({
          where: {
            eventType,
            createdAt: { gte: startDate },
          },
        });
        return { event: eventType, count };
      })
    );

    // Get recent leads
    const recentLeads = await prisma.leadEvent.findMany({
      where: {
        createdAt: { gte: startDate },
        userId: { not: null },
      },
      include: {
        user: {
          select: { phone: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalEvents: eventCounts.reduce((sum, e) => sum + e._count, 0),
          uniqueUsers: await prisma.leadEvent.groupBy({
            by: ['userId'],
            where: {
              createdAt: { gte: startDate },
              userId: { not: null },
            },
          }).then(g => g.length),
        },
        eventCounts: eventCounts.map(e => ({
          event: e.eventType,
          count: e._count,
        })),
        sources: leadSources,
        funnel,
        recentLeads: recentLeads.map(l => ({
          event: l.eventType,
          user: l.user?.phone || 'Unknown',
          createdAt: l.createdAt,
        })),
        period: period,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/analytics/products
 * Get product analytics
 */
router.get('/products', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '365d'])
    .withMessage('Invalid period'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) || '30d';
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365d':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Top selling products
    const topProducts = await prisma.$queryRaw`
      SELECT
        p.id,
        p.name,
        p.slug,
        SUM(oi.quantity) as totalQuantity,
        SUM(oi.lineTotal) as totalRevenue,
        COUNT(DISTINCT o.id) as orderCount
      FROM OrderItem oi
      JOIN "Order" o ON oi."orderId" = o.id
      JOIN ProductVariant pv ON oi."variantId" = pv.id
      JOIN Product p ON pv."productId" = p.id
      WHERE o."createdAt" >= ${startDate}
        AND o."paymentStatus" = 'PAID'
      GROUP BY p.id, p.name, p.slug
      ORDER BY totalRevenue DESC
      LIMIT 10
    `;

    // Products by category
    const categorySales = await prisma.$queryRaw`
      SELECT
        c.id,
        c.name,
        c.slug,
        COUNT(DISTINCT oi.id) as itemsSold,
        SUM(oi.quantity) as totalQuantity,
        SUM(oi.lineTotal) as totalRevenue
      FROM OrderItem oi
      JOIN "Order" o ON oi."orderId" = o.id
      JOIN ProductVariant pv ON oi."variantId" = pv.id
      JOIN Product p ON pv."productId" = p.id
      JOIN Category c ON p."categoryId" = c.id
      WHERE o."createdAt" >= ${startDate}
        AND o."paymentStatus" = 'PAID'
      GROUP BY c.id, c.name, c.slug
      ORDER BY totalRevenue DESC
    `;

    // Low stock products
    const lowStock = await prisma.productVariant.findMany({
      where: {
        stock: { lte: 10 },
        isActive: true,
      },
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { stock: 'asc' },
      take: 10,
    });

    // Products viewed (from lead events)
    const viewedProducts = await prisma.leadEvent.groupBy({
      by: ['metadata'],
      _count: true,
      where: {
        eventType: 'PRODUCT_VIEW',
        createdAt: { gte: startDate },
      },
      orderBy: {
        _count: { metadata: 'desc' },
      },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        topProducts: (topProducts as any[]).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          totalQuantity: Number(p.totalQuantity),
          totalRevenue: Number(p.totalRevenue),
          orderCount: Number(p.orderCount),
        })),
        categorySales: (categorySales as any[]).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          itemsSold: Number(c.itemsSold),
          totalQuantity: Number(c.totalQuantity),
          totalRevenue: Number(c.totalRevenue),
        })),
        lowStock: lowStock.map(v => ({
          id: v.id,
          product: v.product,
          size: v.size,
          stock: v.stock,
        })),
        period: period,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/analytics/orders
 * Get order analytics
 */
router.get('/orders', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '365d'])
    .withMessage('Invalid period'),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) || '30d';
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365d':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Order status distribution
    const statusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Payment status distribution
    const paymentDistribution = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: true,
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Orders by day
    const dailyOrders = await prisma.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as orderCount,
        SUM("totalAmount") as totalAmount,
        SUM(CASE WHEN "paymentStatus" = 'PAID' THEN "totalAmount" ELSE 0 END) as paidAmount
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Average order value
    const avgOrder = await prisma.order.aggregate({
      _avg: { totalAmount: true },
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders: avgOrder._count,
          averageOrderValue: Math.round((avgOrder._avg.totalAmount || 0) * 100) / 100,
        },
        statusDistribution: statusDistribution.map(s => ({
          status: s.status,
          count: s._count,
          revenue: s._sum.totalAmount || 0,
        })),
        paymentDistribution: paymentDistribution.map(p => ({
          status: p.paymentStatus,
          count: p._count,
          amount: p._sum.totalAmount || 0,
        })),
        dailyOrders: (dailyOrders as any[]).map((d: any) => ({
          date: d.date,
          orderCount: d.orderCount,
          totalAmount: Number(d.totalAmount),
          paidAmount: Number(d.paidAmount),
        })),
        period: period,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
