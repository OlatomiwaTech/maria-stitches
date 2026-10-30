import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatNaira } from '@/lib/utils';
import { siteWhatsAppUrl } from '@/lib/whatsapp';

export function ProductCard({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const firstImage = product.images[0];
  const enquiry = siteWhatsAppUrl(whatsappNumber, `Hello Maria Stitches, I’m interested in ${product.name}. Is this style available?`);
  return <article className="product-card">
    <Link href={`/shop/${product.slug}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
      {firstImage ? <Image src={firstImage.url} alt={firstImage.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="product-image" /> : <span className="image-placeholder">Maria Stitches</span>}
      {product.isDemo && <span className="sample-badge">SAMPLE STYLE</span>}
      <span className="product-image-arrow"><ArrowUpRight size={16} /></span>
    </Link>
    <div className="product-details">
      <span className="product-category">{product.category.name}</span>
      <Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link>
      <div className="product-card-bottom"><span className="product-price">{formatNaira(product.priceNgn)}<small>{product.isDemo ? 'Illustrative' : ''}</small><small className={product.variants.some((variant) => variant.available) ? 'availability available' : 'availability'}>{product.variants.some((variant) => variant.available) ? (product.isDemo ? 'Sample style' : 'Available to request') : 'Currently unavailable'}</small></span>{enquiry && <a className="product-whatsapp" href={enquiry} target="_blank" rel="noreferrer" aria-label={`Ask about ${product.name} on WhatsApp`}><MessageCircle size={17} /></a>}</div>
    </div>
  </article>;
}
