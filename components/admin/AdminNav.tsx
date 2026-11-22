'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, LogOut } from 'lucide-react';
import { SITE } from '@/config/site';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import BrandLogo from '@/components/BrandLogo';

const ADMIN_LINKS = [
  { href: '/admin/', label: 'Dashboard' },
  { href: '/admin/orders/', label: 'Orders' },
  { href: '/admin/enquiries/', label: 'Enquiries' },
  { href: '/admin/send-payment-email/', label: 'Send Payment' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useAdminPasscode();

  return (
    <header
      className="text-white border-b-2"
      style={{
        backgroundColor: SITE.reply.brand.headerDark,
        borderColor: SITE.reply.brand.primary,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/admin/" className="shrink-0">
          <BrandLogo tone="light" size="sm" />
        </Link>

        <nav className="flex items-center gap-5 overflow-x-auto text-xs sm:text-sm">
          {ADMIN_LINKS.map((link) => {
            const active =
              link.href === '/admin/'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname?.startsWith(link.href.replace(/\/$/, ''));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  active
                    ? 'text-white font-medium'
                    : 'text-[#A8B0BC] border-transparent hover:text-white'
                }`}
                style={active ? { borderColor: SITE.reply.brand.primary } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#C2C8D0] hover:text-white whitespace-nowrap"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>
    </header>
  );
}
