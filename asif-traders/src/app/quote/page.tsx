'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';
import {
  ChevronRight,
  FileText,
  Plus,
  Trash2,
  Send,
  Check,
  Upload,
  X,
  ArrowLeft,
  Phone,
  MessageCircle,
  Clock,
  FileCheck,
  PhoneCall,
  Truck,
  Package,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

// Quote status types and colors
const QUOTE_STATUSES = [
  { status: 'PENDING', label: 'Submitted', icon: Clock, color: 'amber', bgColor: 'bg-amber', textColor: 'text-amber-dark' },
  { status: 'REVIEWING', label: 'Under Review', icon: FileCheck, color: 'blue', bgColor: 'bg-blue-500', textColor: 'text-blue-600' },
  { status: 'QUOTED', label: 'Quote Ready', icon: TrendingUp, color: 'success', bgColor: 'bg-success', textColor: 'text-success' },
  { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, color: 'success', bgColor: 'bg-success', textColor: 'text-success' },
];

// Get status step index (0-based)
const getStatusIndex = (status: string): number => {
  return QUOTE_STATUSES.findIndex(s => s.status === status) || 0;
};

export default function QuotePage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('PENDING');

  // Load existing quote if any
  useEffect(() => {
    const savedQuotes = JSON.parse(localStorage.getItem('asif_quotes') || '[]');
    if (savedQuotes.length > 0) {
      // Use most recent quote
      const recentQuote = savedQuotes[0];
      setQuoteId(recentQuote.id);
      setQuoteStatus(recentQuote.status || 'PENDING');
      // For demo, simulate status progression
      const elapsed = Date.now() - new Date(recentQuote.createdAt).getTime();
      if (elapsed > 3600000) setQuoteStatus('REVIEWING'); // > 1 hour
      if (elapsed > 7200000) setQuoteStatus('QUOTED'); // > 2 hours
    }
  }, []);

  // Quote items from cart + custom items
  const [quoteItems, setQuoteItems] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    notes: string;
    isCustom: boolean;
  }>>(() => {
    // Initialize with cart items
    return items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: `${item.productId}-${item.variant}-${Date.now()}`,
        name: product?.name || '',
        quantity: item.quantity,
        unit: product?.unit || '',
        notes: '',
        isCustom: false,
      };
    });
  });

  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: '',
    gstin: user?.gstin || '',
    notes: '',
  });

  const [customItem, setCustomItem] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    notes: '',
  });

  const handleAddCustomItem = () => {
    if (!customItem.name || !customItem.quantity) {
      showToast('Please enter item name and quantity', 'error');
      return;
    }

    setQuoteItems([
      ...quoteItems,
      {
        id: `custom-${Date.now()}`,
        name: customItem.name,
        quantity: parseInt(customItem.quantity),
        unit: customItem.unit,
        notes: customItem.notes,
        isCustom: true,
      },
    ]);

    setCustomItem({ name: '', quantity: '', unit: 'pieces', notes: '' });
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const handleSubmitQuote = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      showToast('Please fill in your name and phone number', 'error');
      return;
    }

    if (quoteItems.length === 0) {
      showToast('Please add at least one item to your quote request', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newQuoteId = `QT${Date.now().toString(36).toUpperCase()}`;
    setQuoteId(newQuoteId);
    setQuoteStatus('PENDING');
    setIsSubmitted(true);
    clearCart();
    setIsSubmitting(false);
    showToast('Quote request submitted! We will call you within 2 hours.', 'success');

    // Save to local orders (for demo purposes)
    const quoteData = {
      id: newQuoteId,
      items: quoteItems,
      contact: contactInfo,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      type: 'quote',
    };

    const existingQuotes = JSON.parse(localStorage.getItem('asif_quotes') || '[]');
    localStorage.setItem('asif_quotes', JSON.stringify([quoteData, ...existingQuotes]));
  };

  if (isSubmitted) {
    const currentStatusIndex = getStatusIndex(quoteStatus);

    return (
      <div className="animate-fade-in">
        <section className="bg-gradient-to-br from-success/20 via-success/10 to-success/5 py-12 lg:py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Quote Request Submitted!
              </h1>
              <p className="text-text-secondary text-lg mb-2">
                Your quote request has been received successfully.
              </p>
              <div className="bg-white rounded-2xl p-6 shadow-lg inline-block mb-8">
                <p className="text-sm text-text-secondary">Quote Reference</p>
                <p className="text-3xl font-bold text-terracotta font-mono">{quoteId}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section -mt-8">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Status Pipeline */}
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-charcoal to-steel-blue px-6 py-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Quote Status Tracker
                  </h2>
                </div>
                <div className="p-6">
                  {/* Status Steps */}
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-sandstone mx-8">
                      <div
                        className="h-full bg-success rounded-full transition-all duration-500"
                        style={{ width: `${(currentStatusIndex / (QUOTE_STATUSES.length - 1)) * 100}%` }}
                      />
                    </div>

                    {/* Status Steps */}
                    <div className="relative flex justify-between">
                      {QUOTE_STATUSES.map((statusItem, idx) => {
                        const Icon = statusItem.icon;
                        const isCompleted = idx < currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;

                        return (
                          <div key={statusItem.status} className="flex flex-col items-center" style={{ width: '25%' }}>
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all z-10 ${
                                isCompleted
                                  ? 'bg-success text-white'
                                  : isCurrent
                                  ? `${statusItem.bgColor} text-white shadow-lg shadow-success/30`
                                  : 'bg-sandstone text-text-secondary'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-6 h-6" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            <p className={`text-sm font-medium text-center ${
                              isCompleted || isCurrent ? 'text-charcoal' : 'text-text-secondary'
                            }`}>
                              {statusItem.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-success mt-1">Current</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className={`mt-6 p-4 rounded-xl ${
                    quoteStatus === 'PENDING' ? 'bg-amber/10 border border-amber/20' :
                    quoteStatus === 'REVIEWING' ? 'bg-blue-50 border border-blue-200' :
                    'bg-success/10 border border-success/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        quoteStatus === 'PENDING' ? 'text-amber' :
                        quoteStatus === 'REVIEWING' ? 'text-blue-500' : 'text-success'
                      }`} />
                      <div>
                        {quoteStatus === 'PENDING' && (
                          <>
                            <p className="font-medium text-charcoal">Quote Under Review</p>
                            <p className="text-sm text-text-secondary mt-1">
                              Our team has received your request and will start reviewing it shortly.
                              Expected response within 2 hours.
                            </p>
                          </>
                        )}
                        {quoteStatus === 'REVIEWING' && (
                          <>
                            <p className="font-medium text-charcoal">Preparing Your Quote</p>
                            <p className="text-sm text-text-secondary mt-1">
                              Our team is checking the best prices for your requirements.
                              You'll receive a call soon.
                            </p>
                          </>
                        )}
                        {quoteStatus === 'QUOTED' && (
                          <>
                            <p className="font-medium text-charcoal">Quote Ready!</p>
                            <p className="text-sm text-text-secondary mt-1">
                              Your personalized quote is ready. Check your phone for our call
                              or continue on WhatsApp for instant response.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-sandstone/30">
                  <h3 className="font-bold text-charcoal flex items-center gap-2">
                    <Package className="w-5 h-5 text-terracotta" />
                    Quote Items
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-sandstone/20 rounded-xl">
                        <div>
                          <p className="font-medium text-charcoal">{item.name}</p>
                          <p className="text-sm text-text-secondary">
                            Qty: {item.quantity} {item.unit}
                            {item.notes && ` • ${item.notes}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-sandstone/30">
                  <h3 className="font-bold text-charcoal flex items-center gap-2">
                    <Clock className="w-5 h-5 text-terracotta" />
                    Expected Timeline
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">Within 2 Hours</p>
                        <p className="text-sm text-text-secondary">Our team will call you with the best price</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-terracotta" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">Best Price Guarantee</p>
                        <p className="text-sm text-text-secondary">We'll match or beat any competitor price</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">Quick Delivery</p>
                        <p className="text-sm text-text-secondary">Same-day or next-day delivery available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-6 text-center mb-8">
                <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-3" />
                <h3 className="font-bold text-charcoal mb-2">Want faster response?</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Connect with us on WhatsApp for instant quote
                </p>
                <a
                  href={`https://wa.me/918879149174?text=Hi,%20I%20submitted%20quote%20request%20${quoteId}.%20Please%20share%20the%20best%20price.`}
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
                  View All Quotes
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
      <section className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal text-white py-8">
        <div className="container">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center border border-terracotta/30">
              <FileText className="w-6 h-6 text-amber" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Request a Quote
              </h1>
              <p className="text-gray-400">Get the best price for your bulk order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Quote Banner */}
      <div className="bg-gradient-to-r from-success/10 via-success/5 to-success/10 border-b border-success/20">
        <div className="container py-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-charcoal">Best Price Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-success" />
              <span className="text-charcoal">Response in 2 Hours</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Truck className="w-4 h-4 text-success" />
              <span className="text-charcoal">Free Delivery Above ₹5000</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                <div className="bg-gradient-to-r from-terracotta/10 to-amber/5 px-6 py-4 border-b border-sandstone/30">
                  <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Items for Quote
                  </h2>
                </div>
                <div className="p-6">
                  {quoteItems.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No items added yet. Add items below or from your cart.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {quoteItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-sandstone/30 rounded-xl">
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal">{item.name}</p>
                            <p className="text-sm text-text-secondary">
                              Qty: {item.quantity} {item.unit}
                              {item.notes && ` • ${item.notes}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 hover:bg-error/10 rounded-lg transition-colors text-error/70 hover:text-error"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Item */}
                  <div className="border-t border-dashed border-sandstone pt-4">
                    <h3 className="font-semibold text-charcoal mb-3">Add Item</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={customItem.name}
                        onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                        placeholder="Item name (e.g., TMT 16mm)"
                        className="input"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={customItem.quantity}
                          onChange={(e) => setCustomItem({ ...customItem, quantity: e.target.value })}
                          placeholder="Qty"
                          className="input w-24"
                          min="1"
                        />
                        <select
                          value={customItem.unit}
                          onChange={(e) => setCustomItem({ ...customItem, unit: e.target.value })}
                          className="input w-32"
                        >
                          <option value="pieces">Pieces</option>
                          <option value="bags">Bags</option>
                          <option value="tons">Tons</option>
                          <option value="sqft">Sq.ft</option>
                          <option value="running ft">Running ft</option>
                          <option value="units">Units</option>
                        </select>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={customItem.notes}
                      onChange={(e) => setCustomItem({ ...customItem, notes: e.target.value })}
                      placeholder="Additional notes (optional)"
                      className="input mt-3"
                    />
                    <button
                      onClick={handleAddCustomItem}
                      className="btn-secondary w-full mt-3 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-sandstone/50 overflow-hidden">
                <div className="bg-gradient-to-r from-terracotta/10 to-amber/5 px-6 py-4 border-b border-sandstone/30">
                  <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Your Contact Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                          className="input"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Phone <span className="text-error">*</span>
                        </label>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          className="input"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Email (Optional)</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="input"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        GSTIN (Optional - for business customers)
                      </label>
                      <input
                        type="text"
                        value={contactInfo.gstin}
                        onChange={(e) => setContactInfo({ ...contactInfo, gstin: e.target.value.toUpperCase() })}
                        className="input"
                        placeholder="e.g., 27XXXXX1234X1ZX"
                        maxLength={15}
                      />
                      {contactInfo.gstin && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Business customer pricing applied
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Additional Notes</label>
                      <textarea
                        value={contactInfo.notes}
                        onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                        className="input min-h-[80px]"
                        placeholder="Any specific requirements, delivery timeline, site address, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuote}
                disabled={isSubmitting || !contactInfo.name || !contactInfo.phone || quoteItems.length === 0}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Quote Request
                  </>
                )}
              </button>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-sandstone/50 overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-charcoal to-steel-blue px-5 py-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Quote Summary
                  </h2>
                </div>

                <div className="p-5">
                  <div className="text-center mb-6 p-4 bg-sandstone/30 rounded-xl">
                    <p className="text-4xl font-bold text-terracotta">{quoteItems.length}</p>
                    <p className="text-text-secondary">Item(s) in quote</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {quoteItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm p-2 bg-sandstone/20 rounded-lg">
                        <span className="text-text-secondary line-clamp-1">{item.name}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </div>
                    ))}
                    {quoteItems.length > 3 && (
                      <p className="text-sm text-text-secondary text-center">
                        +{quoteItems.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl p-4 mb-6">
                    <p className="font-bold text-charcoal mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      What You Get
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span>Best price guarantee</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span>Free delivery above ₹5,000</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span>Response within 2 hours</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span>Genuine ISI products</span>
                      </li>
                    </ul>
                  </div>

                  {/* Help */}
                  <div className="p-4 bg-terracotta/5 rounded-xl text-center">
                    <p className="font-semibold text-charcoal mb-2">Need urgent help?</p>
                    <a href="tel:+918879149174" className="flex items-center justify-center gap-2 text-terracotta font-bold hover:underline">
                      <Phone className="w-5 h-5" />
                      Call +91 88791 49174
                    </a>
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
