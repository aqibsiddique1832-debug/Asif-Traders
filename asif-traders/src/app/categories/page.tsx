'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/products';
import { ChevronRight } from 'lucide-react';

// Category images - real product photographs
const categoryImages: Record<string, string> = {
  'cement': '/images/categories/cement.jpg',
  'tmt-bars': '/images/categories/tmt-bars.jpg',
  'structural-steel': '/images/categories/structural-steel.jpg',
  'gi-pipes': '/images/categories/gi-pipes.jpg',
  'ms-pipes': '/images/categories/ms-pipes.jpg',
  'tiles': '/images/categories/tiles.jpg',
  'aac-blocks': '/images/categories/aac-blocks.jpg',
  'cement-sheets': '/images/categories/cement-sheets.jpg',
  'sand-aggregate': '/images/categories/sand-aggregate.jpg',
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
                className="card p-6 flex items-center gap-6 hover:border-terracotta border-2 border-transparent transition-all group overflow-hidden"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-sandstone flex-shrink-0">
                  <img
                    src={categoryImages[category.slug]}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-charcoal group-hover:text-terracotta transition-colors" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {category.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{category.description}</p>
                  <p className="text-xs text-amber font-semibold mt-2">{category.productCount}+ Products</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-terracotta transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
