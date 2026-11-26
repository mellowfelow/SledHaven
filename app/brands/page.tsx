import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import BrandsClient from '@/components/BrandsClient';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Snowmobile Brands & Engineering Divisions',
  description:
    'Explore SledHaven curated snowmobile brands and engineering divisions across mountain, trail, luxury touring, heavy-duty utility, and alpine carbon gear.',
  alternates: { canonical: '/brands/' },
};

export default function BrandsPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE.url}/brands/` },
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
          <span className="text-[#111418] font-medium">Brands</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          Snowmobile Brands &amp; Divisions
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Select a performance division below to inspect dedicated mountain, trail, touring, utility, and protective equipment models available for crated US delivery.
        </p>
      </div>

      <BrandsClient />
    </main>
  );
}
