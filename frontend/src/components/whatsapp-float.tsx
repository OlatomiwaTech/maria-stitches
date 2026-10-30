import { MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/site-settings';
import { siteWhatsAppUrl } from '@/lib/site-settings';

export function WhatsAppFloat({ settings }: { settings: SiteSettings }) {
  const href = siteWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I would like to ask about a style.`);
  if (!href) return null;
  return <a className="whatsapp-float" href={href} target="_blank" rel="noreferrer" aria-label="Message Maria Stitches on WhatsApp"><MessageCircle size={20} /><span>Chat on WhatsApp</span></a>;
}
