'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, products, testimonials, brands } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ChevronRight,
  Truck,
  Shield,
  BadgeDollarSign,
  Phone,
  Star,
  ArrowRight,
  Clock,
  Award,
  Users,
  Quote,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  FileText,
  Percent,
  TruckIcon,
  Building2,
  Package,
  MessageCircle,
  Zap,
  BadgeCheck,
  Gem,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

// Category images - real product photographs
const categoryImages: Record<string, string> = {
  'cement': '/images/categories/cement.jpg',
  'tmt-bars': '/images/categories/tmt-bars.jpg',
  'structural-steel': '/images/categories/structural-steel.jpg',
  'gi-pipes': '/images/categories/gi-pipes.jpg',
  'ms-pipes': '/images/categories/ms-pipes.jpg',
  'tiles': '/images/categories/tiles.jpg',
  'aac-blocks': '/images/categories/aac-blocks.jpg',
  'cement-sheets': '/images/categories/cement-sheets.jpg',
  'sand-aggregate': '/images/categories/sand-aggregate.jpg',
};

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const [isAdding, setIsAdding] = useState(false);

  const defaultVariant = product.variants[0];
  const discount = defaultVariant ? Math.round(defaultVariant.discountPercent) : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product.id, defaultVariant.size, quantity);
    showToast(`Added ${quantity} ${product.unit}(s) to cart`, 'success');
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className="card p-3 lg:p-4 flex-shrink-0 w-56 lg:w-64 scroll-snap-align-start"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/product/${product.slug}/`}>
        <div className="relative aspect-square bg-sandstone rounded-lg mb-2 lg:mb-3 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 badge badge-amber text-xs">
              {discount}% OFF
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-error font-semibold text-xs">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.slug}/`}>
        <h3 className="font-semibold text-charcoal line-clamp-2 mb-0.5 lg:mb-1 text-sm lg:text-base hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        {product.variants.length > 1 && (
          <p className="text-xs text-text-secondary mb-1 lg:mb-2">
            {product.variants.length} options
          </p>
        )}
      </Link>

      <div className="flex items-baseline gap-1.5 lg:gap-2 mb-2 lg:mb-3">
        <span className="text-lg lg:text-xl font-bold text-terracotta">
          ₹{defaultVariant?.sellingPrice.toLocaleString()}
        </span>
        {defaultVariant && defaultVariant.mrp > defaultVariant.sellingPrice && (
          <span className="text-xs lg:text-sm text-text-secondary line-through">
            ₹{defaultVariant.mrp.toLocaleString()}
          </span>
        )}
        <span className="text-[10px] lg:text-xs text-text-secondary">/ {product.unit}</span>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-2">
        <div className="flex items-center border border-sandstone rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
            className="p-1.5 lg:p-2 hover:bg-sandstone transition-colors"
          >
            <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
          <span className="w-10 lg:w-12 text-center font-mono font-semibold text-xs lg:text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-1.5 lg:p-2 hover:bg-sandstone transition-colors"
          >
            <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="flex-1 btn-primary text-xs lg:text-sm flex items-center justify-center gap-1 py-2"
        >
          <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
          {isAdding ? 'Added!' : 'Add'}
        </button>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="card p-4 lg:p-5 flex-shrink-0 w-72 lg:w-80 scroll-snap-align-start">
      <div className="flex items-center gap-1 mb-2 lg:mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${i < testimonial.rating ? 'text-amber fill-amber' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <Quote className="w-6 h-6 lg:w-8 lg:h-8 text-terracotta/20 mb-2 lg:mb-3" />
      <p className="text-charcoal mb-3 lg:mb-4 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sandstone rounded-full flex items-center justify-center text-terracotta font-bold text-base lg:text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-charcoal text-sm lg:text-base">{testimonial.name}</p>
          <p className="text-xs lg:text-sm text-text-secondary">{testimonial.business}</p>
        </div>
      </div>
    </div>
  );
}

