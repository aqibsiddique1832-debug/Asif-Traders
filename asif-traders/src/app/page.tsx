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
} from 'lucide-react';

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'cement': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="24" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="16" width="32" height="8" fill="currentColor" opacity="0.4"/>
      <rect x="12" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
      <rect x="28" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  'tmt-bars': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="36" height="8" rx="2" fill="currentColor"/>
      <rect x="8" y="22" width="32" height="4" rx="1" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="24" r="2" fill="currentColor"/>
      <circle cx="40" cy="24" r="2" fill="currentColor"/>
    </svg>
  ),
  'structural-steel': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" fill="currentColor" opacity="0.3"/>
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 4V44M8 12L40 36M40 12L8 36" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'gi-pipes': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="12" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="12" y="10" width="24" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="12" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="12" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'ms-pipes': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="10" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="10" width="20" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="10" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="10" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'tiles': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="26" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="6" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="26" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="26" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'aac-blocks': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="20" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="14" width="36" height="6" fill="currentColor" opacity="0.5"/>
      <line x1="18" y1="20" x2="18" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <line x1="30" y1="20" x2="30" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <rect x="6" y="14" width="36" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'cement-sheets': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" fill="currentColor" opacity="0.3"/>
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'sand-aggregate': (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 36C8 36 12 28 24 28C36 28 40 36 40 36V40H8V36Z" fill="currentColor" opacity="0.4"/>
      <circle cx="16" cy="24" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="20" r="4" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="24" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="28" cy="30" r="2" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
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
          <div className="absolute inset-0 img-placeholder flex items-center justify-center text-terracotta/30">
            {categoryIcons[product.categorySlug] || (
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-sandstone rounded-full" />
            )}
          </div>
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
      {/* Hero Section - Reduced Height */}
      <section className="relative bg-charcoal overflow-hidden">
        {/* Construction Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal/80" />

        <div className="container py-8 lg:py-12 xl:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-white">
              <span className="badge badge-amber mb-3 lg:mb-4 inline-block text-xs lg:text-sm">
                {heroBanners[currentBanner].badge}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-3 leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {heroBanners[currentBanner].title}
              </h1>
              <p className="text-base lg:text-lg text-gray-300 mb-1 lg:mb-2 font-medium">
                {heroBanners[currentBanner].subtitle}
              </p>
              <p className="text-sm lg:text-base text-gray-400 mb-4 lg:mb-6 max-w-lg">
                {heroBanners[currentBanner].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Link href={heroBanners[currentBanner].ctaLink} className="btn-primary flex items-center justify-center gap-2 py-2.5 lg:py-3 text-sm lg:text-base">
                  {heroBanners[currentBanner].cta}
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
                <a href="tel:+917977572727" className="btn-secondary border-amber text-amber hover:bg-amber hover:text-charcoal flex items-center justify-center gap-2 py-2.5 lg:py-3 text-sm lg:text-base">
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-terracotta/20 rounded-full blur-3xl" />
              <div className="relative bg-gradient-to-br from-terracotta/20 to-amber/10 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                    <Building2 className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Cement</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                    <Package className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Steel</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                    <TruckIcon className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Delivery</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center col-span-3">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>9 Categories</span>
                    <span className="text-xs text-gray-300">Everything for Construction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators */}
          <div className="flex gap-2 mt-6 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
                  index === currentBanner ? 'bg-amber w-6 lg:w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="py-3 lg:py-4 bg-white border-b border-sandstone">
        <div className="container">
          <div className="flex overflow-x-auto gap-4 lg:gap-8 hide-scrollbar pb-1">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <badge.icon className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-charcoal whitespace-nowrap">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2 lg:gap-3">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="card p-2 lg:p-3 text-center hover:border-terracotta border-2 border-transparent transition-all group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 lg:w-14 lg:h-14 mx-auto mb-1.5 lg:mb-2 text-terracotta group-hover:scale-110 transition-transform">
                  {categoryIcons[category.slug]}
                </div>
                <h3 className="font-medium text-xs lg:text-sm text-charcoal group-hover:text-terracotta transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-[10px] lg:text-xs text-text-secondary mt-0.5">{category.productCount}+</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Quote Banner */}
      <section className="py-4 lg:py-5 bg-gradient-to-r from-terracotta to-terracotta-dark">
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
            <Link href="/quote" className="btn-primary bg-white text-terracotta hover:bg-gray-100 py-2 px-4 text-sm">
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
      <section className="py-8 lg:py-12 bg-gradient-to-br from-terracotta to-terracotta-dark">
        <div className="container text-center text-white">
          <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 mb-4 lg:mb-6 max-w-xl mx-auto text-sm lg:text-base">
            Get the best prices on quality building materials. Contact us today for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-3">
            <Link href="/quote" className="btn-primary bg-white text-terracotta hover:bg-gray-100 py-2.5 px-6 text-sm lg:text-base">
              Get Free Quote
            </Link>
            <a href="tel:+917977572727" className="btn-secondary border-white text-white hover:bg-white hover:text-terracotta py-2.5 px-6 text-sm lg:text-base">
              <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 inline" />
              Call +91 79775 72727
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
