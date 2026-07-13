export interface Variant {
  size: string;
  grade?: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  name: string;
  variants: Variant[];
  description: string;
  specifications: Record<string, string>;
  image: string;
  inStock: boolean;
  minOrderQty: number;
  unit: 'bag' | 'ton' | 'piece' | 'sqft' | 'running_ft' | 'per_brass' | 'per_truck' | 'bundle';
  brand?: string;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: 'cement',
    slug: 'cement',
    name: 'Cement',
    description: 'Premium cement for every construction need',
    image: '/images/categories/cement.jpg',
    productCount: 7,
    subcategories: ['OPC 43 Grade', 'OPC 53 Grade', 'PPC Cement', 'PSC Cement', 'White Cement', 'Ready Mix Cement']
  },
  {
    id: 'tmt-bars',
    slug: 'tmt-bars',
    name: 'TMT Bars',
    description: 'High-strength TMT reinforcement bars',
    image: '/images/categories/tmt-bars.jpg',
    productCount: 8,
    subcategories: ['6mm', '8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '32mm']
  },
  {
    id: 'structural-steel',
    slug: 'structural-steel',
    name: 'Structural Steel',
    description: 'MS angles, channels, plates and more',
    image: '/images/categories/structural-steel.jpg',
    productCount: 9,
    subcategories: ['MS Angle', 'MS Channel', 'MS Flat', 'MS Square Bar', 'MS Round Bar', 'MS Plate', 'MS Sheet', 'Chequered Plate', 'I-Beams / Beams']
  },
  {
    id: 'gi-pipes',
    slug: 'gi-pipes',
    name: 'GI Pipes',
    description: 'Galvanized iron pipes for plumbing',
    image: '/images/categories/gi-pipes.jpg',
    productCount: 6,
    subcategories: ['Light Class', 'Medium Class', 'Heavy Class', 'Round GI Pipe', 'GI Square Pipe', 'GI Rectangle Pipe']
  },
  {
    id: 'ms-pipes',
    slug: 'ms-pipes',
    name: 'MS Pipes',
    description: 'Mild steel pipes for structural use',
    image: '/images/categories/ms-pipes.jpg',
    productCount: 5,
    subcategories: ['Round Pipe', 'Square Pipe', 'Rectangle Pipe', 'ERW Pipe', 'Seamless Pipe']
  },
  {
    id: 'tiles',
    slug: 'tiles',
    name: 'Tiles',
    description: 'Vitrified, ceramic and designer tiles',
    image: '/images/categories/tiles.jpg',
    productCount: 8,
    subcategories: ['Vitrified Tiles', 'Double Charge Tiles', 'GVT Tiles', 'PGVT Tiles', 'Ceramic Tiles', 'Parking Tiles', 'Wall Tiles', 'Elevation Tiles']
  },
  {
    id: 'aac-blocks',
    slug: 'aac-blocks',
    name: 'AAC Blocks',
    description: 'Lightweight aerated concrete blocks',
    image: '/images/categories/aac-blocks.jpg',
    productCount: 5,
    subcategories: ['600 × 200 × 75 mm', '600 × 200 × 100 mm', '600 × 200 × 125 mm', '600 × 200 × 150 mm', '600 × 200 × 200 mm']
  },
  {
    id: 'cement-sheets',
    slug: 'cement-sheets',
    name: 'Cement Sheets & Roofing',
    description: 'Roofing and walling solutions',
    image: '/images/categories/cement-sheets.jpg',
    productCount: 10,
    subcategories: ['Plain Cement Sheets', 'Fibre Cement Sheets', 'High Density Cement Boards', 'Colour Coated Roofing Sheets', 'Galvanized Roofing Sheets', 'PPGI Roofing Sheets', 'Polycarbonate Roofing Sheets', 'UPVC Roofing Sheets', 'FRP Roofing Sheets']
  },
  {
    id: 'sand-aggregate',
    slug: 'sand-aggregate',
    name: 'Sand & Aggregate',
    description: 'Quality sand and aggregates',
    image: '/images/categories/sand-aggregate.jpg',
    productCount: 10,
    subcategories: ['River Sand', 'M-Sand', 'P-Sand', 'Crushed Sand', '20mm Aggregate', '12mm Aggregate', '10mm Aggregate', '40mm Aggregate', 'Stone Dust / Grit', 'Crusher Run / GSB Material']
  }
];

