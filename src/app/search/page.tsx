'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { products, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  Filter,
  Plus,
  Minus,
  ShoppingCart,
  X,
  SlidersHorizontal,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [debouncedQuery, selectedCategory, router]);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search query filter
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      const searchFields = [
        product.name,
        product.category,
        product.subcategory,
        product.description,
        product.brand,
        ...product.variants.map(v => v.size),
      ].join(' ').toLowerCase();

      if (!searchFields.includes(query)) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory && product.categorySlug !== selectedCategory) {
      return false;
    }

    // Stock filter
    if (inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory(null);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedCategory || debouncedQuery || inStockOnly;

  return (
    <div className="animate-fade-in">
      {/* Search Header */}
      <section className="bg-charcoal text-white py-6 lg:py-8">
        <div className="container">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Search Products
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cement, TMT bars, tiles, pipes..."
              className="w-full pl-12 pr-4 py-3 bg-white text-charcoal rounded-xl focus:outline-none focus:ring-2 focus:ring-amber"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Quick Suggestions */}
          {!debouncedQuery && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Popular:</span>
              {['OPC 53 Cement', 'TMT 12mm', 'Vitrified Tiles', 'GI Pipes', 'AAC Blocks'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-sandstone/50 border-b border-sandstone sticky top-0 z-10">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-terracotta text-white'
                    : 'bg-white text-charcoal hover:bg-sandstone'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-white text-terracotta rounded-full text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-terracotta hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-sm text-text-secondary">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="pb-4 space-y-4">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-charcoal mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === null
                        ? 'bg-terracotta text-white'
                        : 'bg-white text-charcoal hover:bg-sandstone'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === cat.slug
                          ? 'bg-terracotta text-white'
                          : 'bg-white text-charcoal hover:bg-sandstone'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-terracotta"
                  />
                  <span className="text-sm text-charcoal">In Stock Only</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-charcoal mb-2">No products found</h2>
              <p className="text-text-secondary mb-4">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <SearchProductCard key={product.id} product={product} onAddToCart={() => {
                  addToCart(product.id, product.variants[0].size, product.minOrderQty);
                  showToast(`Added ${product.name} to cart`, 'success');
                }} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SearchProductCard({ product, onAddToCart }: {
  product: typeof products[0];
  onAddToCart: () => void;
}) {
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const defaultVariant = product.variants[0];
  const discount = defaultVariant ? Math.round(defaultVariant.discountPercent) : 0;

  return (
    <div className="card overflow-hidden group">
      <Link href={`/product/${product.slug}/`}>
        <div className="relative aspect-square bg-sandstone overflow-hidden">
          <div className="absolute inset-0 img-placeholder flex items-center justify-center text-terracotta/20">
            <div className="w-20 h-20 bg-sandstone/50 rounded-full" />
          </div>
          {discount > 0 && (
            <span className="absolute top-3 left-3 badge badge-amber">
              {discount}% OFF
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-error font-semibold text-xs px-2 py-1 bg-white rounded">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}/`}>
          <p className="text-xs text-text-secondary mb-1">{product.category}</p>
          <h3 className="font-semibold text-charcoal line-clamp-2 mb-1 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
          {product.variants.length > 1 && (
            <p className="text-sm text-text-secondary mb-2">{product.variants.length} variants</p>
          )}
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-terracotta">
            ₹{defaultVariant.sellingPrice.toLocaleString()}
          </span>
          <span className="text-sm text-text-secondary line-through">
            ₹{defaultVariant.mrp.toLocaleString()}
          </span>
          <span className="text-xs text-text-secondary">/ {product.unit}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-sandstone rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
              className="p-2 hover:bg-sandstone transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-sandstone transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => {
              setQuantity(product.minOrderQty);
              onAddToCart();
            }}
            disabled={!product.inStock}
            className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="animate-fade-in">
      <section className="bg-charcoal text-white py-6 lg:py-8">
        <div className="container">
          <div className="h-8 w-48 bg-white/10 rounded mb-4" />
          <div className="h-12 bg-white/10 rounded-xl" />
        </div>
      </section>
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-square bg-sandstone animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-sandstone rounded animate-pulse" />
                  <div className="h-6 w-24 bg-sandstone rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
