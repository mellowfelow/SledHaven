import React from 'react';
import type { Metadata } from 'next';
import CheckoutClient from '@/components/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="flex-1 bg-[#F7F7F5]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-widest text-[#9A6B3E]">
            Email Order Checkout
          </p>
          <h1 className="font-serif text-3xl font-semibold text-[#111418]">
            Checkout
          </h1>
          <p className="text-sm text-[#5C636E]">
            State freight &amp; taxes calculated below. Confirmation email sent immediately upon reservation.
          </p>
        </div>

        <CheckoutClient />
      </div>
    </main>
  );
}
