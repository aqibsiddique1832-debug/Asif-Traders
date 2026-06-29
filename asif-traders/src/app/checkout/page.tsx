'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useLocation } from '@/context/LocationContext';
import { products } from '@/data/products';
import {
  ChevronRight,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Check,
  ArrowLeft,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartCount, clearCart } = useCart();
  const { showToast } = useToast();
  const { location, isLocationSet } = useLocation();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form state
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

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
  }).filter(item => item.product && item.variant);

  const totalAmount = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrderId = `AT${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
    setIsProcessing(false);
    showToast('Order placed successfully!', 'success');
  };

  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="animate-fade-in">
        <section className="py-16">
          <div className="container">
            <div className="text-center max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Cart is Empty
              </h1>
              <p className="text-text-secondary mb-6">Add some products before checking out.</p>
              <Link href="/categories" className="btn-primary inline-flex items-center gap-2">
                Browse Products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="animate-fade-in">
        <section className="py-16">
          <div className="container">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Order Placed Successfully!
              </h1>
              <p className="text-text-secondary mb-6">
                Thank you for your order. We will process it soon.
              </p>
              <div className="bg-sandstone/50 rounded-xl p-6 mb-6">
                <p className="text-sm text-text-secondary">Order ID</p>
                <p className="text-2xl font-bold text-terracotta font-mono">{orderId}</p>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Our team will call you shortly to confirm the order and schedule delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders" className="btn-primary">
                  View Orders
                </Link>
                <Link href="/" className="btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal text-white py-6">
        <div className="container">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Checkout
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {['Address', 'Payment', 'Confirm'].map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step > index + 1
                        ? 'bg-success text-white'
                        : step === index + 1
                        ? 'bg-terracotta text-white'
                        : 'bg-sandstone text-text-secondary'
                    }`}
                  >
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`ml-2 font-medium ${step >= index + 1 ? 'text-charcoal' : 'text-text-secondary'}`}>
                    {label}
                  </span>
                </div>
                {index < 2 && <div className={`w-12 lg:w-24 h-1 mx-4 rounded ${step > index + 1 ? 'bg-success' : 'bg-sandstone'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Address Step */}
              {step === 1 && (
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-terracotta" />
                    </div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="input"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="input"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
                      <textarea
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        className="input min-h-[100px]"
                        placeholder="House/Flat No., Building, Street"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={address.landmark}
                          onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                          className="input"
                          placeholder="Near landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">Pincode *</label>
                        <input
                          type="text"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          className="input"
                          placeholder="6-digit pincode"
                        />
                      </div>
                    </div>

                    {isLocationSet && location && (
                      <div className="bg-success/10 p-3 rounded-lg flex items-center gap-2">
                        <Truck className="w-4 h-4 text-success" />
                        <span className="text-sm text-charcoal">
                          Delivery to {location.area}, {location.city} • {location.deliveryDays}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!address.name || !address.phone || !address.address || !address.pincode}
                    className="w-full btn-primary mt-6"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Payment Step */}
              {step === 2 && (
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-terracotta" />
                    </div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <label className={`card p-4 cursor-pointer border-2 ${paymentMethod === 'cod' ? 'border-terracotta' : 'border-transparent'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-5 h-5 accent-terracotta"
                        />
                        <div>
                          <p className="font-semibold">Cash on Delivery</p>
                          <p className="text-sm text-text-secondary">Pay when you receive your order</p>
                        </div>
                      </div>
                    </label>

                    <label className={`card p-4 cursor-pointer border-2 ${paymentMethod === 'upi' ? 'border-terracotta' : 'border-transparent'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-5 h-5 accent-terracotta"
                        />
                        <div>
                          <p className="font-semibold">UPI Payment</p>
                          <p className="text-sm text-text-secondary">Pay using GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </label>

                    <label className={`card p-4 cursor-pointer border-2 ${paymentMethod === 'card' ? 'border-terracotta' : 'border-transparent'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-5 h-5 accent-terracotta"
                        />
                        <div>
                          <p className="font-semibold">Credit/Debit Card</p>
                          <p className="text-sm text-text-secondary">Pay with Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 btn-secondary">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 btn-primary">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Step */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Address Summary */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-charcoal">Delivery Address</h3>
                      <button onClick={() => setStep(1)} className="text-sm text-terracotta hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="font-semibold">{address.name}</p>
                    <p className="text-text-secondary text-sm">{address.address}</p>
                    {address.landmark && <p className="text-text-secondary text-sm">Landmark: {address.landmark}</p>}
                    <p className="text-text-secondary text-sm">Phone: {address.phone}</p>
                    <p className="text-text-secondary text-sm">Pincode: {address.pincode}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-charcoal">Payment Method</h3>
                      <button onClick={() => setStep(2)} className="text-sm text-terracotta hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-text-secondary capitalize">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="card p-6">
                    <h3 className="font-bold text-charcoal mb-4">Order Items ({cartCount})</h3>
                    <div className="space-y-3">
                      {cartDetails.map((item) => (
                        <div key={`${item.productId}-${item.variant}`} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.product?.name}</p>
                            <p className="text-sm text-text-secondary">
                              {item.variant?.size} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">₹{item.subtotal.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full btn-primary py-4 text-lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Place Order • ₹${totalAmount.toLocaleString()}`
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-secondary">
                    <span>Items ({cartCount})</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Delivery</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="border-t border-sandstone pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-terracotta">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-sandstone/50 rounded-lg text-sm">
                  <Phone className="w-4 h-4 text-terracotta" />
                  <span className="text-text-secondary">Need help? Call +91 79775 72727</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
