import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/config/site';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact SledHaven Dealership Concierge',
  description:
    'Contact SledHaven for US snowmobile inventory availability, state crated freight quotes, Pay-in-4 financing, and 10% crypto order assistance.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10 space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2">
          <Link href="/" className="hover:text-[#111418]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">Contact</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          Contact Our Dealership Desk
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Speak directly with our US snowmobile specialists regarding crated freight scheduling, Pay-in-4 installments, or specific model specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          <ContactFormClient />
        </div>

        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 space-y-5">
            <h2 className="font-serif text-lg font-semibold text-[#111418]">
              Direct Channels
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#9A6B3E] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#646D78]">
                    Sales &amp; Logistics Phone
                  </p>
                  <a
                    href={SITE.contact.phoneHref}
                    className="font-semibold text-[#111418] hover:text-[#9A6B3E] tabular-nums"
                  >
                    {SITE.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9A6B3E] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#646D78]">
                    Territory
                  </p>
                  <p className="text-[#111418] font-medium">{SITE.location.display}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#9A6B3E] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#646D78]">
                    Desk Response Window
                  </p>
                  <p className="text-[#4F5863]">
                    Monday – Saturday · Same-day email reply from our sales desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
