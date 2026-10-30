import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'About', description: 'Learn about Maria Stitches, a fashion and tailoring business in Sango Ota, Ogun State.', alternates: { canonical: '/about' } };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <main className="page-shell">
    <div className="about-hero">
      <div className="about-hero-copy"><span className="eyebrow">ABOUT THE STUDIO</span><h1 className="page-title">Personal style,<br /><em>made personal.</em></h1><p className="page-intro">{settings.businessName} is a fashion and tailoring business based in {settings.location}. The studio offers ready-to-wear clothing and custom-made outfits, with details confirmed directly for each request.</p><p className="story-location"><MapPin size={15} /> {settings.location} · Customer pickup</p><div className="hero-actions"><Button asChild><Link href="/shop">Explore the sample shop <ArrowRight size={15} /></Link></Button><Button asChild variant="outline"><Link href="/custom-order">Start a custom enquiry</Link></Button></div></div>
      <figure className="about-portrait"><Image src="https://images.unsplash.com/photo-1687052093309-7a14efa58ecb?auto=format&fit=crop&w=1200&q=84" alt="Illustrative portrait of a woman in traditional African clothing by Ibrahima Toure; not a Maria Stitches garment." fill sizes="(max-width: 700px) 90vw, 46vw" /><figcaption>Illustrative editorial portrait by Ibrahima Toure via Unsplash. Not work by Maria Stitches.</figcaption></figure>
    </div>
    <div className="about-panels"><section><h2>Clothing for your moments.</h2><p>Browse sample styles across dresses and gowns, two-piece outfits, native and traditional wear, trousers and shirts, and children’s clothing. The sample catalogue is a starting point; current designs, prices and availability are confirmed directly.</p></section><section><h2>Made in conversation.</h2><p>For custom-made requests, share your idea and the occasion first. Fit, fabric, measurements and timing can be discussed privately with {settings.businessName} after the initial enquiry.</p></section></div>
    <section className="about-pickup"><span className="eyebrow">A CLEAR WAY TO BEGIN</span><h2>Browse a sample or ask a question.</h2><p>There is no online payment or delivery checkout. Orders are discussed directly and fulfilled by customer pickup.</p><Button asChild variant="outline"><Link href="/contact">Contact and pickup details <ArrowRight size={15} /></Link></Button></section>
  </main>;
}
