'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, Grid3X3, FileText, ClipboardList, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/categories', icon: Grid3X3, label: 'Categories' },
    { href: '/cart', icon: FileText, label: 'Quote/Cart', badge: cartCount },
    { href: '/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-tab-bar lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors relative ${
                isActive ? 'text-terracotta' : 'text-text-secondary'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-terracotta rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
