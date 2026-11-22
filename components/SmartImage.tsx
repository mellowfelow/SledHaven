'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mountain } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function SmartImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className = '',
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE7] text-[#5C636E] ${
          fill ? 'absolute inset-0' : 'w-full h-full min-h-[200px]'
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        <Mountain className="w-8 h-8 mb-2 opacity-50" strokeWidth={1.5} />
        <span className="text-xs tracking-wide px-4 text-center">{alt}</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
        priority={priority}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1200}
      height={height || 900}
      sizes={sizes}
      priority={priority}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
