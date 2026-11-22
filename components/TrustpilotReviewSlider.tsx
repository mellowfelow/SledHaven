'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Star,
} from 'lucide-react';
import {
  CUSTOMER_REVIEWS,
  REVIEW_SUMMARY,
  type CustomerReview,
  type ReviewCategory,
} from '@/config/reviews';

const TRUSTPILOT_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: '#00B67A',
  4: '#73CF11',
  3: '#FFCE00',
  2: '#FF8622',
  1: '#FF3722',
};

const TOPIC_FILTERS: ('All' | ReviewCategory)[] = [
  'All',
  'Product Quality',
  'Delivery Promptness',
  'Customer Service',
  'Post-Purchase Follow-Up',
];

const AUTOPLAY_MS = 6500;

function TrustpilotStars({
  rating,
  size = 'sm',
  halfLast = false,
}: {
  rating: number;
  size?: 'sm' | 'lg';
  halfLast?: boolean;
}) {
  const rounded = Math.max(1, Math.min(5, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
  const activeColor = halfLast ? '#00B67A' : TRUSTPILOT_COLORS[rounded];
  const fullCount = halfLast ? Math.floor(rating) : rounded;
  const tileClass = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const iconClass = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div
      className="inline-flex items-center gap-[3px] shrink-0"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((idx) => {
        const isFull = idx <= fullCount;
        const isHalf = halfLast && idx === fullCount + 1;

        return (
          <span
            key={idx}
            className={`${tileClass} relative inline-flex items-center justify-center rounded-[2px] overflow-hidden`}
            style={{
              backgroundColor: isFull ? activeColor : '#DCDCE6',
            }}
          >
            {isHalf && (
              <span
                className="absolute inset-y-0 left-0 w-1/2"
                style={{ backgroundColor: activeColor }}
                aria-hidden="true"
              />
            )}
            <Star
              className={`${iconClass} relative z-10 text-white fill-white`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        );
      })}
    </div>
  );
}

function getInitials(name: string): string {
  const clean = name.replace(/_/g, ' ').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function formatDisplayName(name: string): string {
  if (!name.includes('_')) return name;
  return name
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export default function TrustpilotReviewSlider() {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<'All' | ReviewCategory>('All');
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [perPage, setPerPage] = useState(3);

  // Sync responsive cards-per-slide (3 desktop, 2 tablet, 1 mobile)
  useEffect(() => {
    function updatePerPage() {
      const w = window.innerWidth;
      if (w >= 1024) setPerPage(3);
      else if (w >= 768) setPerPage(2);
      else setPerPage(1);
    }
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  const filteredReviews = useMemo(() => {
    return CUSTOMER_REVIEWS.filter((r) => {
      if (selectedStar !== null && r.rating !== selectedStar) return false;
      if (selectedTopic !== 'All' && r.category !== selectedTopic) return false;
      return true;
    });
  }, [selectedStar, selectedTopic]);

  const slides: CustomerReview[][] = useMemo(() => {
    const chunks: CustomerReview[][] = [];
    for (let i = 0; i < filteredReviews.length; i += perPage) {
      chunks.push(filteredReviews.slice(i, i + perPage));
    }
    return chunks;
  }, [filteredReviews, perPage]);

  const totalSlides = Math.max(1, slides.length);
  const safeSlideIndex = Math.min(slideIndex, totalSlides - 1);
  const activeCards = slides[safeSlideIndex] || [];

  const goNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(-1);
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback(
    (target: number) => {
      if (target === safeSlideIndex) return;
      setDirection(target > safeSlideIndex ? 1 : -1);
      setSlideIndex(target);
    },
    [safeSlideIndex]
  );

  // Auto-advance timer (pauses cleanly on hover or manual pause)
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setSlideIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, totalSlides]);

  function handleStarSelect(stars: number) {
    setSelectedStar((prev) => (prev === stars ? null : stars));
    setSlideIndex(0);
    setDirection(1);
  }

  function handleTopicSelect(topic: 'All' | ReviewCategory) {
    setSelectedTopic(topic);
    setSlideIndex(0);
    setDirection(1);
  }

  function resetFilters() {
    setSelectedStar(null);
    setSelectedTopic('All');
    setSlideIndex(0);
    setDirection(1);
  }

  const hasActiveFilter = selectedStar !== null || selectedTopic !== 'All';

  return (
    <section
      aria-label="Verified Customer Reviews"
      className="bg-[#F7F7F5] border-b border-[#E4E6E8]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        {/* Top Trustpilot Summary & Interactive 5-4-3-2-1 Distribution Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pb-10 border-b border-[#E4E6E8]">
          {/* Left: Trustpilot Rating Scoreblock */}
          <div className="lg:col-span-4 space-y-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#111418]">
              <Star
                className="w-5 h-5 text-[#00B67A] fill-[#00B67A] shrink-0"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="tracking-tight">Verified Rider Reviews</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2
                className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] leading-none"
                style={{ textWrap: 'balance' }}
              >
                {REVIEW_SUMMARY.verdict}
              </h2>
              <span className="text-lg font-mono font-semibold text-[#111418] tabular-nums">
                {REVIEW_SUMMARY.averageRating.toFixed(1)} / 5
              </span>
            </div>

            <div className="pt-0.5">
              <TrustpilotStars rating={REVIEW_SUMMARY.averageRating} size="lg" halfLast />
            </div>

            <p className="text-sm text-[#4F5863] leading-relaxed tabular-nums">
              Based on{' '}
              <strong className="font-semibold text-[#111418]">
                {REVIEW_SUMMARY.totalReviews.toLocaleString('en-US')}+ verified reviews
              </strong>{' '}
              across product quality, crated delivery, customer service, and post-purchase follow-up.
            </p>
          </div>

          {/* Center: Interactive 5-4-3-2-1 Breakdown Bars */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#646D78] mb-2">
              <span>Filter by star rating (click any bar)</span>
              {selectedStar !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStar(null);
                    setSlideIndex(0);
                  }}
                  className="text-[#00B67A] hover:text-[#111418] font-medium cursor-pointer"
                >
                  Show all stars
                </button>
              )}
            </div>

            {REVIEW_SUMMARY.distribution.map((row) => {
              const isSelected = selectedStar === row.stars;
              const barColor = TRUSTPILOT_COLORS[row.stars];
              return (
                <button
                  key={row.stars}
                  type="button"
                  onClick={() => handleStarSelect(row.stars)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center gap-3 py-1 px-2 -mx-2 rounded-md text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#F3F5F4] ring-1 ring-[#111418]/15'
                      : 'hover:bg-[#F7F7F5]'
                  }`}
                >
                  <span className="w-12 text-xs font-medium text-[#111418] shrink-0 tabular-nums whitespace-nowrap">
                    {row.label}
                  </span>
                  <div className="flex-1 h-2.5 bg-[#ECEEF0] rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-opacity duration-200"
                      style={{
                        width: `${row.percent}%`,
                        backgroundColor: barColor,
                        opacity: selectedStar !== null && !isSelected ? 0.35 : 1,
                      }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs text-[#5C636E] tabular-nums shrink-0 whitespace-nowrap">
                    {row.percent}% · {row.count.toLocaleString('en-US')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Slider Revolution Playback & Arrow Controls */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
            <div className="text-left lg:text-right space-y-1">
              <p className="text-xs font-medium text-[#646D78]">Showing Verified Feedback</p>
              <p className="text-sm font-semibold text-[#111418] font-mono tabular-nums">
                Slide {String(safeSlideIndex + 1).padStart(2, '0')} /{' '}
                {String(totalSlides).padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause review slider' : 'Play review slider'}
                className="w-10 h-10 inline-flex items-center justify-center rounded-md border border-[#D6DBE0] bg-white text-[#111418] hover:border-[#111418] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={goPrev}
                disabled={totalSlides <= 1}
                aria-label="Previous reviews slide"
                className="w-10 h-10 inline-flex items-center justify-center rounded-md border border-[#D6DBE0] bg-white text-[#111418] hover:border-[#111418] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={totalSlides <= 1}
                aria-label="Next reviews slide"
                className="w-10 h-10 inline-flex items-center justify-center rounded-md bg-[#111418] text-white hover:bg-[#00B67A] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Topic Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E4E6E8] rounded-lg"
            role="tablist"
            aria-label="Filter reviews by topic"
          >
            {TOPIC_FILTERS.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTopicSelect(topic)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#111418] text-white'
                      : 'text-[#47505B] hover:text-[#111418]'
                  }`}
                >
                  {topic === 'All' ? 'All Topics' : topic}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#5C636E] tabular-nums">
            <span>
              {filteredReviews.length}{' '}
              {filteredReviews.length === 1 ? 'featured review' : 'featured reviews'} matching
            </span>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-medium text-[#111418] hover:text-[#00B67A] cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Slider Revolution Stage */}
        <div className="relative overflow-hidden">
          {/* Sleek Slider Revolution Progress Indicator */}
          {totalSlides > 1 && (
            <div className="h-[2px] w-full bg-[#ECEEF0] mb-6 overflow-hidden rounded-full">
              <motion.div
                key={`progress-${safeSlideIndex}-${selectedStar ?? 'all'}-${selectedTopic}-${isPlaying}-${isHovered}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPlaying && !isHovered ? 1 : 0 }}
                transition={{
                  duration: isPlaying && !isHovered ? AUTOPLAY_MS / 1000 : 0.2,
                  ease: 'linear',
                }}
                style={{ transformOrigin: 'left center' }}
                className="h-full bg-[#00B67A]"
              />
            </div>
          )}

          {filteredReviews.length === 0 ? (
            <div className="py-14 px-6 bg-[#F7F7F5] border border-[#E4E6E8] rounded-lg text-center space-y-3">
              <p className="text-sm font-semibold text-[#111418]">
                No featured reviews match that exact star &amp; topic combination.
              </p>
              <p className="text-xs text-[#5C636E]">
                Clear one of the filters to inspect all verified customer experiences across 5–1 stars.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#111418] hover:bg-[#00B67A] rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>View All Reviews</span>
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={`slide-${safeSlideIndex}-${perPage}-${selectedStar ?? 'all'}-${selectedTopic}`}
                custom={direction}
                initial={{ opacity: 0, x: direction * 44, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -44, scale: 0.99 }}
                transition={{
                  duration: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
                drag={totalSlides > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goNext();
                  else if (info.offset.x > 60) goPrev();
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-grab active:cursor-grabbing"
              >
                {activeCards.map((review) => (
                  <article
                    key={review.id}
                    className="flex flex-col bg-white border border-[#E4E6E8] rounded-lg p-6 hover:border-[#C5CDD4] transition-colors h-full"
                  >
                    {/* Card Top: Trustpilot Star Tiles + Verified + Relative Date */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <TrustpilotStars rating={review.rating} size="sm" />
                        <span className="text-xs font-mono font-semibold text-[#111418] tabular-nums">
                          {review.rating}.0
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-[#5C636E] whitespace-nowrap">
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#5C636E] shrink-0"
                              aria-hidden="true"
                            />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#646D78] whitespace-nowrap shrink-0">
                        {review.relativeDate}
                      </span>
                    </div>

                    {/* Review Headline & Body */}
                    <h3 className="text-base font-semibold text-[#111418] leading-snug mb-2">
                      {review.title}
                    </h3>
                    <p className="text-sm text-[#3B424D] leading-relaxed flex-1">
                      {review.body}
                    </p>

                    {/* Optional Accountable Dealership Reply (for 3, 2, 1-star reviews) */}
                    {review.dealershipReply && (
                      <div className="mt-4 pt-3.5 border-t border-[#ECEEF0] space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#5C636E]">
                          <span className="font-semibold text-[#111418]">
                            Reply from SledHaven Desk
                          </span>
                          <span>{review.dealershipReply.date}</span>
                        </div>
                        <p className="text-xs text-[#4F5863] leading-relaxed">
                          {review.dealershipReply.body}
                        </p>
                      </div>
                    )}

                    {/* Card Footer: Reviewer + Topic + Date of Experience */}
                    <div className="mt-5 pt-4 border-t border-[#E4E6E8] space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-[#111418] text-white text-xs font-semibold inline-flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          {getInitials(review.author)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111418] truncate">
                            {formatDisplayName(review.author)}
                          </p>
                          <p className="text-[11px] text-[#646D78] truncate">
                            {review.location} &middot; {review.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#646D78] tabular-nums">
                        Date of experience:{' '}
                        <span className="text-[#47505B] font-medium">
                          {review.dateOfExperience}
                        </span>
                      </p>
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Bottom Slider Revolution Pagination Scrubber */}
        {totalSlides > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1" role="tablist" aria-label="Review slides">
              {slides.map((_, idx) => {
                const isCurrent = idx === safeSlideIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to review slide ${idx + 1} of ${totalSlides}`}
                    onClick={() => goToSlide(idx)}
                    className="py-2.5 px-1 inline-flex items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`h-2 rounded-full transition-all block ${
                        isCurrent
                          ? 'w-8 bg-[#00B67A]'
                          : 'w-2.5 bg-[#CFD4DC] hover:bg-[#9AA2AE]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#646D78] text-center sm:text-right">
              Showing representative excerpts from our 2,400+ verified buyer reviews (5★ to 1★) &middot; Drag or use arrows to browse.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
