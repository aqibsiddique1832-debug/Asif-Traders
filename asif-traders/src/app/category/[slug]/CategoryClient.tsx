'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { categories, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ChevronRight, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CategoryClientProps {
  slug: string;
}

export default function CategoryClient({ slug }: CategoryClientProps) {
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.categorySlug === slug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
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
  const filteredProducts = selectedSubcategory
    ? categoryProducts.filter(p => p.subcategory === selectedSubcategory)
    : categoryProducts;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-charcoal text-white py-8 lg:py-12">
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
            <p className="text-amber font-semibold">{categoryProducts.length} Products</p>
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

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}/`}>
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
