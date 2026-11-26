'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { CATEGORIES, type Product } from '@/config/catalog';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/components/StoreProvider';

const PAGE_SIZE = 16;

interface ShopCatalogClientProps {
  products: Product[];
  activeCategorySlug?: string;
  initialSub?: string;
}

export default function ShopCatalogClient({
  products,
  activeCategorySlug,
  initialSub,
}: ShopCatalogClientProps) {
  const urlSub = initialSub || 'all';

  const { compareIds } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(activeCategorySlug || 'all');
  const [userSubOverride, setUserSubOverride] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');
  const [page, setPage] = useState(1);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const selectedSubcategory = userSubOverride !== null ? userSubOverride : urlSub;

  // Keep local filter state in sync when navigating client-side between
  // category pages (e.g. via the Nav mega-menu) — React can keep this
  // component instance mounted across such route changes, so the initial
  // useState values alone would otherwise go stale.
  useEffect(() => {
    setSelectedCategory(activeCategorySlug || 'all');
  }, [activeCategorySlug]);

  useEffect(() => {
    setUserSubOverride(null);
  }, [activeCategorySlug, urlSub]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      list = list.filter((p) => p.subcategorySlug === selectedSubcategory);
    }
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, selectedSubcategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedSubcategory, sortBy]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  return (
    <div className="space-y-8">
      {/* Filter & Sort Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4E6E8]">
        {/* Category Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {!activeCategorySlug && (
            <>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setUserSubOverride('all');
                }}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#111418] text-white'
                    : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#111418]'
                }`}
              >
                All Inventory ({products.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setUserSubOverride('all');
                  }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#111418] text-white'
                      : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#111418]'
                  }`}
                >
                  {cat.shortTitle}
                </button>
              ))}
            </>
          )}

          {/* Subcategory filter when a category is active */}
          {activeCategoryObj && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUserSubOverride('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#9A6B3E] text-white'
                    : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#9A6B3E]'
                }`}
              >
                All {activeCategoryObj.shortTitle}
              </button>
              {activeCategoryObj.subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setUserSubOverride(sub.slug)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedSubcategory === sub.slug
                      ? 'bg-[#9A6B3E] text-white'
                      : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#9A6B3E]'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort + Compare Shortcut */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {compareIds.length > 0 && (
            <Link
              href="/compare/"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#111418] bg-white border border-[#D6DBE0] hover:border-[#9A6B3E] rounded-md whitespace-nowrap"
            >
              <Scale className="w-3.5 h-3.5 text-[#9A6B3E]" />
              <span className="tabular-nums">Compare ({compareIds.length})</span>
            </Link>
          )}
          <label htmlFor="shop-sort" className="sr-only">
            Sort inventory
          </label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs bg-white border border-[#D6DBE0] rounded-md px-3 py-2 text-[#111418] focus:outline-none focus:border-[#9A6B3E]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[#E4E6E8] rounded-lg space-y-3">
          <p className="text-sm text-[#5C636E]">No models match this filter combination.</p>
          <button
            type="button"
            onClick={() => {
              setUserSubOverride('all');
              if (!activeCategorySlug) setSelectedCategory('all');
            }}
            className="text-xs font-medium text-[#835931] underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <p className="text-xs text-[#5C636E] tabular-nums">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#D6DBE0] text-[#47505B] hover:border-[#111418] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`inline-flex items-center justify-center w-8 h-8 text-xs font-medium rounded-md cursor-pointer tabular-nums ${
                      n === page
                        ? 'bg-[#111418] text-white'
                        : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#111418]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  aria-label="Next page"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#D6DBE0] text-[#47505B] hover:border-[#111418] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
