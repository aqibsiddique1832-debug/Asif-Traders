'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { products } from '@/data/products';
import { formatPrice } from '@/components/PriceDisplay';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, FileText, Truck, MessageCircle, ShieldCheck, Sparkles, ChevronLeft, Package } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 5000;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getCartCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const cartCount = getCartCount();

  // Calculate totals
  const cartDetails = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    const variant = product?.variants.find(v => v.size === item.variant);
    return {
      ...item,
      product,
      variant,
      subtotal: variant ? variant.sellingPrice * item.quantity : 0,
    };
  }).filter((item): item is typeof item & { variant: NonNullable<typeof item.variant> } => item.product !== undefined && item.variant !== undefined);

  const totalAmount = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const totalMRP = cartDetails.reduce((sum, item) => {
    const mrp = item.variant.mrp || 0;
    return sum + mrp * item.quantity;
  }, 0);
  const totalSavings = totalMRP - totalAmount;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalAmount);
  const deliveryProgress = Math.min(100, (totalAmount / FREE_DELIVERY_THRESHOLD) * 100);

  if (cartCount === 0) {
    return (
      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-charcoal via-steel-blue to-charcoal text-white py-16 lg:py-24">
          <div className="container">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-28 h-28 bg-gradient-to-br from-terracotta/20 to-amber/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-terracotta/30">
                <ShoppingCart className="w-14 h-14 text-terracotta" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Cart is Empty
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                Looks like you haven't added any building materials yet. Start exploring our categories to find what you need.
              </p>
              <Link href="/categories" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Categories */}
        <section className="section bg-sandstone/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Cement', slug: 'cement', icon: '🏗️' },
                { name: 'TMT Bars', slug: 'tmt-bars', icon: '🔩' },
                { name: 'Tiles', slug: 'tiles', icon: '⬜' },
                { name: 'Structural Steel', slug: 'structural-steel', icon: '⚙️' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="card p-6 text-center hover:border-terracotta hover:-translate-y-1 transition-all"
                >
                  <span className="text-4xl mb-3 block">{cat.icon}</span>
                  <h3 className="font-semibold text-charcoal">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal text-white py-8 lg:py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-terracotta/20 rounded-xl flex items-center justify-center border border-terracotta/30">
              <ShoppingCart className="w-7 h-7 text-terracotta" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Cart
              </h1>
              <p className="text-gray-400 mt-1">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} • {formatPrice(totalAmount)} total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Delivery Progress */}
      <div className="bg-gradient-to-r from-success/10 via-success/5 to-success/10 border-b border-success/20">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Truck className="w-6 h-6 text-success flex-shrink-0" />
            <div className="flex-1">
              {amountToFreeDelivery > 0 ? (
                <>
                  <p className="text-sm text-charcoal font-medium">
                    Add <span className="text-success font-bold">{formatPrice(amountToFreeDelivery)}</span> more for <span className="text-success font-bold">FREE delivery!</span>
                  </p>
                  <div className="mt-2 h-2 bg-sandstone rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500"
                      style={{ width: `${deliveryProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-success font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  You've unlocked <span className="font-bold">FREE delivery!</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartDetails.map((item) => (
                <div
                  key={`${item.productId}-${item.variant}`}
                  className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 lg:p-5">
                    <div className="flex gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-sandstone to-sandstone/50 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-sandstone/30">
                        <Package className="w-10 h-10 text-sandstone-dark" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            {item.product?.category && (
                              <span className="text-xs font-medium text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                                {item.product.category}
                              </span>
                            )}
                            <Link
                              href={`/product/${item.product?.slug}`}
                              className="font-bold text-charcoal hover:text-terracotta transition-colors block mt-1 text-lg"
                            >
                              {item.product?.name}
                            </Link>
                            <p className="text-sm text-text-secondary mt-1">
                              <span className="font-medium">{item.variant?.size}</span>
                              <span className="mx-2">•</span>
                              {formatPrice(item.variant?.sellingPrice || 0)} per {item.product?.unit?.replace('_', ' ')}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart(item.productId, item.variant.size);
                              showToast('Item removed from cart', 'info');
                            }}
                            className="p-2 hover:bg-error/10 rounded-lg transition-colors text-error/70 hover:text-error flex-shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price & Quantity Row */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-sandstone/30">
                          {/* Quantity Selector */}
                          <div className="flex items-center border-2 border-sandstone rounded-xl overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variant.size, Math.max(1, item.quantity - 1))}
                              className="p-2 lg:p-2.5 hover:bg-sandstone transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                updateQuantity(item.productId, item.variant.size, Math.max(1, newQty));
                              }}
                              className="w-14 text-center font-mono font-bold text-base bg-transparent outline-none border-none"
                              min="1"
                              max="9999"
                            />
                            <button
                              onClick={() => updateQuantity(item.productId, item.variant.size, item.quantity + 1)}
                              className="p-2 lg:p-2.5 hover:bg-sandstone transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-terracotta text-xl">
                              {formatPrice(item.subtotal)}
                            </p>
                            {item.variant && item.variant.mrp > item.variant.sellingPrice && (
                              <p className="text-xs text-text-secondary line-through">
                                {formatPrice(item.variant.mrp * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                    showToast('Cart cleared', 'info');
                  }
                }}
                className="text-error/70 hover:text-error transition-colors text-sm font-medium flex items-center gap-2 ml-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden sticky top-24">
                {/* Header */}
                <div className="bg-gradient-to-r from-charcoal to-steel-blue px-5 py-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Order Summary
                  </h2>
                </div>

                <div className="p-5">
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-text-secondary">
                      <span>MRP Total</span>
                      <span>{formatPrice(totalMRP)}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Product Discount</span>
                      <span>-{formatPrice(totalSavings)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Delivery</span>
                      <span className="text-success font-medium">Free</span>
                    </div>
                    <div className="border-t-2 border-dashed border-sandstone pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-terracotta">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  {totalSavings > 0 && (
                    <div className="bg-gradient-to-r from-success/10 to-success/5 text-success border border-success/20 rounded-xl p-3 mb-6 text-center">
                      <p className="font-bold text-lg">You're Saving!</p>
                      <p className="text-2xl font-bold">{formatPrice(totalSavings)}</p>
                      <p className="text-xs mt-1 opacity-80">on MRP prices</p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-3 shadow-lg shadow-terracotta/20"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* WhatsApp Order */}
                  <a
                    href={`https://wa.me/918879149174?text=${encodeURIComponent(`Hi ASIF TRADERS, I would like to order:\n${cartDetails.map(item => `• ${item.product?.name} (${item.variant?.size}) - Qty: ${item.quantity}`).join('\n')}\n\nTotal Items: ${cartCount}\nEstimated Total: ${formatPrice(totalAmount)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </a>

                  {/* Get Quote */}
                  <button
                    onClick={() => router.push('/quote')}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-sandstone/50 text-charcoal rounded-xl font-medium hover:bg-sandstone transition-colors mt-3"
                  >
                    <FileText className="w-4 h-4" />
                    Request Bulk Quote
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-4 border-t border-sandstone/30 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      <span>Secure & Safe Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Truck className="w-4 h-4 text-success" />
                      <span>Free delivery on orders above ₹5,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Sparkles className="w-4 h-4 text-amber" />
                      <span>Genuine ISI Marked Products</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
