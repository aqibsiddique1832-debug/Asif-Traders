// Mock data for ASIF TRADERS Admin Panel

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  brand: string;
  description: string;
  variants: ProductVariant[];
  images: string[];
  inStock: boolean;
  minOrderQty: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  grade?: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  active: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'new' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'upi' | 'bank_transfer';
  deliveryAddress: string;
  deliveryPincode: string;
  deliveryDate?: string;
  deliveryBoy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  address: string;
  pincode: string;
  group: 'contractor' | 'builder' | 'homeowner' | 'mason' | 'architect';
  creditBalance: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: string;
  description: string;
  status: 'pending' | 'followed_up' | 'quoted' | 'converted' | 'closed';
  assignedTo?: string;
  quotedPrice?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pincode {
  id: string;
  code: string;
  area: string;
  city: string;
  state: string;
  deliveryCharges: number;
  deliveryTime: string;
  active: boolean;
}

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  area: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'sales_manager' | 'inventory_manager' | 'delivery_manager' | 'content_manager';
  password: string;
  lastLogin?: string;
  active: boolean;
  createdAt: string;
}

export interface WebsiteSettings {
  logo: string;
  favicon: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroSliders: HeroSlider[];
}

export interface HeroSlider {
  id: string;
  image: string;
  heading: string;
  subtext: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
}

export interface NotificationTemplate {
  id: string;
  type: 'push' | 'whatsapp' | 'sms' | 'email';
  name: string;
  template: string;
  variables: string[];
}

// Initial Mock Data
export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'OPC 53 Grade Cement',
    slug: 'opc-53-grade',
    category: 'cement',
    subcategory: 'OPC 53 Grade',
    brand: 'UltraTech',
    description: 'UltraTech Premium OPC 53 Grade Cement - High strength cement for RCC works',
    variants: [
      { id: 'v1', size: '50kg Bag', mrp: 380, sellingPrice: 350, discountPercent: 8, stock: 500 },
    ],
    images: ['/images/cement.jpg'],
    inStock: true,
    minOrderQty: 10,
    unit: 'bag',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 'prod-002',
    name: 'TMT Bars 12mm',
    slug: 'tmt-12mm',
    category: 'tmt-bars',
    subcategory: 'TMT Bars',
    brand: 'TATA Steel',
    description: 'TATA TMT Bars Fe 500D - High ductility reinforcement bars',
    variants: [
      { id: 'v1', size: '12mm', grade: 'Fe 500D', mrp: 850, sellingPrice: 780, discountPercent: 8, stock: 1000 },
    ],
    images: ['/images/tmt.jpg'],
    inStock: true,
    minOrderQty: 50,
    unit: 'piece',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
];

export const initialCategories: Category[] = [
  { id: 'cat-001', name: 'Cement', slug: 'cement', description: 'All types of cement', icon: 'cement', image: '/images/categories/cement.jpg', productCount: 25, active: true },
  { id: 'cat-002', name: 'TMT Bars', slug: 'tmt-bars', description: 'Reinforcement steel bars', icon: 'tmt', image: '/images/categories/tmt.jpg', productCount: 32, active: true },
  { id: 'cat-003', name: 'Structural Steel', slug: 'structural-steel', description: 'Angles, channels, beams', icon: 'steel', image: '/images/categories/steel.jpg', productCount: 45, active: true },
  { id: 'cat-004', name: 'GI Pipes', slug: 'gi-pipes', description: 'Galvanized iron pipes', icon: 'pipe', image: '/images/categories/gi-pipes.jpg', productCount: 18, active: true },
  { id: 'cat-005', name: 'MS Pipes', slug: 'ms-pipes', description: 'Mild steel pipes', icon: 'pipe', image: '/images/categories/ms-pipes.jpg', productCount: 15, active: true },
  { id: 'cat-006', name: 'Tiles', slug: 'tiles', description: 'Floor and wall tiles', icon: 'tile', image: '/images/categories/tiles.jpg', productCount: 120, active: true },
  { id: 'cat-007', name: 'AAC Blocks', slug: 'aac-blocks', description: 'Autoclaved aerated concrete', icon: 'block', image: '/images/categories/aac.jpg', productCount: 20, active: true },
  { id: 'cat-008', name: 'Cement Sheets', slug: 'cement-sheets', description: 'Roofing and wall sheets', icon: 'roof', image: '/images/categories/sheets.jpg', productCount: 28, active: true },
  { id: 'cat-009', name: 'Sand & Aggregate', slug: 'sand-aggregate', description: 'Construction aggregates', icon: 'sand', image: '/images/categories/sand.jpg', productCount: 15, active: true },
];