export const products: Product[] = [
  // Cement Products
  {
    id: 'opc-43-grade',
    slug: 'opc-43-grade-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'OPC 43 Grade',
    subcategorySlug: 'opc-43-grade',
    name: 'OPC 43 Grade Cement',
    variants: [
      { size: '50 kg bag', mrp: 380, sellingPrice: 355, discountPercent: 7 },
      { size: '25 kg bag', mrp: 195, sellingPrice: 182, discountPercent: 7 },
      { size: 'Bulk (per ton)', mrp: 7100, sellingPrice: 6650, discountPercent: 6 }
    ],
    description: 'Ordinary Portland Cement 43 Grade is commonly used for plastering, masonry works, and non-structural concrete. Ideal for general construction where high early strength is not critical.',
    specifications: {
      'Grade': 'OPC 43',
      'Initial Setting Time': '30 minutes (min)',
      'Final Setting Time': '600 minutes (max)',
      'Compressive Strength 7 Days': '33 MPa',
      'Compressive Strength 28 Days': '43 MPa',
      'Fineness': '225 m²/kg (min)'
    },
    image: '/images/products/opc-cement.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'bag',
    brand: 'UltraTech'
  },
  {
    id: 'opc-53-grade',
    slug: 'opc-53-grade-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'OPC 53 Grade',
    subcategorySlug: 'opc-53-grade',
    name: 'OPC 53 Grade Cement',
    variants: [
      { size: '50 kg bag', mrp: 410, sellingPrice: 378, discountPercent: 8 },
      { size: '25 kg bag', mrp: 210, sellingPrice: 194, discountPercent: 8 },
      { size: 'Bulk (per ton)', mrp: 7600, sellingPrice: 7050, discountPercent: 7 }
    ],
    description: 'High-strength Ordinary Portland Cement 53 Grade suitable for RCC structures, bridges, and high-rise buildings where high early strength is essential.',
    specifications: {
      'Grade': 'OPC 53',
      'Initial Setting Time': '30 minutes (min)',
      'Final Setting Time': '600 minutes (max)',
      'Compressive Strength 3 Days': '27 MPa',
      'Compressive Strength 7 Days': '37 MPa',
      'Compressive Strength 28 Days': '53 MPa',
      'Fineness': '225 m²/kg (min)'
    },
    image: '/images/products/opc53-cement.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'bag',
    brand: 'ACC'
  },
  {
    id: 'ppc-cement',
    slug: 'ppc-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'PPC Cement',
    subcategorySlug: 'ppc-cement',
    name: 'Portland Pozzolana Cement',
    variants: [
      { size: '50 kg bag', mrp: 395, sellingPrice: 365, discountPercent: 8 },
      { size: 'Bulk (per ton)', mrp: 7300, sellingPrice: 6800, discountPercent: 7 }
    ],
    description: 'Portland Pozzolana Cement with fly ash content provides better durability and resistance to chemical attacks. Excellent for foundations, marine structures, and mass concrete works.',
    specifications: {
      'Type': 'PPC',
      'Fly Ash Content': '15-35%',
      'Compressive Strength 28 Days': '33 MPa (min)',
      'Initial Setting Time': '30 minutes (min)',
      'Final Setting Time': '600 minutes (max)'
    },
    image: '/images/products/ppc-cement.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'bag',
    brand: 'Ambuja'
  },
  {
    id: 'psc-cement',
    slug: 'psc-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'PSC Cement',
    subcategorySlug: 'psc-cement',
    name: 'Portland Slag Cement',
    variants: [
      { size: '50 kg bag', mrp: 390, sellingPrice: 362, discountPercent: 7 },
      { size: 'Bulk (per ton)', mrp: 7200, sellingPrice: 6700, discountPercent: 7 }
    ],
    description: 'Portland Slag Cement offers superior resistance to sulfate attack and is ideal for coastal constructions, sewage treatment plants, and structures exposed to aggressive environments.',
    specifications: {
      'Type': 'PSC',
      'Slag Content': '25-70%',
      'Compressive Strength 28 Days': '33 MPa (min)',
      'Sulfate Resistance': 'Excellent'
    },
    image: '/images/products/psc-cement.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'bag',
    brand: 'Birla'
  },
  {
    id: 'white-cement',
    slug: 'white-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'White Cement',
    subcategorySlug: 'white-cement',
    name: 'White Portland Cement',
    variants: [
      { size: '25 kg bag', mrp: 520, sellingPrice: 480, discountPercent: 8 },
      { size: '50 kg bag', mrp: 980, sellingPrice: 910, discountPercent: 7 }
    ],
    description: 'Premium white cement for architectural finishes, tile grouting, wall putty, and decorative concrete. Delivers a bright, consistent white finish.',
    specifications: {
      'Whiteness': '88% (min)',
      'Grade': 'White OPC 53',
      'Fineness': '450 m²/kg',
      'Covering Area': '3-4 sq.ft/kg for putty'
    },
    image: '/images/products/white-cement.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'bag',
    brand: 'Birla White'
  },
  {
    id: 'ready-mix-cement',
    slug: 'ready-mix-cement',
    category: 'Cement',
    categorySlug: 'cement',
    subcategory: 'Ready Mix Cement',
    subcategorySlug: 'ready-mix-cement',
    name: 'Ready Mix Plaster/Cement',
    variants: [
      { size: '40 kg bag', mrp: 280, sellingPrice: 258, discountPercent: 8 },
      { size: 'Truck load (6 ton)', mrp: 42000, sellingPrice: 38500, discountPercent: 8 }
    ],
    description: 'Pre-mixed cement plaster for walls. Just add water — no sand or cement mixing required. Ensures consistent quality and reduces wastage.',
    specifications: {
      'Coverage': '20-25 sq.ft/bag (12mm thick)',
      'Mix Ratio': 'Just add water',
      'Shelf Life': '6 months'
    },
    image: '/images/products/ready-mix.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'bag'
  },

  // TMT Bars Products
  {
    id: 'tmt-6mm',
    slug: 'tmt-bar-6mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '6mm',
    subcategorySlug: '6mm',
    name: 'TMT Bar 6mm',
    variants: [
      { size: 'per piece (12m)', mrp: 285, sellingPrice: 265, discountPercent: 7 },
      { size: 'per quintal', mrp: 58000, sellingPrice: 54500, discountPercent: 6 },
      { size: 'per ton', mrp: 580000, sellingPrice: 545000, discountPercent: 6 }
    ],
    description: '6mm TMT bars are primarily used for residential slab mesh work, small binding purposes, and internal structure reinforcement in low-stress areas.',
    specifications: {
      'Diameter': '6 mm',
      'Length': '12 meters',
      'Grade': 'Fe 500',
      'Yield Strength': '500 N/mm²',
      'Elongation': '12% (min)',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-6mm.jpg',
    inStock: true,
    minOrderQty: 50,
    unit: 'piece',
    brand: 'TATA Steel'
  },
  {
    id: 'tmt-8mm',
    slug: 'tmt-bar-8mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '8mm',
    subcategorySlug: '8mm',
    name: 'TMT Bar 8mm',
    variants: [
      { size: 'per piece (12m)', mrp: 510, sellingPrice: 472, discountPercent: 7 },
      { size: 'per quintal', mrp: 56500, sellingPrice: 53200, discountPercent: 6 },
      { size: 'per ton', mrp: 565000, sellingPrice: 532000, discountPercent: 6 }
    ],
    description: '8mm TMT bars are ideal for residential construction stirrups, column ties, and light structural reinforcement work.',
    specifications: {
      'Diameter': '8 mm',
      'Length': '12 meters',
      'Grade': 'Fe 500',
      'Yield Strength': '500 N/mm²',
      'Elongation': '12% (min)',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-8mm.jpg',
    inStock: true,
    minOrderQty: 30,
    unit: 'piece',
    brand: 'JSW'
  },
  {
    id: 'tmt-10mm',
    slug: 'tmt-bar-10mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '10mm',
    subcategorySlug: '10mm',
    name: 'TMT Bar 10mm',
    variants: [
      { size: 'per piece (12m)', mrp: 795, sellingPrice: 735, discountPercent: 8 },
      { size: 'per quintal', mrp: 55500, sellingPrice: 52000, discountPercent: 6 },
      { size: 'per ton', mrp: 555000, sellingPrice: 520000, discountPercent: 6 }
    ],
    description: '10mm TMT bars are commonly used as main reinforcement in residential slabs, beams, and columns for medium-rise buildings.',
    specifications: {
      'Diameter': '10 mm',
      'Length': '12 meters',
      'Grade': 'Fe 500 / Fe 550',
      'Yield Strength': '500 N/mm²',
      'Elongation': '12% (min)',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-10mm.jpg',
    inStock: true,
    minOrderQty: 20,
    unit: 'piece',
    brand: 'TATA Steel'
  },
  {
    id: 'tmt-12mm',
    slug: 'tmt-bar-12mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '12mm',
    subcategorySlug: '12mm',
    name: 'TMT Bar 12mm',
    variants: [
      { size: 'per piece (12m)', mrp: 1145, sellingPrice: 1055, discountPercent: 8 },
      { size: 'per quintal', mrp: 55000, sellingPrice: 51500, discountPercent: 6 },
      { size: 'per ton', mrp: 550000, sellingPrice: 515000, discountPercent: 6 }
    ],
    description: '12mm TMT bars are the most popular choice for main reinforcement in residential and commercial buildings. Excellent strength-to-weight ratio.',
    specifications: {
      'Diameter': '12 mm',
      'Length': '12 meters',
      'Grade': 'Fe 500 / Fe 550 / Fe 500D',
      'Yield Strength': '500 N/mm²',
      'Elongation': '12% (min)',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-12mm.jpg',
    inStock: true,
    minOrderQty: 15,
    unit: 'piece',
    brand: 'JSW'
  },
  {
    id: 'tmt-16mm',
    slug: 'tmt-bar-16mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '16mm',
    subcategorySlug: '16mm',
    name: 'TMT Bar 16mm',
    variants: [
      { size: 'per piece (12m)', mrp: 2040, sellingPrice: 1875, discountPercent: 8 },
      { size: 'per quintal', mrp: 54500, sellingPrice: 51000, discountPercent: 6 },
      { size: 'per ton', mrp: 545000, sellingPrice: 510000, discountPercent: 6 }
    ],
    description: '16mm TMT bars are used for main reinforcement in columns and beams of multi-story buildings, heavy structures, and bridges.',
    specifications: {
      'Diameter': '16 mm',
      'Length': '12 meters',
      'Weight': '1.58 kg/meter',
      'Grade': 'Fe 500 / Fe 550',
      'Yield Strength': '500 N/mm²',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-16mm.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'piece',
    brand: 'TATA Steel'
  },
  {
    id: 'tmt-20mm',
    slug: 'tmt-bar-20mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '20mm',
    subcategorySlug: '20mm',
    name: 'TMT Bar 20mm',
    variants: [
      { size: 'per piece (12m)', mrp: 3185, sellingPrice: 2930, discountPercent: 8 },
      { size: 'per quintal', mrp: 54000, sellingPrice: 50600, discountPercent: 6 },
      { size: 'per ton', mrp: 540000, sellingPrice: 506000, discountPercent: 6 }
    ],
    description: '20mm TMT bars for heavy structural work, industrial buildings, and foundation piles requiring maximum load-bearing capacity.',
    specifications: {
      'Diameter': '20 mm',
      'Length': '12 meters',
      'Weight': '2.47 kg/meter',
      'Grade': 'Fe 500 / Fe 550',
      'Yield Strength': '500 N/mm²',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-20mm.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece',
    brand: 'TATA Steel'
  },
  {
    id: 'tmt-25mm',
    slug: 'tmt-bar-25mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '25mm',
    subcategorySlug: '25mm',
    name: 'TMT Bar 25mm',
    variants: [
      { size: 'per piece (12m)', mrp: 4980, sellingPrice: 4580, discountPercent: 8 },
      { size: 'per ton', mrp: 535000, sellingPrice: 501000, discountPercent: 6 }
    ],
    description: '25mm TMT bars for heavy industrial construction, flyovers, and structures requiring extra-large diameter reinforcement.',
    specifications: {
      'Diameter': '25 mm',
      'Length': '12 meters',
      'Weight': '3.85 kg/meter',
      'Grade': 'Fe 550',
      'Yield Strength': '550 N/mm²',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-25mm.jpg',
    inStock: true,
    minOrderQty: 3,
    unit: 'piece',
    brand: 'JSW'
  },
  {
    id: 'tmt-32mm',
    slug: 'tmt-bar-32mm',
    category: 'TMT Bars',
    categorySlug: 'tmt-bars',
    subcategory: '32mm',
    subcategorySlug: '32mm',
    name: 'TMT Bar 32mm',
    variants: [
      { size: 'per piece (12m)', mrp: 8150, sellingPrice: 7500, discountPercent: 8 },
      { size: 'per ton', mrp: 530000, sellingPrice: 496000, discountPercent: 6 }
    ],
    description: '32mm TMT bars for mega infrastructure projects, heavy industrial foundations, and specialized engineering applications.',
    specifications: {
      'Diameter': '32 mm',
      'Length': '12 meters',
      'Weight': '6.31 kg/meter',
      'Grade': 'Fe 550',
      'Yield Strength': '550 N/mm²',
      'Certification': 'BIS 1786'
    },
    image: '/images/products/tmt-32mm.jpg',
    inStock: true,
    minOrderQty: 2,
    unit: 'piece',
    brand: 'TATA Steel'
  },

  // Structural Steel Products
  {
    id: 'ms-angle',
    slug: 'ms-angle',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Angle',
    subcategorySlug: 'ms-angle',
    name: 'MS Angle',
    variants: [
      { size: '25x25x3mm (6m)', mrp: 850, sellingPrice: 795, discountPercent: 6 },
      { size: '25x25x5mm (6m)', mrp: 1350, sellingPrice: 1265, discountPercent: 6 },
      { size: '30x30x3mm (6m)', mrp: 980, sellingPrice: 920, discountPercent: 6 },
      { size: '40x40x5mm (6m)', mrp: 1850, sellingPrice: 1735, discountPercent: 6 },
      { size: '50x50x5mm (6m)', mrp: 2450, sellingPrice: 2300, discountPercent: 6 },
      { size: '50x50x6mm (6m)', mrp: 2850, sellingPrice: 2675, discountPercent: 6 },
      { size: '75x75x6mm (6m)', mrp: 4200, sellingPrice: 3950, discountPercent: 6 }
    ],
    description: 'Mild Steel Equal and Unequal Angles for structural fabrication, framework, support structures, and industrial applications.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250 / E350',
      'Length': '6 meters',
      'Type': 'Equal & Unequal Angles',
      'Surface': 'Mill Finish'
    },
    image: '/images/products/ms-angle.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'ms-channel',
    slug: 'ms-channel',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Channel',
    subcategorySlug: 'ms-channel',
    name: 'MS Channel',
    variants: [
      { size: '50x50x5mm (6m)', mrp: 1850, sellingPrice: 1740, discountPercent: 6 },
      { size: '75x40x5mm (6m)', mrp: 2350, sellingPrice: 2210, discountPercent: 6 },
      { size: '100x50x5mm (6m)', mrp: 2950, sellingPrice: 2775, discountPercent: 6 },
      { size: '125x65x5mm (6m)', mrp: 3850, sellingPrice: 3625, discountPercent: 6 },
      { size: '150x75x5mm (6m)', mrp: 4850, sellingPrice: 4565, discountPercent: 6 }
    ],
    description: 'Mild Steel Channels for structural framing, column supports, beam connections, and industrial fabrication.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250 / E350',
      'Length': '6 meters',
      'Type': 'Indian Standard Channel',
      'Surface': 'Mill Finish'
    },
    image: '/images/products/ms-channel.jpg',
    inStock: true,
    minOrderQty: 3,
    unit: 'piece'
  },
  {
    id: 'ms-flat',
    slug: 'ms-flat',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Flat',
    subcategorySlug: 'ms-flat',
    name: 'MS Flat Bar',
    variants: [
      { size: '20x5mm (6m)', mrp: 650, sellingPrice: 610, discountPercent: 6 },
      { size: '25x5mm (6m)', mrp: 780, sellingPrice: 735, discountPercent: 6 },
      { size: '40x6mm (6m)', mrp: 1250, sellingPrice: 1175, discountPercent: 6 },
      { size: '50x8mm (6m)', mrp: 1950, sellingPrice: 1835, discountPercent: 6 },
      { size: '75x10mm (6m)', mrp: 3200, sellingPrice: 3010, discountPercent: 6 },
      { size: '100x12mm (6m)', mrp: 5200, sellingPrice: 4895, discountPercent: 6 }
    ],
    description: 'Mild Steel Flat Bars for fabrication, gate manufacturing, frame structures, and general engineering applications.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250',
      'Length': '6 meters',
      'Width Range': '20mm - 150mm',
      'Thickness Range': '5mm - 12mm'
    },
    image: '/images/products/ms-flat.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'ms-square-bar',
    slug: 'ms-square-bar',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Square Bar',
    subcategorySlug: 'ms-square-bar',
    name: 'MS Square Bar',
    variants: [
      { size: '10x10mm (6m)', mrp: 520, sellingPrice: 490, discountPercent: 6 },
      { size: '12x12mm (6m)', mrp: 750, sellingPrice: 705, discountPercent: 6 },
      { size: '16x16mm (6m)', mrp: 1350, sellingPrice: 1270, discountPercent: 6 },
      { size: '20x20mm (6m)', mrp: 2100, sellingPrice: 1975, discountPercent: 6 },
      { size: '25x25mm (6m)', mrp: 3250, sellingPrice: 3060, discountPercent: 6 }
    ],
    description: 'Mild Steel Square Bars for shafts, axles, construction framework, and general engineering uses.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E350',
      'Length': '6 meters',
      'Section': 'Square',
      'Tolerance': '+/- 0.5mm'
    },
    image: '/images/products/ms-square-bar.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'ms-round-bar',
    slug: 'ms-round-bar',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Round Bar',
    subcategorySlug: 'ms-round-bar',
    name: 'MS Round Bar',
    variants: [
      { size: '10mm dia (6m)', mrp: 480, sellingPrice: 452, discountPercent: 6 },
      { size: '12mm dia (6m)', mrp: 680, sellingPrice: 640, discountPercent: 6 },
      { size: '16mm dia (6m)', mrp: 1220, sellingPrice: 1150, discountPercent: 6 },
      { size: '20mm dia (6m)', mrp: 1900, sellingPrice: 1790, discountPercent: 6 },
      { size: '25mm dia (6m)', mrp: 2950, sellingPrice: 2780, discountPercent: 6 },
      { size: '32mm dia (6m)', mrp: 4850, sellingPrice: 4565, discountPercent: 6 }
    ],
    description: 'Mild Steel Round Bars for shafts, bolts, pins, construction, and general engineering applications.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E350',
      'Length': '6 meters',
      'Surface': 'Bright / Black'
    },
    image: '/images/products/ms-round-bar.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'ms-plate',
    slug: 'ms-plate',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Plate',
    subcategorySlug: 'ms-plate',
    name: 'MS Steel Plate',
    variants: [
      { size: '6mm (1.5x6m)', mrp: 8500, sellingPrice: 7990, discountPercent: 6 },
      { size: '8mm (1.5x6m)', mrp: 11500, sellingPrice: 10810, discountPercent: 6 },
      { size: '10mm (1.5x6m)', mrp: 14200, sellingPrice: 13350, discountPercent: 6 },
      { size: '12mm (1.5x6m)', mrp: 17200, sellingPrice: 16170, discountPercent: 6 },
      { size: '16mm (1.5x6m)', mrp: 22800, sellingPrice: 21435, discountPercent: 6 },
      { size: '20mm (1.5x6m)', mrp: 28500, sellingPrice: 26790, discountPercent: 6 }
    ],
    description: 'Mild Steel Plates for structural fabrication, shipbuilding, storage tanks, pressure vessels, and heavy engineering.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250 / E350',
      'Dimensions': '1.5m x 6m (standard)',
      'Thickness Range': '5mm - 50mm'
    },
    image: '/images/products/ms-plate.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'piece'
  },
  {
    id: 'ms-sheet',
    slug: 'ms-sheet',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'MS Sheet',
    subcategorySlug: 'ms-sheet',
    name: 'MS Sheets',
    variants: [
      { size: '1.2mm (4x8ft)', mrp: 3200, sellingPrice: 3010, discountPercent: 6 },
      { size: '1.5mm (4x8ft)', mrp: 3850, sellingPrice: 3620, discountPercent: 6 },
      { size: '2mm (4x8ft)', mrp: 4850, sellingPrice: 4560, discountPercent: 6 },
      { size: '2.5mm (4x8ft)', mrp: 5850, sellingPrice: 5500, discountPercent: 6 },
      { size: '3mm (4x8ft)', mrp: 6850, sellingPrice: 6440, discountPercent: 6 }
    ],
    description: 'Mild Steel Sheets for fabrication, roofing, panelling, and general sheet metal work.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250',
      'Dimensions': '4ft x 8ft (standard)',
      'Thickness Range': '0.8mm - 6mm'
    },
    image: '/images/products/ms-sheet.jpg',
    inStock: true,
    minOrderQty: 2,
    unit: 'piece'
  },
  {
    id: 'chequered-plate',
    slug: 'chequered-plate',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'Chequered Plate',
    subcategorySlug: 'chequered-plate',
    name: 'Chequered MS Plate',
    variants: [
      { size: '3mm (4x8ft)', mrp: 4200, sellingPrice: 3950, discountPercent: 6 },
      { size: '4mm (4x8ft)', mrp: 5200, sellingPrice: 4890, discountPercent: 6 },
      { size: '5mm (4x8ft)', mrp: 6200, sellingPrice: 5830, discountPercent: 6 },
      { size: '6mm (4x8ft)', mrp: 7200, sellingPrice: 6770, discountPercent: 6 }
    ],
    description: 'Chequered plates for anti-slip flooring in walkways, staircases, platforms, and industrial flooring applications.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Pattern': '5 Bar / Diamond',
      'Dimensions': '4ft x 8ft (standard)',
      'Anti-slip': 'Yes'
    },
    image: '/images/products/chequered-plate.jpg',
    inStock: true,
    minOrderQty: 2,
    unit: 'piece'
  },
  {
    id: 'iswb-beams',
    slug: 'iswb-beams',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'I-Beams / Beams',
    subcategorySlug: 'i-beams',
    name: 'ISWB Beams',
    variants: [
      { size: 'ISWB 150 (6m)', mrp: 5200, sellingPrice: 4890, discountPercent: 6 },
      { size: 'ISWB 200 (6m)', mrp: 7200, sellingPrice: 6770, discountPercent: 6 },
      { size: 'ISWB 250 (6m)', mrp: 9500, sellingPrice: 8935, discountPercent: 6 },
      { size: 'ISWB 300 (6m)', mrp: 12500, sellingPrice: 11750, discountPercent: 6 }
    ],
    description: 'Indian Standard Wide Flange Beams for structural steel construction, bridges, and industrial buildings.',
    specifications: {
      'Type': 'ISWB (Indian Standard Wide Flange)',
      'Material': 'Structural Steel',
      'Grade': 'E250 / E350',
      'Length': '6m / 12m'
    },
    image: '/images/products/i-beam.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'piece'
  },
  {
    id: 'h-beams',
    slug: 'h-beams',
    category: 'Structural Steel',
    categorySlug: 'structural-steel',
    subcategory: 'I-Beams / Beams',
    subcategorySlug: 'i-beams',
    name: 'H-Beams / Universal Beams',
    variants: [
      { size: 'HB 100 (6m)', mrp: 4800, sellingPrice: 4515, discountPercent: 6 },
      { size: 'HB 150 (6m)', mrp: 7500, sellingPrice: 7055, discountPercent: 6 },
      { size: 'HB 200 (6m)', mrp: 10500, sellingPrice: 9875, discountPercent: 6 },
      { size: 'HB 250 (6m)', mrp: 14500, sellingPrice: 13640, discountPercent: 6 },
      { size: 'HB 300 (6m)', mrp: 18500, sellingPrice: 17400, discountPercent: 6 }
    ],
    description: 'H-Beams for heavy structural applications, industrial sheds, pre-engineered buildings, and mega projects.',
    specifications: {
      'Type': 'H-Beam / W-Beam',
      'Material': 'Structural Steel',
      'Grade': 'E350',
      'Length': '6m / 12m'
    },
    image: '/images/products/h-beam.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'piece'
  },

  // GI Pipes
  {
    id: 'gi-round-pipe',
    slug: 'gi-round-pipe',
    category: 'GI Pipes',
    categorySlug: 'gi-pipes',
    subcategory: 'Round GI Pipe',
    subcategorySlug: 'gi-round-pipe',
    name: 'GI Round Pipe',
    variants: [
      { size: '15mm (1/2") Light', mrp: 285, sellingPrice: 268, discountPercent: 6 },
      { size: '20mm (3/4") Light', mrp: 365, sellingPrice: 343, discountPercent: 6 },
      { size: '25mm (1") Light', mrp: 485, sellingPrice: 456, discountPercent: 6 },
      { size: '15mm (1/2") Medium', mrp: 345, sellingPrice: 325, discountPercent: 6 },
      { size: '20mm (3/4") Medium', mrp: 445, sellingPrice: 418, discountPercent: 6 },
      { size: '25mm (1") Medium', mrp: 595, sellingPrice: 560, discountPercent: 6 },
      { size: '15mm (1/2") Heavy', mrp: 420, sellingPrice: 395, discountPercent: 6 },
      { size: '20mm (3/4") Heavy', mrp: 545, sellingPrice: 513, discountPercent: 6 },
      { size: '25mm (1") Heavy', mrp: 725, sellingPrice: 682, discountPercent: 6 }
    ],
    description: 'Galvanized Iron Round Pipes for water transportation, plumbing, fencing, and structural applications. Hot-dip galvanized for corrosion resistance.',
    specifications: {
      'Material': 'Galvanized Iron (GI)',
      'Type': 'Round / ERW',
      'Class': 'Light / Medium / Heavy',
      'Length': '6 meters',
      'Zinc Coating': '120-275 g/m²'
    },
    image: '/images/products/gi-pipe.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'gi-square-pipe',
    slug: 'gi-square-pipe',
    category: 'GI Pipes',
    categorySlug: 'gi-pipes',
    subcategory: 'GI Square Pipe',
    subcategorySlug: 'gi-square-pipe',
    name: 'GI Square Pipe',
    variants: [
      { size: '20x20mm Light', mrp: 520, sellingPrice: 489, discountPercent: 6 },
      { size: '25x25mm Light', mrp: 650, sellingPrice: 612, discountPercent: 6 },
      { size: '30x30mm Medium', mrp: 850, sellingPrice: 800, discountPercent: 6 },
      { size: '40x40mm Medium', mrp: 1150, sellingPrice: 1082, discountPercent: 6 },
      { size: '50x50mm Heavy', mrp: 1650, sellingPrice: 1552, discountPercent: 6 }
    ],
    description: 'Galvanized Iron Square Pipes for structural applications, furniture frames, gates, and architectural purposes.',
    specifications: {
      'Material': 'Galvanized Iron (GI)',
      'Section': 'Square',
      'Class': 'Light / Medium / Heavy',
      'Length': '6 meters',
      'Wall Thickness': '1.6mm - 3.2mm'
    },
    image: '/images/products/gi-square-pipe.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },
  {
    id: 'gi-rectangle-pipe',
    slug: 'gi-rectangle-pipe',
    category: 'GI Pipes',
    categorySlug: 'gi-pipes',
    subcategory: 'GI Rectangle Pipe',
    subcategorySlug: 'gi-rectangle-pipe',
    name: 'GI Rectangle Pipe',
    variants: [
      { size: '40x20mm Medium', mrp: 850, sellingPrice: 800, discountPercent: 6 },
      { size: '50x25mm Medium', mrp: 1050, sellingPrice: 988, discountPercent: 6 },
      { size: '60x30mm Medium', mrp: 1250, sellingPrice: 1176, discountPercent: 6 },
      { size: '75x50mm Heavy', mrp: 1850, sellingPrice: 1740, discountPercent: 6 },
      { size: '100x50mm Heavy', mrp: 2450, sellingPrice: 2305, discountPercent: 6 }
    ],
    description: 'Galvanized Iron Rectangle Pipes for structural framing, rollings shutters, and industrial applications.',
    specifications: {
      'Material': 'Galvanized Iron (GI)',
      'Section': 'Rectangle',
      'Class': 'Medium / Heavy',
      'Length': '6 meters'
    },
    image: '/images/products/gi-rectangle-pipe.jpg',
    inStock: true,
    minOrderQty: 5,
    unit: 'piece'
  },

  // MS Pipes
  {
    id: 'ms-round-pipe',
    slug: 'ms-round-pipe',
    category: 'MS Pipes',
    categorySlug: 'ms-pipes',
    subcategory: 'Round Pipe',
    subcategorySlug: 'ms-round-pipe',
    name: 'MS Round Pipe',
    variants: [
      { size: '25mm (1")', mrp: 850, sellingPrice: 799, discountPercent: 6 },
      { size: '32mm (1.25")', mrp: 1150, sellingPrice: 1082, discountPercent: 6 },
      { size: '40mm (1.5")', mrp: 1450, sellingPrice: 1365, discountPercent: 6 },
      { size: '50mm (2")', mrp: 1950, sellingPrice: 1835, discountPercent: 6 },
      { size: '65mm (2.5")', mrp: 2650, sellingPrice: 2495, discountPercent: 6 },
      { size: '80mm (3")', mrp: 3450, sellingPrice: 3245, discountPercent: 6 },
      { size: '100mm (4")', mrp: 4850, sellingPrice: 4565, discountPercent: 6 }
    ],
    description: 'Mild Steel Round Pipes for structural applications, mechanical engineering, and industrial uses.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Type': 'ERW / Seamless',
      'Grade': 'E250',
      'Length': '6 meters',
      'Wall Thickness': '2.0mm - 6mm'
    },
    image: '/images/products/ms-round-pipe.jpg',
    inStock: true,
    minOrderQty: 3,
    unit: 'piece'
  },
  {
    id: 'ms-square-pipe-structural',
    slug: 'ms-square-pipe-structural',
    category: 'MS Pipes',
    categorySlug: 'ms-pipes',
    subcategory: 'Square Pipe',
    subcategorySlug: 'ms-square-pipe',
    name: 'MS Square Pipe',
    variants: [
      { size: '25x25mm', mrp: 950, sellingPrice: 893, discountPercent: 6 },
      { size: '40x40mm', mrp: 1450, sellingPrice: 1365, discountPercent: 6 },
      { size: '50x50mm', mrp: 1850, sellingPrice: 1740, discountPercent: 6 },
      { size: '75x75mm', mrp: 2850, sellingPrice: 2682, discountPercent: 6 },
      { size: '100x100mm', mrp: 3850, sellingPrice: 3623, discountPercent: 6 }
    ],
    description: 'Mild Steel Square Pipes for structural applications, columns, beams, and architectural purposes.',
    specifications: {
      'Material': 'Mild Steel (MS)',
      'Section': 'Square',
      'Grade': 'E350',
      'Length': '6 meters',
      'Wall Thickness': '2.0mm - 5mm'
    },
    image: '/images/products/ms-square-structural.jpg',
    inStock: true,
    minOrderQty: 3,
    unit: 'piece'
  },
  {
    id: 'erw-pipe',
    slug: 'erw-pipe',
    category: 'MS Pipes',
    categorySlug: 'ms-pipes',
    subcategory: 'ERW Pipe',
    subcategorySlug: 'erw-pipe',
    name: 'ERW Steel Pipe',
    variants: [
      { size: '50mm (2")', mrp: 1850, sellingPrice: 1740, discountPercent: 6 },
      { size: '80mm (3")', mrp: 2850, sellingPrice: 2682, discountPercent: 6 },
      { size: '100mm (4")', mrp: 3650, sellingPrice: 3435, discountPercent: 6 },
      { size: '150mm (6")', mrp: 5850, sellingPrice: 5505, discountPercent: 6 },
      { size: '200mm (8")', mrp: 7850, sellingPrice: 7385, discountPercent: 6 }
    ],
    description: 'Electric Resistance Welded (ERW) Steel Pipes for water transmission, structural applications, and industrial uses.',
    specifications: {
      'Type': 'ERW (Electric Resistance Welded)',
      'Material': 'Mild Steel (MS)',
      'Grade': 'E250',
      'Length': '6 meters',
      'Application': 'Water / Structural'
    },
    image: '/images/products/erw-pipe.jpg',
    inStock: true,
    minOrderQty: 2,
    unit: 'piece'
  },

  // Tiles
  {
    id: 'vitrified-tiles',
    slug: 'vitrified-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Vitrified Tiles',
    subcategorySlug: 'vitrified-tiles',
    name: 'Vitrified Floor Tiles',
    variants: [
      { size: '2x2 ft (600x600mm)', mrp: 45, sellingPrice: 38, discountPercent: 16 },
      { size: '2x2.5 ft (600x800mm)', mrp: 58, sellingPrice: 48, discountPercent: 17 },
      { size: '2.5x2.5 ft (800x800mm)', mrp: 65, sellingPrice: 54, discountPercent: 17 },
      { size: 'Marble finish 2x2 ft', mrp: 75, sellingPrice: 62, discountPercent: 17 }
    ],
    description: 'Premium vitrified tiles with superior strength, low water absorption, and marble/wood finish options. Ideal for living rooms, offices, and commercial spaces.',
    specifications: {
      'Type': 'Double Charged Vitrified',
      'Size Range': '600x600mm to 800x800mm',
      'Thickness': '8-12mm',
      'Water Absorption': '< 0.5%',
      'Finish': 'Glossy / Matt / Rocker'
    },
    image: '/images/products/vitrified-tiles.jpg',
    inStock: true,
    minOrderQty: 25,
    unit: 'sqft',
    brand: 'Kajaria'
  },
  {
    id: 'double-charge-tiles',
    slug: 'double-charge-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Double Charge Tiles',
    subcategorySlug: 'double-charge-tiles',
    name: 'Double Charge Tiles',
    variants: [
      { size: '2x2 ft (600x600mm)', mrp: 52, sellingPrice: 43, discountPercent: 17 },
      { size: '2x2.5 ft (600x800mm)', mrp: 68, sellingPrice: 56, discountPercent: 18 },
      { size: '2.5x2.5 ft (800x800mm)', mrp: 78, sellingPrice: 64, discountPercent: 18 }
    ],
    description: 'Double charge vitrified tiles with thicker design layer (3-4mm) for heavy foot traffic areas. Perfect for commercial spaces and high-wear residential areas.',
    specifications: {
      'Type': 'Double Charged',
      'Design Layer': '3-4mm',
      'PEI Rating': 'PEI 4-5',
      'Thickness': '9-12mm',
      'Anti-skid': 'Yes (R10)'
    },
    image: '/images/products/double-charge.jpg',
    inStock: true,
    minOrderQty: 25,
    unit: 'sqft',
    brand: 'Somany'
  },
  {
    id: 'gvt-tiles',
    slug: 'gvt-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'GVT Tiles',
    subcategorySlug: 'gvt-tiles',
    name: 'GVT Polished Glazed Vitrified Tiles',
    variants: [
      { size: '2x2 ft (600x600mm)', mrp: 65, sellingPrice: 52, discountPercent: 20 },
      { size: '2x3 ft (600x900mm)', mrp: 85, sellingPrice: 68, discountPercent: 20 },
      { size: 'Marble look 2x2 ft', mrp: 95, sellingPrice: 76, discountPercent: 20 },
      { size: 'Designer pattern 2x2 ft', mrp: 120, sellingPrice: 95, discountPercent: 21 }
    ],
    description: 'Glazed Vitrified Tiles with digital printing technology for intricate designs, marble effects, and natural stone looks. Premium finish for luxury interiors.',
    specifications: {
      'Type': 'GVT (Polished)',
      'Glazing': 'Digital Printed',
      'Finish': 'High Gloss / Sugar / Carving',
      'Thickness': '8-10mm',
      'Design Options': '100+ patterns'
    },
    image: '/images/products/gvt-tiles.jpg',
    inStock: true,
    minOrderQty: 20,
    unit: 'sqft',
    brand: 'Kajaria'
  },
  {
    id: 'ceramic-tiles',
    slug: 'ceramic-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Ceramic Tiles',
    subcategorySlug: 'ceramic-tiles',
    name: 'Ceramic Floor Tiles',
    variants: [
      { size: '1x1 ft (300x300mm)', mrp: 22, sellingPrice: 18, discountPercent: 18 },
      { size: '1.5x1.5 ft (400x400mm)', mrp: 32, sellingPrice: 26, discountPercent: 19 },
      { size: '2x2 ft (600x600mm)', mrp: 38, sellingPrice: 31, discountPercent: 18 }
    ],
    description: 'Quality ceramic floor tiles for budget-friendly flooring solutions in homes, shops, and small commercial spaces.',
    specifications: {
      'Type': 'Ceramic',
      'Size Range': '300x300mm to 600x600mm',
      'Thickness': '7-9mm',
      'Water Absorption': '3-10%',
      'Application': 'Indoor'
    },
    image: '/images/products/ceramic-tiles.jpg',
    inStock: true,
    minOrderQty: 50,
    unit: 'sqft',
    brand: 'NITCO'
  },
  {
    id: 'parking-tiles',
    slug: 'parking-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Parking Tiles',
    subcategorySlug: 'parking-tiles',
    name: 'Anti-Skid Parking Tiles',
    variants: [
      { size: '1x1 ft (300x300mm)', mrp: 28, sellingPrice: 23, discountPercent: 18 },
      { size: '1.2x1.2 ft (330x330mm)', mrp: 35, sellingPrice: 28, discountPercent: 20 }
    ],
    description: 'Heavy-duty anti-skid tiles designed for parking areas, driveways, and outdoor spaces. Excellent grip and weather resistance.',
    specifications: {
      'Type': 'Anti-Skid / Industrial',
      'Finish': 'Matt / Anti-skid',
      'Thickness': '8-10mm',
      'PEI Rating': 'PEI 5',
      'Application': 'Outdoor / Parking'
    },
    image: '/images/products/parking-tiles.jpg',
    inStock: true,
    minOrderQty: 50,
    unit: 'sqft',
    brand: 'RAK'
  },
  {
    id: 'wall-tiles',
    slug: 'wall-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Wall Tiles',
    subcategorySlug: 'wall-tiles',
    name: 'Ceramic Wall Tiles',
    variants: [
      { size: '8x12 inch (200x300mm)', mrp: 18, sellingPrice: 14, discountPercent: 22 },
      { size: '10x14 inch (250x350mm)', mrp: 22, sellingPrice: 17, discountPercent: 23 },
      { size: '12x18 inch (300x450mm)', mrp: 28, sellingPrice: 22, discountPercent: 21 },
      { size: 'Designer 10x14 inch', mrp: 35, sellingPrice: 28, discountPercent: 20 }
    ],
    description: 'Attractive ceramic wall tiles for bathrooms, kitchens, and interior wall cladding. Available in glossy, matt, and decorative finishes.',
    specifications: {
      'Type': 'Ceramic Wall',
      'Finish': 'Glossy / Matt / Satin',
      'Application': 'Indoor Walls',
      'Water Absorption': '< 15%',
      'Size Range': '200x300mm to 300x600mm'
    },
    image: '/images/products/wall-tiles.jpg',
    inStock: true,
    minOrderQty: 100,
    unit: 'sqft',
    brand: 'Asian'
  },
  {
    id: 'elevation-tiles',
    slug: 'elevation-tiles',
    category: 'Tiles',
    categorySlug: 'tiles',
    subcategory: 'Elevation Tiles',
    subcategorySlug: 'elevation-tiles',
    name: 'Exterior Elevation Tiles',
    variants: [
      { size: '12x24 inch (300x600mm)', mrp: 35, sellingPrice: 28, discountPercent: 20 },
      { size: '16x24 inch (400x600mm)', mrp: 45, sellingPrice: 36, discountPercent: 20 },
      { size: '16x32 inch (400x800mm)', mrp: 55, sellingPrice: 44, discountPercent: 20 },
      { size: 'Stone finish 12x24 inch', mrp: 65, sellingPrice: 52, discountPercent: 20 }
    ],
    description: 'Weather-resistant exterior tiles for building facades, boundary walls, and outdoor architectural features.',
    specifications: {
      'Type': 'Porcelain / Vitrified',
      'Application': 'Exterior / Elevation',
      'Weather Resistance': 'Excellent',
      'Frost Resistance': 'Yes',
      'Anti-fading': 'UV Resistant'
    },
    image: '/images/products/elevation-tiles.jpg',
    inStock: true,
    minOrderQty: 30,
    unit: 'sqft',
    brand: 'Kajaria'
  },

  // AAC Blocks
  {
    id: 'aac-block-75mm',
    slug: 'aac-block-600x200x75',
    category: 'AAC Blocks',
    categorySlug: 'aac-blocks',
    subcategory: '600 × 200 × 75 mm',
    subcategorySlug: '600-200-75',
    name: 'AAC Block 600x200x75mm',
    variants: [
      { size: 'per piece', mrp: 52, sellingPrice: 46, discountPercent: 12 },
      { size: 'per sqft of wall', mrp: 65, sellingPrice: 58, discountPercent: 11 },
      { size: 'per cubic meter', mrp: 4300, sellingPrice: 3850, discountPercent: 10 }
    ],
    description: '75mm thick AAC blocks for non-load bearing internal walls, partitions, and curtain walls. Lightweight yet strong.',
    specifications: {
      'Dimensions': '600 x 200 x 75 mm',
      'Volume': '9 liters',
      'Density': '450-550 kg/m³',
      'Compressive Strength': '4 N/mm²',
      'Thermal Conductivity': '0.12 W/mK'
    },
    image: '/images/products/aac-block-75.jpg',
    inStock: true,
    minOrderQty: 100,
    unit: 'piece',
    brand: 'Aerocon'
  },
  {
    id: 'aac-block-100mm',
    slug: 'aac-block-600x200x100',
    category: 'AAC Blocks',
    categorySlug: 'aac-blocks',
    subcategory: '600 × 200 × 100 mm',
    subcategorySlug: '600-200-100',
    name: 'AAC Block 600x200x100mm',
    variants: [
      { size: 'per piece', mrp: 65, sellingPrice: 58, discountPercent: 11 },
      { size: 'per sqft of wall', mrp: 55, sellingPrice: 49, discountPercent: 11 },
      { size: 'per cubic meter', mrp: 4200, sellingPrice: 3780, discountPercent: 10 }
    ],
    description: '100mm thick AAC blocks for standard internal partition walls with better sound insulation.',
    specifications: {
      'Dimensions': '600 x 200 x 100 mm',
      'Volume': '12 liters',
      'Density': '450-550 kg/m³',
      'Compressive Strength': '4 N/mm²',
      'Sound Insulation': '40 dB'
    },
    image: '/images/products/aac-block-100.jpg',
    inStock: true,
    minOrderQty: 100,
    unit: 'piece',
    brand: 'Bricksol'
  },
  {
    id: 'aac-block-125mm',
    slug: 'aac-block-600x200x125',
    category: 'AAC Blocks',
    categorySlug: 'aac-blocks',
    subcategory: '600 × 200 × 125 mm',
    subcategorySlug: '600-200-125',
    name: 'AAC Block 600x200x125mm',
    variants: [
      { size: 'per piece', mrp: 78, sellingPrice: 70, discountPercent: 10 },
      { size: 'per sqft of wall', mrp: 48, sellingPrice: 43, discountPercent: 10 },
      { size: 'per cubic meter', mrp: 4100, sellingPrice: 3690, discountPercent: 10 }
    ],
    description: '125mm thick AAC blocks for internal walls requiring higher strength and thermal insulation.',
    specifications: {
      'Dimensions': '600 x 200 x 125 mm',
      'Volume': '15 liters',
      'Density': '500-600 kg/m³',
      'Compressive Strength': '5 N/mm²'
    },
    image: '/images/products/aac-block-125.jpg',
    inStock: true,
    minOrderQty: 75,
    unit: 'piece',
    brand: 'Ultratech'
  },
  {
    id: 'aac-block-150mm',
    slug: 'aac-block-600x200x150',
    category: 'AAC Blocks',
    categorySlug: 'aac-blocks',
    subcategory: '600 × 200 × 150 mm',
    subcategorySlug: '600-200-150',
    name: 'AAC Block 600x200x150mm',
    variants: [
      { size: 'per piece', mrp: 92, sellingPrice: 83, discountPercent: 10 },
      { size: 'per sqft of wall', mrp: 45, sellingPrice: 40, discountPercent: 11 },
      { size: 'per cubic meter', mrp: 4000, sellingPrice: 3600, discountPercent: 10 }
    ],
    description: '150mm thick AAC blocks suitable for load-bearing internal walls and exterior walls in low-rise structures.',
    specifications: {
      'Dimensions': '600 x 200 x 150 mm',
      'Volume': '18 liters',
      'Density': '500-600 kg/m³',
      'Compressive Strength': '5 N/mm²',
      'Fire Rating': '4 hours'
    },
    image: '/images/products/aac-block-150.jpg',
    inStock: true,
    minOrderQty: 50,
    unit: 'piece',
    brand: 'Bricksol'
  },
  {
    id: 'aac-block-200mm',
    slug: 'aac-block-600x200x200',
    category: 'AAC Blocks',
    categorySlug: 'aac-blocks',
    subcategory: '600 × 200 × 200 mm',
    subcategorySlug: '600-200-200',
    name: 'AAC Block 600x200x200mm',
    variants: [
      { size: 'per piece', mrp: 125, sellingPrice: 112, discountPercent: 10 },
      { size: 'per sqft of wall', mrp: 38, sellingPrice: 34, discountPercent: 11 },
      { size: 'per cubic meter', mrp: 3850, sellingPrice: 3465, discountPercent: 10 }
    ],
    description: '200mm thick AAC blocks for exterior walls, compound walls, and load-bearing applications in buildings up to G+2 floors.',
    specifications: {
      'Dimensions': '600 x 200 x 200 mm',
      'Volume': '24 liters',
      'Density': '550-650 kg/m³',
      'Compressive Strength': '6 N/mm²',
      'Thermal Insulation': 'Excellent'
    },
    image: '/images/products/aac-block-200.jpg',
    inStock: true,
    minOrderQty: 40,
    unit: 'piece',
    brand: 'Aerocon'
  },

  // Cement Sheets & Roofing
  {
    id: 'plain-cement-sheets',
    slug: 'plain-cement-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'Plain Cement Sheets',
    subcategorySlug: 'plain-cement-sheets',
    name: 'Plain Cement Sheets',
    variants: [
      { size: '6mm (4x4ft)', mrp: 850, sellingPrice: 765, discountPercent: 10 },
      { size: '6mm (6x4ft)', mrp: 1250, sellingPrice: 1125, discountPercent: 10 },
      { size: '8mm (6x4ft)', mrp: 1550, sellingPrice: 1395, discountPercent: 10 },
      { size: '10mm (6x4ft)', mrp: 1850, sellingPrice: 1665, discountPercent: 10 }
    ],
    description: 'Plain cement sheets for wall partitioning, false ceiling, and general construction applications.',
    specifications: {
      'Type': 'Plain Cement Sheet',
      'Thickness': '6mm / 8mm / 10mm',
      'Size': '4x4ft / 6x4ft',
      'Material': 'Reinforced Cement Concrete'
    },
    image: '/images/products/plain-cement-sheet.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'piece',
    brand: 'NCL'
  },
  {
    id: 'fibre-cement-sheets',
    slug: 'fibre-cement-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'Fibre Cement Sheets',
    subcategorySlug: 'fibre-cement-sheets',
    name: 'Fibre Cement Sheets',
    variants: [
      { size: '4mm (6x4ft) - Ceiling', mrp: 650, sellingPrice: 585, discountPercent: 10 },
      { size: '6mm (6x4ft)', mrp: 920, sellingPrice: 828, discountPercent: 10 },
      { size: '8mm (6x4ft)', mrp: 1150, sellingPrice: 1035, discountPercent: 10 },
      { size: '10mm (6x4ft)', mrp: 1420, sellingPrice: 1278, discountPercent: 10 }
    ],
    description: 'High-strength fibre cement sheets for roofing, cladding, and partitioning. Weather-resistant and durable.',
    specifications: {
      'Type': 'Fibre Cement',
      'Asbestos Free': 'Yes',
      'Fire Rating': 'Class A',
      'Weather Resistance': 'Excellent'
    },
    image: '/images/products/fibre-cement.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'piece',
    brand: 'Everite'
  },
  {
    id: 'colour-coated-roofing',
    slug: 'colour-coated-roofing-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'Colour Coated Roofing Sheets',
    subcategorySlug: 'colour-coated-roofing',
    name: 'Colour Coated Roofing Sheets',
    variants: [
      { size: '0.4mm TCT (4ft width)', mrp: 620, sellingPrice: 558, discountPercent: 10 },
      { size: '0.5mm TCT (4ft width)', mrp: 750, sellingPrice: 675, discountPercent: 10 },
      { size: '0.5mm TCT (3ft width)', mrp: 580, sellingPrice: 522, discountPercent: 10 }
    ],
    description: 'Pre-painted colour coated roofing sheets in multiple colors. Corrosion resistant, lightweight, and long-lasting.',
    specifications: {
      'Material': 'PPGI / PPGL',
      'Thickness': '0.35mm - 0.6mm TCT',
      'Width': '3ft / 4ft',
      'Length': 'Custom (up to 12m)',
      'Colors': 'Multiple RAL shades'
    },
    image: '/images/products/colour-coated.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'running_ft',
    brand: 'Tata BlueScope'
  },
  {
    id: 'galvanized-roofing',
    slug: 'galvanized-roofing-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'Galvanized Roofing Sheets',
    subcategorySlug: 'galvanized-roofing',
    name: 'Galvanized Roofing Sheets',
    variants: [
      { size: '0.4mm TCT', mrp: 480, sellingPrice: 432, discountPercent: 10 },
      { size: '0.5mm TCT', mrp: 580, sellingPrice: 522, discountPercent: 10 },
      { size: '0.6mm TCT', mrp: 680, sellingPrice: 612, discountPercent: 10 }
    ],
    description: 'Hot-dip galvanized roofing sheets for industrial and agricultural applications. Excellent corrosion resistance.',
    specifications: {
      'Material': 'Hot-dip Galvanized Steel',
      'Zinc Coating': '120-275 g/m²',
      'Thickness': '0.4mm - 0.6mm TCT',
      'Profile': 'Sinusoidal / Trapezoidal'
    },
    image: '/images/products/gi-roofing.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'running_ft',
    brand: 'JSW'
  },
  {
    id: 'upvc-roofing',
    slug: 'upvc-roofing-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'UPVC Roofing Sheets',
    subcategorySlug: 'upvc-roofing',
    name: 'UPVC Roofing Sheets',
    variants: [
      { size: '3mm (2.5ft width)', mrp: 85, sellingPrice: 76, discountPercent: 11 },
      { size: '3mm (3ft width)', mrp: 95, sellingPrice: 85, discountPercent: 11 },
      { size: '4mm (3ft width)', mrp: 115, sellingPrice: 103, discountPercent: 10 }
    ],
    description: 'UPVC roofing sheets for residential and agricultural buildings. Heat resistant, noise reducing, and maintenance-free.',
    specifications: {
      'Material': 'UPVC',
      'Thickness': '3mm / 4mm',
      'Width': '2.5ft / 3ft',
      'UV Protection': 'Yes',
      'Fire Retardant': 'Yes'
    },
    image: '/images/products/upvc-roofing.jpg',
    inStock: true,
    minOrderQty: 20,
    unit: 'running_ft',
    brand: 'Onduline'
  },
  {
    id: 'polycarbonate-roofing',
    slug: 'polycarbonate-roofing-sheets',
    category: 'Cement Sheets & Roofing',
    categorySlug: 'cement-sheets',
    subcategory: 'Polycarbonate Roofing Sheets',
    subcategorySlug: 'polycarbonate-roofing',
    name: 'Polycarbonate Roofing Sheets',
    variants: [
      { size: '0.8mm solid', mrp: 145, sellingPrice: 130, discountPercent: 10 },
      { size: '1.5mm solid', mrp: 195, sellingPrice: 175, discountPercent: 10 },
      { size: '6mm multiwall', mrp: 185, sellingPrice: 166, discountPercent: 10 },
      { size: '10mm multiwall', mrp: 245, sellingPrice: 220, discountPercent: 10 }
    ],
    description: 'Polycarbonate roofing sheets for skylights, canopies, and transparent roofing. High impact strength and UV protection.',
    specifications: {
      'Type': 'Solid / Multiwall',
      'UV Protection': 'Co-extruded',
      'Light Transmission': '70-90%',
      'Impact Resistance': 'Excellent'
    },
    image: '/images/products/polycarbonate.jpg',
    inStock: true,
    minOrderQty: 10,
    unit: 'running_ft',
    brand: 'Lexan'
  },

  // Sand & Aggregate
  {
    id: 'river-sand',
    slug: 'river-sand',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: 'River Sand',
    subcategorySlug: 'river-sand',
    name: 'River Sand',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 8500, sellingPrice: 7800, discountPercent: 8 },
      { size: 'Per Ton', mrp: 1200, sellingPrice: 1100, discountPercent: 8 },
      { size: 'Per Truck Load', mrp: 35000, sellingPrice: 32000, discountPercent: 9 }
    ],
    description: 'Fine river sand for plastering, masonry, and concrete works. Washed and graded for consistent quality.',
    specifications: {
      'Type': 'River Sand / Natural Sand',
      'FM Value': '2.2 - 2.8',
      'Silt Content': '< 5%',
      'Moisture': '< 5%',
      'Source': 'River beds'
    },
    image: '/images/products/river-sand.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  },
  {
    id: 'm-sand',
    slug: 'm-sand',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: 'M-Sand',
    subcategorySlug: 'm-sand',
    name: 'M-Sand (Manufactured Sand)',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 5500, sellingPrice: 4950, discountPercent: 10 },
      { size: 'Per Ton', mrp: 850, sellingPrice: 765, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 22000, sellingPrice: 19800, discountPercent: 10 }
    ],
    description: 'Manufactured sand (M-Sand) as a sustainable alternative to river sand. Consistent gradation and superior quality for concrete and plastering.',
    specifications: {
      'Type': 'M-Sand / Robo Sand',
      'Grade': 'Zone II',
      'FM Value': '2.6 - 3.2',
      'Silt Content': '< 3%',
      'Packed': 'Yes'
    },
    image: '/images/products/msand.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass',
    brand: 'UltraTech'
  },
  {
    id: 'p-sand',
    slug: 'p-sand',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: 'P-Sand',
    subcategorySlug: 'p-sand',
    name: 'P-Sand (Plastering Sand)',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 5000, sellingPrice: 4500, discountPercent: 10 },
      { size: 'Per Ton', mrp: 750, sellingPrice: 675, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 20000, sellingPrice: 18000, discountPercent: 10 }
    ],
    description: 'Specially graded sand for plastering works. Fine particles ensure smooth finish without cracks.',
    specifications: {
      'Type': 'P-Sand / Plastering Sand',
      'Grade': 'Zone III',
      'FM Value': '1.8 - 2.4',
      'Fineness': '0.15mm - 1.18mm',
      'Application': 'Plastering'
    },
    image: '/images/products/psand.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  },
  {
    id: 'aggregate-20mm',
    slug: 'aggregate-20mm',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: '20mm Aggregate',
    subcategorySlug: '20mm-aggregate',
    name: '20mm Aggregate',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 4500, sellingPrice: 4050, discountPercent: 10 },
      { size: 'Per Ton', mrp: 680, sellingPrice: 612, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 18000, sellingPrice: 16200, discountPercent: 10 }
    ],
    description: '20mm crushed aggregate for RCC concrete works, road construction, and heavy-duty applications.',
    specifications: {
      'Size': '20mm',
      'Type': 'Crushed / Angular',
      'Shape': 'Cubical',
      'Grading': 'Single size',
      'Application': 'Concrete / Roads'
    },
    image: '/images/products/aggregate-20.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  },
  {
    id: 'aggregate-12mm',
    slug: 'aggregate-12mm',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: '12mm Aggregate',
    subcategorySlug: '12mm-aggregate',
    name: '12mm Aggregate',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 4200, sellingPrice: 3780, discountPercent: 10 },
      { size: 'Per Ton', mrp: 650, sellingPrice: 585, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 16800, sellingPrice: 15120, discountPercent: 10 }
    ],
    description: '12mm crushed aggregate for concrete, columns, and reinforced structures.',
    specifications: {
      'Size': '12mm',
      'Type': 'Crushed / Angular',
      'Shape': 'Cubical',
      'Grading': 'Single size',
      'Application': 'Concrete'
    },
    image: '/images/products/aggregate-12.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  },
  {
    id: 'aggregate-10mm',
    slug: 'aggregate-10mm',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: '10mm Aggregate',
    subcategorySlug: '10mm-aggregate',
    name: '10mm Aggregate',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 4000, sellingPrice: 3600, discountPercent: 10 },
      { size: 'Per Ton', mrp: 620, sellingPrice: 558, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 16000, sellingPrice: 14400, discountPercent: 10 }
    ],
    description: '10mm crushed aggregate for concrete, drainage works, and fine RCC applications.',
    specifications: {
      'Size': '10mm',
      'Type': 'Crushed / Angular',
      'Shape': 'Cubical',
      'Application': 'Concrete / Drainage'
    },
    image: '/images/products/aggregate-10.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  },
  {
    id: 'crusher-run',
    slug: 'crusher-run-gsb',
    category: 'Sand & Aggregate',
    categorySlug: 'sand-aggregate',
    subcategory: 'Crusher Run / GSB Material',
    subcategorySlug: 'crusher-run',
    name: 'Crusher Run / GSB Material',
    variants: [
      { size: 'Per Brass (100 cft)', mrp: 2500, sellingPrice: 2250, discountPercent: 10 },
      { size: 'Per Ton', mrp: 380, sellingPrice: 342, discountPercent: 10 },
      { size: 'Per Truck Load', mrp: 10000, sellingPrice: 9000, discountPercent: 10 }
    ],
    description: 'Granular Sub Base (GSB) material and crusher run for road base, foundation filling, and site leveling.',
    specifications: {
      'Type': 'GSB / WMM Material',
      'Size': 'Down to dust',
      'CBR Value': '> 30%',
      'Application': 'Road Base / Filling'
    },
    image: '/images/products/crusher-run.jpg',
    inStock: true,
    minOrderQty: 1,
    unit: 'per_brass'
  }
];

