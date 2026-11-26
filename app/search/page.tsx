import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import SearchClient from '@/components/SearchClient';

export const metadata: Metadata = {
  title: 'Search Snowmobile Inventory',
  description:
    'Search SledHaven snowmobiles for sale by model name, engine displacement, riding discipline, or SKU.',
  alternates: { canonical: '/search/' },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2">
          <Link href="/" className="hover:text-[#111418]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">Search</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          Search Inventory
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="py-12 text-sm text-[#5C636E]">Loading inventory search...</div>
        }
      >
        <SearchClient />
      </Suspense>
    </main>
  );
}
