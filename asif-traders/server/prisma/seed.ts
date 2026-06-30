import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // ============================================
  // Create Admin User
  // ============================================
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@asiftraders.in' },
    update: {},
    create: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@asiftraders.in',
      password: adminPassword,
      phone: process.env.ADMIN_PHONE || '+918879149174',
      role: 'SUPER_ADMIN',
      isActive: true,
      is2FAEnabled: false,
    },
  });
  console.log('Admin user created:', admin.email);

  // ============================================
  // Create Categories
  // ============================================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cement' },
      update: {},
      create: {
        name: 'Cement',
        slug: 'cement',
        description: 'Premium quality cement for all construction needs',
        icon: 'Layers',
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'steel' },
      update: {},
      create: {
        name: 'Steel & TMT Bars',
        slug: 'steel',
        description: 'High-grade TMT bars and steel for reinforcement',
        icon: 'Box',
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sand-aggregates' },
      update: {},
      create: {
        name: 'Sand & Aggregates',
        slug: 'sand-aggregates',
        description: 'Quality sand, aggregates, and river sand',
        icon: 'Mountain',
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bricks-blocks' },
      update: {},
      create: {
        name: 'Bricks & Blocks',
        slug: 'bricks-blocks',
        description: 'AAC blocks, red bricks, and fly ash bricks',
        icon: 'Grid3x3',
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pipes-fittings' },
      update: {},
      create: {
        name: 'Pipes & Fittings',
        slug: 'pipes-fittings',
        description: 'PVC, CPVC, and GI pipes with fittings',
        icon: 'Workflow',
        isActive: true,
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'electrical' },
      update: {},
      create: {
        name: 'Electrical',
        slug: 'electrical',
        description: 'Wires, cables, switches, and electrical accessories',
        icon: 'Zap',
        isActive: true,
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'plumbing' },
      update: {},
      create: {
        name: 'Plumbing',
        slug: 'plumbing',
        description: 'Bathroom fittings, taps, and sanitaryware',
        icon: 'Droplets',
        isActive: true,
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'roofing-sheets' },
      update: {},
      create: {
        name: 'Roofing Sheets',
        slug: 'roofing-sheets',
        description: 'Color coated sheets, polycarbonate, and tin sheets',
        icon: 'Home',
        isActive: true,
        sortOrder: 8,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'construction-chemicals' },
      update: {},
      create: {
        name: 'Construction Chemicals',
        slug: 'construction-chemicals',
        description: 'Waterproofing, adhesives, and construction chemicals',
        icon: 'FlaskConical',
        isActive: true,
        sortOrder: 9,
      },
    }),
  ]);
  console.log('Categories created:', categories.length);

  // ============================================
  // Create Brands
  // ============================================
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'ultratech' },
      update: {},
      create: {
        name: 'UltraTech',
        slug: 'ultratech',
        logo: '/images/brands/ultratech.png',
        website: 'https://www.ultratechcement.com',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'acc' },
      update: {},
      create: {
        name: 'ACC',
        slug: 'acc',
        logo: '/images/brands/acc.png',
        website: 'https://www.acclimited.com',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'tata-tiscon' },
      update: {},
      create: {
        name: 'TATA Tiscon',
        slug: 'tata-tiscon',
        logo: '/images/brands/tata.png',
        website: 'https://www.tatasteel.com',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'sail' },
      update: {},
      create: {
        name: 'SAIL',
        slug: 'sail',
        logo: '/images/brands/sail.png',
        website: 'https://www.sail.gov.in',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'jsw' },
      update: {},
      create: {
        name: 'JSW',
        slug: 'jsw',
        logo: '/images/brands/jsw.png',
        website: 'https://www.jsw.in',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'astral' },
      update: {},
      create: {
        name: 'Astral',
        slug: 'astral',
        logo: '/images/brands/astral.png',
        website: 'https://www.astralpipes.com',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'finolex' },
      update: {},
      create: {
        name: 'Finolex',
        slug: 'finolex',
        logo: '/images/brands/finolex.png',
        website: 'https://www.finolexpipes.com',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'havells' },
      update: {},
      create: {
        name: 'Havells',
        slug: 'havells',
        logo: '/images/brands/havells.png',
        website: 'https://www.havells.com',
        isActive: true,
      },
    }),
  ]);
  console.log('Brands created:', brands.length);

  // ============================================
  // Create Products with Variants
  // ============================================
  const cementCategory = categories.find(c => c.slug === 'cement')!;
  const ultratechBrand = brands.find(b => b.slug === 'ultratech')!;
  const accBrand = brands.find(b => b.slug === 'acc')!;

  // Products Data
  const productsData = [
    {
      name: 'UltraTech Portland Cement (OPC 53)',
      slug: 'ultratech-opc-53-cement',
      description: 'UltraTech OPC 53 Grade Cement is a high-strength cement that provides protection from climate changes and ensures durability of structures.',
      features: ['High strength', 'Quick setting', 'Climate resistant', 'Durable structures'],
      unit: 'bag (50kg)',
      categoryId: cementCategory.id,
      brandId: ultratechBrand.id,
      variants: [
        { size: '50 kg', mrp: 420, sellingPrice: 380 },
        { size: '25 kg', mrp: 220, sellingPrice: 195 },
      ],
    },
    {
      name: 'UltraTech Portland Pozzolana Cement (PPC)',
      slug: 'ultratech-ppc-cement',
      description: 'UltraTech PPC is blended cement that provides improved workability, superior finish, and enhanced durability.',
      features: ['Eco-friendly', 'Better workability', 'Reduced cracks', 'Longer life'],
      unit: 'bag (50kg)',
      categoryId: cementCategory.id,
      brandId: ultratechBrand.id,
      variants: [
        { size: '50 kg', mrp: 400, sellingPrice: 365 },
      ],
    },
    {
      name: 'ACC Cement (OPC 53)',
      slug: 'acc-opc-53-cement',
      description: 'ACC 53 Grade Ordinary Portland Cement is a high-quality cement for high-strength applications.',
      features: ['High early strength', 'Consistent quality', 'Fast setting'],
      unit: 'bag (50kg)',
      categoryId: cementCategory.id,
      brandId: accBrand.id,
      variants: [
        { size: '50 kg', mrp: 410, sellingPrice: 375 },
      ],
    },
    {
      name: 'ACC Gold Waterproof Cement',
      slug: 'acc-gold-waterproof-cement',
      description: 'ACC Gold with Waterlock Technology provides extra protection against water seepage.',
      features: ['Waterproof', 'Extra strength', 'Crack resistance'],
      unit: 'bag (50kg)',
      categoryId: cementCategory.id,
      brandId: accBrand.id,
      variants: [
        { size: '50 kg', mrp: 450, sellingPrice: 410 },
      ],
    },
  ];

  // Create products
  for (const productData of productsData) {
    const { variants, ...productInfo } = productData;

    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {},
      create: {
        ...productInfo,
        features: JSON.stringify(productInfo.features),
        tags: JSON.stringify(['best-seller']),
        isActive: true,
      },
    });

    // Create variants
    for (const variant of variants) {
      const sku = `${product.slug}-${variant.size}`.toUpperCase().replace(/-/g, '').replace(/\s/g, '');

      await prisma.productVariant.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size: variant.size,
          },
        },
        update: {},
        create: {
          productId: product.id,
          size: variant.size,
          mrp: variant.mrp,
          sellingPrice: variant.sellingPrice,
          stock: Math.floor(Math.random() * 500) + 100,
          sku: sku,
          isActive: true,
        },
      });

      // Create initial inventory log
      const createdVariant = await prisma.productVariant.findFirst({
        where: { productId: product.id, size: variant.size },
      });

      if (createdVariant) {
        await prisma.inventoryLog.create({
          data: {
            variantId: createdVariant.id,
            change: createdVariant.stock,
            reason: 'INITIAL_STOCK',
            notes: 'Initial stock on product creation',
          },
        });
      }
    }
  }
  console.log('Products and variants created');

  // ============================================
  // Create Testimonials
  // ============================================
  await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        customerName: 'Rajesh Patel',
        location: 'Airoli, Navi Mumbai',
        rating: 5,
        content: 'Best quality cement and steel at competitive prices. Their delivery is always on time and the staff is very helpful.',
        isApproved: true,
        isFeatured: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        customerName: 'Suresh Kumar',
        location: 'Thane',
        rating: 5,
        content: 'I have been buying from Asif Traders for 5 years now. Their product range is excellent and prices are very reasonable.',
        isApproved: true,
        isFeatured: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-3' },
      update: {},
      create: {
        id: 'testimonial-3',
        customerName: 'Mohammad Ansari',
        location: 'Digha, Navi Mumbai',
        rating: 5,
        content: 'Great experience with Asif Traders. They helped me select the right materials for my project and even arranged quick delivery.',
        isApproved: true,
        isFeatured: true,
      },
    }),
  ]);
  console.log('Testimonials created');

  // ============================================
  // Create Settings
  // ============================================
  await Promise.all([
    prisma.setting.upsert({
      where: { key: 'company_info' },
      update: {},
      create: {
        key: 'company_info',
        value: JSON.stringify({
          name: 'ASIF TRADERS',
          tagline: 'Your Trusted Building Materials Partner',
          phone: ['+91 88791 49174', '+91 79773 71025', '+91 99199 51519'],
          whatsapp: '+918879149174',
          email: 'info@asiftraders.in',
          address: 'Digha, Thane-Belapur Road, Navi Mumbai, Maharashtra',
          timings: { weekdays: '8:00 AM - 8:00 PM', sunday: '9:00 AM - 2:00 PM' },
        }),
        description: 'Company contact and basic information',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'social_links' },
      update: {},
      create: {
        key: 'social_links',
        value: JSON.stringify({
          whatsapp: 'https://wa.me/918879149174',
          phone: 'tel:+918879149174',
          email: 'mailto:info@asiftraders.in',
          map: 'https://maps.google.com/?q=Digha,Thane-Belapur+Road,Navi+Mumbai',
        }),
        description: 'Social and contact links',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'delivery_info' },
      update: {},
      create: {
        key: 'delivery_info',
        value: JSON.stringify({
          freeDeliveryThreshold: 5000,
          deliveryAreas: ['Navi Mumbai', 'Thane', 'Mumbai', 'Panvel'],
          estimatedDeliveryTime: 'Same day to 2 days',
        }),
        description: 'Delivery configuration',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'quote_settings' },
      update: {},
      create: {
        key: 'quote_settings',
        value: JSON.stringify({
          quoteValidityDays: 7,
          autoAssign: true,
          notificationEmails: ['admin@asiftraders.in'],
        }),
        description: 'Quote request settings',
      },
    }),
  ]);
  console.log('Settings created');

  // ============================================
  // Create Sample Quote Requests
  // ============================================
  await Promise.all([
    prisma.quoteRequest.create({
      data: {
        referenceNo: 'QT001',
        userName: 'Amit Sharma',
        userPhone: '+919876543210',
        userEmail: 'amit.sharma@email.com',
        gstin: '27XXXXX1234X1ZX',
        notes: 'Required for residential construction project in Airoli',
        status: 'PENDING',
        items: {
          create: [
            { productName: 'UltraTech OPC 53 Cement', variantSize: '50 kg', quantity: 100, unit: 'bags' },
            { productName: 'TATA Tiscon TMT Bar 16mm', variantSize: '12m', quantity: 50, unit: 'pieces' },
          ],
        },
      },
    }),
    prisma.quoteRequest.create({
      data: {
        referenceNo: 'QT002',
        userName: 'Priya Verma',
        userPhone: '+919988776655',
        userEmail: 'priya.v@email.com',
        notes: 'Commercial project - need bulk order',
        status: 'QUOTED',
        totalAmount: 150000,
        assignedToId: admin.id,
        items: {
          create: [
            { productName: 'ACC Gold Waterproof Cement', variantSize: '50 kg', quantity: 200, unit: 'bags' },
            { productName: 'Astral PVC Pipes 4"', variantSize: '3m', quantity: 100, unit: 'pieces' },
          ],
        },
      },
    }),
  ]);
  console.log('Sample quote requests created');

  console.log('');
  console.log('Database seed completed successfully!');
  console.log('');
  console.log('Admin Login Details:');
  console.log('Email:', process.env.ADMIN_EMAIL || 'admin@asiftraders.in');
  console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@123');
  console.log('');
  console.log('Please change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
