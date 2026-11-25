import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';
import { BLOG_POSTS, getBlogPostBySlug } from '@/config/blog';
import { getProductsByCategory } from '@/config/catalog';
import SmartImage from '@/components/SmartImage';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await context.params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage, alt: post.coverAlt }],
    },
  };
}

export default async function BlogArticlePage(context: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await context.params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedModels = getProductsByCategory(post.relatedCategorySlug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: `${SITE.url}${post.coverImage}`,
    author: {
      '@type': 'Organization',
      name: SITE.name,
    },
    publisher: {
      '@id': `${SITE.url}/#organization`,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE.url}/blog/${post.slug}/`,
      },
    ],
  };

  return (
    <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      <article className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#646D78] hover:text-[#111418]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Field Journal</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#646D78]">
            <span className="text-[#9A6B3E] font-medium">{post.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Published {post.publishedAt}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readTime}</span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4F5863] leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#E4E6E8] bg-[#F3F1ED]">
          <SmartImage
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            sizes="(max-width: 1040px) 100vw, 1040px"
            className="object-cover"
          />
        </div>

        <div className="bg-white border border-[#E4E6E8] rounded-lg p-6 sm:p-10 space-y-8 max-w-none">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="font-serif text-2xl font-semibold text-[#111418]">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base text-[#37404A] leading-relaxed max-w-[72ch]"
                >
                  {para}
                </p>
              ))}
            </section>
          ))}

          <div className="pt-6 border-t border-[#ECEEF0] flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#5C636E]">
              Have a state-specific delivery or specification question?
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/compare/"
                className="text-xs font-medium text-[#111418] hover:text-[#9A6B3E] underline"
              >
                Compare Models
              </Link>
              <Link
                href="/shop/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] transition-colors"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {relatedModels.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E4E6E8]">
          <h2 className="font-serif text-2xl font-semibold text-[#111418] mb-7">
            Featured Models Mentioned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedModels.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
