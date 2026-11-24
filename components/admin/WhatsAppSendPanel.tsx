'use client';

import React, { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { waPaymentDetailsLink, waPaymentDetailsMessage } from '@/lib/whatsapp';

interface WhatsAppSendPanelProps {
  customerPhone: string;
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
  paymentPlan?: 'full' | 'pay_in_4';
  total: number;
  rawDetail: string;
  paymentPageUrl: string;
  confirmPageUrl: string;
}

export default function WhatsAppSendPanel(props: WhatsAppSendPanelProps) {
  const [copied, setCopied] = useState(false);

  const message = waPaymentDetailsMessage({
    orderNumber: props.orderNumber,
    customerName: props.customerName,
    paymentMethod: props.paymentMethod,
    paymentPlan: props.paymentPlan,
    total: props.total,
    rawDetail: props.rawDetail,
    paymentPageUrl: props.paymentPageUrl,
    confirmPageUrl: props.confirmPageUrl,
  });

  const href = waPaymentDetailsLink(props.customerPhone, {
    orderNumber: props.orderNumber,
    customerName: props.customerName,
    paymentMethod: props.paymentMethod,
    paymentPlan: props.paymentPlan,
    total: props.total,
    rawDetail: props.rawDetail,
    paymentPageUrl: props.paymentPageUrl,
    confirmPageUrl: props.confirmPageUrl,
  });

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-white border border-[#E4E6E8] rounded-lg p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111418]">
            WhatsApp Reply Panel
          </h3>
          <p className="text-xs text-[#5C636E]">
            Pre-filled admin message to {props.customerPhone} using the bold dealership header.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyMessage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#D6DBE0] text-xs font-medium text-[#111418] hover:bg-[#F7F7F5] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Send via WhatsApp</span>
          </a>
        </div>
      </div>

      <pre className="p-3.5 rounded-md bg-[#F7F7F5] border border-[#E4E6E8] text-xs text-[#2B313A] whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
        {message}
      </pre>
    </div>
  );
}
