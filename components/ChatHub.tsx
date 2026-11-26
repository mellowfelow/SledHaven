'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, MessageCircle, MessageSquare, Phone, X } from 'lucide-react';
import { SITE } from '@/config/site';
import { waGeneralInquiryLink } from '@/lib/whatsapp';

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      onChatMinimized?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      maximize?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export default function ChatHub() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tawkConfigured = Boolean(SITE.chat.tawkPropertyId);

  // Inject Tawk.to if configured, but keep its own floating bubble hidden —
  // it's opened on demand from the "Live Chat" option in this same panel,
  // so there's only ever one chat entry point on the page.
  useEffect(() => {
    const propId = SITE.chat.tawkPropertyId;
    const widgetId = SITE.chat.tawkWidgetId || 'default';
    if (!propId || typeof window === 'undefined') return;
    if (document.getElementById('sledhaven-tawk-script')) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API?.hideWidget?.();
    };
    window.Tawk_API.onChatMinimized = function () {
      window.Tawk_API?.hideWidget?.();
    };
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = 'sledhaven-tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${encodeURIComponent(propId)}/${encodeURIComponent(widgetId)}`;
    script.charset = 'UTF-8';
    document.body.appendChild(script);
  }, []);

  function openLiveChat() {
    setOpen(false);
    window.Tawk_API?.showWidget?.();
    window.Tawk_API?.maximize?.();
  }

  // Hide inside Reply Portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open && (
        <div className="mb-3 w-72 bg-white border border-[#E4E6E8] rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#111418] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{SITE.name} Concierge</p>
              <p className="text-[11px] text-[#B8C0CC]">US Sales & Freight Desk</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#B8C0CC] hover:text-white p-1 cursor-pointer"
              aria-label="Close concierge menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 space-y-2 text-sm">
            {tawkConfigured && (
              <button
                type="button"
                onClick={openLiveChat}
                className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F7F7F5] text-[#111418] transition-colors cursor-pointer text-left"
              >
                <MessageSquare className="w-4 h-4 text-[#9A6B3E] shrink-0" />
                <div>
                  <div className="font-medium text-xs">Live Chat</div>
                  <div className="text-xs text-[#5C636E]">Chat with our sales desk now</div>
                </div>
              </button>
            )}
            <a
              href={waGeneralInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F7F7F5] text-[#111418] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <div>
                <div className="font-medium text-xs">Message on WhatsApp</div>
                <div className="text-xs text-[#5C636E] tabular-nums">{SITE.contact.phone}</div>
              </div>
            </a>
            <a
              href={SITE.contact.phoneHref}
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F7F7F5] text-[#111418] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#9A6B3E] shrink-0" />
              <div>
                <div className="font-medium text-xs">Call Dealership Desk</div>
                <div className="text-xs text-[#5C636E] tabular-nums">{SITE.contact.phone}</div>
              </div>
            </a>
            <Link
              href="/contact/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F7F7F5] text-[#111418] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#9A6B3E] shrink-0" />
              <div>
                <div className="font-medium text-xs">Send Direct Enquiry</div>
                <div className="text-xs text-[#5C636E]">Freight quotes & Pay-in-4 terms</div>
              </div>
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111418] text-white text-xs font-medium shadow-lg hover:bg-[#9A6B3E] transition-colors cursor-pointer min-h-[44px]"
        aria-label="Open dealership concierge contact options"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Concierge</span>
      </button>
    </div>
  );
}
