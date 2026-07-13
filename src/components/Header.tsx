'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { categories, products } from '@/data/products';
import { Search, Menu, X, ShoppingCart, User, MapPin, ChevronDown, Phone, TrendingUp, Package, ArrowRight, History, Heart } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount } = useCart();
  const { location, isLocationSet, setShowLocationModal } = useLocation();
  const { user } = useAuth();
  const { getWishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const searchPlaceholders = [
    'Search "TMT Bars 12mm"',
    'Search "OPC 53 Cement"',
    'Search "Vitrified Tiles"',
    'Search "AAC Blocks"',
    'Search "GI Pipes"',
    'Search "MS Angles"',
  ];

  // Search algorithm with fuzzy matching
  const fuzzyMatch = (text: string, query: string): boolean => {
    const t = text.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return false;

    // Exact match
    if (t.includes(q)) return true;

    // Fuzzy match - all query chars must appear in order
    let ti = 0;
    for (let qi = 0; qi < q.length && ti < t.length; qi++) {
      const idx = t.indexOf(q[qi], ti);
      if (idx === -1) return false;
      ti = idx + 1;
    }
    return true;
  };

  // Get search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { categories: [], products: [], suggestions: [] };

    const query = searchQuery.toLowerCase().trim();

    // Match categories
    const matchedCategories = categories.filter(cat =>
      fuzzyMatch(cat.name, query) || fuzzyMatch(cat.slug, query)
    ).slice(0, 3);

    // Match products
    const matchedProducts = products.filter(product =>
      fuzzyMatch(product.name, query) ||
      fuzzyMatch(product.category, query) ||
      fuzzyMatch(product.brand || '', query) ||
      product.variants.some(v => fuzzyMatch(v.size, query))
    ).slice(0, 6);

    // Generate suggestions based on partial matches
    const suggestions: string[] = [];
    if (query.length >= 2) {
      // Add category suggestions
      categories.forEach(cat => {
        if (cat.name.toLowerCase().startsWith(query) && !matchedCategories.includes(cat)) {
          suggestions.push(cat.name);
        }
      });
      // Add brand suggestions
      const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      brands.forEach(brand => {
        if (brand!.toLowerCase().startsWith(query)) {
          suggestions.push(brand!);
        }
      });
    }

    return {
      categories: matchedCategories,
      products: matchedProducts,
      suggestions: suggestions.slice(0, 5),
    };
  };

  const { categories: matchedCategories, products: matchedProducts, suggestions } = getSearchResults();
  const hasResults = matchedCategories.length > 0 || matchedProducts.length > 0 || suggestions.length > 0;

  // Save search to recent
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle result click
  const handleResultClick = (type: 'category' | 'product' | 'suggestion', value: string, slug?: string) => {
    if (type !== 'suggestion') {
      saveSearch(searchQuery);
    }
    setShowResults(false);
    setSearchQuery('');

    if (type === 'category') {
      router.push(`/category/${slug}`);
    } else if (type === 'product') {
      router.push(`/product/${slug}`);
    } else {
      setSearchQuery(value);
      inputRef.current?.focus();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = matchedCategories.length + matchedProducts.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < matchedCategories.length) {
        const cat = matchedCategories[selectedIndex];
        handleResultClick('category', cat.name, cat.slug);
      } else {
        const prod = matchedProducts[selectedIndex - matchedCategories.length];
        handleResultClick('product', prod.name, prod.slug);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {/* Search Bar - Desktop with Autocomplete */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder={searchPlaceholders[searchIndex]}
                  className="w-full pl-10 pr-4 py-2 border-2 border-sandstone rounded-full focus:border-terracotta focus:outline-none transition-colors text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-sandstone rounded-full"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {showResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-sandstone/50 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {/* Categories */}
                  {matchedCategories.length > 0 && (
                    <div className="p-2 border-b border-sandstone/30">
                      <p className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Categories
                      </p>
                      {matchedCategories.map((cat, idx) => (
                        <button
                          key={cat.slug}
                          onClick={() => handleResultClick('category', cat.name, cat.slug)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sandstone/50 transition-colors text-left ${
                            selectedIndex === idx ? 'bg-terracotta/10' : ''
                          }`}
                        >
                          <div className="w-8 h-8 bg-terracotta/10 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-terracotta" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-charcoal">{cat.name}</p>
                            <p className="text-xs text-text-secondary">{cat.productCount}+ products</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-secondary" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {matchedProducts.length > 0 && (
                    <div className="p-2 border-b border-sandstone/30">
                      <p className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Products
                      </p>
                      {matchedProducts.map((product, idx) => {
                        const prodIndex = matchedCategories.length + idx;
                        return (
                          <button
                            key={product.id}
                            onClick={() => handleResultClick('product', product.name, product.slug)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sandstone/50 transition-colors text-left ${
                              selectedIndex === prodIndex ? 'bg-terracotta/10' : ''
                            }`}
                          >
                            <div className="w-10 h-10 bg-sandstone rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-sandstone-dark" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-charcoal truncate">{product.name}</p>
                              <p className="text-xs text-text-secondary">
                                {product.category} • ₹{product.variants[0]?.sellingPrice.toLocaleString()}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && !hasResults && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Suggestions
                      </p>
                      {suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => handleResultClick('suggestion', suggestion)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sandstone/50 transition-colors text-left"
                        >
                          <TrendingUp className="w-4 h-4 text-text-secondary" />
                          <span className="text-charcoal">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* View All Results */}
                  {hasResults && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 bg-terracotta/5 hover:bg-terracotta/10 text-terracotta font-medium text-center transition-colors flex items-center justify-center gap-2"
                    >
                      View all results for "{searchQuery}"
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Recent Searches (when empty) */}
              {showResults && !searchQuery.trim() && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-sandstone/50 overflow-hidden z-50">
                  <div className="p-2">
                    <p className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Recent Searches
                    </p>
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(search);
                          inputRef.current?.focus();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sandstone/50 transition-colors text-left"
                      >
                        <History className="w-4 h-4 text-text-secondary" />
                        <span className="text-charcoal">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-sandstone transition-colors md:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-charcoal" />
              </button>

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

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-lg hover:bg-sandstone transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-terracotta fill-terracotta' : 'text-charcoal'}`} />
                {wishlistCount > 0 && (
                  <span className={`absolute -top-1 ${wishlistCount > 99 ? '-right-2' : '-right-1'} bg-terracotta text-white font-bold rounded-full flex items-center justify-center animate-pulse-custom ${wishlistCount > 99 ? 'w-7 h-5 text-[10px] px-1' : 'w-5 h-5 text-xs'}`}>
                    {wishlistCount > 99 ? '99+' : wishlistCount}
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
            <div ref={searchRef} className="pb-3 md:hidden relative">
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" style={{ top: 'calc(50% + 6px)' }} />
                <input
                  type="text"
                  placeholder={searchPlaceholders[searchIndex]}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-sandstone rounded-full focus:border-terracotta focus:outline-none transition-colors"
                  autoFocus
                />
              </form>

              {/* Mobile Search Results */}
              {showResults && searchQuery.trim() && hasResults && (
                <div className="mt-2 bg-white rounded-xl shadow-lg border border-sandstone/50 overflow-hidden max-h-[300px] overflow-y-auto">
                  {matchedCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleResultClick('category', cat.name, cat.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sandstone/50 transition-colors text-left border-b border-sandstone/30 last:border-0"
                    >
                      <Package className="w-5 h-5 text-terracotta" />
                      <span className="font-medium text-charcoal">{cat.name}</span>
                    </button>
                  ))}
                  {matchedProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick('product', product.name, product.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sandstone/50 transition-colors text-left border-b border-sandstone/30 last:border-0"
                    >
                      <Package className="w-5 h-5 text-text-secondary" />
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        <p className="text-xs text-text-secondary">₹{product.variants[0]?.sellingPrice.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                href="tel:+918879149174"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sandstone transition-colors text-terracotta font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>+91 88791 49174</span>
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
