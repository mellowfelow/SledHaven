'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, RotateCcw, ShoppingBag, X } from 'lucide-react';
import { PRODUCTS, type Product } from '@/config/catalog';
import { money } from '@/lib/order';
import SmartImage from '@/components/SmartImage';
import { useStore } from '@/components/StoreProvider';

const VEHICLES = PRODUCTS.filter((p) => p.isVehicle);

export default function CompareClient() {
  const { compareIds, toggleCompare, replaceCompare, clearCompare, addToCart } = useStore();
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const selected: Product[] = compareIds
    .map((id) => VEHICLES.find((v) => v.id === id))
    .filter((v): v is Product => Boolean(v));

  const availableToAdd = VEHICLES.filter((v) => !compareIds.includes(v.id));

  function handleSwap(oldId: string, newId: string) {
    if (!newId || oldId === newId) return;
    replaceCompare(oldId, newId);
  }

  const allRows: { label: string; render: (p: Product) => string }[] = [
    { label: 'Brand / Division', render: (p) => p.brand },
    { label: 'Category', render: (p) => `${p.categoryName} · ${p.subcategory}` },
    { label: 'Model Year', render: (p) => String(p.year) },
    { label: 'Retail Price', render: (p) => money(p.price) },
    { label: '10% Crypto Price (BTC/USDT)', render: (p) => money(Math.round(p.price * 0.9)) },
    {
      label: 'Pay-in-4 Installment (25%)',
      render: (p) => `${money(Math.round((p.price / 4) * 100) / 100)} × 4`,
    },
    { label: 'Engine Architecture', render: (p) => p.specs.engine },
    { label: 'Displacement', render: (p) => p.specs.displacement },
    { label: 'Output Rating', render: (p) => p.specs.horsepower },
    { label: 'Track Dimensions', render: (p) => p.specs.track },
    { label: 'Suspension Package', render: (p) => p.specs.suspension },
    { label: 'Dry Weight', render: (p) => p.specs.dryWeight },
    { label: 'Fuel Capacity', render: (p) => p.specs.fuelCapacity },
    { label: 'Starting System', render: (p) => p.specs.starting },
  ];

  const visibleRows = allRows.filter((row) => {
    if (!differencesOnly || selected.length < 2) return true;
    const vals = new Set(selected.map((s) => row.render(s)));
    return vals.size > 1;
  });

  return (
    <div className="space-y-8">
      {/* Control Toolbar */}
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#111418] tabular-nums">
            Comparing {selected.length} of 3 Snowmobiles
          </p>
          <p className="text-xs text-[#5C636E] mt-0.5">
            Swap models directly in any column or add up to three sleds to evaluate horsepower, dry weight, track footprint, and settlement pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selected.length >= 2 && (
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#111418] cursor-pointer select-none px-3 py-2 rounded-md border border-[#D6DBE0] bg-[#F7F7F5]">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(e) => setDifferencesOnly(e.target.checked)}
                className="accent-[#9A6B3E]"
              />
              <span>Show Differences Only</span>
            </label>
          )}

          {availableToAdd.length > 0 && selected.length < 3 && (
            <div>
              <label htmlFor="add-compare-select" className="sr-only">
                Add snowmobile to comparison
              </label>
              <select
                id="add-compare-select"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    toggleCompare(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="text-xs bg-white border border-[#D6DBE0] rounded-md px-3 py-2 text-[#111418] focus:outline-none focus:border-[#9A6B3E]"
              >
                <option value="" disabled>
                  + Add Snowmobile ({3 - selected.length} slot{3 - selected.length === 1 ? '' : 's'} open)
                </option>
                {availableToAdd.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({money(v.price)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selected.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#D6DBE0] text-xs font-medium text-[#47505B] hover:text-[#111418] hover:border-[#111418] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {selected.length === 0 ? (
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-12 text-center space-y-5">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">
            Select models to begin comparing
          </h2>
          <p className="text-sm text-[#5C636E] max-w-md mx-auto">
            Choose up to three 2026 snowmobiles below to inspect horsepower, dry weight, track length, and Pay-in-4 or 10% crypto pricing side by side.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => toggleCompare(v.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#D6DBE0] text-xs font-medium text-[#111418] hover:border-[#9A6B3E] hover:bg-[#FAF6F1] cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#9A6B3E]" />
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Responsive Comparison Table */
        <div className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[660px]">
              <thead>
                <tr className="border-b border-[#E4E6E8]">
                  <th className="w-52 p-5 align-top bg-[#F7F7F5] text-xs font-semibold uppercase tracking-wider text-[#646D78]">
                    Specification
                  </th>
                  {selected.map((sled) => {
                    const swapOptions = VEHICLES.filter(
                      (v) => v.id === sled.id || !compareIds.includes(v.id)
                    );
                    return (
                      <th key={sled.id} className="p-5 align-top border-l border-[#ECEEF0] min-w-[230px]">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <select
                            aria-label={`Swap ${sled.name}`}
                            value={sled.id}
                            onChange={(e) => handleSwap(sled.id, e.target.value)}
                            className="flex-1 min-w-0 text-xs font-medium bg-[#F7F7F5] border border-[#D6DBE0] rounded px-2 py-1.5 text-[#111418] focus:outline-none focus:border-[#9A6B3E]"
                          >
                            {swapOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => toggleCompare(sled.id)}
                            className="text-[#88919E] hover:text-[#111418] p-1 shrink-0 cursor-pointer"
                            aria-label={`Remove ${sled.name} from comparison`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <Link
                          href={`/shop/${sled.category}/${sled.slug}/`}
                          className="relative aspect-[4/3] w-full bg-[#F3F1ED] rounded overflow-hidden mb-3 block"
                        >
                          <SmartImage
                            src={sled.image}
                            alt={sled.imageAlt}
                            fill
                            sizes="260px"
                            className="object-cover"
                          />
                        </Link>

                        <Link
                          href={`/shop/${sled.category}/${sled.slug}/`}
                          className="font-serif text-base font-semibold text-[#111418] hover:text-[#9A6B3E] block mb-3"
                        >
                          {sled.name}
                        </Link>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => addToCart(sled.id, 1)}
                            className="w-full py-2 px-3 rounded-md text-xs font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag &middot; {money(sled.price)}</span>
                          </button>
                          <Link
                            href={`/shop/${sled.category}/${sled.slug}/`}
                            className="w-full py-1.5 text-[11px] font-medium text-[#5C636E] hover:text-[#111418] inline-flex items-center justify-center gap-1"
                          >
                            <span>View Full Listing</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF0] text-sm">
                {visibleRows.map((row) => {
                  const uniqueVals = new Set(selected.map((s) => row.render(s)));
                  const differs = selected.length > 1 && uniqueVals.size > 1;
                  return (
                    <tr
                      key={row.label}
                      className={differs ? 'bg-[#FDFBF8] hover:bg-[#FAF6F1]' : 'hover:bg-[#FAFAFA]'}
                    >
                      <td className="p-4 bg-[#F7F7F5] text-xs font-medium text-[#5C636E]">
                        <span>{row.label}</span>
                      </td>
                      {selected.map((sled) => (
                        <td
                          key={`${sled.id}-${row.label}`}
                          className={`p-4 border-l border-[#ECEEF0] tabular-nums ${
                            row.label.includes('Crypto')
                              ? 'text-[#9A6B3E] font-semibold'
                              : row.label === 'Retail Price'
                              ? 'text-[#111418] font-semibold'
                              : 'text-[#2B313A]'
                          }`}
                        >
                          {row.render(sled)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
