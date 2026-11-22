import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: `${SITE.name}'s policy on order cancellations, refunds, and payment-settlement disputes.`,
  alternates: { canonical: '/refund/' },
};

export default function RefundPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Refund Policy', item: `${SITE.url}/refund/` },
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
        <span className="text-[#111418] font-medium">Refund Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] mb-2">Refund Policy</h1>
      <p className="text-xs text-[#78818E] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-sm sm:text-base text-[#3E4650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Before Settlement</h2>
          <p>
            An order placed through checkout is a request to purchase, not a final sale. If you cancel before
            sending any payment, no funds have been collected and no refund is necessary — simply contact our
            dealership desk to cancel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">After a Settlement Payment</h2>
          <p>
            Once a payment (full settlement, a Pay-in-4 installment, or crypto transfer) has been confirmed and
            crating/freight preparation has begun, that payment is non-refundable except where the vehicle is
            defective on arrival, materially misdescribed, or undeliverable due to a {SITE.name} error.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Cryptocurrency Payments</h2>
          <p>
            Because blockchain transactions are irreversible, cryptocurrency settlements can only be refunded by
            our dealership desk initiating a return transfer to a wallet address you provide. Processing time
            depends on network conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Damaged or Defective Vehicles</h2>
          <p>
            If your snowmobile arrives damaged in freight or does not match its listed specification, contact our
            dealership desk within 48 hours of delivery with photos. We will arrange an inspection, repair,
            replacement, or refund as appropriate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">How to Request a Refund</h2>
          <p>
            Email{' '}
            <a href={`mailto:${SITE.contact.email}`} className="font-medium text-[#9A6B3E] underline">
              {SITE.contact.email}
            </a>{' '}
            with your order reference number and reason for the request. Our dealership desk will respond with
            next steps within two business days.
          </p>
        </section>
      </div>
    </main>
  );
}
