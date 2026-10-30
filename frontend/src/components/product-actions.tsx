'use client';

import { useMemo, useState } from 'react';
import { Check, MessageCircle, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-provider';
import { siteWhatsAppUrl } from '@/lib/whatsapp';
import type { Product } from '@/lib/types';

export function ProductActions({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const firstAvailable = product.variants.find((variant) => variant.available);
  const [variantId, setVariantId] = useState(firstAvailable?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const { add } = useCart();
  const selected = useMemo(() => product.variants.find((variant) => variant.id === variantId), [product.variants, variantId]);
  const enquiry = siteWhatsAppUrl(whatsappNumber, `Hello Maria Stitches, I’m interested in ${product.name}${selected ? ` in size ${selected.size}` : ''}. Is it currently available?`);

  function addProduct() {
    setError('');
    if (!selected || !add(product, selected.id, quantity)) {
      setError('This quantity is not currently available to add. Please choose a smaller amount or ask Maria Stitches on WhatsApp.');
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return <div>
    <span className="detail-label" id="size-label">Choose a size</span>
    {product.variants.length ? <div className="variant-options" role="group" aria-labelledby="size-label">{product.variants.map((variant) => <button type="button" className="variant-option" key={variant.id} aria-pressed={variant.id === variantId} disabled={!variant.available} onClick={() => { setVariantId(variant.id); setQuantity(1); }} title={variant.available ? `${variant.size}${variant.color ? ` · ${variant.color}` : ''}` : `${variant.size} unavailable`}>{variant.size}{variant.color ? ` · ${variant.color}` : ''}</button>)}</div> : <p className="detail-stock">Please ask Maria Stitches to confirm available sizes.</p>}
    <label className="detail-label" htmlFor="product-quantity">Quantity</label><select id="product-quantity" className="field-control quantity-control" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: product.isDemo ? 10 : Math.min(10, selected?.stockQuantity || 1) }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}</select>
    {selected?.color && <p className="detail-stock">Colour: {selected.color}</p>}
    {!product.isDemo && selected && selected.stockQuantity > 0 && <p className="detail-stock">Available to request: {selected.stockQuantity}</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="detail-actions"><Button onClick={addProduct} disabled={!selected?.available}><ShoppingBag size={16} /> {added ? <><Check size={16} /> Added to bag</> : product.isDemo ? 'Add sample to bag' : 'Add to bag'}</Button>{enquiry && <Button asChild variant="whatsapp"><a href={enquiry} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Ask on WhatsApp</a></Button>}</div>
    {product.isDemo && <p className="demo-product-help"><Plus size={13} /> Sample styles can be added to your preview bag. They cannot be submitted as a real order.</p>}
  </div>;
}
