import { demoProducts } from '@/lib/demo-products';
import { demoCategories } from '@/lib/demo-products';
import { hasSupabaseConfig, createSupabaseServerClient } from '@/lib/supabase/server';
import type { Category, Product } from '@/lib/types';

export type CatalogResult = { products: Product[]; categories: Category[]; demoMode: boolean; connected: boolean };

export async function getCatalog(): Promise<CatalogResult> {
  if (!hasSupabaseConfig()) {
    const showDemo = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_DEMO_CATALOG === 'true';
    return { products: showDemo ? demoProducts : [], categories: showDemo ? demoCategories : [], demoMode: showDemo, connected: false };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { products: [], categories: [], demoMode: false, connected: false };
  const { data: rows, error } = await supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false });
  if (error) return { products: [], categories: [], demoMode: false, connected: true };

  const productIds = rows.map((product) => product.id);
  const [{ data: categoryRows }, { data: images }, { data: variants }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    productIds.length ? supabase.from('product_images').select('*').in('product_id', productIds).order('sort_order') : Promise.resolve({ data: [], error: null }),
    productIds.length ? supabase.from('product_variants').select('*').in('product_id', productIds).order('size') : Promise.resolve({ data: [], error: null }),
  ]);

  const categoryMap = new Map((categoryRows ?? []).map((category) => [category.id, category]));
  return {
    connected: true,
    demoMode: false,
    categories: (categoryRows ?? []).map((category) => ({ id: category.id, name: category.name, slug: category.slug, description: category.description ?? '', sortOrder: category.sort_order, isActive: category.is_active })),
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