export const initialBrands: Brand[] = [
  { id: 'brand-001', name: 'UltraTech', logo: '/images/brands/ultratech.jpg', description: 'UltraTech Cement Ltd', active: true },
  { id: 'brand-002', name: 'ACC', logo: '/images/brands/acc.jpg', description: 'ACC Limited', active: true },
  { id: 'brand-003', name: 'Ambuja', logo: '/images/brands/ambuja.jpg', description: 'Ambuja Cements Ltd', active: true },
  { id: 'brand-004', name: 'TATA Steel', logo: '/images/brands/tata.jpg', description: 'TATA Steel Limited', active: true },
  { id: 'brand-005', name: 'JSW', logo: '/images/brands/jsw.jpg', description: 'JSW Steel Limited', active: true },
  { id: 'brand-006', name: 'Kajaria', logo: '/images/brands/kajaria.jpg', description: 'Kajaria Ceramics', active: true },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-001',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    items: [
      { productId: 'prod-001', productName: 'OPC 53 Grade Cement', variant: '50kg Bag', quantity: 100, price: 35000 },
    ],
    totalAmount: 35000,
    status: 'new',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    deliveryAddress: 'Sector 21, Vashi, Navi Mumbai',
    deliveryPincode: '400705',
    createdAt: '2024-01-20T10:30:00',
    updatedAt: '2024-01-20T10:30:00',
  },
  {
    id: 'ORD-002',
    customerId: 'cust-002',
    customerName: 'Suresh Patel',
    customerPhone: '+91 98765 43211',
    items: [
      { productId: 'prod-002', productName: 'TMT Bars 12mm', variant: '12mm', quantity: 200, price: 156000 },
    ],
    totalAmount: 156000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    deliveryAddress: 'Rabale MIDC, Navi Mumbai',
    deliveryPincode: '400701',
    deliveryDate: '2024-01-22',
    createdAt: '2024-01-19T14:20:00',
    updatedAt: '2024-01-20T09:00:00',
  },
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@contractor.com',
    phone: '+91 98765 43210',
    gstin: '27AAPCS1234C1Z5',
    address: 'Sector 21, Vashi, Navi Mumbai',
    pincode: '400705',
    group: 'contractor',
    creditBalance: 50000,
    totalOrders: 15,
    totalSpent: 450000,
    createdAt: '2023-06-15',
  },
  {
    id: 'cust-002',
    name: 'Suresh Patel',
    email: 'suresh@builder.com',
    phone: '+91 98765 43211',
    address: 'Rabale MIDC, Navi Mumbai',
    pincode: '400701',
    group: 'builder',
    creditBalance: 100000,
    totalOrders: 28,
    totalSpent: 1200000,
    createdAt: '2023-03-20',
  },
];

export const initialQuotes: Quote[] = [
  {
    id: 'QT-001',
    customerName: 'Amit Sharma',
    customerPhone: '+91 98765 43212',
    customerEmail: 'amit@email.com',
    items: 'OPC Cement - 200 bags, TMT 16mm - 100 pieces',
    description: 'Requirement for residential building project',
    status: 'pending',
    notes: '',
    createdAt: '2024-01-20T11:00:00',
    updatedAt: '2024-01-20T11:00:00',
  },
];

export const initialPincodes: Pincode[] = [
  { id: 'pc-001', code: '400708', area: 'Digha', city: 'Navi Mumbai', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true },
  { id: 'pc-002', code: '400080', area: 'Airoli', city: 'Navi Mumbai', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true },
  { id: 'pc-003', code: '400701', area: 'Rabale', city: 'Navi Mumbai', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true },
  { id: 'pc-004', code: '400710', area: 'Ghansoli', city: 'Navi Mumbai', state: 'Maharashtra', deliveryCharges: 500, deliveryTime: '48 hours', active: true },
  { id: 'pc-005', code: '400705', area: 'Vashi', city: 'Navi Mumbai', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true },
  { id: 'pc-006', code: '400601', area: 'Thane', city: 'Thane', state: 'Maharashtra', deliveryCharges: 1000, deliveryTime: '48 hours', active: true },
];

