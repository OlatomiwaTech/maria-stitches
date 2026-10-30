import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mariastiches.vercel.app').replace(/\/$/, '');
  const staticPages = ['', '/shop', '/custom-order', '/about', '/contact', '/faq', '/privacy'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === '/shop' ? 'daily' as const : 'monthly' as const,
    priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.6,
  }));
  const { products } = await getCatalog();
  const productPages = products.filter((product) => product.published).map((product) => ({
    url: `${base}/shop/${product.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  return [...staticPages, ...productPages];
}
