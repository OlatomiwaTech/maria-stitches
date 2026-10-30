'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';

const imageUrlSchema = z.string().url().refine((value) => {
  const url = new URL(value);
  const projectHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '';
  return Boolean(projectHost && url.hostname === projectHost && url.pathname.includes('/storage/v1/object/public/product-images/'));
}, 'Upload the product photo to the Maria Stitches product-images bucket.');

export type ActionResult = { ok: boolean; message: string };

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the product details.' };
  const image = imageUrlSchema.safeParse(formData.get('imageUrl'));
  if (!image.success) return { ok: false, message: image.error.issues[0]?.message ?? 'Upload a product image.' };
  const { supabase } = await requireAdmin();
  const slug = slugify(parsed.data.name);
  const { data: product, error } = await supabase.from('products').insert({
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
    price_ngn: parsed.data.priceNgn,
    is_demo: false,
    is_published: false,
  }).select('id').single();
  if (error || !product) return { ok: false, message: error?.code === '23505' ? 'A product with a similar slug already exists.' : 'The product could not be created.' };

  const [imageInsert, variantInsert] = await Promise.all([
    supabase.from('product_images').insert({ product_id: product.id, image_url: image.data, alt_text: parsed.data.imageAlt || parsed.data.name, source_url: image.data, photographer: null, license: 'Uploaded by Maria Stitches', sort_order: 0 }),
    supabase.from('product_variants').insert(parsed.data.sizes.flatMap((size) => parsed.data.colors.map((color) => ({ product_id: product.id, size, color: color || null, stock_quantity: parsed.data.stockQuantity, is_available: parsed.data.stockQuantity > 0 })))),
  ]);
  if (imageInsert.error || variantInsert.error) {
    await supabase.from('products').delete().eq('id', product.id);
    return { ok: false, message: 'Product details could not be saved. Check the category and try again.' };
  }
  revalidatePath('/shop'); revalidatePath('/admin/products');
  return { ok: true, message: 'Product created as a genuine item. It is unpublished until you choose to publish it.' };
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  const id = z.string().uuid().safeParse(formData.get('id'));
  const parsed = productSchema.safeParse(readProductForm(formData));
  const image = imageUrlSchema.safeParse(formData.get('imageUrl'));
  const publish = formData.get('isPublished') === 'true';
  if (!id.success || !parsed.success || !image.success) return { ok: false, message: !parsed.success ? parsed.error.issues[0]?.message ?? 'Check the product details.' : !image.success ? 'Upload a replacement product photo before marking this as genuine.' : 'Invalid product id.' };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('products').update({ category_id: parsed.data.categoryId, name: parsed.data.name, slug: slugify(parsed.data.name), description: parsed.data.description, price_ngn: parsed.data.priceNgn, is_demo: false, is_published: publish }).eq('id', id.data);
  if (error) return { ok: false, message: error.code === '23505' ? 'A product with a similar slug already exists.' : 'The product could not be updated.' };
  await supabase.from('product_variants').update({ stock_quantity: 0, is_available: false }).eq('product_id', id.data);
  const variantResult = await supabase.from('product_variants').upsert(parsed.data.sizes.flatMap((size) => parsed.data.colors.map((color) => ({ product_id: id.data, size, color: color || null, stock_quantity: parsed.data.stockQuantity, is_available: parsed.data.stockQuantity > 0 }))), { onConflict: 'product_id,variant_key' });
  if (variantResult.error) return { ok: false, message: 'Product details saved, but size and colour options did not update.' };
  const { error: imageDeleteError } = await supabase.from('product_images').delete().eq('product_id', id.data);
  if (imageDeleteError) return { ok: false, message: 'Product details saved, but the old product image could not be replaced.' };
  const imageResult = await supabase.from('product_images').insert({ product_id: id.data, image_url: image.data, alt_text: parsed.data.imageAlt || parsed.data.name, source_url: image.data, photographer: null, license: 'Uploaded by Maria Stitches', sort_order: 0 });
  if (imageResult.error) return { ok: false, message: 'Product details saved, but the new image did not update.' };
  revalidatePath('/shop'); revalidatePath(`/shop/${slugify(parsed.data.name)}`); revalidatePath('/admin/products');
  return { ok: true, message: `Product updated${publish ? ' and published' : ''}.` };
}

