'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Coins, CreditCard, Scale, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { SITE } from '@/config/site';
import { US_STATES_SHIPPING, type Product } from '@/config/catalog';
import { calculateOrderTotals, money } from '@/lib/order';
import SmartImage from '@/components/SmartImage';
import { useStore } from '@/components/StoreProvider';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, compareIds, toggleCompare } = useStore();
  const [stateCode, setStateCode] = useState('CO');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const isCompared = compareIds.includes(product.id);
  const cryptoPrice = Math.round(product.price * (1 - SITE.orderRules.cryptoDiscountPercent / 100));
  const payIn4 = Math.round((product.price / 4) * 100) / 100;
  const estimate = calculateOrderTotals([{ id: product.id, quantity: 1 }], stateCode, 'bank_transfer');

  function handleAdd() {
    addToCart(product.id, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* Left Sticky Gallery */}
      <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
        <div className="relative aspect-[4/3] w-full bg-[#F3F1ED] border border-[#E4E6E8] rounded-lg overflow-hidden">
          <SmartImage
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </div>

        {/* Technical Specifications Table */}
        <section className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E4E6E8]">
            <h2 className="font-serif text-lg font-semibold text-[#111418]">
              Technical Specifications
            </h2>
          </div>
          <dl className="divide-y divide-[#F0F1F3] text-sm">
            {[
              ['Model Year', String(product.year)],
              ['SKU / Stock Number', product.sku],
              ['Engine / System', product.specs.engine],
              ['Displacement / Certification', product.specs.displacement],
              ['Output / Rating', product.specs.horsepower],
              ['Track / Shell', product.specs.track],
              ['Suspension / Liner', product.specs.suspension],
              ['Dry Weight', product.specs.dryWeight],
              ['Fuel Capacity / Kit', product.specs.fuelCapacity],
              ['Starting / Sizing', product.specs.starting],
            ].map(([label, val]) => (
              <div
                key={label}
                className="px-6 py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4"
              >
                <dt className="sm:col-span-5 text-xs font-medium text-[#646D78] uppercase tracking-wider">
                  {label}
                </dt>
                <dd className="sm:col-span-7 font-medium text-[#111418] tabular-nums">
                  {val}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Right Contiguous Purchase Module */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
        <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 sm:p-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#646D78]">
              <span>{product.categoryName}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{product.subcategory}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="text-emerald-700 font-medium">In Stock</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418] leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-[#646D78] font-mono">SKU: {product.sku}</p>
          </div>

          {/* Pricing Block */}
          <div className="pb-5 border-b border-[#ECEEF0] space-y-2 tabular-nums">
            <div className="text-3xl font-semibold text-[#111418]">
              {money(product.price)}
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="inline-flex items-center gap-1.5 text-[#9A6B3E] font-medium">
                <Coins className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {money(cryptoPrice)} with {SITE.orderRules.cryptoDiscountPercent}% BTC / USDT crypto discount (Save{' '}
                  {money(product.price - cryptoPrice)})
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[#47505B]">
                <CreditCard className="w-3.5 h-3.5 shrink-0 text-[#9A6B3E]" />
                <span>
                  Or 4 interest-free payments of <strong>{money(payIn4)}</strong> with{' '}
                  <Link href="/financing/" className="underline hover:text-[#111418]">
                    Pay in 4
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#47505B] leading-relaxed">{product.description}</p>

          {/* Primary Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3.5 px-5 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Allocation Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag &middot; {money(product.price)}</span>
                </>
              )}
            </button>

            {product.isVehicle && (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`py-2.5 px-3 rounded-md text-xs font-medium border transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCompared
                      ? 'bg-[#FAF6F1] border-[#9A6B3E] text-[#9A6B3E]'
                      : 'bg-white border-[#D6DBE0] text-[#111418] hover:border-[#111418]'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Compare List' : 'Compare Sled'}</span>
                </button>
                <Link
                  href="/compare/"
                  className="py-2.5 px-3 rounded-md text-xs font-medium border border-[#D6DBE0] text-[#111418] hover:border-[#111418] inline-flex items-center justify-center transition-colors"
                >
                  Open Compare Tool
                </Link>
              </div>
            )}
          </div>

          {/* Live State Freight Estimator */}
          <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="pdp-state" className="text-xs font-semibold text-[#111418] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#9A6B3E]" />
                <span>Estimate Delivery by State</span>
              </label>
              <select
                id="pdp-state"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="text-xs bg-white border border-[#D6DBE0] rounded px-2 py-1 text-[#111418]"
              >
                {US_STATES_SHIPPING.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-[#47505B] space-y-1 tabular-nums">
              <div className="flex justify-between">
                <span>{estimate.shippingLabel}</span>
                <span className="font-semibold text-[#111418]">
                  {estimate.shippingFee === 0 ? 'Free' : money(estimate.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Transit Window</span>
                <span className="font-medium text-[#111418]">{estimate.transitDays}</span>
              </div>
              <p className="text-[11px] text-[#646D78] pt-1">{estimate.regulatoryNote}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="pt-2 border-t border-[#ECEEF0] space-y-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#646D78]">
              Included Highlights
            </h2>
            <ul className="space-y-2 text-xs text-[#47505B]">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A6B3E] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
