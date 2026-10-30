'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoNotice } from '@/components/demo-notice';
import { useCart } from '@/components/cart/cart-provider';
import { siteWhatsAppUrl } from '@/lib/whatsapp';
import { useSiteSettings } from '@/components/site-settings-provider';
import { formatNaira } from '@/lib/utils';
import type { CartLine } from '@/lib/types';

type OrderResponse = { reference: string; whatsappUrl: string; totalEstimateNgn: number };

function demoMessage(lines: CartLine[], name: string, phone: string, businessName: string) {
  const items = lines.map((line, index) => `${index + 1}. ${line.name}\n   Size: ${line.size}\n   Quantity: ${line.quantity}\n   Illustrative price: ${formatNaira(line.unitPriceNgn)} each`).join('\n\n');
  return `Hello ${businessName}!\n\nI am interested in these sample styles:\n\n${items}\n\nMy name: ${name || '[Your name]'}\nPhone: ${phone || '[Your phone number]'}\n\nI understand that these are sample photographs, prices and designs. Please let me know what is currently available.\n\nThank you!`;
}

export function CartPage() {
  const { lines, totalNgn, setQuantity, remove, clear, ready } = useCart();
  const settings = useSiteSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const demoOnly = lines.some((line) => line.isDemo);
  const demoChat = siteWhatsAppUrl(settings.whatsappNumber, demoMessage(lines, name, phone, settings.businessName));

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const response = await fetch('/api/order-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, note, idempotencyKey: crypto.randomUUID(), items: lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity })) }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isOrderResponse(payload)) throw new Error(isErrorPayload(payload) ? payload.message : 'We could not create this order request. Please try again.');
      setOrder(payload);
      clear();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not create this order request.');
    } finally { setPending(false); }
  }

  if (!ready) return <main className="page-shell"><div className="empty-state" role="status">Loading your shopping bag…</div></main>;
  if (!lines.length && order) return <main className="page-shell"><span className="eyebrow">ORDER REQUEST CREATED</span><h1 className="page-title">Your request is <em>ready.</em></h1><div className="cart-message">Reference: <strong>{order.reference}</strong><br />This is awaiting WhatsApp confirmation. It is not a confirmed order.</div><Button asChild variant="whatsapp"><a href={order.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Continue in WhatsApp</a></Button></main>;
  if (!lines.length) return <main className="page-shell"><span className="eyebrow">YOUR BAG</span><h1 className="page-title">A little room for <em>something lovely.</em></h1><div className="empty-state">Your bag is empty.<br /><br /><Button asChild variant="outline"><Link href="/shop">Browse the sample styles</Link></Button></div></main>;

  return <main className="page-shell">
    <span className="eyebrow">YOUR BAG</span><h1 className="page-title">Review your <em>selection.</em></h1>
    {demoOnly && <DemoNotice />}
    <div className="cart-layout">
      <div className="cart-lines">{lines.map((line) => <article className="cart-line" key={line.variantId}>
        <div className="cart-line-image">{line.image && <Image src={line.image} alt={`${line.name}, illustrative sample`} fill sizes="92px" />}</div>
        <div className="cart-line-info"><h3>{line.name}</h3><p>Size {line.size}{line.color ? ` · ${line.color}` : ''}</p>{line.isDemo && <p>Illustrative price: {formatNaira(line.unitPriceNgn)}</p>}<div className="cart-line-controls"><label className="sr-only" htmlFor={`quantity-${line.variantId}`}>Quantity for {line.name}</label><input className="cart-quantity" id={`quantity-${line.variantId}`} type="number" min="1" max="10" value={line.quantity} onChange={(event) => setQuantity(line.variantId, Number(event.target.value))} /><button className="text-button" type="button" onClick={() => remove(line.variantId)}><Trash2 size={13} /> Remove</button></div></div>
        <span className="cart-line-total">{formatNaira(line.unitPriceNgn * line.quantity)}</span>
      </article>)}</div>
      <aside className="cart-summary"><h2>Order estimate</h2>{lines.map((line) => <div className="summary-row" key={line.variantId}><span>{line.name} × {line.quantity}</span><span>{formatNaira(line.unitPriceNgn * line.quantity)}</span></div>)}<div className="summary-row summary-total"><span>Estimated total</span><span>{formatNaira(totalNgn)}</span></div><p className="summary-caption">Pickup only in Sango Ota, Ogun State. No delivery fee or online payment is added.</p>
        {!demoOnly && <form className="checkout-fields" onSubmit={submitOrder}><label htmlFor="order-name">Your name<input required minLength={2} maxLength={100} id="order-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label><label htmlFor="order-phone">WhatsApp phone number<input required minLength={7} maxLength={24} id="order-phone" type="tel" autoComplete="tel" placeholder="+234…" value={phone} onChange={(event) => setPhone(event.target.value)} /></label><label htmlFor="order-note">Note (optional)<textarea id="order-note" maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<Button type="submit" className="w-full" disabled={pending}>{pending ? 'Creating request…' : 'Create order request'}</Button><p className="summary-caption">We’ll create a request and then you can continue the conversation in WhatsApp. It is not confirmed until Maria Stitches confirms it.</p></form>}
        {demoOnly && <div className="cart-message">Sample products cannot be submitted as real orders. Use WhatsApp to ask which similar styles are currently available.</div>}
        {demoOnly && demoChat && <Button asChild variant="whatsapp" className="w-full"><a href={demoChat} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Ask about these styles</a></Button>}
        <Link href="/shop" className="continue-shopping"><ArrowLeft size={14} /> Continue browsing</Link>
      </aside>
    </div>
  </main>;
}

function isOrderResponse(value: unknown): value is OrderResponse {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<OrderResponse>;
  return typeof record.reference === 'string' && typeof record.whatsappUrl === 'string' && typeof record.totalEstimateNgn === 'number';
}

function isErrorPayload(value: unknown): value is { message: string } {
  return Boolean(value && typeof value === 'object' && 'message' in value && typeof value.message === 'string');
}
