'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '@/config/catalog';
import ProductCard from '@/components/ProductCard';

const SUGGESTIONS = ['850 Turbo', 'Mountain', 'Trail', 'Touring', 'WideTrack', 'Helmet'];

function SearchClientInner({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    const terms = q.split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      const hay = [
        p.name,
        p.brand,
        p.categoryName,
        p.subcategory,
        p.shortDescription,
        p.description,
        p.sku,
        ...Object.values(p.specs),
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.replace(trimmed ? `/search/?q=${encodeURIComponent(trimmed)}` : '/search/', {
      scroll: false,
    });
  }

  function clearSearch() {
    setQuery('');
    router.replace('/search/', { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="inventory-search" className="sr-only">
            Search snowmobiles by model, engine, brand, or category
          </label>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#646D78] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="inventory-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model, brand, 850 Turbo, WideTrack, Touring, Helmet..."
              className="w-full pl-10 pr-9 py-3 text-sm bg-white border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#646D78] hover:text-[#111418] cursor-pointer"
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

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[#646D78] tabular-nums">
            Showing {results.length} {results.length === 1 ? 'listing' : 'listings'}
            {query.trim() ? ` matching "${query.trim()}"` : ''}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  router.replace(`/search/?q=${encodeURIComponent(term)}`, { scroll: false });
                }}
                className="px-2 py-1 rounded border border-[#E4E6E8] bg-white text-[#47505B] hover:border-[#9A6B3E] hover:text-[#9A6B3E] transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-12 text-center space-y-4">
          <p className="text-sm text-[#4F5863]">
            No snowmobiles or gear matched &ldquo;{query}&rdquo;. Try searching &ldquo;Turbo&rdquo;, &ldquo;Mountain&rdquo;, &ldquo;Touring&rdquo;, or &ldquo;900&rdquo;.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2 text-xs font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors cursor-pointer"
          >
            Show All {PRODUCTS.length} Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  return <SearchClientInner key={initialQuery} initialQuery={initialQuery} />;
}