export const serviceablePincodes = [
  { pincode: '400708', area: 'Digha', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400701', area: 'Rabale', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400710', area: 'Ghansoli', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400709', area: 'Kopar Khairane', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400705', area: 'Vashi', city: 'Navi Mumbai', deliveryDays: '2-3 days' },
  { pincode: '400703', area: 'Sanpada', city: 'Navi Mumbai', deliveryDays: '2-3 days' },
  { pincode: '400706', area: 'Seawoods', city: 'Navi Mumbai', deliveryDays: '2-3 days' },
  { pincode: '400614', area: 'Mahape', city: 'Thane', deliveryDays: '1-2 days' },
  { pincode: '400710', area: 'Turbhe', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400605', area: 'Kalwa', city: 'Thane', deliveryDays: '2-3 days' },
  { pincode: '400601', area: 'Thane', city: 'Thane', deliveryDays: '2-3 days' },
  { pincode: '400602', area: 'Naupada', city: 'Thane', deliveryDays: '2-3 days' },
  { pincode: '400604', area: 'Majiwada', city: 'Thane', deliveryDays: '2-3 days' },
  { pincode: '400080', area: 'Airoli', city: 'Navi Mumbai', deliveryDays: '1-2 days' },
  { pincode: '400703', area: 'Nerul', city: 'Navi Mumbai', deliveryDays: '2-3 days' },
  { pincode: '400607', area: 'Mumbra', city: 'Thane', deliveryDays: '2-3 days' },
  { pincode: '400612', area: 'Dombivli', city: 'Thane', deliveryDays: '3-4 days' },
  { pincode: '400615', area: 'Kalyan', city: 'Thane', deliveryDays: '3-4 days' },
  { pincode: '421301', area: 'Ambarnath', city: 'Thane', deliveryDays: '3-4 days' },
  { pincode: '410206', area: 'Panvel', city: 'Raigad', deliveryDays: '3-4 days' }
];

export const testimonials = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    business: 'Sharma Construction Co.',
    location: 'Rabale, Navi Mumbai',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'ASIF TRADERS has been our trusted supplier for 5 years. Their TMT bars and cement always arrive on time, and the prices are genuinely competitive for bulk orders. Highly recommend for any contractor.',
    rating: 5,
    orderValue: '₹15+ Lakhs',
    projectsCompleted: '50+'
  },
  {
    id: 2,
    name: 'Prakash Patel',
    business: 'Patel Infra Projects',
    location: 'Thane',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'We completed a G+3 residential project using materials from ASIF TRADERS. Quality of AAC blocks and TMT bars was excellent. The team is responsive and handles urgent deliveries without fuss.',
    rating: 5,
    orderValue: '₹8+ Lakhs',
    projectsCompleted: '25+'
  },
  {
    id: 3,
    name: 'Vijay More',
    business: 'More Associates (Architects)',
    location: 'Vashi, Navi Mumbai',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    quote: 'As an architect, I recommend ASIF TRADERS to my clients for their renovation projects. They stock a good range of tiles and the staff helps with technical guidance on material selection.',
    rating: 4,
    orderValue: '₹3+ Lakhs',
    projectsCompleted: '40+'
  },
  {
    id: 4,
    name: 'Sunil Gawde',
    business: 'Gawde Masonry Works',
    location: 'Airoli, Navi Mumbai',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face',
    quote: 'For a small contractor like me, ASIF TRADERS is reliable. I can get cement, sand, and steel delivered to my site without any quality complaints. Their wholesale pricing works for my project sizes.',
    rating: 5,
    orderValue: '₹2+ Lakhs',
    projectsCompleted: '15+'
  },
  {
    id: 5,
    name: 'Anita Deshmukh',
    business: 'Homeowner',
    location: 'Ghansoli, Navi Mumbai',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    quote: 'Built my first home with ASIF TRADERS supplies. They guided me on choosing the right cement grade and TMT size. Materials were genuine ISI-marked products. Good experience overall.',
    rating: 5,
    orderValue: '₹6+ Lakhs',
    projectsCompleted: '1'
  }
];

