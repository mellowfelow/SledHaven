import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: 'Enquiry Received',
  robots: { index: false, follow: true },
};

export default async function ThankYouContactPage(context: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await context.searchParams;
  const ref = (params?.ref || '').trim();

  return (
    <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-[#E4E6E8] rounded-lg p-8 space-y-5">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#111418]">
          We received your message.
        </h1>
        <p className="text-sm text-[#4F5863] leading-relaxed">
          A {SITE.name} specialist will reply directly to your email shortly. For immediate assistance, call{' '}
          <a href={SITE.contact.phoneHref} className="font-semibold text-[#111418] underline">
            {SITE.contact.phone}
          </a>
          .
        </p>
        {ref && (
          <p className="text-xs text-[#646D78] font-mono">Enquiry Reference: {ref}</p>
        )}
        <div className="pt-2">
          <Link
            href="/shop/"
            className="inline-flex px-5 py-2.5 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors"
          >
            Explore Inventory
          </Link>
        </div>
      </div>
    </main>
  );
}
