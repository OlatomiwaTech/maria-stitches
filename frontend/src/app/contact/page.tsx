import type { Metadata } from 'next';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings';
import { siteWhatsAppUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Contact Maria Stitches', description: 'Contact Maria Stitches in Sango Ota, Ogun State, Nigeria.' };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const chat = siteWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I have a question.`);
  const phoneDisplay = settings.whatsappNumber.startsWith('234') ? `+${settings.whatsappNumber.slice(0, 3)} ${settings.whatsappNumber.slice(3, 6)} ${settings.whatsappNumber.slice(6, 9)} ${settings.whatsappNumber.slice(9)}` : settings.whatsappNumber;
  return <main className="page-shell"><span className="eyebrow">GET IN TOUCH</span><h1 className="page-title">A good place to <em>start.</em></h1><p className="page-intro">For ready-to-wear availability, custom-made outfits or pickup arrangements, contact {settings.businessName} directly.</p><div className="contact-grid"><section className="contact-card"><MapPin size={20} /><h2>Location</h2><p>{settings.location}</p><p>{settings.pickupInstructions}</p></section><section className="contact-card"><MessageCircle size={20} /><h2>WhatsApp</h2><p>Ask a question or enquire about a style.</p>{chat && <Button asChild variant="whatsapp"><a href={chat} target="_blank" rel="noreferrer">Message {settings.businessName}</a></Button>}</section><section className="contact-card"><Phone size={20} /><h2>Phone</h2><p>Call or WhatsApp the studio.</p><a className="contact-phone" href={`tel:+${settings.whatsappNumber}`}>{phoneDisplay}</a></section></div></main>;
}
