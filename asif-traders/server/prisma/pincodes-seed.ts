import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Common Navi Mumbai and Mumbai area pincodes
const pincodes = [
  // Airoli and nearby
  { pincode: '400708', areaName: 'Airoli Sector 1', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400709', areaName: 'Airoli Sector 2', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400710', areaName: 'Airoli Sector 3', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400711', areaName: 'Airoli Sector 4', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400801', areaName: 'Rabale', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400802', areaName: 'Ghansoli', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400803', areaName: 'Koproli', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400804', areaName: 'Sanpada', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },

  // Vashi and nearby
  { pincode: '400703', areaName: 'Vashi Sector 1', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400704', areaName: 'Vashi Sector 2', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400705', areaName: 'Vashi Sector 9', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400706', areaName: 'Vashi Sector 17', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400614', areaName: 'Vashi', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400703', areaName: 'Juhu Nagar', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },

  // Nerul and nearby
  { pincode: '400706', areaName: 'Nerul Sector 1', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400707', areaName: 'Nerul Sector 2', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400708', areaName: 'Nerul Sector 3', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400706', areaName: 'Nerul East', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400706', areaName: 'Nerul West', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400706', areaName: 'Seawoods', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },

  // Kharghar and nearby
  { pincode: '410210', areaName: 'Kharghar Sector 1', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '410211', areaName: 'Kharghar Sector 2', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '410212', areaName: 'Kharghar Sector 12', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '410220', areaName: 'Kharghar', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '410221', areaName: 'Kamothe', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '410222', areaName: 'Kalamboli', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Panvel and nearby
  { pincode: '410206', areaName: 'Panvel City', city: 'Panvel', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '410207', areaName: 'Panvel Sector 1', city: 'Panvel', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '410208', areaName: 'New Panvel', city: 'Panvel', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '410209', areaName: 'Taloja', city: 'Panvel', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '410218', areaName: 'Ulwe', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '410219', areaName: 'Belapur', city: 'Navi Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Thane
  { pincode: '400601', areaName: 'Thane City', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400602', areaName: 'Thane West', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400603', areaName: 'Thane East', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400604', areaName: 'Naupada', city: 'Thane', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400605', areaName: 'Lokmanya Nagar', city: 'Thane', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400606', areaName: 'Kapurbawdi', city: 'Thane', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400607', areaName: 'Majiwada', city: 'Thane', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400608', areaName: 'Teen Haath Naka', city: 'Thane', state: 'Maharashtra', deliveryDays: 2, deliveryCharge: 0, isFreeDelivery: true },
  { pincode: '400610', areaName: 'Ghodbunder Road', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400611', areaName: 'Kasarvadavali', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Mulund and Bhandup
  { pincode: '400080', areaName: 'Mulund West', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400081', areaName: 'Mulund East', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400078', areaName: 'Bhandup West', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400079', areaName: 'Bhandup East', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400082', areaName: 'Kanjurmarg', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Dombivli and Kalyan
  { pincode: '421201', areaName: 'Dombivli East', city: 'Dombivli', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '421202', areaName: 'Dombivli West', city: 'Dombivli', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '421203', areaName: 'Thakurli', city: 'Thane', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '421301', areaName: 'Kalyan City', city: 'Kalyan', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '421302', areaName: 'Kalyan West', city: 'Kalyan', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '421303', areaName: 'Kalyan East', city: 'Kalyan', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Mira Road and Vasai
  { pincode: '401107', areaName: 'Mira Road', city: 'Mira Bhayandar', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '401101', areaName: 'Bhayandar West', city: 'Mira Bhayandar', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '401105', areaName: 'Bhayandar East', city: 'Mira Bhayandar', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '401208', areaName: 'Vasai West', city: 'Vasai Virar', state: 'Maharashtra', deliveryDays: 4, deliveryCharge: 100, isFreeDelivery: false },
  { pincode: '401209', areaName: 'Vasai East', city: 'Vasai Virar', state: 'Maharashtra', deliveryDays: 4, deliveryCharge: 100, isFreeDelivery: false },
  { pincode: '401202', areaName: 'Virar West', city: 'Vasai Virar', state: 'Maharashtra', deliveryDays: 4, deliveryCharge: 100, isFreeDelivery: false },

  // Mumbai Central areas
  { pincode: '400064', areaName: 'Powai', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400072', areaName: 'Kurla', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400070', areaName: 'Ghatkopar West', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400077', areaName: 'Ghatkopar East', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },
  { pincode: '400071', areaName: 'Vidyavihar', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 3, deliveryCharge: 50, isFreeDelivery: false },

  // Not serviceable areas (for testing)
  { pincode: '110001', areaName: 'Connaught Place', city: 'New Delhi', state: 'Delhi', deliveryDays: 7, deliveryCharge: 200, isFreeDelivery: false, isServiceable: false },
  { pincode: '600001', areaName: 'Anna Square', city: 'Chennai', state: 'Tamil Nadu', deliveryDays: 7, deliveryCharge: 200, isFreeDelivery: false, isServiceable: false },
  { pincode: '560001', areaName: 'MG Road', city: 'Bangalore', state: 'Karnataka', deliveryDays: 7, deliveryCharge: 200, isFreeDelivery: false, isServiceable: false },
];

async function seedPincodes() {
  console.log('Starting pincode seed...');

  let created = 0;
  let updated = 0;

  for (const pin of pincodes) {
    const result = await prisma.pincode.upsert({
      where: { pincode: pin.pincode },
      update: {
        areaName: pin.areaName,
        city: pin.city,
        state: pin.state,
        deliveryDays: pin.deliveryDays,
        deliveryCharge: pin.deliveryCharge,
        isFreeDelivery: pin.isFreeDelivery,
        isServiceable: pin.isServiceable ?? true,
        isActive: true,
      },
      create: {
        pincode: pin.pincode,
        areaName: pin.areaName,
        city: pin.city,
        state: pin.state,
        deliveryDays: pin.deliveryDays,
        deliveryCharge: pin.deliveryCharge,
        isFreeDelivery: pin.isFreeDelivery,
        isServiceable: pin.isServiceable ?? true,
        isActive: true,
      },
    });

    if (result) {
      created++;
    }
  }

  console.log(`Pincode seeding complete! Created/Updated: ${pincodes.length} pincodes`);

  // Log summary
  const summary = await prisma.pincode.groupBy({
    by: ['isServiceable'],
    _count: true,
  });

  console.log('Summary:', summary);
}

seedPincodes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
