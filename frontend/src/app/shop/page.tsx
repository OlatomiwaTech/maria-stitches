import type { Metadata } from 'next';
import { DemoNotice } from '@/components/demo-notice';
import { ProductGrid } from '@/components/product-grid';
import { getCatalog } from '@/lib/catalog';
import { demoCategories } from '@/lib/demo-products';

export const metadata: Metadata = { title: 'Shop ready-to-wear', description: 'Browse ready-to-wear sample styles from Maria Stitches in Sango Ota, Ogun State.' };

export default async function ShopPage() {
  const catalog = await getCatalog();
  const categories = catalog.demoMode ? demoCategories : [...new Map(catalog.products.map((product) => [product.category.slug, product.category])).values()];
  return <main className="page-shell">
    <span className="eyebrow">THE MARIA STITCHES SHOP</span><h1 className="page-title">Ready-to-wear,<br /><em>your way.</em></h1>
    <p className="page-intro">Browse the sample collection by category or search for a style. Message Maria Stitches to confirm current availability and final product details.</p>
    {catalog.demoMode && <DemoNotice />}
    <ProductGrid products={catalog.products} categories={categories} />
  </main>;
}
