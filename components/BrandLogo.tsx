import React from 'react';
import Image from 'next/image';
import { SITE } from '@/config/site';

interface BrandLogoProps {
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md';
}

export default function BrandLogo({ tone = 'dark', size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 28 : 34;

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <Image
        src="/images/logo.jpg"
        alt={`${SITE.name} crest emblem`}
        width={iconSize}
        height={iconSize}
        referrerPolicy="no-referrer"
        className="rounded border border-[#9A6B3E]/40 object-cover shrink-0"
      />
      <span
        className={`font-serif font-semibold tracking-tight ${
          size === 'sm' ? 'text-lg' : 'text-xl sm:text-2xl'
        } ${tone === 'light' ? 'text-white' : 'text-[#111418]'}`}
      >
        {SITE.name}
      </span>
    </span>
  );
}
