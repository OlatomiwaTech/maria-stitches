'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { ImagePlus, LoaderCircle, PackagePlus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { createProduct, deleteProduct, updateProduct, updateVariantStock, type ActionResult } from '@/app/admin/products/actions';
import type { Category, Product } from '@/lib/types';

export function AdminProductManager({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  async function uploadPhoto(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error('Choose a JPG, PNG or WebP photo under 8 MB.');
    const supabase = createSupabaseBrowserClient();
    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = `products/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw new Error('Image upload failed. Confirm the product-images bucket is configured and your admin session is active.');
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      if (!photo) throw new Error('Choose a product photo before creating the product.');
      const form = event.currentTarget;
      const url = await uploadPhoto(photo);
      const data = new FormData(form); data.set('imageUrl', url);
      const result = await createProduct(data);
      setMessage(result);
      if (result.ok) { form.reset(); setPhoto(null); }
    } catch (error) { setMessage({ ok: false, message: error instanceof Error ? error.message : 'Product could not be created.' }); }
    finally { setBusy(false); }
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      const form = event.currentTarget;
      const fileInput = form.elements.namedItem('replacementPhoto');
      const file = fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : undefined;
      if (!file) throw new Error('Upload a real product photograph to replace the sample image before saving this as a genuine item.');
      const url = await uploadPhoto(file);
      const data = new FormData(form); data.set('imageUrl', url);
      setMessage(await updateProduct(data));
    } catch (error) { setMessage({ ok: false, message: error instanceof Error ? error.message : 'Product could not be updated.' }); }
    finally { setBusy(false); }
  }

  async function removeProduct(id: string) {
    if (!window.confirm('Delete this product? Products with order history should be unpublished instead.')) return;
    const data = new FormData(); data.set('id', id); setMessage(await deleteProduct(data));
  }

  async function saveStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setMessage(await updateVariantStock(data));
  }

  return <div className="admin-product-manager">
    <section className="admin-panel"><h2>Add a genuine product</h2><p className="form-help">Only enter designs, prices and stock confirmed by Maria Stitches. New products start unpublished.</p><form className="admin-product-form" onSubmit={create}>
      <label>Name<input name="name" required minLength={2} maxLength={120} /></label><label>Category<select name="categoryId" required>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Price in naira<input name="priceNgn" type="number" min="1" step="1" required /></label><label>Available sizes<input name="sizes" placeholder="S, M, L, XL" required /></label><label>Colours (optional, comma separated)<input name="colors" placeholder="Leave blank if not applicable" /></label><label>Initial stock per size/colour<input name="stockQuantity" type="number" min="0" step="1" defaultValue="0" required /></label><label className="admin-product-description">Description<textarea name="description" rows={3} required minLength={10} maxLength={2000} /></label><label>Photo alt text<input name="imageAlt" maxLength={200} /></label><label className="admin-upload"><ImagePlus size={17} />{photo ? photo.name : 'Choose a product photo'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} /></label><div className="admin-product-submit"><Button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={15} /> : <PackagePlus size={15} />} Create product</Button></div>
    </form></section>
    {message && <p className={message.ok ? 'form-success' : 'form-error'} role="status">{message.message}</p>}
    <section className="admin-panel"><h2>Products ({products.length})</h2>{products.length ? <div className="admin-products">{products.map((product) => { const sizes = [...new Set(product.variants.map((variant) => variant.size))]; const colors = [...new Set(product.variants.map((variant) => variant.color).filter((color): color is string => Boolean(color)))]; return <details className="admin-product" key={product.id}><summary><span>{product.name}</span><span className={product.isDemo ? 'status-pill status-demo' : 'status-pill'}>{product.isDemo ? 'Demo sample' : product.published ? 'Published' : 'Unpublished'}</span></summary><div className="admin-product-detail"><div className="admin-product-preview">{product.images[0] && <Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="120px" />}</div><form className="admin-product-form" onSubmit={update}><input type="hidden" name="id" value={product.id} /><label>Name<input name="name" defaultValue={product.name} required /></label><label>Category<select name="categoryId" defaultValue={product.category.id}>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Price in naira<input name="priceNgn" type="number" min="1" step="1" defaultValue={product.priceNgn} required /></label><label>Sizes, comma separated<input name="sizes" defaultValue={sizes.join(', ')} required /></label><label>Colours, comma separated<input name="colors" defaultValue={colors.join(', ')} placeholder="Leave blank if not applicable" /></label><label>Stock per size/colour<input name="stockQuantity" type="number" min="0" step="1" defaultValue={Math.max(0, ...product.variants.map((variant) => variant.stockQuantity))} required /></label><label className="admin-product-description">Description<textarea name="description" rows={3} defaultValue={product.description} required /></label><label>Replacement photo<input name="replacementPhoto" type="file" accept="image/jpeg,image/png,image/webp" required /></label><label className="check-row"><input name="isPublished" value="true" type="checkbox" defaultChecked={product.published} /> Publish to shop</label><Button type="submit" size="sm" disabled={busy}><Save size={14} /> Replace sample details / save genuine product</Button></form><div className="admin-variants"><span className="footer-label">VARIANT STOCK</span>{product.variants.filter((variant) => variant.available || variant.stockQuantity > 0).map((variant) => <form className="stock-row" key={variant.id} onSubmit={saveStock}><span>{variant.size}{variant.color ? ` · ${variant.color}` : ''}</span><input name="stock" type="number" min="0" max="100000" defaultValue={variant.stockQuantity} aria-label={`Stock for ${product.name} size ${variant.size}`} /><input type="hidden" name="variantId" value={variant.id} /><Button type="submit" size="sm" variant="outline">Save</Button></form>)}</div><Button type="button" variant="outline" size="sm" onClick={() => removeProduct(product.id)}><Trash2 size={14} /> Delete product</Button></div></details>; })}</div> : <div className="empty-state">No products are in the connected database yet. Run the migrations and seed data to add the labeled sample collection.</div>}</section>
  </div>;
}
