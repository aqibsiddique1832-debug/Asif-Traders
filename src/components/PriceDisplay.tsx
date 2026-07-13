'use client';

import React from 'react';

interface PriceDisplayProps {
  /** Selling price (current price) */
  price: number;
  /** Maximum Retail Price (original/strikethrough price) */
  mrp?: number;
  /** Quantity for calculating total (optional, for display purposes) */
  quantity?: number;
  /** Whether to show discount percentage badge */
  showDiscount?: boolean;
  /** Whether to show savings amount badge */
  showSavings?: boolean;
  /** Size variant: 'sm' | 'md' | 'lg' | 'xl' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
  /** Layout variant: 'inline' | 'stacked' */
  layout?: 'inline' | 'stacked';
  /** Currency symbol (default ₹) */
  currency?: string;
}

/**
 * Standardized Price Display Component
 * Ensures consistent price formatting across the entire site
 */
export default function PriceDisplay({
  price,
  mrp,
  quantity = 1,
  showDiscount = true,
  showSavings = false,
  size = 'md',
  className = '',
  layout = 'inline',
  currency = '₹',
}: PriceDisplayProps) {
  // Calculate values
  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savings = hasDiscount ? (mrp - price) * quantity : 0;
  const totalPrice = price * quantity;

  // Size classes
  const sizeClasses = {
    sm: {
      price: 'text-sm',
      mrp: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      price: 'text-lg',
      mrp: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      price: 'text-xl lg:text-2xl',
      mrp: 'text-base',
      badge: 'text-sm px-3 py-1.5',
    },
    xl: {
      price: 'text-2xl lg:text-4xl',
      mrp: 'text-lg lg:text-xl',
      badge: 'text-base px-4 py-2',
    },
  };

  const classes = sizeClasses[size];

  // Inline layout (for product cards)
  if (layout === 'inline') {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
        <span className={`font-bold text-terracotta ${classes.price}`}>
          {currency}{totalPrice.toLocaleString()}
        </span>

        {hasDiscount && (
          <>
            <span className={`text-text-secondary line-through ${classes.mrp}`}>
              {currency}{(mrp * quantity).toLocaleString()}
            </span>

            {(showDiscount || showSavings) && (
              <span className={`font-medium text-success ${classes.badge} bg-success/10 rounded-full`}>
                {showDiscount && `${discountPercent}% off`}
                {showDiscount && showSavings && ' • '}
                {showSavings && `Save ${currency}${savings.toLocaleString()}`}
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  // Stacked layout (for order summaries, cart items)
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Current Price (Large) */}
      <div className={`font-bold text-terracotta ${classes.price}`}>
        {currency}{totalPrice.toLocaleString()}
      </div>

      {/* MRP with strikethrough */}
      {hasDiscount && (
        <div className={`flex items-baseline gap-2 text-text-secondary ${classes.mrp}`}>
          <span className="line-through">
            {currency}{(mrp * quantity).toLocaleString()}
          </span>
          <span className="text-success font-medium">
            {discountPercent}% off
          </span>
        </div>
      )}

      {/* Savings Badge */}
      {(showSavings && savings > 0) && (
        <span className={`inline-block font-medium text-success ${classes.badge} bg-success/10 rounded-full`}>
          You save {currency}{savings.toLocaleString()}
        </span>
      )}
    </div>
  );
}

/**
 * Utility function for formatting prices
 */
export function formatPrice(amount: number, currency = '₹'): string {
  return `${currency}${amount.toLocaleString()}`;
}

/**
 * Utility function for calculating discount percentage
 */
export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Compact price display for small spaces (e.g., table cells)
 */
export function CompactPrice({
  price,
  mrp,
  className = ''
}: {
  price: number;
  mrp?: number;
  className?: string;
}) {
  const hasDiscount = mrp && mrp > price;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-bold text-terracotta">
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-xs text-text-secondary line-through">
          {formatPrice(mrp)}
        </span>
      )}
    </div>
  );
}

/**
 * Price range display (e.g., "₹500 - ₹2,000")
 */
export function PriceRange({
  minPrice,
  maxPrice,
  currency = '₹',
  className = ''
}: {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  className?: string;
}) {
  if (minPrice === maxPrice) {
    return <span className={`font-bold text-terracotta ${className}`}>{formatPrice(minPrice, currency)}</span>;
  }

  return (
    <span className={`font-bold text-terracotta ${className}`}>
      {formatPrice(minPrice, currency)} - {formatPrice(maxPrice, currency)}
    </span>
  );
}
