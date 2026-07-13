'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistItem {
  productId: string;
  addedAt: Date;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'asif-traders-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save wishlist:', error);
      }
    }
  }, [items, isLoaded]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some(item => item.productId === productId);
  }, [items]);

  const addToWishlist = useCallback((productId: string) => {
    setItems(prev => {
      if (prev.some(item => item.productId === productId)) {
        return prev;
      }
      return [...prev, { productId, addedAt: new Date() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const getWishlistCount = useCallback((): number => {
    return items.length;
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{
      items,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      getWishlistCount,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
