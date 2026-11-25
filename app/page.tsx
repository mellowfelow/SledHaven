import React from 'react';
import Link from 'next/link';
import { ArrowRight, Coins, CreditCard, Scale, ShieldCheck, Truck } from 'lucide-react';
import { SITE } from '@/config/site';
import { BRANDS, CATEGORIES, PRODUCTS } from '@/config/catalog';
import SmartImage from '@/components/SmartImage';
import ProductCard from '@/components/ProductCard';
import TrustpilotReviewSlider from '@/components/TrustpilotReviewSlider';
import HeroSlider from '@/components/HeroSlider';
import JsonLd from '@/components/JsonLd';

const HOME_FAQS = [
  {
    q: 'What payment methods does SledHaven accept?',
    a: 'Cryptocurrency (BTC/USDT, 10% instant discount), Bank Transfer, Zelle, Apple Pay, and Chime. After choosing a method at checkout, you also pick a payment plan — pay in full, or split it with Pay-in-4 financing.',
  },
  {
    q: 'How is snowmobile freight shipping calculated?',
    a: 'Freight is calculated automatically at checkout based on your delivery state. Every snowmobile ships insured inside a protective crate, and gear orders over $500 qualify for free US parcel shipping.',
  },
  {
    q: 'How does Pay-in-4 financing work?',
    a: 'Pay-in-4 splits your order into four equal interest-free installments — the first 25% due immediately to lock your unit, then three more every 4 weeks, with no credit check and zero interest.',
  },
  {
    q: 'Do snowmobiles ship with title and registration paperwork?',
    a: 'Yes. Every unit ships with its Manufacturer Certificate of Origin, itemized bill of sale, and pre-delivery inspection record, so you can complete state trail registration in your home state.',
  },
];

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 8);

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <main className="flex-1">
      <JsonLd data={homeFaqSchema} />
      {/* Section 1: Storefront Campaign Hero Slider */}
      <HeroSlider />

      {/* Section 2: Shop by Riding Discipline (Structure A Categories) */}
      <section className="bg-white border-y border-[#E4E6E8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl space-y-2 mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#9A6B3E]">
              Riding Disciplines
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
              Built for Every Elevation &amp; Terrain
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.filter((cat) => cat.slug !== 'parts').map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}/`}
                className="group flex flex-col bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg overflow-hidden hover:border-[#9A6B3E] transition-colors"
              >
                <div className="relative aspect-[4/3] w-full bg-[#EFECE7] overflow-hidden">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#5C636E] leading-relaxed flex-1">
                    {cat.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#E4E6E8] flex items-center justify-between text-xs font-medium text-[#111418]">
                    <span>{cat.subcategories.map((s) => s.name).join(' · ')}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#9A6B3E]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2b: Authorized Dealer Brand Strip */}
      <section className="bg-[#F7F7F5] border-b border-[#E4E6E8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-xs font-medium tracking-widest uppercase text-[#9A6B3E] mb-8">
            Authorized US Dealer For
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 sm:gap-10 items-center justify-center">
            {BRANDS.filter((b) => b.slug !== 'sledhaven-gear').map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/?brand=${brand.slug}`}
                className="group relative aspect-[3/2] flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                aria-label={`${brand.name} — view models`}
              >
                <SmartImage
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Featured Inventory Grid (8 products in 4/4 desktop layout) */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E4E6E8]">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-widest uppercase text-[#9A6B3E]">
              2026 Showroom Allocation
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]"
              style={{ textWrap: 'balance' }}
            >
              Featured Snowmobiles for Sale
            </h2>
          </div>

          <Link
            href="/shop/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111418] hover:text-[#9A6B3E] transition-colors whitespace-nowrap"
          >
            <span>View All {PRODUCTS.length} Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
      </section>

      {/* Section 4: Trustpilot-Style Verified Rider Reviews Slider (2,400+ Reviews across 5-4-3-2-1 Stars) */}
      <TrustpilotReviewSlider />

      {/* Section 5: Transparent US Acquisition, Freight & Financing */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-medium tracking-widest uppercase text-[#9A6B3E]">
              The SledHaven Standard
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418] leading-snug"
              style={{ textWrap: 'balance' }}
            >
              Direct Dealership Pricing. Zero Showroom Friction.
            </h2>
            <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
              Every machine is pre-delivery inspected, crated for long-haul protection, and shipped directly to your residence or commercial dock anywhere in the United States with state-ready title documentation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-sm">
              <Link
                href="/financing/"
                className="font-medium text-[#9A6B3E] hover:text-[#111418] inline-flex items-center gap-1.5"
              >
                <span>Explore Pay-in-4 Financing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq/"
                className="font-medium text-[#47505B] hover:text-[#111418] inline-flex items-center gap-1.5"
              >
                <span>Read Freight &amp; MCO FAQ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-6 space-y-3">
              <Truck className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
              <h3 className="text-base font-semibold text-[#111418]">
                State-Calculated Crated Freight
              </h3>
              <p className="text-sm text-[#5C636E] leading-relaxed">
                Freight rates and state sales tax calculate transparently at checkout based on your delivery state. Gear orders over ${SITE.orderRules.freeShippingThreshold} ship free nationwide.
              </p>
            </div>

            <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-6 space-y-3">
              <Coins className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
              <h3 className="text-base font-semibold text-[#111418]">
                10% Instant Crypto Discount
              </h3>
              <p className="text-sm text-[#5C636E] leading-relaxed">
                Settle via Bitcoin (BTC) or Tether (USDT) and receive an automatic 10% reduction applied directly to your machine subtotal at checkout.
              </p>
            </div>

            <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-6 space-y-3">
              <CreditCard className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
              <h3 className="text-base font-semibold text-[#111418]">
                Pay-in-4 Structured Financing
              </h3>
              <p className="text-sm text-[#5C636E] leading-relaxed">
                Split your acquisition into four equal interest-free installments. Remit 25% to lock your sled allocation and initiate factory crating.
              </p>
            </div>

            <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-6 space-y-3">
              <ShieldCheck className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
              <h3 className="text-base font-semibold text-[#111418]">
                Verified Settlement &amp; MCO Packet
              </h3>
              <p className="text-sm text-[#5C636E] leading-relaxed">
                Bank Transfer, Zelle, Apple Pay, Chime, and Crypto settlements are verified directly by our US dealership desk with complete MCO paperwork for state registration.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Section 6: Homepage FAQ (direct-answer, matches homeFaqSchema above) */}
      <section className="bg-[#F7F7F5] border-t border-[#E4E6E8]">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl space-y-2 mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#9A6B3E]">
              Common Questions
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
              Freight, Payments &amp; Title — Answered
            </h2>
          </div>
          <div className="divide-y divide-[#E4E6E8] bg-white border border-[#E4E6E8] rounded-lg">
            {HOME_FAQS.map((item) => (
              <div key={item.q} className="p-6 sm:p-7 space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#111418]">
                  {item.q}
                </h3>
                <p className="text-sm text-[#5C636E] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm text-[#47505B]">
            Have a different question?{' '}
            <Link href="/faq/" className="font-medium text-[#9A6B3E] hover:text-[#111418] underline">
              Read the full Freight, Title &amp; Payment FAQ →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
