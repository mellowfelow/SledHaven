import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, ShieldCheck, Truck } from 'lucide-react';
import { SITE } from '@/config/site';
import { CATEGORIES } from '@/config/catalog';
import SmartImage from '@/components/SmartImage';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About SledHaven — American Snowmobile Dealership',
  description:
    'How SledHaven delivers mountain, trail, touring & utility snowmobiles nationwide with transparent state freight calculation and MCO registration paperwork.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE.url}/about/` },
    ],
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE.url}/about/`,
    name: `About ${SITE.name}`,
    mainEntity: { '@id': `${SITE.url}/#organization` },
  };

  return (
    <main className="flex-1">
      <JsonLd data={[breadcrumb, aboutPageSchema]} />

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
            <p className="text-xs font-medium tracking-widest uppercase text-[#835931]">
              United States Snowmobile Dealership
            </p>
            <h1
              className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Built for Riders Who Expect Precision Before the First Mile.
            </h1>
            <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
              {SITE.name} operates as a direct-to-rider American snowmobile dealership serving mountain, trail, touring, and utility buyers across all 50 US states. Rather than hiding destination fees or forcing multi-day regional showroom visits, we publish clear vehicle pricing, state-specific freight calculations, and flexible settlement options upfront.
            </p>
            <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
              Whether you are commissioning a turbocharged backcountry sled for Rocky Mountain powder or a wide-track utility machine for northern property management, every order is reviewed directly by our sales and logistics desk before settlement is requested.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors"
              >
                <span>Browse Snowmobiles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-[#111418] border border-[#D6DBE0] hover:border-[#111418] transition-colors"
              >
                <span>Contact Concierge</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full rounded-lg overflow-hidden border border-[#E4E6E8]">
            <SmartImage
              src="/images/hero-alpine.jpg"
              alt="SledHaven performance snowmobile on high-altitude snow ridge"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Operating Standards */}
        <div className="mt-16 pt-14 border-t border-[#E4E6E8] grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-3">
            <Truck className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
            <h2 className="text-base font-semibold text-[#111418]">
              Insured 50-State Crated Freight
            </h2>
            <p className="text-sm text-[#5C636E] leading-relaxed">
              Every machine ships secured in a heavy-gauge transport crate with liftgate residential delivery available and transparent state-based freight pricing.
            </p>
          </div>

          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-3">
            <FileCheck2 className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
            <h2 className="text-base font-semibold text-[#111418]">
              Complete MCO &amp; Registration Packet
            </h2>
            <p className="text-sm text-[#5C636E] leading-relaxed">
              Vehicles arrive accompanied by a Manufacturer Certificate of Origin (MCO), itemized bill of sale, and pre-delivery inspection checklist for seamless state registration.
            </p>
          </div>

          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-3">
            <ShieldCheck className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
            <h2 className="text-base font-semibold text-[#111418]">
              Verified Direct Settlement
            </h2>
            <p className="text-sm text-[#5C636E] leading-relaxed">
              We verify unit allocation first, then send individualized payment details for Cryptocurrency (10% discount), Bank Transfer, Zelle, Apple Pay, or Chime — paid in full or split with Pay-in-4 financing.
            </p>
          </div>
        </div>

        {/* Riding Disciplines We Serve — real catalog breadth, AI-extractable */}
        <div className="mt-16 pt-14 border-t border-[#E4E6E8]">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418] mb-6">
            Riding Disciplines We Serve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="bg-white border border-[#E4E6E8] rounded-lg p-5 space-y-2">
                <h3 className="text-sm font-semibold text-[#111418]">{cat.name}</h3>
                <p className="text-xs text-[#5C636E] leading-relaxed">
                  {cat.subcategories.map((s) => s.name).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nationwide footprint — real, truthful scope statement */}
        <div className="mt-16 pt-14 border-t border-[#E4E6E8] grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
              Nationwide United States Delivery
            </h2>
            <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
              {SITE.name} delivers to all 50 US states. Snowmobile freight and applicable state sales tax are
              calculated transparently at checkout by destination state, and every vehicle arrives with a
              Manufacturer Certificate of Origin (MCO) packet so you can complete registration locally without
              chasing paperwork. Gear and accessory orders over ${SITE.orderRules.freeShippingThreshold} ship free
              nationwide.
            </p>
          </div>
          <div className="lg:col-span-5 space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111418]">
              Flexible, Verified Settlement
            </h2>
            <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
              Beyond traditional bank transfer, {SITE.name} supports Zelle, Apple Pay, Chime, and a 10% instant
              discount for Bitcoin/USDT settlement — paid in full or split into four interest-free Pay-in-4
              installments — so riders can choose the settlement method and plan that fits them, not the other way around.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
