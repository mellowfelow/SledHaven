import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function pageHref(page: number): string {
  return page === 1 ? '/blog/' : `/blog/page/${page}/`;
}

export default function BlogPagination({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-sm transition-colors ${
          currentPage === 1
            ? 'pointer-events-none opacity-40 border-[#E4E6E8] text-[#646D78]'
            : 'border-[#E4E6E8] text-[#111418] hover:border-[#9A6B3E] hover:text-[#9A6B3E]'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={pageHref(n)}
          aria-current={n === currentPage ? 'page' : undefined}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
            n === currentPage
              ? 'bg-[#111418] border-[#111418] text-white'
              : 'border-[#E4E6E8] text-[#111418] hover:border-[#9A6B3E] hover:text-[#9A6B3E]'
          }`}
        >
          {n}
        </Link>
      ))}

      <Link
        href={pageHref(Math.min(pageCount, currentPage + 1))}
        aria-label="Next page"
        aria-disabled={currentPage === pageCount}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-sm transition-colors ${
          currentPage === pageCount
            ? 'pointer-events-none opacity-40 border-[#E4E6E8] text-[#646D78]'
            : 'border-[#E4E6E8] text-[#111418] hover:border-[#9A6B3E] hover:text-[#9A6B3E]'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
