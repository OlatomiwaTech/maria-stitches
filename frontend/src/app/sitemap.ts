import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return ['', '/shop', '/custom-order', '/about', '/contact', '/faq', '/privacy'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === '/shop' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.6,
  }));
}
