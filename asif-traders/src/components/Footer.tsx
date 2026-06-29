'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/products';
import { Phone, Mail, Clock, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2L2 8v12h20V8L12 2zm0 2.5L19 8v2H5V8l7-3.5zM7 12v6h3v-4h4v4h3v-6H7z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                ASIF TRADERS
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for quality building materials. Serving contractors, builders, and homeowners across Navi Mumbai and Thane with wholesale pricing on cement, steel, pipes, tiles, and more.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/917977572727?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-success rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/category/cement" className="text-gray-400 hover:text-white transition-colors">Cement</Link></li>
              <li><Link href="/category/tmt-bars" className="text-gray-400 hover:text-white transition-colors">TMT Bars</Link></li>
              <li><Link href="/category/structural-steel" className="text-gray-400 hover:text-white transition-colors">Structural Steel</Link></li>
              <li><Link href="/category/tiles" className="text-gray-400 hover:text-white transition-colors">Tiles</Link></li>
              <li><Link href="/category/aac-blocks" className="text-gray-400 hover:text-white transition-colors">AAC Blocks</Link></li>
              <li><Link href="/quote" className="text-gray-400 hover:text-white transition-colors">Request Quote</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              All Categories
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  ASIF TRADERS<br />
                  Digha, Thane-Belapur Road<br />
                  Navi Mumbai, Maharashtra
                </span>
              </li>
              <li>
                <a
                  href="tel:+917977572727"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-terracotta" />
                  <span>+91 79775 72727</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@asiftraders.in"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-terracotta" />
                  <span>info@asiftraders.in</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Mon - Sat: 8:00 AM - 8:00 PM<br />
                  Sunday: 9:00 AM - 2:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-64 bg-gray-800">
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
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 ASIF TRADERS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/917977572727?text=Hi,%20I%20want%20a%20quote%20for%20building%20materials%20from%20ASIF%20TRADERS."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 w-14 h-14 bg-success rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </footer>
  );
}
