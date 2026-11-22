'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { SITE } from '@/config/site';

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || pathname?.startsWith('/admin')) return null;

  return (
    <div className="bg-[#111418] text-[#E5E8EC] border-b border-[#252B33]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 text-xs">
        <p className="truncate">
          {SITE.orderRules.cryptoDiscountPercent}% instant crypto discount (BTC/USDT) &middot; Pay-in-4 financing available &middot; Nationwide US crated delivery
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#9AA2AE] hover:text-white p-1 shrink-0 cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
