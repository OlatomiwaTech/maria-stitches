import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Scissors } from 'lucide-react';
import { brand, whatsappUrl } from '@/lib/brand';

export function SiteFooter() {
  const chat = whatsappUrl(`Hello ${brand.name}, I have a question about your styles.`);
  return <footer className="site-footer">
    <div className="footer-main">
      <div>
        <Link href="/" className="brand-lockup footer-lockup"><span className="brand-monogram"><Scissors size={19} /></span><span className="brand-wordmark">MARIA <i>STITCHES</i><small>{brand.tagline.toUpperCase()}</small></span></Link>
        <p className="footer-location">Fashion and tailoring in<br />{brand.location}</p>
      </div>
      <div className="footer-column"><span className="footer-label">EXPLORE</span><Link href="/shop">Shop ready-to-wear</Link><Link href="/custom-order">Custom-made</Link><Link href="/about">About Maria Stitches</Link><Link href="/faq">Frequently asked questions</Link></div>
      <div className="footer-column"><span className="footer-label">GET IN TOUCH</span>{chat && <a href={chat} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp us <ArrowUpRight size={13} /></a>}<Link href="/contact">Contact and pickup</Link><span>Customer pickup only</span></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Maria Stitches</span><Link href="/privacy">Privacy</Link><span>{brand.location}</span></div>
  </footer>;
}
