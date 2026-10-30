import type { Metadata } from 'next';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { brand, whatsappUrl } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Contact Maria Stitches', description: 'Contact Maria Stitches in Sango Ota, Ogun State, Nigeria.' };

export default function ContactPage() {
  const chat = whatsappUrl(`Hello ${brand.name}, I have a question.`);
  return <main className="page-shell"><span className="eyebrow">GET IN TOUCH</span><h1 className="page-title">A good place to <em>start.</em></h1><p className="page-intro">For ready-to-wear availability, custom-made outfits or pickup arrangements, contact Maria Stitches directly.</p><div className="contact-grid"><section className="contact-card"><MapPin size={20} /><h2>Location</h2><p>{brand.location}</p><p>Customer pickup only. Exact pickup arrangements are shared after an order is confirmed.</p></section><section className="contact-card"><MessageCircle size={20} /><h2>WhatsApp</h2><p>Ask a question or enquire about a style.</p>{chat && <Button asChild variant="whatsapp"><a href={chat} target="_blank" rel="noreferrer">Message Maria Stitches</a></Button>}</section><section className="contact-card"><Phone size={20} /><h2>Phone</h2><p>Call or WhatsApp using the public studio number.</p><a className="contact-phone" href="tel:+2348033646143">+234 803 364 6143</a></section></div></main>;
}
