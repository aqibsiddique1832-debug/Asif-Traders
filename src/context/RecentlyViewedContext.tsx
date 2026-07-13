'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RECENTLY_VIEWED_KEY = 'asif_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

interface RecentlyViewedItem {
  productId: string;
  viewedAt: Date;
}

interface RecentlyViewedContextType {
  items: RecentlyViewedItem[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  getRecentlyViewedProducts: () => RecentlyViewedItem[];
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.map((item: { productId: string; viewedAt: string }) => ({
          ...item,
          viewedAt: new Date(item.viewedAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save recently viewed:', error);
      }
    }
  }, [items, isLoaded]);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setItems(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.productId !== productId);
      // Add to beginning
      const updated = [
        { productId, viewedAt: new Date() },
        ...filtered,
      ].slice(0, MAX_RECENTLY_VIEWED);
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setItems([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  }, []);

  const getRecentlyViewedProducts = useCallback(() => {
    // Return items sorted by most recent first
    return [...items].sort((a, b) =>
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
  }, [items]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        addToRecentlyViewed,
        clearRecentlyViewed,
        getRecentlyViewedProducts,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
