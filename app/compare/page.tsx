import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import CompareClient from '@/components/CompareClient';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Compare Snowmobiles Side-by-Side',
  description:
    'Compare SledHaven mountain, trail, touring, and utility snowmobiles side by side across displacement, horsepower, track length, dry weight, Pay-in-4, and 10% crypto pricing.',
  alternates: { canonical: '/compare/' },
};

export default function ComparePage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Compare Models', item: `${SITE.url}/compare/` },
    ],
  };

  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={breadcrumb} />

      <div className="mb-10 space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2">
          <Link href="/" className="hover:text-[#111418]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">Compare</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          Side-by-Side Snowmobile Comparison
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Evaluate engine architecture, track footprint, dry weight, and settlement options across up to three 2026 SledHaven models.
        </p>
      </div>

      <CompareClient />
    </main>
  );
}
