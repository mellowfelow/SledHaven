import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/config/site';
import { CATEGORIES, getCategoryBySlug, getProductsByCategory } from '@/config/catalog';
import ShopCatalogClient from '@/components/ShopCatalogClient';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await context.params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.seoH1 || cat.name} for Sale in the USA`,
    description: cat.description,
    alternates: { canonical: `/shop/${cat.slug}/` },
  };
}

export default async function CategoryPage(context: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await context.params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const items = getProductsByCategory(cat.slug);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: `${SITE.url}/shop/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: cat.name,
        item: `${SITE.url}/shop/${cat.slug}/`,
      },
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
          <Link href="/shop/" className="hover:text-[#111418]">
            Inventory
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111418] font-medium">{cat.name}</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#111418]">
          {cat.seoH1 || cat.name}
        </h1>
        <p className="text-sm sm:text-base text-[#4F5863] max-w-2xl leading-relaxed">
          {cat.description}
        </p>
      </div>

      <ShopCatalogClient products={items} activeCategorySlug={cat.slug} />
    </main>
  );
}
