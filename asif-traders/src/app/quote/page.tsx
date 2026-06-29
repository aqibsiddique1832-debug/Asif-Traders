'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function QuotePage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');

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
    setIsSubmitted(true);
    clearCart();
    setIsSubmitting(false);
    showToast('Quote request submitted! We will call you within 2 hours.', 'success');

    // Save to local orders (for demo purposes)
    const quoteData = {
      id: newQuoteId,
      items: quoteItems,
      contact: contactInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'quote',
    };

    const existingQuotes = JSON.parse(localStorage.getItem('asif_quotes') || '[]');
    localStorage.setItem('asif_quotes', JSON.stringify([quoteData, ...existingQuotes]));
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in">
        <section className="py-16">
          <div className="container">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Quote Request Submitted!
              </h1>
              <p className="text-text-secondary mb-6">
                Our team will call you within 2 hours with the best price.
              </p>
              <div className="bg-sandstone/50 rounded-xl p-6 mb-6">
                <p className="text-sm text-text-secondary">Quote Reference</p>
                <p className="text-2xl font-bold text-terracotta font-mono">{quoteId}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders" className="btn-primary">
                  View All Quotes
                </Link>
                <Link href="/" className="btn-secondary">
                  Continue Shopping
                </Link>
              </div>

              {/* WhatsApp Follow-up */}
              <div className="mt-8 p-4 bg-success/10 rounded-xl">
                <p className="text-sm text-charcoal mb-3">
                  Want faster response? Connect with us on WhatsApp:
                </p>
                <a
                  href={`https://wa.me/917977572727?text=Hi,%20I%20submitted%20quote%20request%20${quoteId}.%20Please%20share%20the%20best%20price.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-full font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
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
      <section className="bg-charcoal text-white py-8">
        <div className="container">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta/20 rounded-xl flex items-center justify-center">
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

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Section */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Items for Quote
                </h2>

                {quoteItems.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No items added yet. Add items below or from your cart.</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-sandstone/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-charcoal">{item.name}</p>
                          <p className="text-sm text-text-secondary">
                            Qty: {item.quantity} {item.unit}
                            {item.notes && ` • ${item.notes}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Item */}
                <div className="border-t border-sandstone pt-4">
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

              {/* Contact Info */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Your Contact Details
                </h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        className="input"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
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
                    <label className="block text-sm font-medium text-charcoal mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="input"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">GSTIN (Optional - for business customers)</label>
                    <input
                      type="text"
                      value={contactInfo.gstin}
                      onChange={(e) => setContactInfo({ ...contactInfo, gstin: e.target.value.toUpperCase() })}
                      className="input"
                      placeholder="e.g., 27XXXXX1234X1ZX"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Additional Notes</label>
                    <textarea
                      value={contactInfo.notes}
                      onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                      className="input min-h-[80px]"
                      placeholder="Any specific requirements, delivery timeline, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuote}
                disabled={isSubmitting || !contactInfo.name || !contactInfo.phone || quoteItems.length === 0}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
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
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Quote Summary
                </h2>

                <div className="mb-6">
                  <p className="text-3xl font-bold text-terracotta">{quoteItems.length}</p>
                  <p className="text-text-secondary">Item(s) in quote</p>
                </div>

                <div className="space-y-2 mb-6">
                  {quoteItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-text-secondary line-clamp-1">{item.name}</span>
                      <span>×{item.quantity}</span>
                    </div>
                  ))}
                  {quoteItems.length > 3 && (
                    <p className="text-sm text-text-secondary">
                      +{quoteItems.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="bg-amber/10 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-amber-dark mb-1">What happens next?</p>
                  <ol className="text-text-secondary space-y-1">
                    <li>1. We review your requirements</li>
                    <li>2. We call you within 2 hours</li>
                    <li>3. You get the best price!</li>
                  </ol>
                </div>

                <div className="mt-6 p-4 bg-sandstone/30 rounded-lg">
                  <p className="font-semibold text-charcoal mb-2">Need urgent help?</p>
                  <a href="tel:+917977572727" className="flex items-center gap-2 text-terracotta font-medium">
                    <Phone className="w-4 h-4" />
                    Call +91 79775 72727
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
