import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms governing orders, payments, and vehicle delivery placed through ${SITE.name}.`,
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${SITE.url}/terms/` },
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
        <span className="text-[#111418] font-medium">Terms of Service</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] mb-2">Terms of Service</h1>
      <p className="text-xs text-[#78818E] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-sm sm:text-base text-[#3E4650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Orders & Pricing</h2>
          <p>
            All prices listed on {SITE.name} are in US dollars and exclude applicable state sales tax and freight,
            which are calculated transparently at checkout based on your delivery state. The minimum order value is
            ${SITE.orderRules.minOrder}. Placing an order through our checkout form constitutes a request to
            purchase; it is not a final sale until our dealership desk verifies unit allocation and confirms
            settlement instructions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Payment Methods &amp; Plans</h2>
          <p>
            We accept Cryptocurrency (Bitcoin / USDT — with an automatic {SITE.orderRules.cryptoDiscountPercent}%
            instant subtotal discount), domestic Bank Transfer (Wire / ACH), Zelle, Apple Pay, and Chime. Credit
            card processing is temporarily unavailable. After selecting a payment method at checkout, you also
            choose a payment plan: pay the full order total upfront, or split it with Pay-in-4 installment
            financing (25% due immediately, then three equal interest-free installments every 4 weeks). No funds are
            charged automatically at checkout — payment is settled directly with our dealership desk after order
            verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Pay-in-4 Financing</h2>
          <p>
            Pay-in-4 divides the total order into four equal, interest-free installments. The first 25%
            installment is due to reserve your unit allocation and begin crated freight preparation; the remaining
            three installments are due at 4-week intervals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Vehicle Documentation & Registration</h2>
          <p>
            Snowmobiles ship with a Manufacturer Certificate of Origin (MCO), itemized bill of sale, and
            pre-delivery inspection record. The buyer is solely responsible for completing vehicle registration,
            titling, and any state-specific trail permit requirements in their state of residence.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Cancellations</h2>
          <p>
            Orders may be cancelled prior to settlement confirmation by contacting our dealership desk. Once a
            settlement installment or full payment has been confirmed and crating/freight has begun, cancellation
            is subject to our Refund Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Governing Law</h2>
          <p>
            These terms are governed by the laws of the United States and the state in which {SITE.name} is
            operated, without regard to conflict-of-law principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Contact</h2>
          <p>
            Questions about these terms can be directed to{' '}
            <a href={`mailto:${SITE.contact.email}`} className="font-medium text-[#9A6B3E] underline">
              {SITE.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
