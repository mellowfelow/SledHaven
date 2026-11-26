import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: `How ${SITE.name} calculates and dispatches crated snowmobile freight and gear shipping nationwide across the United States.`,
  alternates: { canonical: '/shipping/' },
};

export default function ShippingPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Shipping Policy', item: `${SITE.url}/shipping/` },
    ],
  };

  return (
    <main className="flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <JsonLd data={breadcrumb} />
      <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2 mb-6">
        <Link href="/" className="hover:text-[#111418]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#111418] font-medium">Shipping Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] mb-2">Shipping Policy</h1>
      <p className="text-xs text-[#78818E] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-sm sm:text-base text-[#3E4650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Coverage Area</h2>
          <p>{SITE.name} ships to all 50 US states. We do not currently ship internationally.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Vehicle Freight</h2>
          <p>
            Every snowmobile ships insured inside a protective transport crate. Freight cost and applicable state
            sales tax are calculated automatically at checkout based on your delivery state. Optional residential
            liftgate delivery is available.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Gear & Accessories Shipping</h2>
          <p>
            Alpine gear and accessory orders of ${SITE.orderRules.freeShippingThreshold} or more ship free via
            standard US parcel carriers. Orders below that threshold are charged a flat shipping rate shown at
            checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Dispatch Timeline</h2>
          <p>
            Vehicle crating and dispatch begin once settlement is confirmed by our dealership desk. Transit time
            depends on your delivery state and carrier routing; our team will confirm an estimated delivery window
            after dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Documentation Included</h2>
          <p>
            Each vehicle shipment includes its Manufacturer Certificate of Origin (MCO), itemized bill of sale, and
            pre-delivery inspection record for state registration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Contact</h2>
          <p>
            For a state-specific freight quote or shipment status, contact{' '}
            <a href={`mailto:${SITE.contact.email}`} className="font-medium text-[#835931] underline">
              {SITE.contact.email}
            </a>{' '}
            or{' '}
            <a href={SITE.contact.phoneHref} className="font-medium text-[#835931] underline">
              {SITE.contact.phone}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
