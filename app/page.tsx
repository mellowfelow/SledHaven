import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Coins, CreditCard, Package, Scale, ShieldCheck, Star, Truck } from 'lucide-react';
import { SITE } from '@/config/site';
import { BRANDS, CATEGORIES, PRODUCTS } from '@/config/catalog';
import { BLOG_POSTS } from '@/config/blog';
import { REVIEW_SUMMARY } from '@/config/reviews';
import SmartImage from '@/components/SmartImage';
import ProductCard from '@/components/ProductCard';
import TrustpilotReviewSlider from '@/components/TrustpilotReviewSlider';
import HeroSlider from '@/components/HeroSlider';
import HomeFaqAccordion from '@/components/HomeFaqAccordion';
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
  const authorizedBrandCount = BRANDS.filter((b) => b.slug !== 'sledhaven-gear').length;
  const latestPosts = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const STATS = [
    {
      icon: Star,
      value: `${REVIEW_SUMMARY.averageRating}★`,
      label: `${REVIEW_SUMMARY.totalReviews.toLocaleString()}+ Verified Rider Reviews`,
    },
    {
      icon: Package,
      value: `${PRODUCTS.length}`,
      label: 'Models In Current Inventory',
    },
    {
      icon: Award,
      value: `${authorizedBrandCount}`,
      label: 'Authorized Manufacturer Brands',
    },
    {
      icon: Truck,
      value: '50',
      label: 'States — Nationwide Crated Freight',
    },
  ];

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

      {/* Section 1b: Credibility Stats Bar */}
      <section className="bg-[#111418]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 sm:gap-4">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#9A6B3E] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-[#9BA3AD] leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Shop by Riding Discipline (Structure A Categories) */}
      <section className="bg-white border-y border-[#E4E6E8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl space-y-2 mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
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
          <p className="text-center text-xs font-medium tracking-widest uppercase text-[#835931] mb-8">
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
            <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
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
            <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
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
                className="font-medium text-[#835931] hover:text-[#111418] inline-flex items-center gap-1.5"
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

      {/* Section 6: From the Field Journal (latest blog posts) */}
      <section className="bg-white border-t border-[#E4E6E8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E4E6E8]">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
                SledHaven Field Journal
              </p>
              <h2
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]"
                style={{ textWrap: 'balance' }}
              >
                Guides for Buying, Owning &amp; Riding
              </h2>
            </div>
            <Link
              href="/blog/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111418] hover:text-[#9A6B3E] transition-colors whitespace-nowrap"
            >
              <span>Read the Full Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-7">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg overflow-hidden hover:border-[#9A6B3E] transition-colors"
              >
                <Link
                  href={`/blog/${post.slug}/`}
                  className="relative aspect-[16/9] w-full bg-[#EFECE7] overflow-hidden block"
                >
                  <SmartImage
                    src={post.coverImage}
                    alt={post.coverAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#646D78] mb-2">
                    <span className="text-[#835931] font-medium">{post.category}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="font-serif text-lg font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors leading-snug"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-3 text-sm text-[#5C636E] leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="mt-5 pt-4 border-t border-[#E4E6E8] inline-flex items-center gap-1.5 text-xs font-medium text-[#111418] group-hover:text-[#9A6B3E] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Homepage FAQ (collapsible, matches homeFaqSchema above) */}
      <section className="bg-[#F7F7F5] border-t border-[#E4E6E8]">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl space-y-2 mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
              Common Questions
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
              Freight, Payments &amp; Title — Answered
            </h2>
          </div>
          <HomeFaqAccordion items={HOME_FAQS} />
          <div className="mt-6 text-sm text-[#47505B]">
            Have a different question?{' '}
            <Link href="/faq/" className="font-medium text-[#835931] hover:text-[#111418] underline">
              Read the full Freight, Title &amp; Payment FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 8: Closing CTA Band */}
      <section className="bg-[#111418]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold text-white"
              style={{ textWrap: 'balance' }}
            >
              Ready to Find Your Snowmobile?
            </h2>
            <p className="text-sm text-[#9BA3AD] max-w-md">
              Browse {PRODUCTS.length} new models across {CATEGORIES.length - 1} riding disciplines, crated and shipped nationwide.
            </p>
          </div>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 bg-[#9A6B3E] hover:bg-[#835931] text-white font-medium text-sm px-6 py-3.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Browse Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
