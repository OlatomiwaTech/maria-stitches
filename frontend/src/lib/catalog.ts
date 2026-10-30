import { demoProducts } from '@/lib/demo-products';
import { hasSupabaseConfig, createSupabaseServerClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';

export type CatalogResult = { products: Product[]; demoMode: boolean; connected: boolean };

export async function getCatalog(): Promise<CatalogResult> {
  if (!hasSupabaseConfig()) {
    const showDemo = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_DEMO_CATALOG === 'true';
    return { products: showDemo ? demoProducts : [], demoMode: showDemo, connected: false };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { products: [], demoMode: false, connected: false };
  const { data: rows, error } = await supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false });
  if (error || !rows?.length) return { products: [], demoMode: false, connected: true };

  const productIds = rows.map((product) => product.id);
  const categoryIds = [...new Set(rows.map((product) => product.category_id))];
  const [{ data: categoryRows }, { data: images }, { data: variants }] = await Promise.all([
    supabase.from('categories').select('*').in('id', categoryIds),
    supabase.from('product_images').select('*').in('product_id', productIds).order('sort_order'),
    supabase.from('product_variants').select('*').in('product_id', productIds).order('size'),
  ]);

  const categoryMap = new Map((categoryRows ?? []).map((category) => [category.id, category]));
  return {
    connected: true,
    demoMode: false,
    products: rows.flatMap((row) => {
      const category = categoryMap.get(row.category_id);
      if (!category) return [];
      return [{
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        category: { id: category.id, name: category.name, slug: category.slug, description: category.description ?? '', sortOrder: category.sort_order, isActive: category.is_active },
        priceNgn: Number(row.price_ngn),
        isDemo: row.is_demo,
        published: row.is_published,
        images: (images ?? []).filter((image) => image.product_id === row.id).map((image) => ({
          id: image.id,
          url: image.image_url,
          alt: image.alt_text,
          sourceUrl: image.source_url ?? image.image_url,
          photographer: image.photographer,
          license: image.license ?? 'Unknown',
        })),
        variants: (variants ?? []).filter((variant) => variant.product_id === row.id).map((variant) => ({
          id: variant.id,
          size: variant.size,
          color: variant.color,
          stockQuantity: variant.stock_quantity,
          available: variant.is_available && variant.stock_quantity > 0,
        })),
      }];
    }),
  };
}
