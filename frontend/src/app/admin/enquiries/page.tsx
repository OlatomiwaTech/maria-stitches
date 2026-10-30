import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MessageSquareText } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { customerWhatsAppUrl } from '@/lib/whatsapp';
import { updateEnquiryStatus } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Custom enquiries', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
const statuses = ['pending', 'contacted', 'accepted', 'declined'] as const;

export default async function AdminEnquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data: enquiries, error } = await supabase.from('custom_enquiries').select('*').order('created_at', { ascending: false }).limit(200);
  const withImages = await Promise.all((enquiries ?? []).map(async (enquiry) => {
    if (!enquiry.inspiration_path) return { ...enquiry, inspirationUrl: null };
    const { data } = await supabase.storage.from('custom-inspiration').createSignedUrl(enquiry.inspiration_path, 300);
    return { ...enquiry, inspirationUrl: data?.signedUrl ?? null };
  }));

  return <main className="admin-shell"><div className="admin-heading"><div><span className="eyebrow"><MessageSquareText size={14} /> CUSTOM-MADE</span><h1 className="story-title">Enquiries.</h1><p>Review requests, contact customers and record follow-up status.</p></div><Link className="back-home" href="/admin/dashboard">← Dashboard</Link></div><section className="admin-panel">{error ? <p className="form-error">Custom enquiries could not be loaded.</p> : withImages.length ? <div className="order-request-list">{withImages.map((enquiry) => {
    const contact = customerWhatsAppUrl(enquiry.customer_phone, `Hello ${enquiry.customer_name}, this is Maria Stitches following up on custom enquiry ${enquiry.reference}.`);
    return <article className="order-request-card" key={enquiry.id}><div className="order-request-heading"><div><span className="status-pill">{enquiry.status}</span><h2>{enquiry.reference}</h2><span className="admin-timestamp">{new Date(enquiry.created_at).toLocaleString('en-NG')}</span></div><strong>{enquiry.category_label}</strong></div><div className="order-customer"><strong>{enquiry.customer_name}</strong><span>{enquiry.customer_phone}</span>{contact && <a href={contact} target="_blank" rel="noreferrer">Contact via WhatsApp <ArrowUpRight size={13} /></a>}</div><p className="order-note">{enquiry.description}</p><div className="enquiry-meta"><span>Preferred size: {enquiry.preferred_size || 'To discuss'}</span><span>Desired completion: {enquiry.desired_date || 'To discuss'}</span></div>{enquiry.notes && <p className="order-note">Additional notes: {enquiry.notes}</p>}{enquiry.inspiration_path && <p className="form-help">Inspiration image path: {enquiry.inspiration_path}</p>}{enquiry.inspirationUrl && <a className="inspiration-link" href={enquiry.inspirationUrl} target="_blank" rel="noreferrer">View private inspiration image <ArrowUpRight size={13} /></a>}<form action={updateEnquiryStatus} className="order-status-form"><input type="hidden" name="id" value={enquiry.id} /><label htmlFor={`enquiry-status-${enquiry.id}`}>Update status</label><select id={`enquiry-status-${enquiry.id}`} name="status" defaultValue={enquiry.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button type="submit">Save status</button></form></article>;
  })}</div> : <div className="empty-state">No custom enquiries have been received yet.</div>}</section></main>;
}
