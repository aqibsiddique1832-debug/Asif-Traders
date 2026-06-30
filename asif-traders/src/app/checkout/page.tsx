'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useLocation } from '@/context/LocationContext';
import { products } from '@/data/products';
import {
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Check,
  ArrowLeft,
  ArrowRight,
  Package,
  Home,
  Building2,
  Briefcase,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface SavedOrder {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  address: {
    name: string;
    phone: string;
    address: string;
    landmark: string;
    pincode: string;
  };
  paymentMethod: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const ADDRESS_TYPES = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'office', label: 'Office', icon: Building2 },
  { value: 'other', label: 'Other', icon: Briefcase },
];

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: Truck,
    badge: 'Popular',
  },
  {
    id: 'upi',
    label: 'UPI Payment',
    description: 'GPay, PhonePe, Paytm, BHIM',
    icon: CreditCard,
    badge: null,
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    badge: null,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartCount, clearCart } = useCart();
  const { showToast } = useToast();
  const { location, isLocationSet } = useLocation();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  // Form state
  const [addressType, setAddressType] = useState<'home' | 'office' | 'other'>('home');
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

  const totalMRP = cartDetails.reduce((sum, item) => {
    const mrp = item.variant?.mrp || 0;
    return sum + mrp * item.quantity;
  }, 0);
  const totalAmount = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const totalSavings = totalMRP - totalAmount;

  // Validate address form
  const isAddressValid = address.name.trim() &&
    address.phone.trim() &&
    address.address.trim() &&
    address.pincode.trim().length === 6;

  // Save order to localStorage
  const saveOrder = (orderData: SavedOrder) => {
    const existingOrders = JSON.parse(localStorage.getItem('asif_orders') || '[]');
    const updatedOrders = [orderData, ...existingOrders];
    localStorage.setItem('asif_orders', JSON.stringify(updatedOrders));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrderId = `AT${Date.now().toString(36).toUpperCase()}`;
    const newOrderNumber = `AT-2026-${Date.now().toString().slice(-5)}`;

    // Create order data to save
    const orderData: SavedOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      items: cartDetails.map(item => ({
        productId: item.productId,
        productName: item.product?.name || '',
        variantSize: item.variant?.size || '',
        quantity: item.quantity,
        unitPrice: item.variant?.sellingPrice || 0,
        lineTotal: item.subtotal,
      })),
      address: { ...address },
      paymentMethod,
      subtotal: totalAmount,
      deliveryCharge: 0,
      totalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage BEFORE clearing cart
    saveOrder(orderData);

    setOrderId(newOrderId);
    setOrderNumber(newOrderNumber);
    setOrderPlaced(true);
    clearCart();
    setIsProcessing(false);
    showToast('Order placed successfully!', 'success');
  };

  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="animate-fade-in">
        <section className="bg-gradient-to-br from-charcoal via-steel-blue to-charcoal text-white py-16 lg:py-24">
          <div className="container">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-28 h-28 bg-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-terracotta/30">
                <Package className="w-14 h-14 text-terracotta" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Cart is Empty
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                Add some products before checking out.
              </p>
              <Link href="/categories" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Browse Products
                <ArrowRight className="w-5 h-5" />
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
        <section className="bg-gradient-to-br from-success/20 via-success/10 to-success/5 text-white py-12 lg:py-16">
          <div className="container">
            <div className="text-center">
              <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Order Placed Successfully!
              </h1>
              <p className="text-text-secondary text-lg">
                Thank you for choosing ASIF TRADERS
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Order Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-charcoal to-steel-blue px-6 py-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Order Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-text-secondary mb-1">Order ID</p>
                    <p className="text-3xl font-bold text-terracotta font-mono">{orderId}</p>
                    <p className="text-sm text-text-secondary mt-1">Order Number: {orderNumber}</p>
                  </div>

                  <div className="bg-success/10 rounded-xl p-4 mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-success">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Expected delivery in 2-3 business days</span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-terracotta" />
                      Delivery Address
                    </h3>
                    <div className="bg-sandstone/30 rounded-lg p-4">
                      <p className="font-medium text-charcoal">{address.name}</p>
                      <p className="text-sm text-text-secondary mt-1">{address.address}</p>
                      {address.landmark && <p className="text-sm text-text-secondary">Landmark: {address.landmark}</p>}
                      <p className="text-sm text-text-secondary">Pincode: {address.pincode}</p>
                      <p className="text-sm text-text-secondary">Phone: {address.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-terracotta" />
                      Payment Method
                    </h3>
                    <div className="bg-sandstone/30 rounded-lg p-4">
                      <p className="font-medium text-charcoal capitalize">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                      </p>
                      <p className="text-sm text-success font-medium mt-1">Amount: ₹{totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-terracotta" />
                      Order Items ({cartDetails.length})
                    </h3>
                    <div className="space-y-2">
                      {cartDetails.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-sandstone/20 rounded-lg">
                          <div>
                            <p className="font-medium text-charcoal text-sm">{item.product?.name}</p>
                            <p className="text-xs text-text-secondary">{item.variant?.size} × {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-terracotta">₹{item.subtotal.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-6 text-center mb-8">
                <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-3" />
                <h3 className="font-bold text-charcoal mb-2">Need to track your order?</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Contact us on WhatsApp for order updates and queries
                </p>
                <a
                  href={`https://wa.me/918879149174?text=Hi,%20I%20just%20placed%20order%20${orderId}.%20Please%20confirm.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/orders" className="flex-1 btn-primary py-4 text-center">
                  View All Orders
                </Link>
                <Link href="/categories" className="flex-1 btn-secondary py-4 text-center">
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
      <section className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal text-white py-6">
        <div className="container">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Checkout
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Premium Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            {[
              { label: 'Address', icon: MapPin },
              { label: 'Payment', icon: CreditCard },
              { label: 'Confirm', icon: Check },
            ].map((item, index) => {
              const stepNum = index + 1;
              const isCompleted = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <React.Fragment key={item.label}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted
                          ? 'bg-success text-white shadow-lg shadow-success/30'
                          : isCurrent
                          ? 'bg-terracotta text-white shadow-lg shadow-terracotta/30'
                          : 'bg-sandstone text-text-secondary'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <item.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isCurrent || isCompleted ? 'text-charcoal' : 'text-text-secondary'}`}>
                      {item.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-16 lg:w-24 h-1 mx-3 rounded-full transition-all mb-8 ${
                      step > index + 1 ? 'bg-success' : 'bg-sandstone'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Address Step */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-terracotta/10 to-amber/5 px-6 py-4 border-b border-sandstone/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-terracotta" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          Delivery Address
                        </h2>
                        <p className="text-sm text-text-secondary">Enter your delivery details</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Address Type Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-charcoal mb-3">Address Type</label>
                      <div className="flex gap-3">
                        {ADDRESS_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setAddressType(type.value as any)}
                              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                addressType === type.value
                                  ? 'border-terracotta bg-terracotta/5 text-terracotta'
                                  : 'border-sandstone hover:border-terracotta/50 text-text-secondary'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Name & Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Full Name <span className="text-error">*</span>
                          </label>
                          <input
                            type="text"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="input"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Phone Number <span className="text-error">*</span>
                          </label>
                          <input
                            type="tel"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            className="input"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Complete Address <span className="text-error">*</span>
                        </label>
                        <textarea
                          value={address.address}
                          onChange={(e) => setAddress({ ...address, address: e.target.value })}
                          className="input min-h-[100px]"
                          placeholder="House/Flat No., Building, Street, Area"
                        />
                      </div>

                      {/* Landmark & Pincode */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            value={address.landmark}
                            onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                            className="input"
                            placeholder="Near landmark"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Pincode <span className="text-error">*</span>
                          </label>
                          <input
                            type="text"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                            className="input"
                            placeholder="6-digit pincode"
                            maxLength={6}
                          />
                        </div>
                      </div>

                      {/* Delivery Info */}
                      {isLocationSet && location && (
                        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-success">Delivery Available</p>
                            <p className="text-sm text-charcoal">
                              {location.area}, {location.city} • Est. {location.deliveryDays}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!isAddressValid}
                      className="w-full btn-primary mt-8 py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-terracotta/10 to-amber/5 px-6 py-4 border-b border-sandstone/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-terracotta" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          Payment Method
                        </h2>
                        <p className="text-sm text-text-secondary">Choose how you want to pay</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`block cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                            paymentMethod === method.id
                              ? 'border-terracotta bg-terracotta/5 shadow-md'
                              : 'border-sandstone/50 hover:border-terracotta/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id as any)}
                              className="w-5 h-5 accent-terracotta"
                            />
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              paymentMethod === method.id ? 'bg-terracotta/10' : 'bg-sandstone'
                            }`}>
                              <Icon className={`w-6 h-6 ${paymentMethod === method.id ? 'text-terracotta' : 'text-text-secondary'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-charcoal">{method.label}</p>
                                {method.badge && (
                                  <span className="text-xs font-medium bg-success/10 text-success px-2 py-0.5 rounded-full">
                                    {method.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-secondary mt-0.5">{method.description}</p>
                            </div>
                            {paymentMethod === method.id && (
                              <div className="w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="px-6 pb-6 flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 btn-secondary py-4">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 btn-primary py-4 flex items-center justify-center gap-2">
                      Review Order
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Step */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Address Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-sandstone/30">
                      <h3 className="font-bold text-charcoal flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-terracotta" />
                        Delivery Address
                      </h3>
                      <button onClick={() => setStep(1)} className="text-sm text-terracotta hover:underline font-medium">
                        Edit
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-sandstone rounded-lg flex items-center justify-center flex-shrink-0">
                          {addressType === 'home' ? <Home className="w-5 h-5 text-text-secondary" /> :
                           addressType === 'office' ? <Building2 className="w-5 h-5 text-text-secondary" /> :
                           <Briefcase className="w-5 h-5 text-text-secondary" />}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">{address.name}</p>
                          <p className="text-text-secondary text-sm mt-1">{address.address}</p>
                          {address.landmark && <p className="text-text-secondary text-sm">Landmark: {address.landmark}</p>}
                          <p className="text-text-secondary text-sm mt-1">Pincode: {address.pincode}</p>
                          <p className="text-text-secondary text-sm">Phone: {address.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-sandstone/30">
                      <h3 className="font-bold text-charcoal flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-terracotta" />
                        Payment Method
                      </h3>
                      <button onClick={() => setStep(2)} className="text-sm text-terracotta hover:underline font-medium">
                        Edit
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sandstone rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-text-secondary" />
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">
                            {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {paymentMethod === 'cod' ? 'Pay when you receive your order' :
                             paymentMethod === 'upi' ? 'Pay using GPay, PhonePe, Paytm' :
                             'Pay with Visa, Mastercard, RuPay'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-sandstone/30">
                      <h3 className="font-bold text-charcoal flex items-center gap-2">
                        <Package className="w-5 h-5 text-terracotta" />
                        Order Items ({cartDetails.length})
                      </h3>
                    </div>
                    <div className="p-6 space-y-3">
                      {cartDetails.map((item) => (
                        <div key={`${item.productId}-${item.variant}`} className="flex justify-between items-center p-3 bg-sandstone/20 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-sandstone rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-sandstone-dark" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{item.product?.name}</p>
                              <p className="text-sm text-text-secondary">
                                {item.variant?.size} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-terracotta">₹{item.subtotal.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        Place Order • ₹{totalAmount.toLocaleString()}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Trust Note */}
                  <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>Your order is secure and protected</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-charcoal to-steel-blue px-5 py-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Order Summary
                  </h2>
                </div>

                <div className="p-5">
                  {/* Items Preview */}
                  <div className="space-y-3 mb-5">
                    {cartDetails.slice(0, 3).map((item) => (
                      <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                        <span className="text-text-secondary line-clamp-1">
                          {item.product?.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-charcoal">₹{item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                    {cartDetails.length > 3 && (
                      <p className="text-xs text-text-secondary">
                        +{cartDetails.length - 3} more items
                      </p>
                    )}
                  </div>

                  <div className="border-t border-dashed border-sandstone pt-4 space-y-3">
                    <div className="flex justify-between text-text-secondary">
                      <span>MRP Total</span>
                      <span>₹{totalMRP.toLocaleString()}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-success">
                        <span>You Save</span>
                        <span className="font-medium">-₹{totalSavings.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-secondary">
                      <span>Delivery</span>
                      <span className="text-success font-medium">Free</span>
                    </div>
                    <div className="border-t-2 border-dashed border-sandstone pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-terracotta">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  {totalSavings > 0 && (
                    <div className="bg-gradient-to-r from-success/10 to-success/5 text-success border border-success/20 rounded-xl p-3 mt-5 text-center">
                      <p className="font-bold text-lg">You're Saving ₹{totalSavings.toLocaleString()}!</p>
                      <p className="text-xs opacity-80">on MRP prices</p>
                    </div>
                  )}

                  {/* Help */}
                  <div className="mt-6 pt-4 border-t border-sandstone/30">
                    <div className="flex items-center gap-3 p-3 bg-sandstone/30 rounded-xl">
                      <Phone className="w-5 h-5 text-terracotta flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-charcoal">Need Help?</p>
                        <p className="text-xs text-text-secondary">Call +91 79775 72727</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      <span>100% Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
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
