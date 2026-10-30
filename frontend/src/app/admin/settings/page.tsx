import type { Metadata } from 'next';
import Link from 'next/link';
import { BusinessSettingsForm } from '@/components/business-settings-form';
import { requireAdmin } from '@/lib/admin';
import { defaultSiteSettings, type SiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'Business settings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
  const rawColors = data?.brand_settings && typeof data.brand_settings === 'object' && !Array.isArray(data.brand_settings) ? data.brand_settings as Record<string, unknown> : {};
  const color = (name: keyof SiteSettings['colors']) => typeof rawColors[name] === 'string' && /^#[\da-f]{6}$/i.test(rawColors[name] as string) ? rawColors[name] as string : defaultSiteSettings.colors[name];
  const settings: SiteSettings = data ? {
    businessName: data.business_name,
    tagline: data.tagline,
    whatsappNumber: data.whatsapp_number,
    location: data.location,
    pickupInstructions: data.pickup_instructions,
    announcement: data.announcement ?? '',
    contactEmail: data.contact_email ?? '',
    instagramUrl: data.instagram_url ?? '',
    colors: { espresso: color('espresso'), ivory: color('ivory'), burgundy: color('burgundy'), beige: color('beige'), champagne: color('champagne') },
  } : defaultSiteSettings;
  return <main className="admin-shell"><div className="admin-heading"><div><span className="eyebrow">PUBLIC SITE CONTENT</span><h1 className="story-title">Business settings.</h1><p>Update the business details and brand colours used across the storefront.</p></div><Link className="back-home" href="/admin/dashboard">← Dashboard</Link></div><BusinessSettingsForm settings={settings} /></main>;
}
