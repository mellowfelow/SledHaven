'use client';

import React, { useMemo, useState } from 'react';
import { BRANDS, PRODUCTS } from '@/config/catalog';
import ProductCard from '@/components/ProductCard';
import SmartImage from '@/components/SmartImage';

export default function BrandsClient() {
  const [activeBrand, setActiveBrand] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (activeBrand === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.brandSlug === activeBrand);
  }, [activeBrand]);

  return (
    <div className="space-y-12">
      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="relative aspect-[16/9] w-full bg-[#F3F1ED] overflow-hidden">
                <SmartImage
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-[#646D78]">
                  <span>{brand.origin}</span>
                  <span className="tabular-nums font-medium text-[#9A6B3E]">
                    {count} {count === 1 ? 'Model' : 'Models'}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors">
                  {brand.name}
                </h2>
                <p className="text-xs font-medium text-[#47505B]">{brand.discipline}</p>
                <p className="text-xs text-[#5C636E] leading-relaxed pt-1 flex-1">
                  {brand.summary}
                </p>
                <div className="pt-3 mt-2 border-t border-[#ECEEF0] text-xs font-medium text-[#111418]">
                  {isSelected ? 'Showing Models Below (Click to Reset)' : `Filter ${brand.name} Models →`}
                </div>
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
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
