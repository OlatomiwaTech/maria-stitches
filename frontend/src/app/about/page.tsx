import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'About', description: 'Learn about Maria Stitches, a fashion and tailoring business in Sango Ota, Ogun State.', alternates: { canonical: '/about' } };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <main className="page-shell"><span className="eyebrow">ABOUT THE STUDIO</span><h1 className="page-title">Personal style,<br /><em>made personal.</em></h1><p className="page-intro">{settings.businessName} is a fashion and tailoring business based in {settings.location}. The studio offers ready-to-wear clothing and custom-made outfits.</p><div className="about-panels"><section><h2>Clothing for your moments.</h2><p>Browse sample styles across dresses and gowns, two-piece outfits, native and traditional wear, trousers and shirts, and children’s clothing. The sample catalogue is a starting point; current designs, prices and availability are confirmed directly.</p></section><section><h2>Made in conversation.</h2><p>For custom-made requests, share your idea and the occasion first. Fit, fabric, measurements and timing can be discussed privately with {settings.businessName} after the initial enquiry.</p></section></div><p className="story-location"><MapPin size={15} /> {settings.location}</p><Button asChild variant="outline"><Link href="/shop">Explore the sample shop <ArrowRight size={15} /></Link></Button></main>;
}
