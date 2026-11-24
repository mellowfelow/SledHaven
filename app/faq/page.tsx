import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Freight, MCO Title & Payments',
  description:
    'Answers on buying snowmobiles online from SledHaven: state-calculated crated freight, MCO registration paperwork, Pay-in-4 financing, and 10% crypto discounts.',
  alternates: { canonical: '/faq/' },
};

const FAQS = [
  {
    q: 'How is snowmobile freight shipping calculated?',
    a: 'Vehicle freight is calculated automatically at checkout based on your delivery US state and regional carrier distance. Every snowmobile ships insured inside a protective transport crate with optional residential liftgate service. Accessories and riding gear orders of $500 or more qualify for free US parcel shipping.',
  },
  {
    q: 'What payment methods does SledHaven currently accept?',
    a: 'We currently accept Cryptocurrency (Bitcoin / USDT) with an automatic 10% instant subtotal discount, Domestic Bank Transfer (Wire / ACH), Zelle, Apple Pay, and Chime. Credit card processing is temporarily unavailable. After choosing your payment method at checkout, you also choose a payment plan — pay the full total upfront, or split it with Pay-in-4 financing.',
  },
  {
    q: 'How does the order and payment confirmation process work?',
    a: 'When you place an order through our checkout form, no funds are charged immediately. You receive an immediate order confirmation email while our dealership desk verifies unit allocation. Next, we email your personalized settlement instructions along with a tap-to-copy payment page and receipt upload link.',
  },
  {
    q: 'How does Pay-in-4 snowmobile financing work?',
    a: 'Pay-in-4 is a payment plan you select at checkout after choosing your payment method (Crypto, Bank Transfer, Zelle, Apple Pay, or Chime). It divides your total order into four equal interest-free installments. Remit the first 25% installment upon receiving your verified settlement instructions to lock your unit and begin crated freight dispatch. The remaining three payments follow every 30 days.',
  },
  {
    q: 'Do snowmobiles arrive with title / registration documentation for my state?',
    a: 'Yes. Every snowmobile ships with its Manufacturer Certificate of Origin (MCO), itemized dealership bill of sale, and pre-delivery inspection record so you can complete state trail registration smoothly in your home state.',
  },
  {
    q: 'What is the minimum order amount?',
    a: `The minimum order value on ${SITE.name} is $${SITE.orderRules.minOrder}. Orders for eligible protective gear or accessories above $${SITE.orderRules.freeShippingThreshold} ship free across the United States.`,
  },
];

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main className="flex-1 max-w-[960px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <JsonLd data={faqSchema} />

      <div className="mb-10 space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2">
          <Link href="/" className="hover:text-[#111418]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">FAQ</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          Freight, Title &amp; Payment FAQ
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] leading-relaxed">
          Clear answers on nationwide US snowmobile shipping, settlement options, and documentation.
        </p>
      </div>

      <div className="divide-y divide-[#E4E6E8] bg-white border border-[#E4E6E8] rounded-lg">
        {FAQS.map((item) => (
          <div key={item.q} className="p-6 sm:p-7 space-y-2">
            <h2 className="font-serif text-lg font-semibold text-[#111418]">{item.q}</h2>
            <p className="text-sm text-[#4F5863] leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm text-[#47505B]">
          Need a state-specific freight quote or custom fleet inquiry? Call{' '}
          <a href={SITE.contact.phoneHref} className="font-semibold text-[#111418] underline">
            {SITE.contact.phone}
          </a>
          .
        </div>
        <Link
          href="/contact/"
          className="px-4 py-2.5 text-xs font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] rounded-md whitespace-nowrap transition-colors"
        >
          Contact Dealership Desk
        </Link>
      </div>
    </main>
  );
}
