'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/config/site';
import { CATEGORIES } from '@/config/catalog';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#111418] text-[#D2D6DC] border-t border-[#232830]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo tone="light" size="md" />
            </Link>
            <p className="text-sm text-[#9AA2AE] leading-relaxed">
              {SITE.tagline} Insured crated snowmobile delivery across all 50 US states with full Manufacturer Certificate of Origin (MCO) documentation.
            </p>
            <div className="pt-2 space-y-1 text-sm">
              <a
                href={SITE.contact.phoneHref}
                className="block text-white hover:text-[#C89B6E] transition-colors tabular-nums"
              >
                {SITE.contact.phone}
              </a>
              <p className="text-xs text-[#88919E]">{SITE.location.display}</p>
            </div>
          </div>

          {/* Inventory Categories */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#9AA2AE] mb-4">
              Inventory
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop/" className="hover:text-white transition-colors">
                  All Snowmobiles &amp; Gear
                </Link>
              </li>
              <li>
                <Link href="/brands/" className="hover:text-white transition-colors">
                  Brands &amp; Divisions
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop/${cat.slug}/`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ownership & Tools */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#9AA2AE] mb-4">
              Ownership &amp; Guides
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/compare/" className="hover:text-white transition-colors">
                  Compare Models Side-by-Side
                </Link>
              </li>
              <li>
                <Link href="/financing/" className="hover:text-white transition-colors">
                  Pay-in-4 Financing
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-white transition-colors">
                  Field Journal &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/search/" className="hover:text-white transition-colors">
                  Search Inventory
                </Link>
              </li>
              <li>
                <Link href="/faq/" className="hover:text-white transition-colors">
                  Freight, Title &amp; Payment FAQ
                </Link>
              </li>
              <li>
                <Link href="/about/" className="hover:text-white transition-colors">
                  About {SITE.name}
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Payments & Standards */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#9AA2AE] mb-4">
              Settlement & Rules
            </h2>
            <ul className="space-y-2 text-sm text-[#9AA2AE]">
              <li>Crypto (BTC / USDT) — 10% Instant Discount</li>
              <li>Domestic Bank Transfer (Wire / ACH)</li>
              <li>Zelle · Apple Pay · Chime</li>
              <li>Pay-in-4 Installment Plan</li>
              <li className="text-[#78818E] text-xs pt-1">
                Credit Card processing temporarily unavailable
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-[#232830] text-xs text-[#88919E] space-y-1">
              <p>Min. Order: ${SITE.orderRules.minOrder} · Free Gear Shipping: ${SITE.orderRules.freeShippingThreshold}+</p>
              <p>Vehicle freight & applicable state tax calculated at checkout.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#232830] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#7E8794]">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved. US Off-Highway Vehicle & Snowmobile Retail.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy/" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping/" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <Link href="/refund/" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
