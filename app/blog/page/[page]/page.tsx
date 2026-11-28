import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/config/site';
import { BLOG_PAGE_SIZE, getBlogPageCount, getSortedBlogPosts } from '@/config/blog';
import BlogPostGrid from '@/components/BlogPostGrid';
import BlogPagination from '@/components/BlogPagination';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  const pageCount = getBlogPageCount();
  return Array.from({ length: pageCount - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata(context: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await context.params;
  return {
    title: `Journal & Snowmobile Buying Guides — Page ${page}`,
    description:
      'Technical guides on buying snowmobiles in the USA: crated freight, state MCO registration, mountain vs. trail specs, and Pay-in-4 vs. 10% crypto savings.',
    alternates: { canonical: `/blog/page/${page}/` },
  };
}

export default async function BlogPaginatedPage(context: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await context.params;
  const pageNum = Number(page);
  const pageCount = getBlogPageCount();

  if (!Number.isInteger(pageNum) || pageNum < 2 || pageNum > pageCount) notFound();

  const sortedPosts = getSortedBlogPosts();
  const start = (pageNum - 1) * BLOG_PAGE_SIZE;
  const pagePosts = sortedPosts.slice(start, start + BLOG_PAGE_SIZE);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog/` },
      { '@type': 'ListItem', position: 3, name: `Page ${pageNum}`, item: `${SITE.url}/blog/page/${pageNum}/` },
    ],
  };

  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={breadcrumb} />

      <div className="mb-10 space-y-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646D78] flex items-center gap-2">
          <Link href="/" className="hover:text-[#111418]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog/" className="hover:text-[#111418]">
            Blog
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">Page {pageNum}</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          SledHaven Field Journal
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Practical engineering breakdowns, US state freight &amp; registration guides, and acquisition insights for American snowmobile riders.
        </p>
      </div>

      <BlogPostGrid posts={pagePosts} />
      <BlogPagination currentPage={pageNum} pageCount={pageCount} />
    </main>
  );
}
