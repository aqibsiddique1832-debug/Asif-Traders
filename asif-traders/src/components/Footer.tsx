'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/products';
import { Phone, Mail, Clock, MapPin, MessageCircle } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 lg:mb-4">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                {/* Orange circle background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-full shadow-lg"></div>
                {/* Overlapping arcs SVG */}
                <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
                  {/* Dark Charcoal arc on top */}
                  <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  {/* Forest Green arc on bottom */}
                  <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  {/* AT text in white */}
                  <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="'Barlow Condensed', sans-serif">AT</text>
                </svg>
              </div>
              <div>
                <span className="text-lg lg:text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  ASIF TRADERS
                </span>
                <p className="text-[10px] text-gray-400 hidden sm:block">Building Materials Supplier</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for quality building materials. Serving contractors, builders, and homeowners across Navi Mumbai and Thane.
            </p>
            <div className="flex items-center gap-2 lg:gap-3">
              <a
                href="https://wa.me/918879149174?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 bg-[#25D366] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
              <a
                href="tel:+918879149174"
                className="w-9 h-9 lg:w-10 lg:h-10 bg-terracotta rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-1.5 lg:space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/category/cement" className="text-gray-400 hover:text-white transition-colors text-sm">Cement</Link></li>
              <li><Link href="/category/tmt-bars" className="text-gray-400 hover:text-white transition-colors text-sm">TMT Bars</Link></li>
              <li><Link href="/category/structural-steel" className="text-gray-400 hover:text-white transition-colors text-sm">Structural Steel</Link></li>
              <li><Link href="/category/tiles" className="text-gray-400 hover:text-white transition-colors text-sm">Tiles</Link></li>
              <li><Link href="/quote" className="text-gray-400 hover:text-white transition-colors text-sm">Request Quote</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              All Categories
            </h3>
            <ul className="space-y-1.5 lg:space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Contact Us
            </h3>
            <ul className="space-y-2 lg:space-y-3">
              <li className="flex items-start gap-2 lg:gap-3">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs lg:text-sm">
                  ASIF TRADERS<br />
                  Digha, Thane-Belapur Road<br />
                  Navi Mumbai, Maharashtra
                </span>
              </li>
              <li>
                <a
                  href="tel:+918879149174"
                  className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                  <span>+91 88791 49174</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+917977371025"
                  className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                  <span>+91 79773 71025</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919919951519"
                  className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                  <span>+91 99199 51519</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@asiftraders.in"
                  className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                  <span>info@asiftraders.in</span>
                </a>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs lg:text-sm">
                  Mon - Sat: 8:00 AM - 8:00 PM<br />
                  Sunday: 9:00 AM - 2:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-48 lg:h-64 bg-gray-800">
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

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500">
            <p>© {currentYear} ASIF TRADERS. All rights reserved.</p>
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button - Positioned above bottom nav with pulse animation */}
      <a
        href="https://wa.me/918879149174?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 w-12 h-12 lg:w-14 lg:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40 whatsapp-pulse"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </a>
    </footer>
  );
}
