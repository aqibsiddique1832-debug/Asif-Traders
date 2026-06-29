'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  LayoutDashboard, Package, Tag, Building2, ShoppingCart, Users, MessageSquare,
  MapPin, DollarSign, Truck, BarChart3, Settings, Bell, UserCog, LogOut,
  Menu, X, ChevronDown, ChevronRight, PackagePlus, FileText, Eye, Edit, Trash2
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin-dashboard' },
  {
    icon: Package, label: 'Products', href: '/admin/products', submenu: [
      { label: 'All Products', href: '/admin/products' },
      { label: 'Add Product', href: '/admin/products/add' },
    ]
  },
  {
    icon: Tag, label: 'Categories', href: '/admin/categories', submenu: [
      { label: 'All Categories', href: '/admin/categories' },
      { label: 'Add Category', href: '/admin/categories/add' },
    ]
  },
  {
    icon: Building2, label: 'Brands', href: '/admin/brands', submenu: [
      { label: 'All Brands', href: '/admin/brands' },
      { label: 'Add Brand', href: '/admin/brands/add' },
    ]
  },
  {
    icon: ShoppingCart, label: 'Orders', href: '/admin/orders', submenu: [
      { label: 'New Orders', href: '/admin/orders?status=new' },
      { label: 'Confirmed', href: '/admin/orders?status=confirmed' },
      { label: 'Out for Delivery', href: '/admin/orders?status=out_for_delivery' },
      { label: 'Delivered', href: '/admin/orders?status=delivered' },
      { label: 'Cancelled', href: '/admin/orders?status=cancelled' },
    ]
  },
  {
    icon: Users, label: 'Customers', href: '/admin/customers', submenu: [
      { label: 'All Customers', href: '/admin/customers' },
    ]
  },
  {
    icon: MessageSquare, label: 'Quotes', href: '/admin/quotes', submenu: [
      { label: 'All Quotes', href: '/admin/quotes' },
      { label: 'Pending', href: '/admin/quotes?status=pending' },
      { label: 'Followed Up', href: '/admin/quotes?status=followed_up' },
    ]
  },
  {
    icon: MapPin, label: 'Locations', href: '/admin/locations', submenu: [
      { label: 'Delivery Pincodes', href: '/admin/locations' },
    ]
  },
  {
    icon: DollarSign, label: 'Pricing', href: '/admin/pricing', submenu: [
      { label: 'Coupons', href: '/admin/pricing' },
      { label: "Todays Best Prices", href: '/admin/pricing/best-prices' },
    ]
  },
  {
    icon: Truck, label: 'Delivery', href: '/admin/delivery', submenu: [
      { label: 'Delivery Boys', href: '/admin/delivery' },
      { label: 'Assign Orders', href: '/admin/delivery/assign' },
    ]
  },
  {
    icon: BarChart3, label: 'Reports', href: '/admin/reports', submenu: [
      { label: 'Sales Report', href: '/admin/reports/sales' },
      { label: 'Product Report', href: '/admin/reports/products' },
      { label: 'Export Data', href: '/admin/reports/export' },
    ]
  },
  {
    icon: Settings, label: 'Website Settings', href: '/admin/settings', submenu: [
      { label: 'Logo & Favicon', href: '/admin/settings' },
      { label: 'Hero Slider', href: '/admin/settings/slider' },
      { label: 'Contact Info', href: '/admin/settings/contact' },
      { label: 'SEO', href: '/admin/settings/seo' },
      { label: 'Payment', href: '/admin/settings/payment' },
    ]
  },
  {
    icon: Bell, label: 'Notifications', href: '/admin/notifications', submenu: [
      { label: 'Templates', href: '/admin/notifications' },
      { label: 'Send Notification', href: '/admin/notifications/send' },
    ]
  },
  {
    icon: UserCog, label: 'Admin Users', href: '/admin/users', submenu: [
      { label: 'All Users', href: '/admin/users' },
      { label: 'Add User', href: '/admin/users/add' },
      { label: 'Activity Logs', href: '/admin/users/logs' },
    ]
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, adminUser, logout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !pathname?.startsWith('/admin-login')) {
      router.push('/admin-login');
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    // Auto-expand current section
    const currentSection = menuItems.find(item =>
      pathname?.startsWith(item.href) && item.submenu
    );
    if (currentSection) {
      setExpandedMenus(prev => [...prev, currentSection.href]);
    }
  }, [pathname]);

  const toggleMenu = (href: string) => {
    setExpandedMenus(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/admin-dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-6 h-6">
                  <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none"/>
                  <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none"/>
                  <text x="24" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AT</text>
                </svg>
              </div>
              <span className="font-bold text-[#2C3E50] hidden sm:block" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                ASIF TRADERS Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-[#E85D04]">
              View Website
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-[#E85D04] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{adminUser?.name?.charAt(0) || 'A'}</span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{adminUser?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{adminUser?.name}</p>
                    <p className="text-sm text-gray-500">{adminUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#E85D04]/10 text-[#E85D04] text-xs rounded-full capitalize">
                      {adminUser?.role?.replace('_', ' ')}
                    </span>
                  </div>
                  <Link href="/admin/users/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <UserCog className="w-4 h-4" /> Profile Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="h-full overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.href)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href) ? 'text-[#E85D04] bg-[#E85D04]/5' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </div>
                    {expandedMenus.includes(item.href) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus.includes(item.href) && (
                    <div className="bg-gray-50">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block pl-14 pr-4 py-2 text-sm transition-colors ${
                            pathname === sub.href ? 'text-[#E85D04] font-medium' : 'text-gray-600 hover:text-[#E85D04]'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href) ? 'text-[#E85D04] bg-[#E85D04]/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
