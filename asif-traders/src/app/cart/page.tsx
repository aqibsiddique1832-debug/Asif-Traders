'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { products } from '@/data/products';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, FileText, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getCartCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const cartCount = getCartCount();

  const [showQuoteFlow, setShowQuoteFlow] = useState(false);

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

  if (cartCount === 0) {
    return (
      <div className="animate-fade-in">
        <section className="py-16">
          <div className="container">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-sandstone rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-text-secondary" />
              </div>
              <h1 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Cart is Empty
              </h1>
              <p className="text-text-secondary mb-6">
                Add some building materials to your cart to get started.
              </p>
              <Link href="/categories" className="btn-primary inline-flex items-center gap-2">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Your Cart
          </h1>
          <p className="text-gray-400 mt-1">{cartCount} item(s) in your cart</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartDetails.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="card p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-sandstone rounded-lg flex-shrink-0" />

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/product/${item.product?.slug}`}
                            className="font-semibold text-charcoal hover:text-terracotta"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-sm text-text-secondary mt-1">
                            {item.variant?.size} • ₹{item.variant?.sellingPrice.toLocaleString()}/{item.product?.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.productId, item.variant.size);
                            showToast('Item removed from cart', 'info');
                          }}
                          className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-error" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-sandstone rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant.size, item.quantity - 1)}
                            className="p-2 hover:bg-sandstone transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-mono font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant.size, item.quantity + 1)}
                            className="p-2 hover:bg-sandstone transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="font-bold text-terracotta text-lg">
                            ₹{item.subtotal.toLocaleString()}
                          </p>
                          {item.variant && item.variant.mrp > item.variant.sellingPrice && (
                            <p className="text-sm text-text-secondary line-through">
                              ₹{(item.variant.mrp * item.quantity).toLocaleString()}
                            </p>
                          )}
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
                className="text-error hover:underline text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-secondary">
                    <span>MRP Total</span>
                    <span>₹{totalMRP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Product Discount</span>
                    <span>-₹{totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Delivery</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="border-t border-sandstone pt-3 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-terracotta">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-success/10 text-success text-sm font-medium p-3 rounded-lg mb-6 text-center">
                    You are saving ₹{totalSavings.toLocaleString()} on this order!
                  </div>
                )}

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => router.push('/quote')}
                    className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Request Bulk Quote
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 mt-6 p-3 bg-sandstone/50 rounded-lg text-sm">
                  <Truck className="w-4 h-4 text-success" />
                  <span className="text-text-secondary">Free delivery for orders above ₹5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
