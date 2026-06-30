'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ChevronRight, Phone, Mail, MapPin, Clock, MessageCircle, Send, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    showToast('Message sent successfully! We will get back to you soon.', 'success');
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-charcoal text-white py-12">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Get in Touch
          </h1>
          <p className="text-gray-400 mt-2">We are here to help with your building material needs</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Call Us</h3>
                    <p className="text-text-secondary mb-2">Mon-Sat: 8:00 AM - 8:00 PM</p>
                    <a href="tel:+918879149174" className="text-terracotta font-semibold hover:underline text-lg">
                      +91 88791 49174
                    </a>
                    <p className="text-text-secondary text-sm mt-1">Alt: +91 79773 71025, +91 99199 51519</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="card p-6 bg-[#25D366]/5 border border-[#25D366]/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">WhatsApp</h3>
                    <p className="text-text-secondary mb-2">Quick responses on WhatsApp</p>
                    <a
                      href="https://wa.me/918879149174?text=Hi,%20I%20want%20to%20enquire%20about%20building%20materials%20from%20ASIF%20TRADERS."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline"
                    >
                      Chat Now
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-steel/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-steel" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Email</h3>
                    <p className="text-text-secondary mb-2">For business enquiries</p>
                    <a href="mailto:info@asiftraders.in" className="text-steel font-semibold hover:underline">
                      info@asiftraders.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-dark" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Visit Our Shop</h3>
                    <p className="text-text-secondary mb-2">Mon-Sat: 8:00 AM - 8:00 PM<br />Sunday: 9:00 AM - 2:00 PM</p>
                    <p className="text-charcoal">
                      ASIF TRADERS<br />
                      Digha, Thane-Belapur Road<br />
                      Navi Mumbai, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Your Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input pl-10"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          className="input pl-10"
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input pl-10"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="input"
                      >
                        <option value="">Select a subject</option>
                        <option value="product-enquiry">Product Enquiry</option>
                        <option value="bulk-order">Bulk Order / Quote</option>
                        <option value="delivery">Delivery Query</option>
                        <option value="return">Return / Exchange</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input pl-10 min-h-[150px]"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map */}
              <div className="card overflow-hidden mt-6">
                <div className="h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9824!2d73.0075!3d19.1542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b045c7e26a4d!2sThane%20Belapur%20Road%2C%20Airoli%2C%20Navi%20Mumbai%2C%20Maharashtra%20400708!5e0!3m2!1sen!2sin!4v1709200000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ASIF TRADERS Location - Thane Belapur Road, Airoli, Navi Mumbai"
                  />
                </div>
                <div className="p-4 bg-sandstone/30">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-terracotta" />
                    <div>
                      <p className="font-semibold text-charcoal">ASIF TRADERS</p>
                      <p className="text-sm text-text-secondary">Digha, Thane-Belapur Road, Navi Mumbai, Maharashtra</p>
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
