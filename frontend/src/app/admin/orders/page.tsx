import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ClipboardList } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { customerWhatsAppUrl } from '@/lib/whatsapp';
import { updateOrderStatus } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Order requests', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
const statuses = ['awaiting_whatsapp', 'confirmed', 'in_production', 'ready_for_pickup', 'completed', 'cancelled'] as const;

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin();
  const { data: orders, error } = await supabase.from('order_requests').select('*').order('created_at', { ascending: false }).limit(200);
  const orderIds = (orders ?? []).map((order) => order.id);
  const { data: items } = orderIds.length ? await supabase.from('order_items').select('*').in('order_request_id', orderIds) : { data: [] };
  const itemsByOrder = new Map<string, NonNullable<typeof items>>();
  for (const item of items ?? []) itemsByOrder.set(item.order_request_id, [...(itemsByOrder.get(item.order_request_id) ?? []), item]);

  return <main className="admin-shell"><div className="admin-heading"><div><span className="eyebrow"><ClipboardList size={14} /> ORDER MANAGEMENT</span><h1 className="story-title">Order requests.</h1><p>WhatsApp confirmation is manual. Creating a request does not confirm an order.</p></div><Link className="back-home" href="/admin/dashboard">← Dashboard</Link></div><section className="admin-panel">{error ? <p className="form-error">Order requests could not be loaded.</p> : orders?.length ? <div className="order-request-list">{orders.map((order) => {
    const message = `Hello ${order.customer_name}, this is Maria Stitches following up on order request ${order.reference}.`;
    const customerLink = customerWhatsAppUrl(order.customer_phone, message);
    return <article className="order-request-card" key={order.id}><div className="order-request-heading"><div><span className="status-pill">{order.status.replaceAll('_', ' ')}</span><h2>{order.reference}</h2><span className="admin-timestamp">{new Date(order.created_at).toLocaleString('en-NG')}</span></div><strong>₦{Number(order.total_estimate_ngn).toLocaleString('en-NG')}</strong></div><div className="order-customer"><strong>{order.customer_name}</strong><span>{order.customer_phone}</span>{customerLink && <a href={customerLink} target="_blank" rel="noreferrer">Contact via WhatsApp <ArrowUpRight size={13} /></a>}</div><ul className="order-item-list">{(itemsByOrder.get(order.id) ?? []).map((item) => <li key={item.id}><span>{item.product_name} · {item.size}{item.color ? ` · ${item.color}` : ''} × {item.quantity}</span><span>₦{Number(item.line_total_ngn).toLocaleString('en-NG')}</span></li>)}</ul>{order.note && <p className="order-note">Customer note: {order.note}</p>}<form action={updateOrderStatus} className="order-status-form"><input type="hidden" name="id" value={order.id} /><label htmlFor={`status-${order.id}`}>Update status</label><select id={`status-${order.id}`} name="status" defaultValue={order.status}>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select><button type="submit">Save status</button></form></article>;
  })}</div> : <div className="empty-state">No order requests have been created yet.</div>}</section></main>;
}