export const initialDeliveryBoys: DeliveryBoy[] = [
  { id: 'db-001', name: 'Ramesh Singh', phone: '+91 98765 43220', vehicle: 'Truck', area: 'Vashi, Rabale, Airoli', active: true },
  { id: 'db-002', name: 'Sunil Yadav', phone: '+91 98765 43221', vehicle: 'Tempo', area: 'Thane, Kalwa', active: true },
];

export const initialCoupons: Coupon[] = [
  {
    id: 'cp-001',
    code: 'BULK20',
    type: 'percentage',
    value: 20,
    minOrderValue: 50000,
    maxDiscount: 10000,
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    usageLimit: 100,
    usedCount: 15,
    active: true,
  },
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@asiftraders.com',
    role: 'super_admin',
    password: 'AsifTraders@2024', // In production, this should be hashed
    lastLogin: '2024-01-20T10:00:00',
    active: true,
    createdAt: '2023-01-01',
  },
];

export const initialWebsiteSettings: WebsiteSettings = {
  logo: '/images/logo.png',
  favicon: '/images/favicon.ico',
  phone: '+91 79775 72727',
  whatsapp: '+91 79775 72727',
  email: 'info@asiftraders.in',
  address: 'ASIF TRADERS, Digha, Thane-Belapur Road, Navi Mumbai, Maharashtra',
  socialLinks: {
    facebook: 'https://facebook.com/asiftraders',
    instagram: 'https://instagram.com/asiftraders',
    linkedin: '',
    youtube: '',
  },
  metaTitle: 'ASIF TRADERS - Building Materials Supplier | Cement, Steel, TMT Bars',
  metaDescription: 'One-stop shop for cement, steel, TMT bars, pipes, tiles at wholesale prices with fast delivery in Navi Mumbai and Thane.',
  metaKeywords: 'building materials, cement, TMT bars, steel, pipes, tiles, Navi Mumbai, Thane',
  heroSliders: [
    {
      id: 'slider-1',
      image: '/images/slider-1.jpg',
      heading: 'Building Materials at Wholesale Prices',
      subtext: 'Cement, Steel, TMT Bars, Pipes, Tiles - All at Dealer Rates',
      buttonText: 'Shop Now',
      buttonLink: '/categories',
      order: 1,
      active: true,
    },
    {
      id: 'slider-2',
      image: '/images/slider-2.jpg',
      heading: 'Premium Quality TMT Bars & Steel',
      subtext: 'Fe 500 & Fe 550 Grades from Top Brands',
      buttonText: 'View Steel Range',
      buttonLink: '/category/tmt-bars',
      order: 2,
      active: true,
    },
    {
      id: 'slider-3',
      image: '/images/slider-3.jpg',
      heading: 'Fast Delivery Across Navi Mumbai & Thane',
      subtext: 'Same Day & Next Day Delivery Available',
      buttonText: 'Check Delivery',
      buttonLink: '/delivery',
      order: 3,
      active: true,
    },
  ],
};

export const initialNotificationTemplates: NotificationTemplate[] = [
  {
    id: 'nt-001',
    type: 'whatsapp',
    name: 'Order Confirmation',
    template: 'Dear {{customer_name}}, your order {{order_id}} has been confirmed. Total: ₹{{amount}}. Expected delivery: {{delivery_date}}. - ASIF TRADERS',
    variables: ['customer_name', 'order_id', 'amount', 'delivery_date'],
  },
  {
    id: 'nt-002',
    type: 'sms',
    name: 'OTP Verification',
    template: 'Your OTP for ASIF TRADERS login is {{otp}}. Valid for 5 minutes.',
    variables: ['otp'],
  },
];

// Dashboard Stats
export const getDashboardStats = () => ({
  totalProducts: 55,
  todayOrders: 12,
  todayRevenue: 125000,
  totalCustomers: 156,
  pendingDeliveries: 8,
  lowStockAlerts: 5,
  monthlySales: 2500000,
  returnRequests: 2,
});
