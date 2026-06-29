'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useLocation } from '@/context/LocationContext';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  Check,
  Star,
  ArrowLeft,
  FileText,
} from 'lucide-react';

interface ProductClientProps {
  slug: string;
}

export default function ProductClient({ slug }: ProductClientProps) {
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { location, isLocationSet } = useLocation();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-charcoal">Product not found</h1>
        <Link href="/categories" className="btn-primary mt-4 inline-block">Browse Products</Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const relatedProducts = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariant.size, quantity);
    showToast(`Added ${quantity} ${product.unit}(s) to cart`, 'success');
  };

  const handleRequestQuote = () => {
    addToCart(product.id, selectedVariant.size, quantity);
    window.location.href = '/quote/';
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-sandstone/50 border-b border-sandstone">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="hover:text-terracotta">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories/" className="hover:text-terracotta">Categories</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/category/${product.categorySlug}/`} className="hover:text-terracotta">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-charcoal line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-sandstone rounded-2xl overflow-hidden sticky top-24">
                <div className="absolute inset-0 img-placeholder flex items-center justify-center">
                  <div className="w-32 h-32 bg-sandstone/50 rounded-full" />
                </div>
                {selectedVariant.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 badge badge-amber text-lg px-4 py-2">
                    {Math.round(selectedVariant.discountPercent)}% OFF
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="text-error font-bold text-xl">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Back Link */}
              <Link
                href={`/category/${product.categorySlug}/`}
                className="inline-flex items-center gap-2 text-text-secondary hover:text-terracotta mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {product.category}
              </Link>

              {/* Title & Brand */}
              {product.brand && (
                <span className="badge bg-sandstone text-charcoal mb-2">{product.brand}</span>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
                <span className="text-sm text-text-secondary">(125 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-terracotta">
                  ₹{selectedVariant.sellingPrice.toLocaleString()}
                </span>
                <span className="text-xl text-text-secondary line-through">
                  ₹{selectedVariant.mrp.toLocaleString()}
                </span>
                <span className="badge badge-success">
                  Save ₹{((selectedVariant.mrp - selectedVariant.sellingPrice) * quantity).toLocaleString()}
                </span>
              </div>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    Select Size/Grade:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedVariantIndex === index
                            ? 'border-terracotta bg-terracotta/10 text-terracotta'
                            : 'border-sandstone hover:border-terracotta/50'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-sandstone/50 rounded-xl">
                <div>
                  <p className="text-sm text-text-secondary">Unit</p>
                  <p className="font-semibold text-charcoal capitalize">{product.unit.replace('_', ' ')}</p>
                </div>
                <div className="h-10 w-px bg-sandstone" />
                <div>
                  <p className="text-sm text-text-secondary">Min. Order</p>
                  <p className="font-semibold text-charcoal">{product.minOrderQty} units</p>
                </div>
                <div className="h-10 w-px bg-sandstone" />
                <div>
                  <p className="text-sm text-text-secondary">Stock</p>
                  <p className={`font-semibold ${product.inStock ? 'text-success' : 'text-error'}`}>
                    {product.inStock ? 'Available' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-sandstone rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                      className="p-3 hover:bg-sandstone transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-20 text-center font-mono font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-sandstone transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-text-secondary">
                    Total: <span className="font-bold text-charcoal">₹{(selectedVariant.sellingPrice * quantity).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary text-lg py-4 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleRequestQuote}
                  className="flex-1 btn-secondary text-lg py-4 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Request Bulk Quote
                </button>
              </div>

              {/* Delivery Info */}
              {isLocationSet && location && (
                <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 mb-6">
                  <Truck className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-semibold text-success">Delivery Available</p>
                    <p className="text-sm text-charcoal">
                      Delivering to {location.area}, {location.city} • {location.deliveryDays}
                    </p>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-sandstone/30 rounded-lg">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">Genuine ISI Marked</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-sandstone/30 rounded-lg">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber/10 rounded-lg border border-amber/20">
                  <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-amber-dark">Verified Seller</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-sandstone/30 rounded-lg">
                  <FileText className="w-5 h-5 text-charcoal" />
                  <span className="text-sm font-medium">GST Invoice</span>
                </div>
              </div>

              {/* Bulk Discount Info */}
              <div className="bg-gradient-to-r from-success/10 to-amber/10 rounded-xl p-4 border border-success/20 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal mb-1">Bulk Order Discounts Available</p>
                    <p className="text-sm text-text-secondary">
                      Order more than 50 units and get extra 2-5% off. Contact us for truck load pricing.
                    </p>
                    <Link href="/quote" className="inline-flex items-center gap-1 text-sm text-success font-medium mt-2 hover:underline">
                      Request Bulk Quote
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Credit Line Banner */}
              <div className="bg-steel-blue/10 rounded-xl p-4 border border-steel-blue/20 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-steel-blue/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-steel-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-steel-blue">Credit Line Available</p>
                    <p className="text-sm text-text-secondary">
                      Regular customers can avail credit facilities. Contact us to know more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Description & Specifications */}
          <div className="mt-12">
            <div className="flex border-b border-sandstone">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'description'
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-text-secondary hover:text-charcoal'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'specifications'
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-text-secondary hover:text-charcoal'
                }`}
              >
                Specifications
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'description' ? (
                <div className="prose max-w-none">
                  <p className="text-charcoal leading-relaxed">{product.description}</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-sandstone/30 rounded-lg">
                      <span className="text-text-secondary">{key}</span>
                      <span className="font-medium text-charcoal">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Related Products
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}/`}
                    className="card p-4 hover:border-terracotta border-2 border-transparent transition-all"
                  >
                    <div className="aspect-square bg-sandstone rounded-lg mb-3" />
                    <h3 className="font-semibold text-charcoal line-clamp-2 text-sm">{p.name}</h3>
                    <p className="text-terracotta font-bold mt-2">
                      ₹{p.variants[0].sellingPrice.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