export const brands = [
  { name: 'UltraTech Cement', logo: '/images/brands/ultratech.png' },
  { name: 'ACC Cement', logo: '/images/brands/acc.png' },
  { name: 'Ambuja Cement', logo: '/images/brands/ambuja.png' },
  { name: 'TATA Steel', logo: '/images/brands/tata.png' },
  { name: 'JSW Steel', logo: '/images/brands/jsw.png' },
  { name: 'Kajaria Tiles', logo: '/images/brands/kajaria.png' },
  { name: 'Somany Tiles', logo: '/images/brands/somany.png' }
];

export const heroBanners = [
  {
    id: 1,
    title: 'Wholesale Prices for Builders',
    subtitle: 'Cement, Steel, TMT & More',
    description: 'Direct dealer rates for contractors and individual builders',
    cta: 'Browse Catalog',
    ctaLink: '/category/cement',
    image: '/images/banners/hero-1.jpg',
    badge: 'Best Prices'
  },
  {
    id: 2,
    title: 'Bulk Order Discounts',
    subtitle: 'Up to 10% Off on Large Quantities',
    description: 'Special rates for projects above ₹50,000',
    cta: 'Request Quote',
    ctaLink: '/quote',
    image: '/images/banners/hero-2.jpg',
    badge: 'Bulk Savings'
  },
  {
    id: 3,
    title: 'Fast Local Delivery',
    subtitle: 'Navi Mumbai & Thane',
    description: 'Delivery within 24-48 hours for in-stock items',
    cta: 'Check Delivery',
    ctaLink: '/delivery',
    image: '/images/banners/hero-3.jpg',
    badge: 'Quick Delivery'
  }
];
