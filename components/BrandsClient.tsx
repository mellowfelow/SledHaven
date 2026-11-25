'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRANDS, PRODUCTS } from '@/config/catalog';
import ProductCard from '@/components/ProductCard';
import SmartImage from '@/components/SmartImage';

const PAGE_SIZE = 16;

export default function BrandsClient() {
  const [activeBrand, setActiveBrand] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (activeBrand === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.brandSlug === activeBrand);
  }, [activeBrand]);

  useEffect(() => {
    setPage(1);
  }, [activeBrand]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = useMemo(
    () => filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredProducts, page]
  );

  return (
    <div className="space-y-12">
      {/* Brand Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {BRANDS.map((brand) => {
          const count = PRODUCTS.filter((p) => p.brandSlug === brand.slug).length;
          const isSelected = activeBrand === brand.slug;
          return (
            <button
              key={brand.slug}
              type="button"
              onClick={() => setActiveBrand(isSelected ? 'all' : brand.slug)}
              className={`group text-left bg-white border rounded-lg overflow-hidden transition-all cursor-pointer flex flex-col ${
                isSelected
                  ? 'border-[#9A6B3E] ring-1 ring-[#9A6B3E]'
                  : 'border-[#E4E6E8] hover:border-[#9A6B3E]'
              }`}
            >
              <div className="relative aspect-[4/3] w-full bg-[#F3F1ED] overflow-hidden">
                <SmartImage
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-1.5 left-1.5 w-9 h-9 rounded-md bg-white/95 border border-[#E4E6E8] p-1 shadow-sm">
                  <SmartImage
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="36px"
                    className="object-contain p-0.5"
                  />
                </div>
              </div>
              <div className="p-2.5 flex-1 flex flex-col gap-0.5">
                <h2 className="font-serif text-sm font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors truncate">
                  {brand.name}
                </h2>
                <p className="text-[11px] tabular-nums text-[#646D78]">
                  {count} {count === 1 ? 'Model' : 'Models'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtered Inventory Section */}
      <div className="space-y-6 pt-4 border-t border-[#E4E6E8]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#111418]">
              {activeBrand === 'all'
                ? 'All Brand Inventory'
                : `${BRANDS.find((b) => b.slug === activeBrand)?.name || ''} Models`}
            </h2>
            <p className="text-xs text-[#5C636E] mt-1 tabular-nums">
              Showing {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'listing' : 'listings'} available for nationwide US delivery
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveBrand('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                activeBrand === 'all'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#111418]'
              }`}
            >
              All Brands
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand.slug}
                type="button"
                onClick={() => setActiveBrand(brand.slug)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors whitespace-nowrap ${
                  activeBrand === brand.slug
                    ? 'bg-[#9A6B3E] text-white'
                    : 'bg-white border border-[#D6DBE0] text-[#47505B] hover:border-[#9A6B3E]'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pagedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between gap-4 pt-4">
            <p className="text-xs text-[#5C636E] tabular-nums">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProducts.length)} of{' '}
              {filteredProducts.length}
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
      </div>
    </div>
  );
}
