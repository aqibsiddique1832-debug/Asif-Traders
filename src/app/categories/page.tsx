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

      {/* Categories Grid - Floating Product Style */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-9 gap-4 lg:gap-5">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group block"
              >
                <div
                  className="relative bg-[#F5F8FF] rounded-[20px] p-4 lg:p-5 transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Category Image Container */}
                  <div className="relative w-full aspect-square mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={categoryImages[category.slug]}
                      alt={category.name}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Category Info */}
                  <div className="text-center">
                    <h2
                      className="font-semibold text-sm lg:text-base text-charcoal group-hover:text-terracotta transition-colors mb-1"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}
                    >
                      {category.name}
                    </h2>
                    <p className="text-xs lg:text-sm text-text-secondary">{category.productCount}+ Products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
