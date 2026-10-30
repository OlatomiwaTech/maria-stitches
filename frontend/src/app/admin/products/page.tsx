import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminProductManager } from '@/components/admin-product-manager';
import { requireAdmin } from '@/lib/admin';
import { demoCategories } from '@/lib/demo-products';
import type { Category, Product } from '@/lib/types';

export const metadata: Metadata = { title: 'Manage products', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: products }, { data: categories }, { data: images }, { data: variants }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('product_images').select('*').order('sort_order'),
    supabase.from('product_variants').select('*').order('size'),
  ]);
  const categoryRows = categories ?? [];
  const categoryMap = new Map(categoryRows.map((category) => [category.id, category]));
  const rows: Product[] = (products ?? []).flatMap((product) => {
    const category = categoryMap.get(product.category_id);
    if (!category) return [];
    return [{
      id: product.id, name: product.name, slug: product.slug, description: product.description,
      category: { id: category.id, name: category.name, slug: category.slug, description: category.description ?? '' },
      priceNgn: Number(product.price_ngn), isDemo: product.is_demo, published: product.is_published,
      images: (images ?? []).filter((image) => image.product_id === product.id).map((image) => ({ id: image.id, url: image.image_url, alt: image.alt_text, sourceUrl: image.source_url ?? image.image_url, photographer: image.photographer, license: image.license ?? '' })),
      variants: (variants ?? []).filter((variant) => variant.product_id === product.id).map((variant) => ({ id: variant.id, size: variant.size, color: variant.color, stockQuantity: variant.stock_quantity, available: variant.is_available && variant.stock_quantity > 0 })),
    }];
  });
  const typedCategories: Category[] = categoryRows.map((category) => ({ id: category.id, name: category.name, slug: category.slug, description: category.description ?? '' }));
  const editableCategories = typedCategories.length ? typedCategories : demoCategories;
  return <main className="admin-shell"><div className="admin-heading"><div><span className="eyebrow">CATALOGUE</span><h1 className="story-title">Products.</h1><p>Replace sample details with confirmed product information before publishing.</p></div><Link className="back-home" href="/admin/dashboard">← Dashboard</Link></div><AdminProductManager products={rows} categories={editableCategories} /></main>;
}
