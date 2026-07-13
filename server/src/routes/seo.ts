import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();
const prisma = new PrismaClient();

const BASE_URL = process.env.FRONTEND_URL || 'https://asiftraders.com';

// ============================================
// Sitemap Generator
// ============================================

/**
 * GET /api/v1/sitemap.xml
 * Generate XML sitemap
 */
router.get('/sitemap.xml', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    // Get all active brands
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/categories', priority: '0.9', changefreq: 'daily' },
      { url: '/brands', priority: '0.8', changefreq: 'weekly' },
      { url: '/quotes', priority: '0.7', changefreq: 'weekly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    ];

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Categories
    for (const cat of categories) {
      const lastmod = cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/category/${cat.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Brands
    for (const brand of brands) {
      const lastmod = brand.updatedAt ? new Date(brand.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/brand/${brand.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    // Products
    for (const product of products) {
      const lastmod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/product/${product.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/robots.txt
 * Generate robots.txt
 */
router.get('/robots.txt', (req: Request, res: Response) => {
  const robots = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/api/v1/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /api/v1/
  `.trim();

  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// ============================================
// JSON-LD Structured Data
// ============================================

/**
 * GET /api/v1/structured-data
 * Get JSON-LD structured data for homepage
 */
router.get('/structured-data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get featured products
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        images: { where: { isPrimary: true } },
        variants: {
          where: { isActive: true },
          orderBy: { sellingPrice: 'asc' },
          take: 1,
        },
        category: true,
        brand: true,
      },
      take: 10,
    });

    // Build Organization schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ASIF TRADERS',
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.png`,
      description: 'Building materials supplier in Navi Mumbai, Maharashtra. Quality cement, steel, pipes, and construction materials.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No. 12, Industrial Area, Airoli',
        addressLocality: 'Navi Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400708',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9876543210',
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi', 'mr'],
      },
      sameAs: [
        'https://www.facebook.com/asiftraders',
        'https://www.instagram.com/asiftraders',
      ],
    };

    // Build Product schema for featured products
    const productSchemas = featuredProducts.map((product) => {
      const primaryImage = product.images[0]?.url || `${BASE_URL}/images/placeholder.jpg`;
      const minPrice = product.variants[0]?.sellingPrice || 0;

      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `Buy ${product.name} at best price from ASIF TRADERS`,
        image: primaryImage,
        url: `${BASE_URL}/product/${product.slug}`,
        brand: product.brand ? {
          '@type': 'Brand',
          name: product.brand.name,
        } : undefined,
        category: product.category?.name,
        offers: {
          '@type': 'Offer',
          price: minPrice.toFixed(2),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'ASIF TRADERS',
          },
        },
      };
    });

    // Build aggregate rating if testimonials exist
    const approvedTestimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      select: { rating: true },
    });

    let aggregateRating = undefined;
    if (approvedTestimonials.length > 0) {
      const avgRating = approvedTestimonials.reduce((sum, t) => sum + t.rating, 0) / approvedTestimonials.length;
      aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: approvedTestimonials.length,
        bestRating: '5',
        worstRating: '1',
      };
    }

    // LocalBusiness schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'Store'],
      name: 'ASIF TRADERS',
      image: `${BASE_URL}/images/logo.png`,
      url: BASE_URL,
      telephone: '+91-9876543210',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No. 12, Industrial Area, Airoli',
        addressLocality: 'Navi Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400708',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '19.1537',
        longitude: '72.9995',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      priceRange: '₹₹',
      ...(aggregateRating && { aggregateRating }),
    };

    res.json({
      success: true,
      data: {
        organization: organizationSchema,
        localBusiness: localBusinessSchema,
        products: productSchemas,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/structured-data/product/:slug
 * Get JSON-LD for a specific product
 */
router.get('/structured-data/product/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { isPrimary: 'desc' } },
        variants: { where: { isActive: true } },
        category: true,
        brand: true,
      },
    });

    if (!product || !product.isActive) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    // Get approved testimonials for this product
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        // In a real scenario, you'd filter by product
      },
      select: { rating: true, content: true },
      take: 5,
    });

    const primaryImage = product.images[0]?.url || `${BASE_URL}/images/placeholder.jpg`;
    const minPrice = Math.min(...product.variants.map(v => v.sellingPrice));
    const maxPrice = Math.max(...product.variants.map(v => v.sellingPrice));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} - Buy online at ASIF TRADERS`,
      image: product.images.map(img => img.url),
      url: `${BASE_URL}/product/${product.slug}`,
      brand: product.brand ? {
        '@type': 'Brand',
        name: product.brand.name,
      } : undefined,
      category: product.category?.name,
      sku: product.variants[0]?.sku,
      mpn: product.id,
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: minPrice.toFixed(2),
        highPrice: maxPrice.toFixed(2),
        priceCurrency: 'INR',
        availability: product.variants.some(v => v.stock > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'ASIF TRADERS',
        },
      },
    };

    // Add reviews if available
    if (testimonials.length > 0) {
      const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
      (schema as any).aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: testimonials.length,
        bestRating: '5',
        worstRating: '1',
      };
      (schema as any).review = testimonials.map(t => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: t.rating,
          bestRating: '5',
          worstRating: '1',
        },
        reviewBody: t.content,
        author: {
          '@type': 'Person',
          name: 'Verified Customer',
        },
      }));
    }

    res.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/structured-data/organization
 * Get Organization JSON-LD only
 */
router.get('/structured-data/organization', async (req: Request, res: Response) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ASIF TRADERS',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: 'Building materials supplier in Navi Mumbai, Maharashtra.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 12, Industrial Area, Airoli',
      addressLocality: 'Navi Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400708',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'sales',
      areaServed: 'IN',
    },
  };

  res.json(schema);
});

/**
 * GET /api/v1/structured-data/local-business
 * Get LocalBusiness JSON-LD only
 */
router.get('/structured-data/local-business', async (req: Request, res: Response) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    name: 'ASIF TRADERS - Building Materials',
    image: `${BASE_URL}/images/logo.png`,
    url: BASE_URL,
    telephone: '+91-9876543210',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 12, Industrial Area, Airoli',
      addressLocality: 'Navi Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400708',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.1537',
      longitude: '72.9995',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    priceRange: '₹₹',
    servesCuisine: 'Building Materials',
    hasMap: `${BASE_URL}/contact#map`,
  };

  res.json(schema);
});

/**
 * GET /api/v1/structured-data/faq
 * Get FAQ JSON-LD
 */
router.get('/structured-data/faq', (req: Request, res: Response) => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What building materials do you supply?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We supply a wide range of building materials including cement, steel, pipes, electrical items, plumbing supplies, and more from trusted brands.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer delivery in Navi Mumbai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer free delivery in most areas of Navi Mumbai and Thane. Delivery charges may apply for distant locations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods do you accept?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept online payments via Razorpay (UPI, cards, net banking), bank transfers, and cash on delivery for select areas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get a bulk quote?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can request a bulk quote through our website or contact us directly. We offer special rates for bulk orders.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide installation services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are a materials supplier and do not provide installation services. However, we can recommend trusted contractors if needed.',
        },
      },
    ],
  };

  res.json(faqSchema);
});

export default router;
