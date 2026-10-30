import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatNaira } from '@/lib/utils';
import { brand, whatsappUrl } from '@/lib/brand';

export function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images[0];
  const enquiry = whatsappUrl(`Hello ${brand.name}, I’m interested in ${product.name}. Is this style available?`);
  return <article className="product-card">
    <Link href={`/shop/${product.slug}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
      {firstImage ? <Image src={firstImage.url} alt={firstImage.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="product-image" /> : <span className="image-placeholder">Maria Stitches</span>}
      {product.isDemo && <span className="sample-badge">SAMPLE STYLE</span>}
      <span className="product-image-arrow"><ArrowUpRight size={16} /></span>
    </Link>
    <div className="product-details">
      <span className="product-category">{product.category.name}</span>
      <Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link>
      <div className="product-card-bottom"><span className="product-price">{formatNaira(product.priceNgn)}<small>{product.isDemo ? 'Illustrative' : ''}</small></span>{enquiry && <a className="product-whatsapp" href={enquiry} target="_blank" rel="noreferrer" aria-label={`Ask about ${product.name} on WhatsApp`}><MessageCircle size={17} /></a>}</div>
    </div>
  </article>;
}
