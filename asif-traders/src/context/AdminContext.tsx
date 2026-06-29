'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, initialAdminUsers, WebsiteSettings, initialWebsiteSettings, Product, initialProducts, Category, initialCategories, Brand, initialBrands, Order, initialOrders, Customer, initialCustomers, Quote, initialQuotes, Pincode, initialPincodes, DeliveryBoy, initialDeliveryBoys, Coupon, initialCoupons, HeroSlider } from '@/data/adminData';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  settings: WebsiteSettings;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  brands: Brand[];
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  orders: Order[];
  updateOrder: (id: string, order: Partial<Order>) => void;
  customers: Customer[];
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  quotes: Quote[];
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  pincodes: Pincode[];
  addPincode: (pincode: Pincode) => void;
  updatePincode: (id: string, pincode: Partial<Pincode>) => void;
  deletePincode: (id: string) => void;
  deliveryBoys: DeliveryBoy[];
  addDeliveryBoy: (boy: DeliveryBoy) => void;
  updateDeliveryBoy: (id: string, boy: Partial<DeliveryBoy>) => void;
  deleteDeliveryBoy: (id: string) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  heroSliders: HeroSlider[];
  updateHeroSlider: (id: string, slider: Partial<HeroSlider>) => void;
  addHeroSlider: (slider: HeroSlider) => void;
  deleteHeroSlider: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [pincodes, setPincodes] = useState<Pincode[]>(initialPincodes);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>(initialDeliveryBoys);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [heroSliders, setHeroSliders] = useState<HeroSlider[]>(initialWebsiteSettings.heroSliders);

  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    const storedTime = localStorage.getItem('adminAuthTime');

    if (storedAuth && storedTime) {
      const elapsed = Date.now() - parseInt(storedTime);
      if (elapsed < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        setAdminUser(JSON.parse(storedAuth));
      } else {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
      }
    }

    const storedSettings = localStorage.getItem('adminSettings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
      setHeroSliders(parsed.heroSliders || initialWebsiteSettings.heroSliders);
    }
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    const storedCategories = localStorage.getItem('adminCategories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    const storedBrands = localStorage.getItem('adminBrands');
    if (storedBrands) setBrands(JSON.parse(storedBrands));
    const storedOrders = localStorage.getItem('adminOrders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    const storedCustomers = localStorage.getItem('adminCustomers');
    if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
    const storedQuotes = localStorage.getItem('adminQuotes');
    if (storedQuotes) setQuotes(JSON.parse(storedQuotes));
    const storedPincodes = localStorage.getItem('adminPincodes');
    if (storedPincodes) setPincodes(JSON.parse(storedPincodes));
    const storedDeliveryBoys = localStorage.getItem('adminDeliveryBoys');
    if (storedDeliveryBoys) setDeliveryBoys(JSON.parse(storedDeliveryBoys));
    const storedCoupons = localStorage.getItem('adminCoupons');
    if (storedCoupons) setCoupons(JSON.parse(storedCoupons));
  }, []);

  useEffect(() => {
    localStorage.setItem('adminSettings', JSON.stringify({ ...settings, heroSliders }));
  }, [settings, heroSliders]);

  useEffect(() => { localStorage.setItem('adminProducts', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('adminCategories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('adminBrands', JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem('adminOrders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('adminCustomers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('adminQuotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('adminPincodes', JSON.stringify(pincodes)); }, [pincodes]);
  useEffect(() => { localStorage.setItem('adminDeliveryBoys', JSON.stringify(deliveryBoys)); }, [deliveryBoys]);
  useEffect(() => { localStorage.setItem('adminCoupons', JSON.stringify(coupons)); }, [coupons]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = initialAdminUsers.find(u => u.email === email && u.password === password && u.active);
    if (user) {
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('adminAuth', JSON.stringify(user));
      localStorage.setItem('adminAuthTime', Date.now().toString());
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    router.push('/admin-login');
  }, [router]);

  const updateSettings = useCallback((newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addProduct = useCallback((product: Product) => { setProducts(prev => [...prev, product]); }, []);
  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  }, []);
  const deleteProduct = useCallback((id: string) => { setProducts(prev => prev.filter(p => p.id !== id)); }, []);

  const addCategory = useCallback((category: Category) => { setCategories(prev => [...prev, category]); }, []);
  const updateCategory = useCallback((id: string, category: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
  }, []);
  const deleteCategory = useCallback((id: string) => { setCategories(prev => prev.filter(c => c.id !== id)); }, []);

  const addBrand = useCallback((brand: Brand) => { setBrands(prev => [...prev, brand]); }, []);
  const updateBrand = useCallback((id: string, brand: Partial<Brand>) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...brand } : b));
  }, []);
  const deleteBrand = useCallback((id: string) => { setBrands(prev => prev.filter(b => b.id !== id)); }, []);

  const updateOrder = useCallback((id: string, order: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...order, updatedAt: new Date().toISOString() } : o));
  }, []);

  const updateCustomer = useCallback((id: string, customer: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  }, []);

  const updateQuote = useCallback((id: string, quote: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...quote, updatedAt: new Date().toISOString() } : q));
  }, []);
  const deleteQuote = useCallback((id: string) => { setQuotes(prev => prev.filter(q => q.id !== id)); }, []);

  const addPincode = useCallback((pincode: Pincode) => { setPincodes(prev => [...prev, pincode]); }, []);
  const updatePincode = useCallback((id: string, pincode: Partial<Pincode>) => {
    setPincodes(prev => prev.map(p => p.id === id ? { ...p, ...pincode } : p));
  }, []);
  const deletePincode = useCallback((id: string) => { setPincodes(prev => prev.filter(p => p.id !== id)); }, []);

  const addDeliveryBoy = useCallback((boy: DeliveryBoy) => { setDeliveryBoys(prev => [...prev, boy]); }, []);
  const updateDeliveryBoy = useCallback((id: string, boy: Partial<DeliveryBoy>) => {
    setDeliveryBoys(prev => prev.map(b => b.id === id ? { ...b, ...boy } : b));
  }, []);
  const deleteDeliveryBoy = useCallback((id: string) => { setDeliveryBoys(prev => prev.filter(b => b.id !== id)); }, []);

  const addCoupon = useCallback((coupon: Coupon) => { setCoupons(prev => [...prev, coupon]); }, []);
  const updateCoupon = useCallback((id: string, coupon: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...coupon } : c));
  }, []);
  const deleteCoupon = useCallback((id: string) => { setCoupons(prev => prev.filter(c => c.id !== id)); }, []);

  const updateHeroSlider = useCallback((id: string, slider: Partial<HeroSlider>) => {
    setHeroSliders(prev => prev.map(s => s.id === id ? { ...s, ...slider } : s));
    setSettings(prev => ({ ...prev, heroSliders: prev.heroSliders.map(s => s.id === id ? { ...s, ...slider } : s) }));
  }, []);

  const addHeroSlider = useCallback((slider: HeroSlider) => {
    setHeroSliders(prev => [...prev, slider]);
    setSettings(prev => ({ ...prev, heroSliders: [...prev.heroSliders, slider] }));
  }, []);

  const deleteHeroSlider = useCallback((id: string) => {
    setHeroSliders(prev => prev.filter(s => s.id !== id));
    setSettings(prev => ({ ...prev, heroSliders: prev.heroSliders.filter(s => s.id !== id) }));
  }, []);

  return (
    <AdminContext.Provider value={{
      isAuthenticated, adminUser, login, logout, settings, updateSettings,
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      brands, addBrand, updateBrand, deleteBrand,
      orders, updateOrder, customers, updateCustomer,
      quotes, updateQuote, deleteQuote,
      pincodes, addPincode, updatePincode, deletePincode,
      deliveryBoys, addDeliveryBoy, updateDeliveryBoy, deleteDeliveryBoy,
      coupons, addCoupon, updateCoupon, deleteCoupon,
      heroSliders, updateHeroSlider, addHeroSlider, deleteHeroSlider,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) { throw new Error('useAdmin must be used within an AdminProvider'); }
  return context;
}
