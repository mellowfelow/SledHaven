import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.name} collects, uses, and protects customer information submitted through checkout, contact, and wholesale forms.`,
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE.url}/privacy/` },
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
        <span className="text-[#111418] font-medium">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] mb-2">Privacy Policy</h1>
      <p className="text-xs text-[#78818E] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-sm sm:text-base text-[#3E4650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Information We Collect</h2>
          <p>
            When you submit an order, contact enquiry, or wholesale request through {SITE.name}, we collect the
            information you provide directly: full name, email address, phone number, shipping address, and your
            selected payment method. We do not collect card numbers, bank account numbers, or wallet private keys
            through any form on this site — payment settlement details are exchanged separately through our
            dealership desk after order verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">How We Use Your Information</h2>
          <p>
            We use the information you submit to process your order, calculate freight and applicable state sales
            tax, generate your Manufacturer Certificate of Origin (MCO) paperwork, communicate order and payment
            status, and respond to enquiries. We do not sell customer information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Email Communications</h2>
          <p>
            Order confirmations, payment-details, and payment-confirmation emails are sent via our transactional
            email provider solely to service your order. We do not add customers to marketing lists without
            separate consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Data Retention & Security</h2>
          <p>
            Order and enquiry records are retained in our secured, passcode-gated dealership dashboard for
            fulfillment and customer-service purposes. Access to this dashboard is restricted to authorized
            {` ${SITE.name}`} staff via a server-side passcode that is never exposed to the public website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Your Rights</h2>
          <p>
            You may request a copy of, correction to, or deletion of the personal information we hold about you by
            contacting{' '}
            <a href={`mailto:${SITE.contact.email}`} className="font-medium text-[#835931] underline">
              {SITE.contact.email}
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#111418]">Contact</h2>
          <p>
            Questions about this policy can be directed to{' '}
            <a href={`mailto:${SITE.contact.email}`} className="font-medium text-[#835931] underline">
              {SITE.contact.email}
            </a>{' '}
            or{' '}
            <a href={SITE.contact.phoneHref} className="font-medium text-[#835931] underline">
              {SITE.contact.phone}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
