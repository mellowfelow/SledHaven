import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center space-y-5">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9A6B3E]">
          404 &middot; Route Not Found
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#111418]">
          This trail leads nowhere.
        </h1>
        <p className="text-sm text-[#5C636E] leading-relaxed">
          The snowmobile listing or page you requested may have moved. Explore our current in-stock inventory below.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/shop/"
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md transition-colors"
          >
            Browse Inventory
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium text-[#111418] border border-[#D6DBE0] hover:border-[#111418] rounded-md transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