// Trust badge data
const trustBadges = [
  { icon: CheckCircle, text: 'Genuine Brands' },
  { icon: Percent, text: 'Wholesale Pricing' },
  { icon: FileText, text: 'GST Billing' },
  { icon: Truck, text: 'Fast Delivery' },
  { icon: Package, text: 'Bulk Orders' },
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const heroBanners = [
    {
      title: 'Building Materials at Wholesale Prices',
      subtitle: 'Cement • TMT Bars • Structural Steel • GI/MS Pipes • Tiles • AAC Blocks',
      description: 'Direct dealer prices for contractors, builders, and homeowners with fast delivery across Navi Mumbai and Mumbai.',
      badge: 'Best Prices',
      cta: 'Browse Products',
      ctaLink: '/categories',
    },
    {
      title: 'Premium Quality TMT Bars & Steel',
      subtitle: 'Fe 500 & Fe 550 Grades Available',
      description: 'ISI-marked TMT bars from Tata Steel, JSW and more. Perfect for residential and commercial construction.',
      badge: 'Top Brands',
      cta: 'View Steel Range',
      ctaLink: '/category/tmt-bars',
    },
    {
      title: 'Complete Construction Solutions',
      subtitle: 'One-Stop Shop for All Materials',
      description: 'From cement to roofing sheets - get everything you need for your construction project at dealer rates.',
      badge: 'Complete Range',
      cta: 'Explore Categories',
      ctaLink: '/categories',
    },
  ];

  const hotProducts = products.filter(p =>
    ['opc-53-grade', 'tmt-12mm', 'vitrified-tiles', 'aac-block-100mm', 'gi-round-pipe', 'fibre-cement-sheets'].includes(p.id)
  );

  const steelProducts = products.filter(p =>
    ['tmt-10mm', 'tmt-16mm', 'tmt-20mm', 'ms-angle', 'ms-channel', 'iswb-beams'].includes(p.id)
  );

  const tilesProducts = products.filter(p =>
    ['vitrified-tiles', 'gvt-tiles', 'double-charge-tiles', 'ceramic-tiles', 'parking-tiles'].includes(p.id)
  );

  return (
    <div className="animate-fade-in">
      {/* Premium Hero Section - Original Design */}
      <section className="relative min-h-[650px] lg:min-h-[720px] bg-[#1a2332] overflow-hidden">
        {/* Background Construction Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#2C3E50] to-[#1a2332]" />
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          {/* Abstract Geometric Shapes */}
          <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
            <div className="absolute top-20 right-10 w-80 h-80 bg-[#E85D04]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-[#F2A93B]/5 rounded-full blur-2xl" />
            {/* Abstract Building Silhouette */}
            <svg className="absolute right-0 bottom-0 h-full w-auto opacity-20" viewBox="0 0 400 500" fill="none">
              <rect x="50" y="150" width="60" height="350" fill="white" opacity="0.1"/>
              <rect x="130" y="100" width="50" height="400" fill="white" opacity="0.15"/>
              <rect x="200" y="50" width="70" height="450" fill="white" opacity="0.1"/>
              <rect x="290" y="120" width="55" height="380" fill="white" opacity="0.12"/>
              <rect x="70" y="170" width="15" height="15" fill="#E85D04" opacity="0.5"/>
              <rect x="70" y="200" width="15" height="15" fill="#E85D04" opacity="0.5"/>
              <rect x="70" y="230" width="15" height="15" fill="#E85D04" opacity="0.5"/>
              <rect x="150" y="120" width="12" height="12" fill="#E85D04" opacity="0.5"/>
              <rect x="150" y="145" width="12" height="12" fill="#E85D04" opacity="0.5"/>
              <rect x="150" y="170" width="12" height="12" fill="#E85D04" opacity="0.5"/>
            </svg>
          </div>
        </div>

        <div className="container relative h-full py-8 lg:py-12">
          {/* Top-Right Badge */}
          <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 animate-fade-in">
              <BadgeCheck className="w-4 h-4 text-[#F2A93B]" />
              <span className="text-white text-xs font-medium">Trusted Supplier in Navi Mumbai</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between h-full pt-8 lg:pt-0 lg:pt-8">
            {/* Left Content - 45% */}
            <div className="w-full lg:w-[45%] relative z-10">
              <div className="bg-white/95 backdrop-blur-xl rounded-[20px] p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/50 relative overflow-hidden animate-slide-up">
                {/* Corner Bracket Accents - Top Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#E85D04] rounded-tl-[20px]" />
                <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[#E85D04]/50" />

                {/* Corner Bracket Accents - Top Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#E85D04] rounded-tr-[20px]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[#E85D04]/50" />

                {/* Logo & Branding */}
                <div className="flex items-center gap-3 mb-4">
                  {/* AT Building Logo */}
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-xl flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 40 40" className="w-8 h-8 lg:w-10 lg:h-10">
                      <path d="M20 4L4 36h8l8-16 8 16h8L20 4z" fill="white"/>
                      <rect x="16" y="20" width="8" height="12" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-[#2C3E50] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      ASIF TRADERS
                    </h1>
                    <p className="text-[#E85D04] text-xs lg:text-sm font-semibold tracking-widest">BUILDING MATERIALS</p>
                  </div>
                </div>

                {/* Tagline */}
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#2C3E50] mb-2 leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Complete Construction <span className="text-[#E85D04]">Solutions</span>
                </h2>
                <p className="text-[#6B6B70] text-sm lg:text-base mb-4">
                  Everything You Need for Every Project
                </p>

                {/* Product Categories */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Cement', 'TMT Bars', 'Steel', 'Pipes', 'Tiles', 'AAC Blocks', 'Roofing'].map((cat) => (
                    <span key={cat} className="bg-[#F4EDE4] text-[#2C3E50] px-3 py-1 rounded-full text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Feature Icons */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { icon: CheckCircle, text: 'Genuine Brands' },
                    { icon: Percent, text: 'Dealer Pricing' },
                    { icon: Truck, text: 'Fast Delivery' },
                    { icon: Package, text: 'Bulk Orders' },
                    { icon: Phone, text: 'Expert Support' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-[#E85D04]" />
                      <span className="text-xs text-[#2C3E50]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/categories" className="flex-1 bg-gradient-to-r from-[#E85D04] to-[#D35400] text-white py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#E85D04]/30 transition-all hover:-translate-y-0.5">
                    Explore Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="https://wa.me/917977572727?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS." target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#25D366]/30 transition-all hover:-translate-y-0.5">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Quote
                  </a>
                </div>

                {/* Corner Bracket Accents - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E85D04] rounded-bl-[20px]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#E85D04]/50" />

                {/* Corner Bracket Accents - Bottom Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E85D04] rounded-br-[20px]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#E85D04]/50" />
              </div>
            </div>

            {/* Right Content - 55% - Construction Background */}
            <div className="hidden lg:flex w-[55%] h-full items-center justify-center relative pl-8">
              {/* Geometric Frame */}
              <div className="relative w-full max-w-lg">
                {/* Outer Frame */}
                <div className="absolute -inset-4 border-2 border-[#E85D04]/30 rounded-3xl" />
                <div className="absolute -inset-6 border border-[#F2A93B]/20 rounded-3xl" />

                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#1a2332] relative">
                    {/* Construction Scene */}
                    <div className="absolute inset-0 flex items-end justify-center">
                      {/* Sky gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Buildings silhouette */}
                      <svg className="absolute bottom-0 w-full h-3/4" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
                        <defs>
                          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3D5A73"/>
                            <stop offset="100%" stopColor="#2C3E50"/>
                          </linearGradient>
                        </defs>
                        {/* Buildings */}
                        <rect x="20" y="100" width="50" height="200" fill="url(#buildingGrad)"/>
                        <rect x="30" y="115" width="12" height="12" fill="#E85D04" opacity="0.8"/>
                        <rect x="48" y="115" width="12" height="12" fill="#E85D04" opacity="0.6"/>
                        <rect x="30" y="140" width="12" height="12" fill="#E85D04" opacity="0.6"/>
                        <rect x="48" y="140" width="12" height="12" fill="#E85D04" opacity="0.8"/>
                        <rect x="30" y="165" width="12" height="12" fill="#E85D04" opacity="0.8"/>
                        <rect x="48" y="165" width="12" height="12" fill="#E85D04" opacity="0.6"/>
                        <rect x="85" y="60" width="60" height="240" fill="url(#buildingGrad)"/>
                        <rect x="95" y="80" width="15" height="15" fill="#F2A93B" opacity="0.7"/>
                        <rect x="120" y="80" width="15" height="15" fill="#F2A93B" opacity="0.5"/>
                        <rect x="95" y="105" width="15" height="15" fill="#F2A93B" opacity="0.5"/>
                        <rect x="120" y="105" width="15" height="15" fill="#F2A93B" opacity="0.7"/>
                        <rect x="160" y="40" width="70" height="260" fill="url(#buildingGrad)"/>
                        <rect x="170" y="55" width="18" height="18" fill="#E85D04" opacity="0.9"/>
                        <rect x="198" y="55" width="18" height="18" fill="#E85D04" opacity="0.7"/>
                        <rect x="170" y="85" width="18" height="18" fill="#E85D04" opacity="0.7"/>
                        <rect x="198" y="85" width="18" height="18" fill="#E85D04" opacity="0.9"/>
                        <rect x="170" y="115" width="18" height="18" fill="#E85D04" opacity="0.9"/>
                        <rect x="198" y="115" width="18" height="18" fill="#E85D04" opacity="0.7"/>
                        <rect x="245" y="90" width="55" height="210" fill="url(#buildingGrad)"/>
                        <rect x="255" y="105" width="14" height="14" fill="#F2A93B" opacity="0.8"/>
                        <rect x="275" y="105" width="14" height="14" fill="#F2A93B" opacity="0.6"/>
                        <rect x="255" y="130" width="14" height="14" fill="#F2A93B" opacity="0.6"/>
                        <rect x="275" y="130" width="14" height="14" fill="#F2A93B" opacity="0.8"/>
                        <rect x="315" y="120" width="65" height="180" fill="url(#buildingGrad)"/>
                        <rect x="325" y="135" width="16" height="16" fill="#E85D04" opacity="0.8"/>
                        <rect x="350" y="135" width="16" height="16" fill="#E85D04" opacity="0.6"/>
                        <rect x="325" y="160" width="16" height="16" fill="#E85D04" opacity="0.6"/>
                        <rect x="350" y="160" width="16" height="16" fill="#E85D04" opacity="0.8"/>
                        {/* Ground */}
                        <rect x="0" y="280" width="400" height="20" fill="#1a2332"/>
                      </svg>

                      {/* Crane */}
                      <svg className="absolute top-4 right-8 w-32 h-48" viewBox="0 0 100 150">
                        <line x1="15" y1="10" x2="85" y2="10" stroke="#E85D04" strokeWidth="3"/>
                        <line x1="15" y1="10" x2="15" y2="140" stroke="#E85D04" strokeWidth="4"/>
                        <line x1="85" y1="10" x2="85" y2="50" stroke="#E85D04" strokeWidth="2"/>
                        <rect x="75" y="45" width="20" height="25" fill="#F2A93B"/>
                        <line x1="15" y1="140" x2="0" y2="150" stroke="#E85D04" strokeWidth="3"/>
                        <line x1="15" y1="140" x2="30" y2="150" stroke="#E85D04" strokeWidth="3"/>
                      </svg>

                      {/* Product Labels */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#E85D04] rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">C</span>
                          </div>
                          <span className="text-xs font-medium text-[#2C3E50]">Cement</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#3D5A73] rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">TMT</span>
                          </div>
                          <span className="text-xs font-medium text-[#2C3E50]">TMT Bars</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#27AE60] rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">GI</span>
                          </div>
                          <span className="text-xs font-medium text-[#2C3E50]">Pipes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Trust Strip */}
          <div className="absolute bottom-0 left-0 right-0 -mb-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/50 p-4 mx-auto max-w-2xl">
              <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
                {[
                  { icon: ShieldCheck, text: 'Genuine Products' },
                  { icon: Percent, text: 'Wholesale Pricing' },
                  { icon: Truck, text: 'Fast Delivery' },
                  { icon: FileText, text: 'GST Billing' },
                  { icon: Package, text: 'Bulk Supply' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E85D04]/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#E85D04]" />
                    </div>
                    <span className="text-xs font-medium text-[#2C3E50] whitespace-nowrap">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip - Spacer for floating element */}
      <section className="h-16 lg:h-20 bg-[#F4EDE4]" />

      {/* Categories Grid */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Shop by Category
              </h2>
              <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Everything for your construction project</p>
            </div>
            <Link href="/categories" className="btn-ghost flex items-center gap-1 text-xs lg:text-sm">
              View All
              <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center text-center group py-4 transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
                  <img
                    src={categoryImages[category.slug]}
                    alt={category.name}
                    className="max-w-[80%] max-h-[80%] object-contain filter drop-shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-semibold text-sm lg:text-base text-charcoal group-hover:text-terracotta transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-text-secondary">{category.productCount}+ Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Quote Banner */}
      <section className="py-4 lg:py-5 bg-gradient-to-r from-[#E85D04] to-[#D35400]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm lg:text-base">Get a Quote in 60 Seconds</h3>
                <p className="text-white/80 text-xs lg:text-sm">Tell us what you need, we&apos;ll call you back</p>
              </div>
            </div>
            <Link href="/quote" className="btn-primary bg-white text-[#E85D04] hover:bg-gray-100 py-2 px-4 text-sm shadow-lg">
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Best Prices */}
      <section className="py-6 lg:py-8 bg-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Today&apos;s Best Prices
              </h2>
              <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Hot deals on essential materials</p>
            </div>
            <Link href="/category/cement" className="btn-ghost flex items-center gap-1 text-xs lg:text-sm">
              View All
              <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Link>
          </div>

          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {hotProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Steel & TMT Section */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Steel & TMT at Best Rates
              </h2>
              <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Premium TMT bars and structural steel</p>
            </div>
            <Link href="/category/tmt-bars" className="btn-ghost flex items-center gap-1 text-xs lg:text-sm">
              View All
              <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Link>
          </div>

          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {steelProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-6 lg:py-8 bg-charcoal text-white">
        <div className="container">
          <div className="text-center mb-5 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Why Choose ASIF TRADERS?
            </h2>
            <p className="text-gray-400 text-sm">Your trusted partner in construction materials</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: Award, title: '15+ Years Experience', desc: 'Trusted service in Navi Mumbai and Thane region' },
              { icon: Users, title: '5000+ Customers', desc: 'Contractors and builders who rely on us' },
              { icon: Clock, title: 'Same/Next Day', desc: 'Fast delivery for in-stock items' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Only ISI-marked certified products' },
            ].map((item, index) => (
              <div key={index} className="text-center p-3 lg:p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-amber" />
                </div>
                <h3 className="text-sm lg:text-base font-bold mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiles & Blocks */}
      <section className="py-6 lg:py-8 bg-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Tiles & Blocks Collection
              </h2>
              <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Premium tiles and AAC blocks</p>
            </div>
            <Link href="/category/tiles" className="btn-ghost flex items-center gap-1 text-xs lg:text-sm">
              View All
              <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Link>
          </div>

          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {tilesProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="container">
          <div className="text-center mb-5 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-charcoal mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              What Our Customers Say
            </h2>
            <p className="text-xs lg:text-sm text-text-secondary">Trusted by contractors and builders</p>
          </div>

          <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-6 lg:py-8 bg-sandstone/30">
        <div className="container">
          <p className="text-center text-xs lg:text-sm text-text-secondary mb-4 lg:mb-6 font-medium">Authorized Dealer for Leading Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="h-8 lg:h-10 px-3 lg:px-4 bg-white rounded-lg flex items-center justify-center shadow-sm"
              >
                <span className="font-bold text-charcoal/60 text-xs lg:text-sm">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-[#E85D04] to-[#D35400]">
        <div className="container text-center text-white">
          <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 mb-4 lg:mb-6 max-w-xl mx-auto text-sm lg:text-base">
            Get the best prices on quality building materials. Contact us today for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-3">
            <Link href="/quote" className="btn-primary bg-white text-[#E85D04] hover:bg-gray-100 py-2.5 px-6 text-sm lg:text-base shadow-lg">
              Get Free Quote
            </Link>
            <a href="tel:+917977572727" className="btn-secondary border-white text-white hover:bg-white hover:text-[#E85D04] py-2.5 px-6 text-sm lg:text-base">
              <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 inline" />
              Call +91 79775 72727
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
