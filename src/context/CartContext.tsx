'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi, tokenStore } from '@/lib/backendApi';

interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, variant: string, quantity: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, variant?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = localStorage.getItem('asif_cart');
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch (e) {
      console.error('Failed to parse cart:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('asif_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // If user is authenticated, sync cart from server on mount + on auth change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refresh = async () => {
      if (!tokenStore.getToken()) return;
      try {
        const data: any = await cartApi.get();
        if (data && data.cart && Array.isArray(data.cart.items)) {
          const serverItems: CartItem[] = data.cart.items
            .map((it: any) => ({
              productId: it.productId,
              variant: it.variant || '',
              quantity: it.quantity || 1,
            }))
            .filter((it: CartItem) => !!it.productId);
          // Merge with local items (union by productId+variant)
          setItems((prev) => {
            const map = new Map<string, CartItem>();
            for (const i of prev) map.set(`${i.productId}::${i.variant}`, i);
            for (const i of serverItems) map.set(`${i.productId}::${i.variant}`, i);
            return Array.from(map.values());
          });
        }
      } catch (e) {
        // ignore — server may be cold
      }
    };
    refresh();
    const onAuth = () => refresh();
    window.addEventListener('storage', onAuth);
    return () => window.removeEventListener('storage', onAuth);
  }, []);

  // Sync changes to server if authenticated (debounced)
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    if (!tokenStore.getToken()) return;
    const t = setTimeout(async () => {
      try {
        // Re-add each item to server (server merges)
        for (const it of items) {
          await cartApi.addItem(it.productId, it.quantity);
        }
      } catch (e) {
        // ignore
      }
    }, 600);
    return () => clearTimeout(t);
  }, [items, isLoaded]);

  const addToCart = (productId: string, variant: string, quantity: number) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === productId && item.variant === variant
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { productId, variant, quantity }];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setItems(prev => prev.filter(
      item => !(item.productId === productId && item.variant === variant)
    ));
  };

  const updateQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variant === variant) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string, variant?: string) => {
    return items.some(item => {
      if (variant) {
        return item.productId === productId && item.variant === variant;
      }
      return item.productId === productId;
    });
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
