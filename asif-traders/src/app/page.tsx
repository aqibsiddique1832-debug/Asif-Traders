'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Users,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  MapPin,
  Mail,
  ArrowRight,
  ShoppingCart,
  Quote,
  FileText,
  Gem,
  ArrowUp,
  Percent,
} from 'lucide-react';

// Categories Data
const categories = [
  { name: 'Cement', slug: 'cement', icon: '🏗️', count: 50 },
  { name: 'TMT Bars', slug: 'tmt-bars', icon: '🔩', count: 30 },
  { name: 'Structural Steel', slug: 'structural-steel', icon: '⚙️', count: 45 },
  { name: 'GI/MS Pipes', slug: 'pipes', icon: '🔧', count: 40 },
  { name: 'Tiles', slug: 'tiles', icon: '📐', count: 60 },
  { name: 'AAC Blocks', slug: 'aac-blocks', icon: '🧱', count: 25 },
];

// Hot Deals Data
const hotDeals = [
  { id: 1, name: 'OPC 53 Grade Cement', price: 380, mrp: 420, unit: 'bag', brand: 'UltraTech', discount: 10 },
  { id: 2, name: 'TMT 12mm Bar', price: 62, mrp: 72, unit: 'kg', brand: 'TATA Steel', discount: 14 },
  { id: 3, name: 'Vitrified Tiles', price: 45, mrp: 55, unit: 'sqft', brand: 'Kajaria', discount: 18 },
  { id: 4, name: 'GI Pipe 2"', price: 180, mrp: 210, unit: 'piece', brand: 'Jindal', discount: 14 },
  { id: 5, name: 'AAC Block 100mm', price: 45, mrp: 55, unit: 'piece', brand: 'Super Thermal', discount: 18 },
  { id: 6, name: 'River Sand', price: 2800, mrp: 3200, unit: 'ton', brand: 'Local', discount: 12 },
];

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    company: 'Sharma Construction Co.',
    rating: 5,
    quote: 'Trusted supplier for 5 years. TMT bars and cement always arrive on time. Prices genuinely competitive for bulk orders.',
    avatar: 'RS',
  },
  {
    id: 2,
    name: 'Prakash Patel',
    company: 'Patel Infra Projects',
    rating: 5,
    quote: 'Completed G+3 residential project. Quality of AAC blocks and TMT bars excellent. Responsive team, handles urgent deliveries.',
    avatar: 'PP',
  },
  {
    id: 3,
    name: 'Vijay More',
    company: 'More Associates (Architects)',
    rating: 5,
    quote: 'Recommend to clients for renovations. Good tile range, staff provides technical guidance.',
    avatar: 'VM',
  },
  {
    id: 4,
    name: 'Sunil Gawde',
    company: 'Gawde Masonry Works',
    rating: 5,
    quote: 'Reliable for small contractors. Cement, sand, steel delivered without quality complaints. Wholesale pricing works.',
    avatar: 'SG',
  },
  {
    id: 5,
    name: 'Anita Deshmukh',
    company: 'Homeowner',
    rating: 5,
    quote: "Built first home with their supplies. Guided on cement grade and TMT size. Genuine ISI-marked products.",
    avatar: 'AD',
  },
];

// FAQ Data
const faqs = [
  {
    question: 'What are your delivery areas?',
    answer: 'We deliver across Navi Mumbai, Mumbai, Thane, and surrounding areas including Airoli, Rabale, Vashi, Kopar Khairane, and more. Contact us to confirm delivery to your location.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer: 'Minimum order quantities vary by product. For cement, minimum is 50 bags. For TMT bars, minimum is 100 kg. Contact us for specific product requirements.',
  },
  {
    question: 'Do you provide GST invoices?',
    answer: 'Yes, we provide complete GST invoices for all purchases. We accept both cash and digital payments with proper billing.',
  },
  {
    question: 'What brands do you stock?',
    answer: 'We stock genuine ISI-marked products from UltraTech, ACC, Ambuja (cement), TATA Steel, JSW Steel (TMT/bars), Kajaria, Somany (tiles), and other leading manufacturers.',
  },
  {
    question: 'Can I get credit facility?',
    answer: 'We offer credit facilities for regular customers and established contractors. Terms are discussed on a case-by-case basis after initial orders.',
  },
  {
    question: 'Do you arrange transport for bulk orders?',
    answer: 'Yes, we arrange door-to-door delivery across our service area. Delivery charges depend on location and order quantity. Same/next day delivery available for in-stock items.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash, UPI (GPay, PhonePe, Paytm), Bank Transfer, and Credit/Debit Cards. For regular customers, we offer credit terms.',
  },
  {
    question: 'Are your products ISI certified?',
    answer: 'All our cement, steel, and structural products are ISI-certified. We only deal in genuine, quality-verified building materials from authorized dealers.',
  },
];

