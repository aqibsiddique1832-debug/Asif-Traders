'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Award, Users, Clock, Shield, Phone, MapPin, Truck, Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-charcoal text-white py-12 lg:py-20">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">About Us</span>
          </nav>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            About ASIF TRADERS
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Your trusted partner for quality building materials in Navi Mumbai and Thane since 2009.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge bg-terracotta/10 text-terracotta mb-4">Our Story</span>
              <h2 className="text-3xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Building Trust, One Material at a Time
              </h2>
              <div className="space-y-4 text-charcoal">
                <p>
                  ASIF TRADERS was founded in 2009 with a simple mission: to provide contractors, builders, and homeowners in Navi Mumbai and Thane with access to quality building materials at fair prices. What started as a small shop at Digha has grown into one of the most trusted names in the region for construction materials.
                </p>
                <p>
                  Over the past 15+ years, we have served thousands of customers, from individual homeowners building their dream homes to large contractors managing multi-crore projects. Our commitment to quality, competitive pricing, and reliable delivery has earned us the trust of the community.
                </p>
                <p>
                  Today, ASIF TRADERS stocks an extensive range of building materials including cement, TMT bars, structural steel, pipes, tiles, AAC blocks, roofing sheets, and aggregates. We are authorized dealers for leading brands like UltraTech, ACC, Ambuja, TATA Steel, and JSW, ensuring that our customers always get genuine, ISI-marked products.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-sandstone rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-terracotta" fill="currentColor">
                      <path d="M12 2L2 8v12h20V8L12 2zm0 2.5L19 8v2H5V8l7-3.5zM7 12v6h3v-4h4v4h3v-6H7z"/>
                    </svg>
                  </div>
                  <p className="text-charcoal font-bold text-xl" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    15+ Years
                  </p>
                  <p className="text-text-secondary">Serving the Community</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber/10 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section bg-sandstone/50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge bg-amber/10 text-amber-dark mb-4">Why Us</span>
            <h2 className="text-3xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Genuine Products', desc: 'Only ISI-marked and certified materials from authorized dealers' },
              { icon: Clock, title: 'On-Time Delivery', desc: 'Fast delivery within 24-48 hours across serviceable areas' },
              { icon: Award, title: 'Best Prices', desc: 'Competitive wholesale rates with transparent pricing' },
              { icon: Users, title: 'Expert Guidance', desc: 'Knowledgeable staff to help you choose the right materials' },
            ].map((value, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-terracotta" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Happy Customers' },
              { number: '15+', label: 'Years Experience' },
              { number: '50+', label: 'Product Brands' },
              { number: '9', label: 'Categories' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl lg:text-5xl font-bold text-amber mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {stat.number}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge bg-success/10 text-success mb-4">Our Mission</span>
            <h2 className="text-3xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Empowering Builders Across Maharashtra
            </h2>
            <p className="text-lg text-charcoal leading-relaxed mb-8">
              Our mission is to make quality building materials accessible to everyone. Whether you are a contractor building a shopping complex or a homeowner building your first home, we are committed to providing you with the best materials at the best prices, backed by exceptional service.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-4 bg-sandstone/50 rounded-xl">
                <Truck className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <p className="font-semibold text-charcoal">Fast Delivery</p>
                <p className="text-sm text-text-secondary">Same-day and next-day delivery options</p>
              </div>
              <div className="p-4 bg-sandstone/50 rounded-xl">
                <Check className="w-8 h-8 text-success mx-auto mb-3" />
                <p className="font-semibold text-charcoal">Quality Assured</p>
                <p className="text-sm text-text-secondary">Genuine products with warranty</p>
              </div>
              <div className="p-4 bg-sandstone/50 rounded-xl">
                <Phone className="w-8 h-8 text-steel mx-auto mb-3" />
                <p className="font-semibold text-charcoal">Expert Support</p>
                <p className="text-sm text-text-secondary">Technical guidance available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-terracotta to-terracotta-dark">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Visit our shop at Digha or browse our catalog online. Our team is ready to help you find the right materials for your construction needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/categories" className="btn-primary bg-white text-terracotta hover:bg-gray-100">
              Browse Products
            </Link>
            <a href="tel:+917977572727" className="btn-secondary border-white text-white hover:bg-white hover:text-terracotta">
              <Phone className="w-5 h-5 mr-2 inline" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
