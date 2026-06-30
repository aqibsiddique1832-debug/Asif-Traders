'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AdminUser, Product, Category, Brand, Quote, Contact, Testimonial, Setting } from '@/data/adminData';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  settings: Setting | null;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  quotes: Quote[];
  contacts: Contact[];
  testimonials: Testimonial[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [settings, setSettings] = useState<Setting | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('adminAccessToken');
      const storedRefreshToken = localStorage.getItem('adminRefreshToken');
      const storedUser = localStorage.getItem('adminUser');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const result = await api.getMe(storedToken);
          if (result.success && result.data) {
            setAccessToken(storedToken);
            setAdminUser(result.data as unknown as AdminUser);
            setIsAuthenticated(true);
            localStorage.setItem('adminRefreshToken', storedRefreshToken || '');
          } else {
            // Try to refresh token
            if (storedRefreshToken) {
              const refreshResult = await api.refreshToken(storedRefreshToken);
              if (refreshResult.success && refreshResult.data) {
                setAccessToken(refreshResult.data.accessToken);
                localStorage.setItem('adminAccessToken', refreshResult.data.accessToken);
                localStorage.setItem('adminRefreshToken', refreshResult.data.refreshToken);
                const meResult = await api.getMe(refreshResult.data.accessToken);
                if (meResult.success && meResult.data) {
                  setAdminUser(meResult.data as unknown as AdminUser);
                  setIsAuthenticated(true);
                }
              } else {
                clearAuth();
              }
            } else {
              clearAuth();
            }
          }
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    setAccessToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await api.login(email, password);

      if (result.success && result.data) {
        setAccessToken(result.data.accessToken);
        setAdminUser(result.data.admin as unknown as AdminUser);
        setIsAuthenticated(true);

        localStorage.setItem('adminAccessToken', result.data.accessToken);
        localStorage.setItem('adminRefreshToken', result.data.refreshToken);
        localStorage.setItem('adminUser', JSON.stringify(result.data.admin));

        return { success: true };
      }

      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    router.push('/admin-login');
  }, [router]);

  const refreshData = useCallback(async () => {
    if (!accessToken) return;

    try {
      const [categoriesRes, brandsRes, productsRes, quotesRes, contactsRes, testimonialsRes, settingsRes] = await Promise.all([
        api.getCategories(),
        api.getBrands(),
        api.getProducts(),
        api.getQuotes(accessToken),
        api.getContacts(accessToken),
        api.getTestimonialsAdmin(accessToken),
        api.getSettings(),
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data || []);
      if (brandsRes.success) setBrands(brandsRes.data || []);
      if (productsRes.success) setProducts(productsRes.data || []);
      if (quotesRes.success) setQuotes(quotesRes.data || []);
      if (contactsRes.success) setContacts(contactsRes.data || []);
      if (testimonialsRes.success) setTestimonials(testimonialsRes.data || []);
      if (settingsRes.success) setSettings(settingsRes.data || null);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [accessToken]);

  // Refresh data when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshData();
    }
  }, [isAuthenticated, accessToken, refreshData]);

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      adminUser,
      accessToken,
      login,
      logout,
      settings,
      products,
      categories,
      brands,
      quotes,
      contacts,
      testimonials,
      loading,
      refreshData,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
