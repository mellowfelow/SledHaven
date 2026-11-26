import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/catalog';
import ShopCatalogClient from '@/components/ShopCatalogClient';
import JsonLd from '@/components/JsonLd';

const TITLE = 'New Snowmobiles for Sale — Full 2026 USA Inventory';
const DESCRIPTION =
  'Browse new snowmobiles for sale: mountain, trail, crossover, touring & utility models with crated freight, Pay-in-4 financing & a 10% crypto discount.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/shop/' },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/shop/`,
  },
  twitter: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
  },
};

export default function ShopPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: `${SITE.url}/shop/` },
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
          <span className="text-[#111418] font-medium">Inventory</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          New Snowmobiles for Sale
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Every new snowmobile for sale here is pre-delivery inspected and ships crated nationwide across the United States. Select a riding discipline and subcategory below or add up to three sleds to compare specifications.
        </p>
      </div>

      <ShopCatalogClient products={PRODUCTS} />
    </main>
  );
}
