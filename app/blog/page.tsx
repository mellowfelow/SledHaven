import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';
import { BLOG_POSTS } from '@/config/blog';
import SmartImage from '@/components/SmartImage';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Journal & Snowmobile Buying Guides',
  description:
    'Technical guides on buying snowmobiles in the USA: crated freight, state MCO registration, mountain vs. trail specs, and Pay-in-4 vs. 10% crypto savings.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndexPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog/` },
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
          <span className="text-[#111418] font-medium">Blog</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          SledHaven Field Journal
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          Practical engineering breakdowns, US state freight &amp; registration guides, and acquisition insights for American snowmobile riders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col bg-white border border-[#E4E6E8] rounded-lg overflow-hidden hover:border-[#9A6B3E] transition-colors"
          >
            <Link
              href={`/blog/${post.slug}/`}
              className="relative aspect-[16/9] w-full bg-[#F3F1ED] overflow-hidden block"
            >
              <SmartImage
                src={post.coverImage}
                alt={post.coverAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-[#646D78] mb-2">
                <span className="text-[#9A6B3E] font-medium">{post.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{post.publishedAt}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readTime}</span>
              </div>
              <Link
                href={`/blog/${post.slug}/`}
                className="font-serif text-xl font-semibold text-[#111418] group-hover:text-[#9A6B3E] transition-colors leading-snug"
              >
                {post.title}
              </Link>
              <p className="mt-3 text-sm text-[#4F5863] leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}/`}
                className="mt-5 pt-4 border-t border-[#ECEEF0] inline-flex items-center gap-1.5 text-xs font-medium text-[#111418] group-hover:text-[#9A6B3E] transition-colors"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
