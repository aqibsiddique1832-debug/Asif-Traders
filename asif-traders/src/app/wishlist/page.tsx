'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import PriceDisplay from '@/components/PriceDisplay';
import WishlistButton from '@/components/WishlistButton';
import { Heart, ShoppingCart, ArrowRight, Trash2, ChevronLeft, Package } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeFromWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const wishlistProducts = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { product, addedAt: item.addedAt } : null;
    })
    .filter(Boolean) as { product: typeof products[0]; addedAt: Date }[];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product.id, product.variants[0].size, product.minOrderQty);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleRemoveAll = () => {
    if (confirm('Are you sure you want to remove all items from your wishlist?')) {
      items.forEach(item => removeFromWishlist(item.productId));
      showToast('Wishlist cleared', 'info');
    }
  };

  if (getWishlistCount() === 0) {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <section className="bg-gradient-to-br from-charcoal via-steel-blue to-charcoal text-white py-16 lg:py-24">
          <div className="container">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-28 h-28 bg-gradient-to-br from-terracotta/20 to-amber/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-terracotta/30">
                <Heart className="w-14 h-14 text-terracotta" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                Save items you like by clicking the heart icon. Your wishlist helps you track products you want to buy later.
              </p>
              <Link href="/categories" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="section bg-sandstone/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              How to Use Your Wishlist
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: 'Save Products', desc: 'Click the heart icon on any product to add it to your wishlist' },
                { icon: Package, title: 'Track Items', desc: 'Monitor prices and availability of saved products' },
                { icon: ShoppingCart, title: 'Easy Purchase', desc: 'Quickly add wishlist items to cart when ready to buy' },
              ].map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tip.icon className="w-7 h-7 text-terracotta" />
                  </div>
                  <h3 className="font-bold text-charcoal mb-2">{tip.title}</h3>
                  <p className="text-text-secondary text-sm">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-charcoal via-steel-blue to-charcoal text-white py-8 lg:py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-terracotta/20 rounded-xl flex items-center justify-center border border-terracotta/30">
              <Heart className="w-7 h-7 text-terracotta fill-current" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                My Wishlist
              </h1>
              <p className="text-gray-400 mt-1">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/categories"
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Continue Shopping
            </Link>
            <button
              onClick={handleRemoveAll}
              className="text-error/70 hover:text-error transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </button>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map(({ product, addedAt }) => (
              <div
                key={product.id}
                className="card overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Link href={`/product/${product.slug}/`}>
                    <div className="relative aspect-square bg-white overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 filter drop-shadow-lg transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Fallback */}
                      <div className="absolute inset-0 img-placeholder hidden flex items-center justify-center">
                        <Package className="w-12 h-12 text-sandstone" />
                      </div>
                      {product.variants[0].discountPercent > 0 && (
                        <span className="absolute top-3 left-3 badge badge-amber">
                          {Math.round(product.variants[0].discountPercent)}% OFF
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="absolute top-3 right-3 badge badge-terracotta">
                          Featured
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist Button */}
                  <div className="absolute top-3 right-3">
                    <WishlistButton
                      productId={product.id}
                      productName={product.name}
                      size="sm"
                      showTooltip={false}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.slug}/`}>
                    <p className="text-xs text-terracotta font-medium mb-1">{product.category}</p>
                    <h3 className="font-semibold text-charcoal line-clamp-2 mb-2 hover:text-terracotta transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mb-4">
                    <PriceDisplay
                      price={product.variants[0].sellingPrice}
                      mrp={product.variants[0].mrp}
                      size="md"
                      layout="inline"
                      showDiscount={true}
                      showSavings={false}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-text-secondary mt-3 text-center">
                    Added {addedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
