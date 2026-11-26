'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Scale, ShoppingBag } from 'lucide-react';
import type { Product } from '@/config/catalog';
import { money } from '@/lib/order';
import SmartImage from '@/components/SmartImage';
import { useStore } from '@/components/StoreProvider';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, compareIds, toggleCompare } = useStore();
  const isCompared = compareIds.includes(product.id);
  const cryptoPrice = Math.round(product.price * 0.9);

  return (
    <article className="group flex flex-col bg-white border border-[#E4E6E8] rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image area on uniform warm alabaster backdrop */}
      <Link
        href={`/shop/${product.category}/${product.slug}/`}
        className="relative aspect-[4/3] w-full bg-[#F3F1ED] overflow-hidden block"
      >
        <SmartImage
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-medium tracking-wide text-[#111418] bg-white/92 backdrop-blur-sm px-2 py-0.5 rounded">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Content tuned cleanly for both 3-col and 4/4 desktop grids */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-[#646D78] mb-1 truncate">
          <span className="truncate">{product.brand}</span>
          <span aria-hidden="true">&middot;</span>
          <span className="truncate">{product.subcategory}</span>
        </div>

        <Link
          href={`/shop/${product.category}/${product.slug}/`}
          className="font-serif text-base font-semibold text-[#111418] hover:text-[#9A6B3E] transition-colors leading-snug"
        >
          {product.name}
        </Link>

        <p className="mt-1.5 text-xs text-[#4F5863] leading-relaxed line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {product.isVehicle && (
          <div className="mt-3 pt-2.5 border-t border-[#F0F1F3] flex items-center justify-between text-[11px] text-[#5C636E] tabular-nums">
            <span>{product.specs.displacement}</span>
            <span>{product.specs.horsepower}</span>
            <span>{product.specs.dryWeight}</span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-[#ECEEF0] flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-base font-semibold text-[#111418] tabular-nums">
              {money(product.price)}
            </div>
            <div className="text-[11px] text-[#835931] tabular-nums truncate">
              {money(cryptoPrice)} crypto
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {product.isVehicle && (
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                aria-label={isCompared ? `Remove ${product.name} from compare` : `Compare ${product.name}`}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-xs transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-[#111418] border-[#111418] text-white'
                    : 'bg-white border-[#D6DBE0] text-[#47505B] hover:border-[#111418] hover:text-[#111418]'
                }`}
              >
                {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => addToCart(product.id, 1)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <Link
          href={`/shop/${product.category}/${product.slug}/`}
          aria-label={`Full Specifications for ${product.name}`}
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#47505B] hover:text-[#9A6B3E] transition-colors"
        >
          <span>Full Specifications</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
