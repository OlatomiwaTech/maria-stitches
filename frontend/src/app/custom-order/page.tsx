import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { CustomOrderForm } from '@/components/custom-order-form';
import { getSiteSettings } from '@/lib/site-settings';
import { siteWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = { title: 'Custom-made enquiry', description: 'Tell Maria Stitches about a custom-made outfit you have in mind.' };

export default async function CustomOrderPage() {
  const settings = await getSiteSettings();
  const chat = siteWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I’d like to ask about a custom-made outfit.`);
  return <main className="page-shell"><span className="eyebrow">MADE AROUND YOUR IDEA</span><h1 className="page-title">Let’s talk about<br /><em>your outfit.</em></h1><p className="page-intro">Share the occasion and the look you have in mind. {settings.businessName} will follow up to discuss details. You don’t need to provide body measurements here.</p><div className="form-layout"><CustomOrderForm /><aside className="contact-aside"><h2>A conversation first.</h2><p>Availability, fabric, fit and timing will be discussed directly. Submitting a request does not confirm an order or a completion date.</p><p>{settings.pickupInstructions}</p>{chat && <a className="aside-whatsapp" href={chat} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Ask on WhatsApp</a>}</aside></div></main>;
}
