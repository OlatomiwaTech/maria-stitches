import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoNotice } from '@/components/demo-notice';
import { ProductCard } from '@/components/product-card';
import { getCatalog } from '@/lib/catalog';
import { getSiteSettings } from '@/lib/site-settings';
import { siteWhatsAppUrl } from '@/lib/whatsapp';

export default async function HomePage() {
  const catalog = await getCatalog();
  const settings = await getSiteSettings();
  const featured = catalog.products.slice(0, 4);
  const categoryLinks = catalog.categories;
  const chatLink = siteWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I would like to ask about ready-to-wear styles.`);

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">A NIGERIAN TAILORING STUDIO</span>
        <h1>Style,<br /><em>beautifully</em><br />stitched.</h1>
        <p>Ready-to-wear pieces and custom-made looks, thoughtfully brought together in {settings.location.split(',')[0]}.</p>
        <div className="hero-actions"><Button asChild size="lg"><Link href="/shop">Explore ready-to-wear <ArrowRight size={16} /></Link></Button>{chatLink && <Button asChild size="lg" variant="whatsapp"><a href={chatLink} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a></Button>}</div>
        <div className="hero-note"><MapPin size={15} /><span>{settings.location}<br /><strong>Customer pickup only</strong></span></div>
      </div>
      <div className="hero-image-frame">
        <Image className="hero-image" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=86" alt="Illustrative editorial fashion photograph. Not a Maria Stitches product image." fill priority sizes="(max-width: 700px) 90vw, 55vw" />
        <span className="hero-index">MARIA STITCHES · 01</span><span className="hero-image-label">An idea becomes your own.</span>
      </div>
      <div className="hero-bottom"><span>READY-TO-WEAR · CUSTOM-MADE</span><span>SCROLL TO EXPLORE <ArrowDownRight size={13} /></span></div>
    </section>

    <section className="intro-band"><span className="intro-label">THE MARIA STITCHES APPROACH</span><p className="intro-text">Personal style, considered detail, and the pleasure of wearing something that feels <em>made for you.</em></p></section>

    <section className="section" aria-labelledby="categories-title">
      <div className="section-head"><div><span className="eyebrow">BROWSE BY CATEGORY</span><h2 className="section-title" id="categories-title">Find your <em>look.</em></h2></div><p className="section-description">Explore sample styles across the categories Maria Stitches makes. Availability and final details are confirmed directly.</p></div>
      <div className="category-grid">{categoryLinks.map((category, index) => <Link className="category-card" href={`/shop?category=${category.slug}`} key={category.slug}><span className="category-number">0{index + 1} / CATEGORY</span><h3>{category.name}</h3></Link>)}</div>
    </section>

    <section className="section section-featured" aria-labelledby="featured-title">
      <div className="section-head"><div><span className="eyebrow">THE SAMPLE EDIT</span><h2 className="section-title" id="featured-title">A few styles to <em>start.</em></h2></div><Button asChild variant="outline"><Link href="/shop">View all styles <ArrowRight size={15} /></Link></Button></div>
      {catalog.demoMode && <DemoNotice />}
      {featured.length ? <div className="product-grid">{featured.map((product) => <ProductCard product={product} whatsappNumber={settings.whatsappNumber} key={product.id} />)}</div> : <div className="empty-state">The shop is being prepared. Message Maria Stitches to ask about current styles.</div>}
    </section>

    <section className="feature-split">
      <div className="feature-image"><Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82" alt="Illustrative fashion photograph of a tailored look; not a Maria Stitches product image." fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
      <div className="feature-copy"><span className="eyebrow">MADE AROUND YOUR IDEA</span><h2 className="feature-title">Some looks begin<br />with a <em>conversation.</em></h2><p>Have an occasion, a fabric or an idea in mind? Tell us what you’re looking for and continue the conversation with Maria Stitches on WhatsApp.</p><Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10"><Link href="/custom-order">Start a custom enquiry <ArrowRight size={15} /></Link></Button></div>
    </section>

    <section className="story-section"><div><span className="eyebrow">A LOCAL ATELIER</span><h2 className="story-title">Made with care in <em>Sango Ota.</em></h2></div><div className="story-copy"><p>{settings.businessName} is a fashion and tailoring business based in {settings.location}. Browse ready-to-wear sample styles or ask about a custom-made outfit.</p><p>Orders are discussed directly with the studio through WhatsApp. Fulfilment is customer pickup; exact arrangements are shared after an order is confirmed.</p><div className="story-location">{settings.location}</div></div></section>

    <section className="pickup-strip"><div><strong>Customer pickup</strong>{settings.pickupInstructions}</div><Link className="text-link" href="/contact">Contact and pickup details <ArrowRight size={14} /></Link></section>
  </main>;
}
