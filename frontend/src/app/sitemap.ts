import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/care-plans',
    '/tools',
    '/tools/whatsapp-nurturer',
    '/tools/content-repurposer',
    '/audit',
    '/case-studies',
  ];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
