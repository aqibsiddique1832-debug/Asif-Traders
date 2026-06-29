'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, products, testimonials, heroBanners, brands } from '@/data/products';
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
} from 'lucide-react';

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'cement': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="24" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="16" width="32" height="8" fill="currentColor" opacity="0.4"/>
      <rect x="12" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
      <rect x="28" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  'tmt-bars': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="36" height="8" rx="2" fill="currentColor"/>
      <rect x="8" y="22" width="32" height="4" rx="1" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="24" r="2" fill="currentColor"/>
      <circle cx="40" cy="24" r="2" fill="currentColor"/>
    </svg>
  ),
  'structural-steel': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" fill="currentColor" opacity="0.3"/>
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 4V44M8 12L40 36M40 12L8 36" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'gi-pipes': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="12" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="12" y="10" width="24" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="12" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="12" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'ms-pipes': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="10" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="10" width="20" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="10" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="10" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'tiles': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="26" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="6" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="26" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="26" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'aac-blocks': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="20" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="14" width="36" height="6" fill="currentColor" opacity="0.5"/>
      <line x1="18" y1="20" x2="18" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <line x1="30" y1="20" x2="30" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <rect x="6" y="14" width="36" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'cement-sheets': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" fill="currentColor" opacity="0.3"/>
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'sand-aggregate': (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      className="card p-4 flex-shrink-0 w-64 scroll-snap-align-start"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-sandstone rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 img-placeholder flex items-center justify-center text-terracotta/30">
            {categoryIcons[product.categorySlug] || (
              <div className="w-16 h-16 bg-sandstone rounded-full" />
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-2 left-2 badge badge-amber">
              {discount}% OFF
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-error font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.slug}`}>
        <h3 className="font-semibold text-charcoal line-clamp-2 mb-1 hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        {product.variants.length > 1 && (
          <p className="text-sm text-text-secondary mb-2">
            {product.variants.length} options
          </p>
        )}
      </Link>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl font-bold text-terracotta">
          ₹{defaultVariant?.sellingPrice.toLocaleString()}
        </span>
        {defaultVariant && defaultVariant.mrp > defaultVariant.sellingPrice && (
          <span className="text-sm text-text-secondary line-through">
            ₹{defaultVariant.mrp.toLocaleString()}
          </span>
        )}
        <span className="text-xs text-text-secondary">/ {product.unit}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-sandstone rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
            className="p-2 hover:bg-sandstone transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-mono font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-sandstone transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdding ? 'Added!' : 'Add'}
        </button>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="card p-6 flex-shrink-0 w-80 scroll-snap-align-start">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber fill-amber' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <Quote className="w-8 h-8 text-terracotta/20 mb-3" />
      <p className="text-charcoal mb-4 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-sandstone rounded-full flex items-center justify-center text-terracotta font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-charcoal">{testimonial.name}</p>
          <p className="text-sm text-text-secondary">{testimonial.business}</p>
          <p className="text-xs text-text-secondary">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      {/* Hero Section */}
      <section className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="container py-12 lg:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="badge badge-amber mb-4 inline-block">
                {heroBanners[currentBanner].badge}
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {heroBanners[currentBanner].title}
              </h1>
              <p className="text-xl text-gray-300 mb-2">{heroBanners[currentBanner].subtitle}</p>
              <p className="text-gray-400 mb-6 max-w-lg">{heroBanners[currentBanner].description}</p>
              <div className="flex flex-wrap gap-4">
                <Link href={heroBanners[currentBanner].ctaLink} className="btn-primary flex items-center gap-2">
                  {heroBanners[currentBanner].cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="tel:+917977572727" className="btn-secondary border-amber text-amber hover:bg-amber hover:text-charcoal flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-terracotta/20 rounded-full blur-3xl" />
              <div className="relative bg-gradient-to-br from-terracotta/20 to-amber/10 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-white/80 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-terracotta/30 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 8v12h20V8L12 2zm0 2.5L19 8v2H5V8l7-3.5zM7 12v6h3v-4h4v4h3v-6H7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold">Quality Building Materials</p>
                  <p className="text-sm text-gray-400">Cement • Steel • Tiles • More</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators */}
          <div className="flex gap-2 mt-8 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBanner ? 'bg-amber w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Quote Banner */}
      <section className="bg-gradient-to-r from-terracotta to-terracotta-dark py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Get a Quote in 60 Seconds</h3>
                <p className="text-white/80 text-sm">Tell us what you need, we&apos;ll call you back</p>
              </div>
            </div>
            <Link href="/quote" className="btn-primary bg-white text-terracotta hover:bg-gray-100">
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Shop by Category
              </h2>
              <p className="text-text-secondary mt-1">Everything you need for your construction project</p>
            </div>
            <Link href="/categories" className="btn-ghost flex items-center gap-1 hidden sm:flex">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="card p-4 text-center hover:border-terracotta border-2 border-transparent transition-all group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-3 text-terracotta group-hover:scale-110 transition-transform">
                  {categoryIcons[category.slug]}
                </div>
                <h3 className="font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1">{category.productCount}+ Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Best Prices */}
      <section className="section bg-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Today&apos;s Best Prices
              </h2>
              <p className="text-text-secondary mt-1">Hot deals on essential building materials</p>
            </div>
            <Link href="/category/cement" className="btn-ghost flex items-center gap-1 hidden sm:flex">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {hotProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Steel & TMT Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Steel & TMT at Best Rates
              </h2>
              <p className="text-text-secondary mt-1">Premium TMT bars and structural steel</p>
            </div>
            <Link href="/category/tmt-bars" className="btn-ghost flex items-center gap-1 hidden sm:flex">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {steelProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 bg-sandstone border-y border-sandstone/50">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Fast Local Delivery', desc: '24-48 hours in serviceable areas' },
              { icon: Shield, title: 'Genuine ISI Products', desc: 'Certified quality materials' },
              { icon: BadgeDollarSign, title: 'Best Wholesale Prices', desc: 'Direct dealer rates' },
              { icon: Phone, title: 'Dedicated Support', desc: 'Expert guidance available' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">{item.title}</h4>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-charcoal text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Why Choose ASIF TRADERS?
            </h2>
            <p className="text-gray-400">Your trusted partner in construction materials</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: '15+ Years Experience', desc: 'Serving the Navi Mumbai and Thane region for over a decade with trusted service.' },
              { icon: Users, title: '5000+ Happy Customers', desc: 'Contractors, builders, and homeowners who rely on us for quality materials.' },
              { icon: Clock, title: 'Same/Next Day Delivery', desc: 'Fast delivery for in-stock items to your construction site.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Only ISI-marked and certified products from authorized dealers.' },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-amber" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiles & Blocks */}
      <section className="section bg-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Tiles & Blocks Collection
              </h2>
              <p className="text-text-secondary mt-1">Premium tiles and AAC blocks for modern construction</p>
            </div>
            <Link href="/category/tiles" className="btn-ghost flex items-center gap-1 hidden sm:flex">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {tilesProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              What Our Customers Say
            </h2>
            <p className="text-text-secondary mt-1">Trusted by contractors and builders across the region</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-x hide-scrollbar -mx-4 px-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-sandstone/30">
        <div className="container">
          <p className="text-center text-text-secondary mb-8 font-medium">Authorized Dealer for Leading Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="h-10 px-4 bg-white rounded-lg flex items-center justify-center shadow-sm"
              >
                <span className="font-bold text-charcoal/60 text-sm">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-terracotta to-terracotta-dark">
        <div className="container text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Get the best prices on quality building materials. Contact us today for a personalized quote or visit our shop at Digha.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary bg-white text-terracotta hover:bg-gray-100">
              Get Free Quote
            </Link>
            <a href="tel:+917977572727" className="btn-secondary border-white text-white hover:bg-white hover:text-terracotta">
              <Phone className="w-5 h-5 mr-2 inline" />
              Call +91 79775 72727
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
