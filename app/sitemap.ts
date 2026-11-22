import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';
import { CATEGORIES, PRODUCTS } from '@/config/catalog';
import { BLOG_POSTS } from '@/config/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/shop/`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE.url}/brands/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/compare/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/financing/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/search/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE.url}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE.url}/shop/${cat.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE.url}/shop/${p.category}/${p.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
    images: [`${SITE.url}${p.image}`],
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}/`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
    images: [`${SITE.url}${post.coverImage}`],
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
