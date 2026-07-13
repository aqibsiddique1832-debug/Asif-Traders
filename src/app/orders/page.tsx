'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Package, FileText, Clock, Check, Truck, Phone, MapPin } from 'lucide-react';

interface QuoteRequest {
  id: string;
  items: Array<{ name: string; quantity: number; unit: string }>;
  contact: { name: string; phone: string };
  status: 'pending' | 'quoted' | 'confirmed' | 'delivered';
  createdAt: string;
  type: 'quote';
}

interface OrderItem {
  productId: string;
  productName: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
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

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders'>('quotes');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Load quotes from localStorage
    const savedQuotes = JSON.parse(localStorage.getItem('asif_quotes') || '[]');
    setQuotes(savedQuotes);

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('asif_orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const getQuoteStatusInfo = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Review', color: 'text-amber bg-amber/10', icon: Clock };
      case 'quoted':
        return { label: 'Quote Received', color: 'text-steel bg-steel/10', icon: FileText };
      case 'confirmed':
        return { label: 'Order Confirmed', color: 'text-success bg-success/10', icon: Check };
      case 'delivered':
        return { label: 'Delivered', color: 'text-success bg-success/10', icon: Truck };
      default:
        return { label: status, color: 'text-text-secondary bg-sandstone', icon: Clock };
    }
  };

  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending Confirmation', color: 'text-amber bg-amber/10', icon: Clock };
      case 'CONFIRMED':
        return { label: 'Confirmed', color: 'text-steel bg-steel/10', icon: Check };
      case 'PROCESSING':
        return { label: 'Processing', color: 'text-blue bg-blue/10', icon: Package };
      case 'SHIPPED':
        return { label: 'Shipped', color: 'text-purple bg-purple/10', icon: Truck };
      case 'OUT_FOR_DELIVERY':
        return { label: 'Out for Delivery', color: 'text-terracotta bg-terracotta/10', icon: Truck };
      case 'DELIVERED':
        return { label: 'Delivered', color: 'text-success bg-success/10', icon: Check };
      case 'CANCELLED':
        return { label: 'Cancelled', color: 'text-error bg-error/10', icon: Clock };
      default:
        return { label: status, color: 'text-text-secondary bg-sandstone', icon: Clock };
    }
  };

  const getStatusStepIndex = (status: string) => {
    return ORDER_STATUSES.indexOf(status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'upi': return 'UPI';
      case 'card': return 'Card';
      default: return method;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal text-white py-8">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">My Orders</span>
          </nav>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            My Orders & Quotes
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="flex border-b border-sandstone mb-6">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'quotes'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-text-secondary hover:text-charcoal'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quote Requests
                {quotes.length > 0 && (
                  <span className="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full">{quotes.length}</span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-text-secondary hover:text-charcoal'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Orders
                {orders.length > 0 && (
                  <span className="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </div>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'quotes' && (
            <div>
              {quotes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-sandstone rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-text-secondary" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    No Quote Requests Yet
                  </h2>
                  <p className="text-text-secondary mb-6">
                    When you submit a quote request, it will appear here.
                  </p>
                  <Link href="/quote" className="btn-primary inline-flex items-center gap-2">
                    Request a Quote
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((quote) => {
                    const statusInfo = getQuoteStatusInfo(quote.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div key={quote.id} className="card p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono font-bold text-terracotta">{quote.id}</span>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary">
                              Submitted on {formatDate(quote.createdAt)}
                            </p>
                          </div>
                          <a
                            href={`https://wa.me/917977572727?text=Hi,%20I%20have%20quote%20request%20${quote.id}.%20Can%20you%20share%20the%20status?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-success font-medium text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            Check Status on WhatsApp
                          </a>
                        </div>

                        {/* Items */}
                        <div className="bg-sandstone/30 rounded-lg p-4">
                          <h4 className="font-semibold text-charcoal mb-2">Items Requested ({quote.items.length})</h4>
                          <div className="space-y-2">
                            {quote.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-text-secondary">{item.name}</span>
                                <span className="font-medium">× {item.quantity} {item.unit}</span>
                              </div>
                            ))}
                            {quote.items.length > 3 && (
                              <p className="text-sm text-text-secondary">
                                +{quote.items.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="mt-4 flex items-center gap-2">
                          {['pending', 'quoted', 'confirmed', 'delivered'].map((step, index) => {
                            const stepStatus = quote.status;
                            const isActive = ['pending', 'quoted', 'confirmed', 'delivered'].indexOf(stepStatus) >= index;
                            const stepInfo = getQuoteStatusInfo(step as QuoteRequest['status']);

                            return (
                              <React.Fragment key={step}>
                                <div className={`flex items-center gap-1.5 ${isActive ? 'text-terracotta' : 'text-text-secondary'}`}>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-terracotta text-white' : 'bg-sandstone'}`}>
                                    <stepInfo.icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-xs font-medium hidden sm:inline">{stepInfo.label}</span>
                                </div>
                                {index < 3 && <div className={`flex-1 h-0.5 ${isActive ? 'bg-terracotta' : 'bg-sandstone'}`} />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-sandstone rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-text-secondary" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    No Orders Yet
                  </h2>
                  <p className="text-text-secondary mb-6">
                    When you place an order, it will appear here.
                  </p>
                  <Link href="/categories" className="btn-primary inline-flex items-center gap-2">
                    Browse Products
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getOrderStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    const currentStepIndex = getStatusStepIndex(order.status);
                    const isExpanded = expandedOrder === order.id;

                    return (
                      <div key={order.id} className="card overflow-hidden">
                        {/* Order Header */}
                        <div
                          className="p-5 cursor-pointer hover:bg-sandstone/30 transition-colors"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="font-mono font-bold text-terracotta">{order.orderNumber}</span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary">
                                {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-text-secondary">Total</p>
                                <p className="text-lg font-bold text-charcoal">₹{order.totalAmount.toLocaleString()}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-sandstone p-5 bg-sandstone/20">
                            {/* Order Status Timeline */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-charcoal mb-3">Order Status</h4>
                              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {ORDER_STATUSES.map((step, index) => {
                                  if (step === 'CANCELLED') return null;
                                  const isActive = currentStepIndex >= index;
                                  const stepInfo = getOrderStatusInfo(step);
                                  return (
                                    <React.Fragment key={step}>
                                      <div className={`flex items-center gap-1.5 flex-shrink-0 ${isActive ? 'text-terracotta' : 'text-text-secondary'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-terracotta text-white' : 'bg-sandstone'}`}>
                                          <stepInfo.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-xs font-medium whitespace-nowrap">{stepInfo.label}</span>
                                      </div>
                                      {index < ORDER_STATUSES.indexOf('DELIVERED') && (
                                        <div className={`w-4 sm:w-8 h-0.5 flex-shrink-0 ${isActive ? 'bg-terracotta' : 'bg-sandstone'}`} />
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Delivery Address
                              </h4>
                              <p className="text-sm text-text-secondary">
                                {order.address.name}<br />
                                {order.address.address}
                                {order.address.landmark && <>, {order.address.landmark}</>}<br />
                                {order.address.pincode}<br />
                                Phone: {order.address.phone}
                              </p>
                            </div>

                            {/* Items */}
                            <div>
                              <h4 className="font-semibold text-charcoal mb-3">Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-start bg-white rounded-lg p-3">
                                    <div>
                                      <p className="font-medium text-charcoal">{item.productName}</p>
                                      <p className="text-sm text-text-secondary">
                                        {item.variantSize} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-semibold">₹{item.lineTotal.toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mt-4 pt-4 border-t border-sandstone">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Delivery</span>
                                <span className="text-success">{order.deliveryCharge === 0 ? 'Free' : `₹${order.deliveryCharge}`}</span>
                              </div>
                              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-sandstone">
                                <span>Total</span>
                                <span className="text-terracotta">₹{order.totalAmount.toLocaleString()}</span>
                              </div>
                              <div className="mt-2 text-sm text-text-secondary">
                                Payment: {getPaymentLabel(order.paymentMethod)}
                              </div>
                            </div>

                            {/* WhatsApp Status Check */}
                            <div className="mt-4 pt-4 border-t border-sandstone">
                              <a
                                href={`https://wa.me/917977572727?text=Hi,%20I%20have%20order%20${order.orderNumber}.%20Can%20you%20share%20the%20status?`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-success font-medium text-sm hover:underline"
                              >
                                <Phone className="w-4 h-4" />
                                Check Status on WhatsApp
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
