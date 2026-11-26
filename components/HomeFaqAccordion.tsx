'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export default function HomeFaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#E4E6E8] bg-white border border-[#E4E6E8] rounded-lg">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `home-faq-panel-${i}`;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 p-6 sm:p-7 text-left"
            >
              <span className="font-serif text-base sm:text-lg font-semibold text-[#111418]">
                {item.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-[#9A6B3E] transition-transform duration-300 motion-reduce:transition-none ${
                  isOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
              />
            </button>
            <div
              id={panelId}
              role="region"
              className={`grid transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 sm:px-7 pb-6 sm:pb-7 text-sm text-[#5C636E] leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
