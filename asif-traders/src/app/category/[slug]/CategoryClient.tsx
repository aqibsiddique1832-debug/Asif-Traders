'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { categories, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import PriceDisplay from '@/components/PriceDisplay';
import WishlistButton from '@/components/WishlistButton';
import { ChevronRight, Plus, Minus, ShoppingCart, ArrowUpDown, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface CategoryClientProps {
  slug: string;
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-az', label: 'Name: A to Z' },
  { value: 'name-za', label: 'Name: Z to A' },
];

export default function CategoryClient({ slug }: CategoryClientProps) {
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.categorySlug === slug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!category) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-charcoal">Category not found</h1>
        <Link href="/categories" className="btn-primary mt-4 inline-block">View All Categories</Link>
      </div>
    );
  }

  const subcategories = [...new Set(categoryProducts.map(p => p.subcategory))];

  // Filter products
  const filteredProducts = selectedSubcategory
    ? categoryProducts.filter(p => p.subcategory === selectedSubcategory)
    : categoryProducts;

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.variants[0]?.sellingPrice || 0) - (b.variants[0]?.sellingPrice || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.variants[0]?.sellingPrice || 0) - (a.variants[0]?.sellingPrice || 0));
        break;
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        // Featured products first, then by name
        sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Featured';

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal text-white py-8 lg:py-12">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {category.name}
              </h1>
              <p className="text-gray-400 mt-2">{category.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-amber font-semibold">{categoryProducts.length} Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Filter */}
      <section className="bg-sandstone/50 border-b border-sandstone">
        <div className="container">
          <div className="flex items-center gap-4 py-4 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSubcategory === null
                  ? 'bg-terracotta text-white'
                  : 'bg-white text-charcoal hover:bg-sandstone'
              }`}
            >
              All
            </button>
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-terracotta text-white'
                    : 'bg-white text-charcoal hover:bg-sandstone'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sort and Results Bar */}
      <section className="bg-white border-b border-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            {/* Results Count */}
            <p className="text-sm text-text-secondary">
              Showing <span className="font-semibold text-charcoal">{sortedProducts.length}</span>
              {selectedSubcategory && (
                <> of <span className="font-semibold text-charcoal">{filteredProducts.length}</span></>
              )} products
              {selectedSubcategory && (
                <span className="ml-1">in <span className="text-terracotta">{selectedSubcategory}</span></span>
              )}
            </p>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-sandstone/50 hover:bg-sandstone rounded-lg text-sm font-medium text-charcoal transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Sort:</span>
                <span>{currentSortLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-sandstone/50 overflow-hidden z-20 min-w-[180px]">
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-sandstone/50 transition-colors flex items-center justify-between ${
                          sortBy === option.value ? 'text-terracotta font-medium bg-terracotta/5' : 'text-charcoal'
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="w-2 h-2 bg-terracotta rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-sandstone/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-text-secondary" />
              </div>
              <p className="text-text-secondary">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSortBy('featured');
                }}
                className="btn-secondary mt-4"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => {
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

function ProductCard({ product, onAddToCart }: { product: typeof products[0]; onAddToCart: () => void }) {
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const defaultVariant = product.variants[0];

  return (
    <div className="card overflow-hidden group">
      <Link href={`/product/${product.slug}/`}>
        <div className="relative aspect-square bg-white overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 filter drop-shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback placeholder */}
          <div className="absolute inset-0 img-placeholder hidden flex items-center justify-center">
            <div className="w-20 h-20 bg-sandstone/50 rounded-full" />
          </div>
          {defaultVariant.discountPercent > 0 && (
            <span className="absolute top-3 left-3 badge badge-amber">
              {Math.round(defaultVariant.discountPercent)}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-3 left-3 badge badge-terracotta">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>
      </Link>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
          showTooltip={true}
        />
      </div>

      <div className="p-4">
        <Link href={`/product/${product.slug}/`}>
          <h3 className="font-semibold text-charcoal line-clamp-2 mb-1 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
          {product.variants.length > 1 && (
            <p className="text-sm text-text-secondary mb-2">{product.variants.length} variants</p>
          )}
        </Link>

        {/* Standardized Price Display */}
        <div className="mb-3">
          <PriceDisplay
            price={defaultVariant.sellingPrice}
            mrp={defaultVariant.mrp}
            size="lg"
            layout="stacked"
            showDiscount={true}
            showSavings={false}
          />
          {product.variants.length > 1 && (
            <p className="text-xs text-text-secondary mt-1">
              Starting from ₹{Math.min(...product.variants.map(v => v.sellingPrice)).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-sandstone rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
              className="p-2 hover:bg-sandstone transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.minOrderQty, parseInt(e.target.value) || product.minOrderQty))}
              className="w-14 text-center font-mono font-semibold bg-transparent outline-none border-none"
              min={product.minOrderQty}
            />
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
