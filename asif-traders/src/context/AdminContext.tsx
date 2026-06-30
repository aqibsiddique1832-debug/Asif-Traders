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
  customers: Array<{ id: string; name: string; phone: string; email?: string; group: string; address?: string; pincode?: string; createdAt: string; totalOrders?: number; totalSpent?: number; creditBalance?: number }>;
  coupons: Array<{ id: string; code: string; type: 'percentage' | 'flat'; value: number; minOrderValue: number; maxDiscount: number; validFrom: string; validTo: string; usageLimit: number; active: boolean; usedCount: number }>;
  heroSliders: Array<{ id: string; image: string; heading: string; subtext: string; buttonText: string; buttonLink: string; active: boolean; order: number }>;
  orders: Array<{ id: string; customerName: string; customerPhone: string; amount: number; status: string; date: string; createdAt: string; totalAmount: number; items: Array<{ productName: string; variant: string; quantity: number; price: number }>; deliveryAddress: string; deliveryPincode: string }>;
  deliveryBoys: Array<{ id: string; name: string; phone: string; status: string; vehicle?: string; area?: string; active?: boolean; activeOrders?: number }>;
  pincodes: Array<{ id: string; code: string; area: string; city: string; state: string; deliveryCharges: number; deliveryTime: string; active: boolean }>;
  loading: boolean;
  refreshData: () => Promise<void>;
  // Stub functions for admin CRUD operations
  addBrand: (brand: Partial<Brand>) => Promise<{ success: boolean; error?: string }>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<{ success: boolean; error?: string }>;
  deleteBrand: (id: string) => Promise<{ success: boolean; error?: string }>;
  addProduct: (product: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  addCategory: (category: Partial<Category>) => Promise<{ success: boolean; error?: string }>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateQuote: (id: string, quote: Partial<Quote>) => Promise<{ success: boolean; error?: string }>;
  deleteQuote: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<{ success: boolean; error?: string }>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<{ success: boolean; error?: string }>;
  addTestimonial: (testimonial: Partial<Testimonial>) => Promise<{ success: boolean; error?: string }>;
  deleteTestimonial: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (settings: Partial<Setting>) => Promise<{ success: boolean; error?: string }>;
  addPincode: (pincode: Partial<{ id: string; code: string; area: string; city: string; state: string; deliveryCharges: number; deliveryTime: string; active: boolean }>) => Promise<{ success: boolean; error?: string }>;
  updatePincode: (id: string, pincode: Partial<{ code: string; area: string; city: string; state: string; deliveryCharges: number; deliveryTime: string; active: boolean }>) => Promise<{ success: boolean; error?: string }>;
  deletePincode: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateOrder: (id: string, order: Partial<{ status: string; notes: string }>) => Promise<{ success: boolean; error?: string }>;
  addCoupon: (coupon: Partial<{ id: string; code: string; type: 'percentage' | 'flat'; value: number; minOrderValue: number; maxDiscount: number; validFrom: string; validTo: string; usageLimit: number; active: boolean; usedCount: number }>) => Promise<{ success: boolean; error?: string }>;
  updateCoupon: (id: string, coupon: Partial<{ code: string; type: 'percentage' | 'flat'; value: number; minOrderValue: number; maxDiscount: number; validFrom: string; validTo: string; usageLimit: number; active: boolean }>) => Promise<{ success: boolean; error?: string }>;
  deleteCoupon: (id: string) => Promise<{ success: boolean; error?: string }>;
  addHeroSlider: (slider: Partial<{ id: string; image: string; heading: string; subtext: string; buttonText: string; buttonLink: string; active: boolean; order: number }>) => Promise<{ success: boolean; error?: string }>;
  updateHeroSlider: (id: string, slider: Partial<{ image: string; heading: string; subtext: string; buttonText: string; buttonLink: string; active: boolean; order: number }>) => Promise<{ success: boolean; error?: string }>;
  deleteHeroSlider: (id: string) => Promise<{ success: boolean; error?: string }>;
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
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; phone: string; email?: string; group: string; address?: string; pincode?: string; createdAt: string; totalOrders?: number; totalSpent?: number; creditBalance?: number }>>([]);
  const [coupons, setCoupons] = useState<Array<{ id: string; code: string; type: 'percentage' | 'flat'; value: number; minOrderValue: number; maxDiscount: number; validFrom: string; validTo: string; usageLimit: number; active: boolean; usedCount: number }>>([]);
  const [heroSliders, setHeroSliders] = useState<Array<{ id: string; image: string; heading: string; subtext: string; buttonText: string; buttonLink: string; active: boolean; order: number }>>([]);
  const [orders, setOrders] = useState<Array<{ id: string; customerName: string; customerPhone: string; amount: number; status: string; date: string; createdAt: string; totalAmount: number; items: Array<{ productName: string; variant: string; quantity: number; price: number }>; deliveryAddress: string; deliveryPincode: string }>>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<Array<{ id: string; name: string; phone: string; status: string; vehicle?: string; area?: string; active?: boolean; activeOrders?: number }>>([]);
  const [pincodes, setPincodes] = useState<Array<{ id: string; code: string; area: string; city: string; state: string; deliveryCharges: number; deliveryTime: string; active: boolean }>>([]);

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
      if (settingsRes.success) setSettings((settingsRes.data as Setting) || null);
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
      customers,
      coupons,
      heroSliders,
      orders,
      deliveryBoys,
      pincodes,
      loading,
      refreshData,
      // Stub CRUD functions
      addBrand: async () => ({ success: false, error: 'Not implemented' }),
      updateBrand: async () => ({ success: false, error: 'Not implemented' }),
      deleteBrand: async () => ({ success: false, error: 'Not implemented' }),
      addProduct: async () => ({ success: false, error: 'Not implemented' }),
      updateProduct: async () => ({ success: false, error: 'Not implemented' }),
      deleteProduct: async () => ({ success: false, error: 'Not implemented' }),
      addCategory: async () => ({ success: false, error: 'Not implemented' }),
      updateCategory: async () => ({ success: false, error: 'Not implemented' }),
      deleteCategory: async () => ({ success: false, error: 'Not implemented' }),
      updateQuote: async () => ({ success: false, error: 'Not implemented' }),
      deleteQuote: async () => ({ success: false, error: 'Not implemented' }),
      updateContact: async () => ({ success: false, error: 'Not implemented' }),
      updateTestimonial: async () => ({ success: false, error: 'Not implemented' }),
      addTestimonial: async () => ({ success: false, error: 'Not implemented' }),
      deleteTestimonial: async () => ({ success: false, error: 'Not implemented' }),
      updateSettings: async () => ({ success: false, error: 'Not implemented' }),
      addPincode: async () => ({ success: false, error: 'Not implemented' }),
      updatePincode: async () => ({ success: false, error: 'Not implemented' }),
      deletePincode: async () => ({ success: false, error: 'Not implemented' }),
      updateOrder: async () => ({ success: false, error: 'Not implemented' }),
      addCoupon: async () => ({ success: false, error: 'Not implemented' }),
      updateCoupon: async () => ({ success: false, error: 'Not implemented' }),
      deleteCoupon: async () => ({ success: false, error: 'Not implemented' }),
      addHeroSlider: async () => ({ success: false, error: 'Not implemented' }),
      updateHeroSlider: async () => ({ success: false, error: 'Not implemented' }),
      deleteHeroSlider: async () => ({ success: false, error: 'Not implemented' }),
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