export async function updateVariantStock(formData: FormData): Promise<ActionResult> {
  const parsed = z.object({ id: z.string().uuid(), stock: z.coerce.number().int().min(0).max(100000) }).safeParse({ id: formData.get('variantId'), stock: formData.get('stock') });
  if (!parsed.success) return { ok: false, message: 'Enter a valid stock quantity.' };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('product_variants').update({ stock_quantity: parsed.data.stock, is_available: parsed.data.stock > 0 }).eq('id', parsed.data.id);
  if (error) return { ok: false, message: 'Stock could not be updated.' };
  revalidatePath('/shop'); revalidatePath('/admin/products');
  return { ok: true, message: 'Stock updated.' };
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  const id = z.string().uuid().safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: 'Invalid product id.' };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('products').delete().eq('id', id.data);
  if (error) return { ok: false, message: 'This product could not be deleted. It may be part of an order history; unpublish it instead.' };
  revalidatePath('/shop'); revalidatePath('/admin/products');
  return { ok: true, message: 'Product deleted.' };
}

export async function saveCategory(formData: FormData): Promise<ActionResult> {
  const idValue = formData.get('id');
  const parsed = z.object({ name: z.string().trim().min(2).max(80), description: z.string().trim().max(300), sortOrder: z.coerce.number().int().min(0).max(1000) }).safeParse({ name: formData.get('name'), description: formData.get('description') ?? '', sortOrder: formData.get('sortOrder') ?? 0 });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the category details.' };
  const { supabase } = await requireAdmin();
  const values = { name: parsed.data.name, slug: slugify(parsed.data.name), description: parsed.data.description || null, sort_order: parsed.data.sortOrder, is_active: formData.get('isActive') !== 'false' };
  const id = z.string().uuid().safeParse(idValue);
  const result = id.success
    ? await supabase.from('categories').update(values).eq('id', id.data)
    : await supabase.from('categories').insert(values);
  if (result.error) return { ok: false, message: result.error.code === '23505' ? 'A category with that name already exists.' : 'Category could not be saved.' };
  revalidatePath('/', 'layout'); revalidatePath('/shop'); revalidatePath('/admin/products');
  return { ok: true, message: id.success ? 'Category updated.' : 'Category added.' };
}

export async function deleteCategory(formData: FormData): Promise<ActionResult> {
  const id = z.string().uuid().safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: 'Invalid category.' };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('categories').delete().eq('id', id.data);
  if (error) return { ok: false, message: 'This category has products or could not be deleted. Deactivate it instead.' };
  revalidatePath('/', 'layout'); revalidatePath('/shop'); revalidatePath('/admin/products');
  return { ok: true, message: 'Category deleted.' };
}

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  categoryId: z.string().uuid(),
  priceNgn: z.coerce.number().int().positive().max(100000000),
  sizes: z.array(z.string().trim().min(1).max(30)).min(1).max(12),
  colors: z.array(z.string().trim().max(40)).min(1).max(10),
  stockQuantity: z.coerce.number().int().min(0).max(100000),
  imageAlt: z.string().trim().max(200).optional().default(''),
}).refine((data) => new Set(data.sizes.map((value) => value.toLowerCase())).size === data.sizes.length, { path: ['sizes'], message: 'Sizes must not be repeated.' })
  .refine((data) => new Set(data.colors.map((value) => value.toLowerCase())).size === data.colors.length, { path: ['colors'], message: 'Colours must not be repeated.' });

function readProductForm(formData: FormData) {
  const sizes = String(formData.get('sizes') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const colorValue = String(formData.get('colors') ?? '').trim();
  const colors = colorValue ? colorValue.split(',').map((value) => value.trim()).filter(Boolean) : [''];
  return { name: formData.get('name'), description: formData.get('description'), categoryId: formData.get('categoryId'), priceNgn: formData.get('priceNgn'), sizes, colors, stockQuantity: formData.get('stockQuantity'), imageAlt: formData.get('imageAlt') };
}

function slugify(value: string) { return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
