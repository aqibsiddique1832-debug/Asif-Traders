'use client';

import React, { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export default function WishlistButton({
  productId,
  productName,
  size = 'md',
  className = '',
  showTooltip = true
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(productId);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (!inWishlist) {
      showToast(productName ? `${productName} added to wishlist` : 'Added to wishlist', 'success');
    } else {
      showToast(productName ? `${productName} removed from wishlist` : 'Removed from wishlist', 'info');
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        transition-all duration-200 group relative
        ${inWishlist
          ? 'bg-terracotta text-white shadow-lg shadow-terracotta/30'
          : 'bg-white/90 text-text-secondary hover:text-terracotta hover:bg-white border border-sandstone hover:border-terracotta/30'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
        ${className}
      `}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${inWishlist ? 'fill-current' : 'fill-transparent group-hover:fill-current'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
      />

      {/* Tooltip */}
      {showTooltip && (
        <span className={`
          absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-white text-xs rounded whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
          ${inWishlist ? 'bg-error' : ''}
        `}>
          {inWishlist ? 'Remove' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
