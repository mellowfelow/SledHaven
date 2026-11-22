import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentDetailsClient from '@/components/PaymentDetailsClient';

export const metadata: Metadata = {
  title: 'Order Payment Details',
  robots: { index: false, follow: false },
};

export default function OrderPaymentDetailsPage() {
  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9A6B3E]">
          Verified Settlement Portal
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#111418]">
          Order Payment Details
        </h1>
        <p className="text-sm text-[#5C636E]">
          Tap any field below to copy verified settlement information accurately.
        </p>
      </div>

      <Suspense
        fallback={<div className="py-12 text-sm text-[#5C636E]">Loading order details...</div>}
      >
        <PaymentDetailsClient />
      </Suspense>
    </main>
  );
}
