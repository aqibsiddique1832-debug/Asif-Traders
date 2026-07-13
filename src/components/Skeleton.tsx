'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-sandstone/50';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-square bg-white">
        <Skeleton className="absolute inset-4" />
        <div className="absolute top-3 left-3">
          <Skeleton width={60} height={24} />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton height={20} className="w-3/4" />
        <Skeleton height={16} className="w-1/2" />
        <div className="flex gap-2">
          <Skeleton width={40} height={32} />
          <Skeleton className="flex-1" height={40} />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-sandstone/50 border-b border-sandstone">
        <div className="container py-3">
          <div className="flex items-center gap-2">
            <Skeleton width={60} height={16} />
            <Skeleton width={20} height={16} />
            <Skeleton width={80} height={16} />
            <Skeleton width={20} height={16} />
            <Skeleton width={120} height={16} />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative">
              <Skeleton className="aspect-square rounded-2xl" />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <Skeleton height={16} width={100} />
              <Skeleton height={40} className="w-3/4" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="circular" width={20} height={20} />
                ))}
              </div>
              <Skeleton height={80} className="w-full" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={48} />
                ))}
              </div>
              <Skeleton height={56} className="w-full" />
              <Skeleton height={56} className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Category Hero Skeleton
export function CategoryHeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal py-8 lg:py-12">
      <div className="container">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton width={60} height={16} />
          <Skeleton width={20} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton height={40} width={200} />
            <Skeleton height={20} width={300} />
          </div>
          <Skeleton height={24} width={100} />
        </div>
      </div>
    </div>
  );
}

// Cart Item Skeleton
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-sandstone/30">
      <Skeleton className="w-24 h-24 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton height={20} className="w-3/4" />
        <Skeleton height={16} className="w-1/2" />
        <Skeleton height={24} className="w-1/4" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton height={24} width={80} />
        <Skeleton width={40} height={32} />
      </div>
    </div>
  );
}

// Cart Page Skeleton
export function CartPageSkeleton() {
  return (
    <div className="animate-fade-in">
      <section className="section">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton height={36} width={200} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="card p-6 space-y-4">
                <Skeleton height={24} className="w-1/2" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton width={100} height={16} />
                      <Skeleton width={60} height={16} />
                    </div>
                  ))}
                </div>
                <Skeleton height={48} />
                <Skeleton height={48} variant="rectangular" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-sandstone/30">
          <Skeleton className="w-20 h-20 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton height={20} className="w-3/4" />
            <Skeleton height={16} className="w-1/2" />
            <Skeleton height={24} className="w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-steel-blue to-charcoal" />
      <div className="relative container py-20">
        <div className="max-w-2xl space-y-6">
          <Skeleton height={16} width={120} />
          <Skeleton height={56} className="w-full" />
          <Skeleton height={56} className="w-3/4" />
          <Skeleton height={24} className="w-full" />
          <Skeleton height={24} className="w-2/3" />
          <div className="flex gap-4 pt-4">
            <Skeleton height={52} width={180} />
            <Skeleton height={52} width={180} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Skeleton
export function TestimonialsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 space-y-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} variant="circular" width={20} height={20} />
            ))}
          </div>
          <Skeleton height={80} className="w-full" />
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="space-y-2">
              <Skeleton height={16} className="w-24" />
              <Skeleton height={14} className="w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Categories Grid Skeleton
export function CategoriesGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 text-center space-y-3">
          <Skeleton variant="circular" width={64} height={64} className="mx-auto" />
          <Skeleton height={20} className="w-3/4 mx-auto" />
          <Skeleton height={14} className="w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
