'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { ToastProvider } from '@/context/ToastContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
