'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-sandstone rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-terracotta" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            404
          </span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          <Link href="/categories" className="btn-secondary inline-flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
