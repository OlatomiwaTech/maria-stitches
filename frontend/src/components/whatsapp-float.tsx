import { MessageCircle } from 'lucide-react';
import { brand, whatsappUrl } from '@/lib/brand';

export function WhatsAppFloat() {
  const href = whatsappUrl(`Hello ${brand.name}, I would like to ask about a style.`);
  if (!href) return null;
  return <a className="whatsapp-float" href={href} target="_blank" rel="noreferrer" aria-label="Message Maria Stitches on WhatsApp"><MessageCircle size={20} /><span>Chat on WhatsApp</span></a>;
}
