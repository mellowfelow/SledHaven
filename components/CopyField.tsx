'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

export default function CopyField({ label, value, mono = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for restricted clipboard contexts
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-[#E4E6E8] rounded-lg">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#646D78] mb-1">
          {label}
        </div>
        <div
          className={`text-sm sm:text-base font-semibold text-[#111418] break-all ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[40px] ${
          copied
            ? 'bg-emerald-700 text-white'
            : 'bg-[#111418] text-white hover:bg-[#9A6B3E]'
        }`}
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
