'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/products';
import { Search, Menu, X, ShoppingCart, User, MapPin, ChevronDown, Phone } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { location, isLocationSet, setShowLocationModal } = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const cartCount = getCartCount();

  const searchPlaceholders = [
    'Search "TMT Bars 12mm"',
    'Search "OPC 53 Cement"',
    'Search "Vitrified Tiles"',
    'Search "AAC Blocks"',
    'Search "GI Pipes"',
    'Search "MS Angles"',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchIndex(prev => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Main Header */}
        <div className="container">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-sandstone transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-charcoal" />
            </button>

            {/* Premium Logo - New AT Design */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                {/* Orange circle background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-full shadow-lg"></div>
                {/* Overlapping arcs SVG */}
                <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
                  {/* Dark Charcoal arc on top */}
                  <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  {/* Forest Green arc on bottom */}
                  <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  {/* AT text in white */}
                  <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="'Barlow Condensed', sans-serif">AT</text>
                </svg>
              </div>
              <div>
                <span className="text-lg lg:text-xl font-bold text-charcoal tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  ASIF TRADERS
                </span>
                <p className="text-[10px] lg:text-xs text-text-secondary -mt-0.5 hidden sm:block">
                  Building Materials Supplier
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5">
              <Link
                href="/"
                className={`font-medium transition-colors ${pathname === '/' ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'}`}
              >
                Home
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 font-medium text-charcoal hover:text-terracotta transition-colors">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-xl p-4 min-w-[240px]">
                    {categories.map(cat => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 rounded-lg hover:bg-sandstone transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/orders"
                className={`font-medium transition-colors ${pathname === '/orders' ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'}`}
              >
                My Orders
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${pathname === '/about' ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'}`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`font-medium transition-colors ${pathname === '/contact' ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'}`}
              >
                Contact
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form action="/search" method="get" className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  name="q"
                  placeholder={searchPlaceholders[searchIndex]}
                  defaultValue={searchQuery}
                  className="w-full pl-10 pr-4 py-2 border-2 border-sandstone rounded-full focus:border-terracotta focus:outline-none transition-colors text-sm"
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Mobile Search */}
              <Link
                href="/search"
                className="p-2 rounded-lg hover:bg-sandstone transition-colors md:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-charcoal" />
              </Link>

              {/* Offers Badge */}
              <Link
                href="/quote"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber/20 text-amber-dark rounded-full text-xs font-semibold"
              >
                <span>Get Best Price</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-sandstone transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-charcoal" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 ${cartCount > 99 ? '-right-2' : '-right-1'} bg-terracotta text-white font-bold rounded-full flex items-center justify-center animate-pulse-custom ${cartCount > 99 ? 'w-7 h-5 text-[10px] px-1' : 'w-5 h-5 text-xs'}`}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                href={user ? '/profile' : '/login'}
                className="p-2 rounded-lg hover:bg-sandstone transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-charcoal" />
              </Link>
            </div>
          </div>

          {/* Mobile Search Expanded */}
          {isSearchOpen && (
            <div className="pb-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder={searchPlaceholders[searchIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-sandstone rounded-full focus:border-terracotta focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Location Bar */}
        <div className="bg-sandstone/50 border-t border-sandstone">
          <div className="container">
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 py-1.5 lg:py-2 text-xs lg:text-sm hover:text-terracotta transition-colors w-full"
            >
              <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              {isLocationSet && location ? (
                <>
                  <span>Delivering to: <strong>{location.area}, {location.city}</strong></span>
                  <span className="text-text-secondary">({location.pincode})</span>
                  <span className="hidden sm:inline text-success flex items-center gap-1 ml-2">
                    <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                    Delivery in {location.deliveryDays}
                  </span>
                </>
              ) : (
                <span className="text-terracotta font-medium">📍 Select delivery location</span>
              )}
              <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 ml-auto" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-slide-in-right lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-sandstone flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  {/* Orange circle background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-full shadow-lg"></div>
                  {/* Overlapping arcs SVG */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
                    <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="'Barlow Condensed', sans-serif">AT</text>
                  </svg>
                </div>
                <span className="text-lg font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  ASIF TRADERS
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-sandstone transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
              >
                <span className="text-base">Home</span>
              </Link>

              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Categories</h3>
                <div className="space-y-0.5">
                  {categories.map(cat => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sandstone transition-colors text-sm"
                    >
                      {cat.name}
                      <span className="ml-auto text-xs text-text-secondary">{cat.productCount}+</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-sandstone my-3" />

              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
              >
                <span className="text-base">My Orders</span>
              </Link>
              <Link
                href="/quote"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
              >
                <span className="text-base">Request Quote</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
              >
                <span className="text-base">About Us</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
              >
                <span className="text-base">Contact</span>
              </Link>

              <div className="border-t border-sandstone my-3" />

              <a
                href="tel:+917977572727"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors text-terracotta font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>+91 79775 72727</span>
              </a>

              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
                >
                  <span className="text-base">My Profile</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors"
                >
                  <span className="text-base">Login / Sign Up</span>
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
