import type { Metadata } from 'next';
import { CartProviderShell } from '@/components/cart/cart-provider-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { SiteSettingsProvider } from '@/components/site-settings-provider';
import { getSiteSettings } from '@/lib/site-settings';
import type { CSSProperties } from 'react';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/playfair-display';
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const colors = {
    '--espresso': settings.colors.espresso,
    '--paper': settings.colors.ivory,
    '--burgundy': settings.colors.burgundy,
    '--beige': settings.colors.beige,
    '--champagne': settings.colors.champagne,
    '--color-espresso': settings.colors.espresso,
    '--color-ivory': settings.colors.ivory,
    '--color-burgundy': settings.colors.burgundy,
    '--color-beige': settings.colors.beige,
    '--color-champagne': settings.colors.champagne,
  } as CSSProperties;
  return <html lang="en-NG" data-scroll-behavior="smooth"><body style={colors}><CartProviderShell><SiteSettingsProvider settings={settings}><SiteHeader />{children}<SiteFooter settings={settings} /><WhatsAppFloat settings={settings} /></SiteSettingsProvider></CartProviderShell></body></html>;
}
