'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Scale } from 'lucide-react';
import { CATEGORIES, type Product } from '@/config/catalog';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/components/StoreProvider';

interface ShopCatalogClientProps {
  products: Product[];
  activeCategorySlug?: string;
}

function ShopCatalogInner({ products, activeCategorySlug }: ShopCatalogClientProps) {
  const searchParams = useSearchParams();
  const urlSub = searchParams?.get('sub') || 'all';

  const { compareIds } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(activeCategorySlug || 'all');
  const [userSubOverride, setUserSubOverride] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const selectedSubcategory = userSubOverride !== null ? userSubOverride : urlSub;

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
        <div className="flex items-center gap-3 shrink-0">
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
            className="text-xs font-medium text-[#9A6B3E] underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopCatalogClient(props: ShopCatalogClientProps) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-sm text-[#5C636E]">Loading snowmobile inventory...</div>
      }
    >
      <ShopCatalogInner {...props} />
    </Suspense>
  );
}
