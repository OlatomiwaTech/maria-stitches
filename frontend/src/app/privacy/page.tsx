import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'Privacy', description: 'Privacy information for Maria Stitches enquiries and order requests.' };

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return <main className="page-shell"><span className="eyebrow">YOUR INFORMATION</span><h1 className="page-title">Privacy, in <em>plain language.</em></h1><div className="privacy-copy"><p>{settings.businessName} may collect the name, phone number, order selections and enquiry details you submit so the studio can respond to your request.</p><p>Order requests are stored in the configured {settings.businessName} database and are not confirmed automatically. Customers complete the conversation in WhatsApp. Customer pickup is the current fulfilment arrangement.</p><p>Inspiration images are optional. Please do not submit sensitive personal information or body measurements through the initial form. Measurements can be discussed privately with the studio if needed.</p><p>For questions about information you have submitted, contact {settings.businessName} through the WhatsApp link on the site.</p><p className="form-help">Business: {settings.businessName} · {settings.location}</p></div></main>;
}
