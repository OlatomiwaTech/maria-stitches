import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-settings';
import { hasSupabaseConfig } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Privacy', description: 'Privacy information for Maria Stitches enquiries and order requests.', alternates: { canonical: '/privacy' } };

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const databaseConfigured = hasSupabaseConfig();
  return <main className="page-shell"><span className="eyebrow">YOUR INFORMATION</span><h1 className="page-title">Privacy, in <em>plain language.</em></h1><div className="privacy-copy">
    <p>The shopping bag is saved in this browser so it is still available when you return. It contains the styles, selected sizes and quantities you add.</p>
    <p>{databaseConfigured ? `When a request is successfully submitted, its name, phone number, selected styles or custom-enquiry details are stored in the connected Maria Stitches database, hosted by Supabase. If an optional inspiration image finishes uploading, it is stored in a private bucket and is available to administrators only.` : `Online order requests and custom enquiries are not currently connected to a database, so the forms will show an error and will not save submitted details.`} Order requests are not confirmed automatically. Customers choose whether to continue in WhatsApp, and must press Send themselves.</p>
    <p>Inspiration images are optional. Please do not submit sensitive personal information or body measurements through the initial form. The current form does not provide a self-service data deletion control; contact the studio through its WhatsApp link to ask about information you submitted.</p>
    <p>Customer pickup in {settings.location} is the current fulfilment arrangement.</p>
    <p className="form-help">Business: {settings.businessName} · {settings.location}</p>
  </div></main>;
}
