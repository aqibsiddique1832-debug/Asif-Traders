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
      {/* Hero Section - Improved with Construction Theme */}
      <section className="relative bg-[#2C3E50] overflow-hidden">
        {/* Construction Background Illustration */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C3E50] via-[#34495E] to-[#2C3E50]" />

          {/* Construction site illustration */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Building structure */}
              <rect x="250" y="100" width="80" height="150" fill="white"/>
              <rect x="260" y="110" width="20" height="20" fill="#E85D04"/>
              <rect x="290" y="110" width="20" height="20" fill="#E85D04"/>
              <rect x="260" y="140" width="20" height="20" fill="#E85D04"/>
              <rect x="290" y="140" width="20" height="20" fill="#E85D04"/>
              <rect x="260" y="170" width="20" height="20" fill="#E85D04"/>
              <rect x="290" y="170" width="20" height="20" fill="#E85D04"/>
              <rect x="280" y="200" width="30" height="50" fill="#2C3E50"/>
              {/* Crane */}
              <line x1="200" y1="50" x2="350" y2="50" stroke="white" strokeWidth="3"/>
              <line x1="200" y1="50" x2="200" y2="250" stroke="white" strokeWidth="3"/>
              <line x1="350" y1="50" x2="350" y2="100" stroke="white" strokeWidth="2"/>
              <rect x="340" y="90" width="20" height="30" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Dark gradient overlay - bottom heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />

        <div className="container py-8 lg:py-12 xl:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-white">
              <span className="badge badge-amber mb-3 lg:mb-4 inline-block text-xs lg:text-sm">
                {heroBanners[currentBanner].badge}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-3 leading-tight hero-text-shadow transition-all duration-500" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {heroBanners[currentBanner].title}
              </h1>
              <p className="text-base lg:text-lg text-gray-200 mb-1 lg:mb-2 font-medium">
                {heroBanners[currentBanner].subtitle}
              </p>
              <p className="text-sm lg:text-base text-gray-300 mb-4 lg:mb-6 max-w-lg">
                {heroBanners[currentBanner].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Link href={heroBanners[currentBanner].ctaLink} className="btn-primary flex items-center justify-center gap-2 py-2.5 lg:py-3 text-sm lg:text-base group">
                  {heroBanners[currentBanner].cta}
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="tel:+917977572727" className="btn-secondary border-amber text-amber hover:bg-amber hover:text-[#2C3E50] flex items-center justify-center gap-2 py-2.5 lg:py-3 text-sm lg:text-base">
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Hero Visual - Construction Materials */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-[#E85D04]/20 rounded-full blur-3xl" />
              <div className="relative bg-gradient-to-br from-[#E85D04]/20 to-amber/10 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden">
                {/* Construction Materials Grid */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1">
                    <Building2 className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Cement</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1">
                    <Package className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Steel</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1">
                    <TruckIcon className="w-8 h-8 text-amber mb-2" />
                    <span className="text-xs text-white/80">Delivery</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center col-span-3 hover:bg-white/20 transition-all">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>9 Categories</span>
                    <span className="text-xs text-gray-300">Everything for Construction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators - Larger dots, orange active state */}
          <div className="flex gap-2 mt-6 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`hero-dot transition-all duration-300 ${
                  index === currentBanner ? 'hero-dot-active' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
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
