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
                href="https://wa.me/917977572727?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 bg-success rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
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
                  href="tel:+917977572727"
                  className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-terracotta" />
                  <span>+91 79775 72727</span>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9587!2d73.0123!3d19.1375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0!2sDigha%2C%20Thane-Belapur%20Road%2C%20Navi%20Mumbai!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ASIF TRADERS Location"
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
        href="https://wa.me/917977572727?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 w-12 h-12 lg:w-14 lg:h-14 bg-[#27AE60] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40 whatsapp-pulse"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </a>
    </footer>
  );
}
