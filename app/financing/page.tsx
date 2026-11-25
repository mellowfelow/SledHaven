import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/catalog';
import { money } from '@/lib/order';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Pay-in-4 Snowmobile Financing — 4 Equal Installments',
  description:
    'Finance your SledHaven snowmobile with Pay in 4. Four equal interest-free installments with 25% due to lock allocation and initiate US crated freight.',
  alternates: { canonical: '/financing/' },
};

export default function FinancingPage() {
  const sampleSleds = PRODUCTS.filter((p) => p.isVehicle).slice(0, 6);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Financing', item: `${SITE.url}/financing/` },
    ],
  };

  return (
    <main className="flex-1">
      <JsonLd data={breadcrumb} />

      {/* Header Band */}
      <section className="bg-[#111418] text-white border-b border-[#232830]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-medium tracking-widest uppercase text-[#D2A97E]">
              Structured Dealership Acquisition
            </p>
            <h1
              className="font-serif text-3xl sm:text-5xl font-semibold leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Pay in 4 Snowmobile Financing
            </h1>
            <p className="text-sm sm:text-base text-[#D2D6DC] leading-relaxed">
              Divide any eligible SledHaven snowmobile into four equal 0% installments. Remit your first 25% payment to reserve your chassis serial number and schedule crated nationwide delivery.
            </p>
          </div>
        </div>
      </section>

      {/* How Pay-in-4 Works */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01. Select Your Model',
              desc: 'Add your snowmobile to your allocation bag and select "Pay in 4 Financing" during checkout.',
              Icon: FileText,
            },
            {
              step: '02. 25% Allocation Payment',
              desc: 'Receive verified settlement instructions by email and remit Installment 1 of 4 via Bank Transfer, Zelle, Apple Pay, Chime, or Crypto.',
              Icon: CheckCircle2,
            },
            {
              step: '03. Pre-Delivery & Freight',
              desc: 'Once Installment 1 clears, we complete multi-point inspection, crate your machine, and dispatch insured freight to your US state.',
              Icon: ShieldCheck,
            },
            {
              step: '04. Three Monthly Payments',
              desc: 'Settle the remaining three equal 25% installments every 4 weeks with 0% interest and zero prepayment penalties.',
              Icon: CalendarCheck,
            },
          ].map(({ step, desc, Icon }) => (
            <div
              key={step}
              className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-3"
            >
              <Icon className="w-5 h-5 text-[#9A6B3E]" strokeWidth={1.75} />
              <h2 className="text-base font-semibold text-[#111418]">{step}</h2>
              <p className="text-sm text-[#5C636E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Transparent Installment Schedule Table */}
        <div className="bg-white border border-[#E4E6E8] rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E4E6E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#111418]">
                Pay-in-4 Installment Reference
              </h2>
              <p className="text-xs text-[#5C636E] mt-1">
                Base vehicle pricing shown prior to state-calculated crated freight and applicable state tax.
              </p>
            </div>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9A6B3E] hover:text-[#111418] whitespace-nowrap"
            >
              <span>Browse All Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7F7F5] border-b border-[#E4E6E8] text-xs uppercase tracking-wider text-[#646D78]">
                  <th className="py-3.5 px-6 font-semibold">Model</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Retail Price</th>
                  <th className="py-3.5 px-6 font-semibold text-right">4 Installments (25% Each)</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF0] tabular-nums">
                {sampleSleds.map((sled) => (
                  <tr key={sled.id} className="hover:bg-[#FAFAFA]">
                    <td className="py-4 px-6 font-semibold text-[#111418]">{sled.name}</td>
                    <td className="py-4 px-6 text-[#5C636E]">{sled.categoryName}</td>
                    <td className="py-4 px-6 text-right text-[#111418]">{money(sled.price)}</td>
                    <td className="py-4 px-6 text-right font-semibold text-[#9A6B3E]">
                      {money(Math.round((sled.price / 4) * 100) / 100)} &times; 4
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/shop/${sled.category}/${sled.slug}/`}
                        className="text-xs font-medium text-[#111418] hover:text-[#9A6B3E] underline"
                      >
                        Select Model
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms & Direct Inquiry CTA */}
        <div className="bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-xl font-semibold text-[#111418]">
              Questions about Pay-in-4 eligibility or MCO release?
            </h2>
            <p className="text-sm text-[#4F5863] leading-relaxed">
              Pay-in-4 is available to US buyers on orders over ${SITE.orderRules.minOrder}. Speak directly with our dealership desk at{' '}
              <a href={SITE.contact.phoneHref} className="font-medium text-[#111418] underline">
                {SITE.contact.phone}
              </a>{' '}
              or submit an enquiry below.
            </p>
          </div>
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Contact Financing Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
