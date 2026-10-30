import type { Metadata } from 'next';
import { CartProviderShell } from '@/components/cart/cart-provider-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Maria Stitches | Style, beautifully stitched.', template: '%s | Maria Stitches' },
  description: 'Ready-to-wear styles and custom-made clothing from Maria Stitches in Sango Ota, Ogun State, Nigeria.',
  openGraph: {
    type: 'website',
    siteName: 'Maria Stitches',
    title: 'Maria Stitches | Style, beautifully stitched.',
    description: 'Browse ready-to-wear styles and enquire about custom-made clothing in Sango Ota, Ogun State.',
    images: ['/og-maria-stitches.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG" data-scroll-behavior="smooth"><body><CartProviderShell><SiteHeader />{children}<SiteFooter /><WhatsAppFloat /></CartProviderShell></body></html>;
}
