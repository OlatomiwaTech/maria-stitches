'use client';

import Link from 'next/link';
import { Menu, Scissors, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/components/site-settings-provider';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const settings = useSiteSettings();
  const links = [['Shop', '/shop'], ['Custom made', '/custom-order'], ['Our story', '/about'], ['Contact', '/contact']];
  return <>
    {settings.announcement && <div className="announcement"><span>{settings.announcement}</span></div>}
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="Maria Stitches home" onClick={() => setOpen(false)}>
        <span className="brand-monogram"><Scissors size={19} strokeWidth={1.45} /></span>
        <span className="brand-wordmark">{settings.businessName.toUpperCase()}<small>{settings.location.toUpperCase()}</small></span>
      </Link>
      <nav className={open ? 'primary-nav is-open' : 'primary-nav'} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Button asChild variant="outline" size="sm" className="cart-button"><Link href="/cart"><ShoppingBag size={16} /> <span>Bag</span><span className="cart-count">{count}</span></Link></Button>
        <Button asChild size="sm" className="desktop-custom"><Link href="/custom-order">Request a custom piece</Link></Button>
      </div>
      <button type="button" className="mobile-menu-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X size={21} /> : <Menu size={21} />}</button>
    </header>
  </>;
}
