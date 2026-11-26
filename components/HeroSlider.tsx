'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Scale } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

interface HeroSlide {
  image: string;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const SLIDES: HeroSlide[] = [
  {
    image: '/images/hero-alpine.jpg',
    imageAlt: 'SledHaven snowmobile on an American mountain ridge at twilight',
    eyebrow: 'United States Snowmobile Dealership · 50-State Crated Delivery',
    heading: 'Snowmobiles for Sale. Engineered for American Winter.',
    body: 'Real Ski-Doo, Polaris, Arctic Cat, Lynx, and Taiga Motors inventory delivered crated to your door with full Manufacturer Certificate of Origin (MCO) documentation, Pay-in-4 financing, and 10% instant savings on BTC or USDT.',
    primaryCta: { label: 'Explore Inventory', href: '/shop/' },
    secondaryCta: { label: 'Compare Models', href: '/compare/' },
  },
  {
    image: '/images/hero-mountain-powder.jpg',
    imageAlt: 'Rider kicking up deep powder through a snow-laden tree line on a mountain snowmobile',
    eyebrow: 'Mountain Snowmobiles · Ski-Doo & Polaris',
    heading: 'Deep-Snow Flagships Built for Steep Technical Terrain',
    body: 'The real Ski-Doo Summit X with Expert Package and Polaris 850 RMK Khaos 155 — turbocharged power, long-travel suspension, and tall-lug tracks for the steepest lines.',
    primaryCta: { label: 'Shop Mountain Sleds', href: '/shop/mountain/' },
    secondaryCta: { label: 'View All Inventory', href: '/shop/' },
  },
  {
    image: '/images/hero-trail-action.jpg',
    imageAlt: 'Ski-Doo trail snowmobile kicking up snow spray at speed through aspen trees',
    eyebrow: 'Trail & Performance · Ski-Doo & Arctic Cat',
    heading: 'Groomed-Trail Performance, From Entry to Race-Ready',
    body: 'From the value-oriented Ski-Doo MXZ Sport to the turbocharged MXZ X-RS with Competition Package and Arctic Cat’s ZR 858 Sno Pro — real trail sleds at every price point.',
    primaryCta: { label: 'Shop Trail Sleds', href: '/shop/trail/' },
    secondaryCta: { label: 'Compare Models', href: '/compare/' },
  },
  {
    image: '/images/hero-touring-lake.jpg',
    imageAlt: 'Two riders on snowmobiles crossing an open frozen lake corridor at sunset',
    eyebrow: 'Touring & Luxury · Ski-Doo Grand Touring',
    heading: 'Two-Up Comfort for the Longest Corridor Days',
    body: 'Real Ski-Doo Grand Touring models with heated two-up seating and integrated luggage — plus zero-emission electric sleds from Ski-Doo and Taiga Motors for commercial, fleet, and backcountry use.',
    primaryCta: { label: 'Shop Touring Sleds', href: '/shop/touring/' },
    secondaryCta: { label: 'Shop Electric', href: '/shop/electric/' },
  },
];

const AUTO_ADVANCE_MS = 6500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const goTo = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || reducedMotion) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, paused, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <section
      className="relative bg-[#111418] text-white overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured snowmobile categories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative min-h-[540px] lg:min-h-[640px] flex items-center">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={i !== index}
          >
            <SmartImage
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0C0F13]/92 via-[#0C0F13]/68 to-[#0C0F13]/25"
              aria-hidden="true"
            />
          </div>
        ))}

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {SLIDES.map((slide, i) => {
            const isActive = i === index;
            const HeadingTag = i === 0 ? 'h1' : 'div';
            return (
              <div
                key={slide.heading}
                className={`max-w-2xl space-y-6 transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
                aria-hidden={!isActive}
                aria-live={i === 0 ? 'off' : undefined}
              >
                <p className="text-xs font-medium tracking-widest uppercase text-[#D2A97E]">
                  {slide.eyebrow}
                </p>

                <HeadingTag
                  className="font-serif font-semibold text-white leading-[1.1] tracking-tight"
                  style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.85rem)', textWrap: 'balance' }}
                >
                  {slide.heading}
                </HeadingTag>

                <p className="text-base sm:text-lg text-[#D8DDE4] leading-relaxed max-w-xl">
                  {slide.body}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.primaryCta.href}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium text-white bg-[#9A6B3E] hover:bg-[#835931] transition-colors whitespace-nowrap"
                  >
                    <span>{slide.primaryCta.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={slide.secondaryCta.href}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors whitespace-nowrap"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{slide.secondaryCta.label}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators + pause/play */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2" role="tablist" aria-label="Slide navigation">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.heading}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}: ${slide.heading}`}
                onClick={() => goTo(i)}
                className="p-2.5 -m-2.5 flex items-center justify-center cursor-pointer"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-[#D2A97E]' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
            className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
          >
            {paused || reducedMotion ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
