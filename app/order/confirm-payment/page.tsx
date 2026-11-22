import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ConfirmPaymentClient from '@/components/ConfirmPaymentClient';

export const metadata: Metadata = {
  title: 'Confirm Order Payment',
  robots: { index: false, follow: false },
};

export default function ConfirmPaymentPage() {
  return (
    <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9A6B3E]">
          Settlement Confirmation
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#111418]">
          Upload Payment Confirmation
        </h1>
        <p className="text-sm text-[#5C636E]">
          Attach your transfer receipt or transaction ID so our dispatch desk can lock your unit and begin crating.
        </p>
      </div>

      <Suspense
        fallback={<div className="py-12 text-sm text-[#5C636E]">Loading confirmation form...</div>}
      >
        <ConfirmPaymentClient />
      </Suspense>
    </main>
  );
}