// Brands Data
const brands = [
  'UltraTech',
  'ACC',
  'Ambuja',
  'TATA Steel',
  'JSW Steel',
  'Kajaria',
  'Somany',
];

// Trust Points
const trustPoints = [
  { icon: Shield, title: 'Genuine Brands', desc: '100% ISI Certified' },
  { icon: Percent, title: 'Wholesale Pricing', desc: 'Direct Dealer Rates' },
  { icon: FileText, title: 'GST Billing', desc: 'Complete Documentation' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Same/Next Day' },
];

// Why Choose Us
const whyChooseUs = [
  { icon: Award, title: '15+ Years Experience', desc: 'Trusted service in Navi Mumbai & Thane' },
  { icon: Users, title: '5000+ Customers', desc: 'Contractors & builders who rely on us' },
  { icon: Clock, title: 'Same/Next Day', desc: 'Fast delivery for in-stock items' },
  { icon: CheckCircle, title: 'Quality Guaranteed', desc: 'Only ISI-marked certified products' },
];

// Section 1: Navbar
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1a365d] text-white py-2 hidden md:block">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+917977572727" className="flex items-center gap-2 hover:text-[#ed8936] transition-colors">
              <Phone className="w-4 h-4" />
              +91 79775 72727
            </a>
            <a href="mailto:info@asiftraders.in" className="flex items-center gap-2 hover:text-[#ed8936] transition-colors">
              <Mail className="w-4 h-4" />
              info@asiftraders.in
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Mon-Sat: 8AM-8PM | Sun: 9AM-2PM
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d] to-[#ed8936] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1a365d] leading-tight">ASIF TRADERS</h1>
                <p className="text-xs text-gray-500">Building Materials Supplier</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-semibold text-[#1a365d] hover:text-[#ed8936] transition-colors">Home</Link>
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 font-semibold text-[#1a365d] hover:text-[#ed8936] transition-colors">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'categories' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#ed8936] transition-colors"
                      >
                        {cat.icon} {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/about" className="font-semibold text-[#1a365d] hover:text-[#ed8936] transition-colors">About</Link>
              <Link href="/contact" className="font-semibold text-[#1a365d] hover:text-[#ed8936] transition-colors">Contact</Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/quote" className="btn-primary">
                <Quote className="w-5 h-5" />
                Get Quote
              </Link>
              <a href="tel:+917977572727" className="btn-secondary">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#1a365d]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ed8936] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AT</span>
              </div>
              <span className="text-white font-bold text-xl">ASIF TRADERS</span>
            </div>
            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4">
            <Link href="/" className="block text-white text-lg font-semibold py-3 border-b border-white/10">
              Home
            </Link>
            <div className="py-3 border-b border-white/10">
              <p className="text-white/60 text-sm mb-2">Categories</p>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block text-white/80 hover:text-[#ed8936] py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="block text-white text-lg font-semibold py-3 border-b border-white/10">
              About Us
            </Link>
            <Link href="/contact" className="block text-white text-lg font-semibold py-3 border-b border-white/10">
              Contact
            </Link>
          </nav>

          <div className="mt-8 space-y-4">
            <a href="tel:+917977572727" className="btn-primary w-full justify-center">
              <Phone className="w-5 h-5" />
              Call +91 79775 72727
            </a>
            <a href="https://wa.me/917977572727" className="btn-secondary w-full justify-center">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

// Section 2: Hero Section
function HeroSection() {
  return (
    <section className="hero-section bg-gradient-to-br from-[#1a365d] via-[#1a365d] to-[#2c5282] relative">
      {/* Background Pattern */}
      <div className="hero-pattern" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ed8936]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#ed8936]/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-left">
            <span className="badge badge-accent mb-6 inline-flex items-center gap-2">
              <Award className="w-4 h-4" />
              15+ Years of Trust
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Building Materials at{' '}
              <span className="text-gradient">Wholesale Prices</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              One-stop shop for Cement, TMT Bars, Structural Steel, GI/MS Pipes, Tiles, AAC Blocks & more.
              Direct dealer prices with fast delivery across Navi Mumbai and Mumbai.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/categories" className="btn-primary text-lg px-8 py-4">
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+917977572727" className="btn-secondary text-lg px-8 py-4">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ed8936]">5000+</p>
                <p className="text-sm text-gray-400">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ed8936]">9+</p>
                <p className="text-sm text-gray-400">Product Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ed8936]">24hr</p>
                <p className="text-sm text-gray-400">Fast Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="hidden lg:block animate-slide-right">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {categories.slice(0, 4).map((cat, i) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="bg-white/10 rounded-2xl p-6 text-center hover:bg-[#ed8936]/20 transition-all hover:scale-105 cursor-pointer"
                    >
                      <span className="text-4xl mb-3 block">{cat.icon}</span>
                      <p className="text-white font-semibold">{cat.name}</p>
                      <p className="text-white/60 text-sm">{cat.count}+ Items</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-[#ed8936] to-[#dd6b20] rounded-2xl p-6 text-center">
                  <p className="text-white text-lg font-semibold mb-2">Get Quote in 60 Seconds</p>
                  <p className="text-white/80 text-sm mb-4">Tell us what you need, we&apos;ll call you back</p>
                  <Link href="/quote" className="bg-white text-[#ed8936] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                    <Quote className="w-4 h-4" />
                    Request Quote
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-[#ed8936] text-white px-6 py-3 rounded-full font-bold shadow-lg animate-float">
                Best Prices Guaranteed!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

// Section 3: Trust Bar
function TrustBar() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustPoints.map((item, i) => (
            <div key={i} className="trust-item flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="trust-icon">
                <item.icon className="w-6 h-6 text-[#ed8936]" />
              </div>
              <div>
                <p className="font-bold text-[#1a365d]">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 4: Categories Grid
function CategoriesSection() {
  return (
    <section className="section bg-gray-50" id="categories">
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-4">Our Products</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for your construction project, all under one roof at dealer prices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="category-card card-lift group"
            >
              <div className="aspect-square bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              </div>
              <div className="category-overlay">
                <h3 className="text-white font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count}+ Products</p>
                <span className="mt-2 text-[#ed8936] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 5: Get Quote Section
function QuoteSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    quantity: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Quote request submitted! Our team will call you within 2 hours.');
  };

  return (
    <section className="section gradient-primary relative overflow-hidden">
      <div className="hero-pattern" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="badge badge-light mb-6 inline-flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Quick Quote
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get a Quote in 60 Seconds
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Tell us what you need for your construction project. Our team will prepare the best price and call you within 2 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Call Directly</p>
                  <a href="tel:+917977572727" className="text-[#ed8936] hover:underline">+91 79775 72727</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">WhatsApp Us</p>
                  <a href="https://wa.me/917977572727" className="text-[#ed8936] hover:underline">Send Message</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Product Category</label>
                  <select
                    className="form-select"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Quantity</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., 100 bags"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Your Message</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Describe your requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center text-lg py-4">
                <Quote className="w-5 h-5" />
                Request Quote
              </button>

              <p className="text-center text-sm text-gray-500">
                Our team will call you within 2 hours with the best price
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 6: Hot Deals
function HotDealsSection() {
  return (
    <section className="section bg-white" id="deals">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="badge badge-accent mb-4">Hot Deals</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d]">Today&apos;s Best Prices</h2>
          </div>
          <Link href="/categories" className="btn-outline mt-4 md:mt-0">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotDeals.map((deal) => (
            <div key={deal.id} className="product-card">
              <div className="product-image">
                <span className="text-6xl opacity-30">{categories.find(c => c.name.includes(deal.name.split(' ')[0]))?.icon || '📦'}</span>
                <span className="product-badge">{deal.discount}% OFF</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{deal.brand}</p>
                <h3 className="font-bold text-[#1a365d] mb-3">{deal.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#ed8936]">₹{deal.price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{deal.mrp}</span>
                  <span className="text-sm text-gray-500">/ {deal.unit}</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/quote" className="flex-1 btn-primary justify-center py-3">
                    Get Quote
                  </Link>
                  <a href="https://wa.me/917977572727?text=Hi, I need ${deal.name}" className="btn-outline px-4">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 7: Why Choose Us
function WhyChooseUsSection() {
  return (
    <section className="section bg-gray-50" id="why-us">
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-4">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Why Choose ASIF TRADERS?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for quality building materials at wholesale prices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => (
            <div key={i} className="card p-8 text-center hover:border-[#ed8936] border-2 border-transparent transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-[#ed8936]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 8: Testimonials
function TestimonialsSection() {
  return (
    <section className="section bg-white" id="testimonials">
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 star-filled fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1a365d]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Testimonials Carousel */}
        <div className="flex gap-6 mt-6 overflow-x-auto hide-scrollbar pb-4">
          {testimonials.slice(3).map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card flex-shrink-0 w-80">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 star-filled fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1a365d] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 9: Brands
function BrandsSection() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="container">
        <p className="text-center text-gray-500 font-semibold mb-8">AUTHORIZED DEALER FOR LEADING BRANDS</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {brands.map((brand, i) => (
            <div key={i} className="brand-logo flex items-center justify-center">
              <span className="font-bold text-gray-600 text-lg">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 10: FAQ
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section bg-white" id="faq">
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIndex === i ? 'active' : ''}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <div className="accordion-icon">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="faq-answer">
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 11: Contact / Footer
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a365d] text-white" id="contact">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ed8936] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AT</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">ASIF TRADERS</h3>
                <p className="text-sm text-white/60">Building Materials Supplier</p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              Your trusted partner for quality building materials at wholesale prices.
              Serving contractors, builders, and homeowners across Navi Mumbai and Mumbai.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/917977572727" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#25d366] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="tel:+917977572727" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#ed8936] transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/70 hover:text-[#ed8936] transition-colors">Home</Link></li>
              <li><Link href="/categories" className="text-white/70 hover:text-[#ed8936] transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-[#ed8936] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-[#ed8936] transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="text-white/70 hover:text-[#ed8936] transition-colors">Get Quote</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6">Categories</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-white/70 hover:text-[#ed8936] transition-colors">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ed8936] flex-shrink-0 mt-1" />
                <span className="text-white/70">Digha, Thane-Belapur Road,<br />Navi Mumbai, Maharashtra</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#ed8936]" />
                <a href="tel:+917977572727" className="text-white/70 hover:text-[#ed8936] transition-colors">
                  +91 79775 72727
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#ed8936]" />
                <a href="mailto:info@asiftraders.in" className="text-white/70 hover:text-[#ed8936] transition-colors">
                  info@asiftraders.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#ed8936]" />
                <span className="text-white/70">Mon-Sat: 8AM-8PM<br />Sun: 9AM-2PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-12 rounded-2xl overflow-hidden h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9566!2d73.0158!3d19.1245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzI3LjQiTiA3M8KwMDAnNTUuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ASIF TRADERS Location"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {currentYear} ASIF TRADERS. All rights reserved.
          </p>
          <p className="text-white/60 text-sm">
            Building Materials Supplier — Best Prices
          </p>
        </div>
      </div>
    </footer>
  );
}

// WhatsApp Floating Button
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917977572727?text=Hi, I want a quote for building materials from ASIF TRADERS."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// Back to Top Button
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <QuoteSection />
      <HotDealsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <BrandsSection />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
