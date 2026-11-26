'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/config/catalog';
import { money } from '@/lib/order';
import BrandLogo from '@/components/BrandLogo';
import SmartImage from '@/components/SmartImage';
import { useStore } from '@/components/StoreProvider';

const DIRECT_LINKS = [
  { href: '/brands/', label: 'Brands' },
  { href: '/compare/', label: 'Compare' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];

const QUICK_SEARCH_TERMS = ['850 Turbo', 'Trail 900', 'Touring', 'WideTrack', 'Carbon Helmet'];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, openCart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement | null;
        if (!target?.closest('[data-search-toggle="true"]')) {
          setSearchOpen(false);
        }
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShopOpen(false);
        setMobileOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        setShopOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const id = window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [searchOpen]);

  const liveMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      const hay = [
        p.name,
        p.brand,
        p.categoryName,
        p.subcategory,
        p.shortDescription,
        p.sku,
        ...Object.values(p.specs),
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [searchQuery]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const shopActive = pathname?.startsWith('/shop');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    if (q) {
      router.push(`/search/?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search/');
    }
  }

  function runQuickSearch(term: string) {
    setSearchQuery(term);
    searchInputRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E4E6E8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Crest + Wordmark */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6B3E] rounded shrink-0"
        >
          <BrandLogo tone="dark" size="md" />
        </Link>

        {/* Zone 2: 5 clean single-line navigation links (Shop dropdown + Brands + Compare + Blog + Contact) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#47505B]"
        >
          {/* Shop Dropdown with All Categories & Subcategories */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <div
              className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                shopActive || shopOpen
                  ? 'text-[#111418] border-[#9A6B3E]'
                  : 'border-transparent hover:text-[#111418] hover:border-[#C5CDD4]'
              }`}
            >
              <Link href="/shop/" onClick={() => setShopOpen(false)} className="cursor-pointer">
                Shop
              </Link>
              <button
                type="button"
                onClick={() => setShopOpen((v) => !v)}
                aria-expanded={shopOpen}
                aria-haspopup="menu"
                aria-label="Toggle shop categories menu"
                className="cursor-pointer"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    shopOpen ? 'rotate-180 text-[#9A6B3E]' : ''
                  }`}
                />
              </button>
            </div>

            {shopOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full pt-2 w-[680px] max-w-[92vw] z-50"
              >
                <div className="bg-white border border-[#E4E6E8] rounded-lg shadow-xl p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ECEEF0]">
                    <div>
                      <p className="font-serif text-base font-semibold text-[#111418]">
                        Shop Snowmobiles &amp; Alpine Equipment
                      </p>
                      <p className="text-xs text-[#646D78]">
                        Browse by riding discipline and subcategory
                      </p>
                    </div>
                    <Link
                      href="/shop/"
                      onClick={() => setShopOpen(false)}
                      className="text-xs font-medium text-[#835931] hover:text-[#111418] underline whitespace-nowrap"
                    >
                      View All Inventory &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.slug} className="space-y-2">
                        <Link
                          href={`/shop/${cat.slug}/`}
                          onClick={() => setShopOpen(false)}
                          className="block text-sm font-semibold text-[#111418] hover:text-[#9A6B3E] transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <ul className="space-y-1.5 pl-0">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={`/shop/${cat.slug}/?sub=${encodeURIComponent(sub.slug)}`}
                                onClick={() => setShopOpen(false)}
                                className="block text-xs text-[#5C636E] hover:text-[#111418] transition-colors py-0.5"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {DIRECT_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href.replace(/\/$/, ''));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  active
                    ? 'text-[#111418] border-[#9A6B3E]'
                    : 'border-transparent hover:text-[#111418] hover:border-[#C5CDD4]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Search icon trigger + Shopping Bag CTA + mobile menu toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-search-toggle="true"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setShopOpen(false);
              setMobileOpen(false);
            }}
            aria-label={searchOpen ? 'Close inventory search' : 'Search inventory'}
            aria-expanded={searchOpen}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-md border transition-colors cursor-pointer shrink-0 ${
              searchOpen
                ? 'border-[#9A6B3E] bg-[#FAF6F1] text-[#9A6B3E]'
                : 'border-[#E4E6E8] bg-white text-[#111418] hover:border-[#9A6B3E] hover:text-[#9A6B3E]'
            }`}
          >
            {searchOpen ? (
              <X className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <Search className="w-4 h-4" strokeWidth={1.75} />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              openCart();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            aria-label={`Open shopping bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setSearchOpen(false);
            }}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#E4E6E8] text-[#111418] hover:bg-[#F7F7F5] cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Live Instant Search Bar Dropdown */}
      {searchOpen && (
        <div
          ref={searchBarRef}
          className="border-t border-[#E4E6E8] bg-white shadow-xl"
          role="search"
          aria-label="Search SledHaven inventory"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#646D78] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search snowmobiles by model, engine, brand, SKU, or gear (e.g. 850 Turbo, WideTrack, Helmet)..."
                  className="w-full pl-10 pr-10 py-3 text-sm bg-[#F7F7F5] border border-[#D6DBE0] rounded-md text-[#111418] placeholder:text-[#646D78] focus:bg-white focus:outline-none focus:border-[#9A6B3E]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#646D78] hover:text-[#111418] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {searchQuery.trim() === '' ? (
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#646D78]">
                <span className="font-medium text-[#47505B]">Popular searches:</span>
                {QUICK_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runQuickSearch(term)}
                    className="px-2.5 py-1 rounded border border-[#E4E6E8] bg-[#F7F7F5] text-[#111418] hover:border-[#9A6B3E] hover:text-[#9A6B3E] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : liveMatches.length === 0 ? (
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C636E]">
                <span>
                  No listings matched &ldquo;{searchQuery.trim()}&rdquo;. Try &ldquo;Turbo&rdquo;, &ldquo;Mountain&rdquo;, &ldquo;Touring&rdquo;, or &ldquo;Helmet&rdquo;.
                </span>
                <Link
                  href="/shop/"
                  onClick={() => setSearchOpen(false)}
                  className="font-medium text-[#835931] hover:text-[#111418] underline whitespace-nowrap"
                >
                  Browse Full Inventory &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#646D78]">
                  <span className="tabular-nums">
                    {liveMatches.length} {liveMatches.length === 1 ? 'listing' : 'listings'} found
                  </span>
                  <Link
                    href={`/search/?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex items-center gap-1 font-medium text-[#835931] hover:text-[#111418]"
                  >
                    <span>View full search results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {liveMatches.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/shop/${item.category}/${item.slug}/`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-3 p-2.5 rounded-md border border-[#E4E6E8] hover:border-[#9A6B3E] bg-[#F9FAFB] hover:bg-white transition-colors"
                    >
                      <div className="relative w-16 h-12 rounded bg-[#EFECE7] overflow-hidden shrink-0">
                        <SmartImage
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#111418] group-hover:text-[#9A6B3E] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#646D78] truncate">
                          {item.categoryName} &middot; {money(item.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden bg-white border-t border-[#E4E6E8] px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto"
        >
          {/* Expandable Shop Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileShopOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3 px-3 text-sm font-medium text-[#111418] hover:bg-[#F7F7F5] rounded-md"
              aria-expanded={mobileShopOpen}
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileShopOpen && (
              <div className="pl-4 pr-2 pb-3 space-y-3 border-b border-[#ECEEF0]">
                <Link
                  href="/shop/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-[#835931]"
                >
                  All Inventory
                </Link>
                {CATEGORIES.map((cat) => (
                  <div key={cat.slug} className="space-y-1">
                    <Link
                      href={`/shop/${cat.slug}/`}
                      onClick={() => setMobileOpen(false)}
                      className="block text-xs font-semibold text-[#111418]"
                    >
                      {cat.name}
                    </Link>
                    <div className="pl-3 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/shop/${cat.slug}/?sub=${encodeURIComponent(sub.slug)}`}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-xs text-[#5C636E]"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {DIRECT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-3 text-sm font-medium text-[#111418] hover:bg-[#F7F7F5] rounded-md"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 mt-2 border-t border-[#E4E6E8] flex flex-wrap items-center gap-4 px-3 text-xs text-[#5C636E]">
            <Link
              href="/financing/"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-[#111418]"
            >
              Pay-in-4 Financing
            </Link>
            <Link
              href="/search/"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-[#111418]"
            >
              Search
            </Link>
            <Link
              href="/about/"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-[#111418]"
            >
              About
            </Link>
            <Link
              href="/faq/"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-[#111418]"
            >
              FAQ
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
