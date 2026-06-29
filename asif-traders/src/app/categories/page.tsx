'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/products';
import { ChevronRight } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'cement': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="24" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="16" width="32" height="8" fill="currentColor" opacity="0.4"/>
      <rect x="12" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
      <rect x="28" y="24" width="8" height="8" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  'tmt-bars': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="36" height="8" rx="2" fill="currentColor"/>
      <rect x="8" y="22" width="32" height="4" rx="1" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="24" r="2" fill="currentColor"/>
      <circle cx="40" cy="24" r="2" fill="currentColor"/>
    </svg>
  ),
  'structural-steel': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" fill="currentColor" opacity="0.3"/>
      <path d="M8 12L24 4L40 12V36L24 44L8 36V12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 4V44M8 12L40 36M40 12L8 36" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'gi-pipes': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="12" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="12" y="10" width="24" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="12" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="12" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'ms-pipes': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="10" rx="10" ry="4" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="10" width="20" height="28" fill="currentColor" opacity="0.3"/>
      <ellipse cx="24" cy="38" rx="10" ry="4" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="10" rx="10" ry="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'tiles': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="26" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="6" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="26" y="26" width="16" height="16" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="26" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'aac-blocks': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="20" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="6" y="14" width="36" height="6" fill="currentColor" opacity="0.5"/>
      <line x1="18" y1="20" x2="18" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <line x1="30" y1="20" x2="30" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <rect x="6" y="14" width="36" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'cement-sheets': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" fill="currentColor" opacity="0.3"/>
      <path d="M4 32L12 16L20 32L28 16L36 32L44 16V40H4V32Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'sand-aggregate': (
    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 36C8 36 12 28 24 28C36 28 40 36 40 36V40H8V36Z" fill="currentColor" opacity="0.4"/>
      <circle cx="16" cy="24" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="20" r="4" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="24" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="28" cy="30" r="2" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
};

export default function CategoriesPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-charcoal text-white py-12">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">All Categories</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Shop by Category
          </h1>
          <p className="text-gray-400 mt-2">Browse our complete range of building materials</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section bg-sandstone/50">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="card p-6 flex items-center gap-6 hover:border-terracotta border-2 border-transparent transition-all group"
              >
                <div className="w-20 h-20 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                  {categoryIcons[category.slug]}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal group-hover:text-terracotta transition-colors" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {category.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">{category.description}</p>
                  <p className="text-xs text-amber font-semibold mt-2">{category.productCount}+ Products</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-terracotta transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
