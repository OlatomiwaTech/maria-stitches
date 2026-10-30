import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ClipboardList, MessageSquareText, Settings2 } from 'lucide-react';
import { AdminSignOut } from '@/components/admin-sign-out';
import { requireAdmin } from '@/lib/admin';

export const metadata: Metadata = { title: 'Admin dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { supabase, admin } = await requireAdmin();
  const [totalProducts, publishedProducts, lowStock, newOrders, confirmedOrders, enquiries, recentOrders] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).lte('stock_quantity', 2).eq('is_available', true),
    supabase.from('order_requests').select('id', { count: 'exact', head: true }).eq('status', 'awaiting_whatsapp'),
    supabase.from('order_requests').select('id', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('custom_enquiries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('order_requests').select('id, reference, customer_name, customer_phone, total_estimate_ngn, status, created_at').order('created_at', { ascending: false }).limit(8),
  ]);
  const stats = [
    ['Total products', totalProducts.count], ['Published products', publishedProducts.count],
    ['Low-stock variants', lowStock.count], ['New order requests', newOrders.count],
    ['Confirmed orders', confirmedOrders.count], ['Pending custom enquiries', enquiries.count],
  ];

  return <main className="admin-shell"><div className="admin-heading"><div><span className="eyebrow">BUSINESS MANAGEMENT</span><h1 className="story-title">Good morning{admin.displayName ? `, ${admin.displayName}` : ''}.</h1><p>Manage the shop and follow up on customer requests.</p></div><AdminSignOut /></div>
    <nav className="admin-nav" aria-label="Admin sections"><Link href="/admin/products"><Package size={15} /> Products</Link><Link href="/admin/orders"><ClipboardList size={15} /> Orders</Link><Link href="/admin/enquiries"><MessageSquareText size={15} /> Custom enquiries</Link><Link href="/admin/settings"><Settings2 size={15} /> Business settings</Link></nav>
    <section className="admin-panel"><h2>Current overview</h2><div className="admin-grid">{stats.map(([label, count]) => <div className="admin-stat" key={label}><span>{label}</span><strong>{count ?? '—'}</strong></div>)}</div><p className="form-help">Counts come from the connected database. A low-stock variant is one with two or fewer units.</p></section>
    <section className="admin-panel admin-recent"><div className="admin-section-heading"><h2>Recent order requests</h2><Link href="/admin/orders">View all</Link></div>{recentOrders.error ? <p className="form-error">Order records could not be loaded.</p> : recentOrders.data?.length ? <div className="table-scroll"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Estimate</th><th>Status</th><th>Received</th></tr></thead><tbody>{recentOrders.data.map((order) => <tr key={order.id}><td>{order.reference}</td><td>{order.customer_name}<small>{order.customer_phone}</small></td><td>₦{Number(order.total_estimate_ngn).toLocaleString('en-NG')}</td><td><span className="status-pill">{order.status.replaceAll('_', ' ')}</span></td><td>{new Date(order.created_at).toLocaleDateString('en-NG')}</td></tr>)}</tbody></table></div> : <p className="empty-state">No order requests yet.</p>}</section>
  </main>;
}
