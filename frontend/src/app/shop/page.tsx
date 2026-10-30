import type { Metadata } from 'next';
import { DemoNotice } from '@/components/demo-notice';
import { ProductGrid } from '@/components/product-grid';
import { getCatalog } from '@/lib/catalog';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'Shop ready-to-wear', description: 'Browse ready-to-wear sample styles from Maria Stitches in Sango Ota, Ogun State.' };

export default async function ShopPage() {
  const catalog = await getCatalog();
  const settings = await getSiteSettings();
  const categories = catalog.categories;
  return <main className="page-shell">
    <span className="eyebrow">THE MARIA STITCHES SHOP</span><h1 className="page-title">Ready-to-wear,<br /><em>your way.</em></h1>
    <p className="page-intro">Browse the sample collection by category or search for a style. Message Maria Stitches to confirm current availability and final product details.</p>
    {catalog.demoMode && <DemoNotice />}
    <ProductGrid products={catalog.products} categories={categories} whatsappNumber={settings.whatsappNumber} />
  </main>;
}
