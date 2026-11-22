import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/order/',
          '/thank-you-order/',
          '/thank-you-contact/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot'],
        allow: '/',
        disallow: ['/admin/', '/order/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
