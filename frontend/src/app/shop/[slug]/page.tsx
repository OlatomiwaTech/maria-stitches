import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DemoNotice } from '@/components/demo-notice';
import { ProductActions } from '@/components/product-actions';
import { getCatalog } from '@/lib/catalog';
import { formatNaira } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const product = products.find((item) => item.slug === slug);
  return product ? { title: product.name, description: product.description, openGraph: { images: product.images[0]?.url ? [product.images[0].url] : [] } } : { title: 'Style not found' };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { products } = await getCatalog();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <main className="page-shell">
    {product.isDemo && <DemoNotice />}
    <div className="product-detail-layout">
      <div className="detail-gallery">{product.images.length ? product.images.map((image) => <figure key={image.id}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 700px) 90vw, 55vw" priority={product.images[0]?.id === image.id} /></figure>) : <div className="empty-state">Product photography will be added by Maria Stitches.</div>}</div>
      <section className="detail-info"><span className="eyebrow">{product.category.name}</span><h1>{product.name}</h1><p className="detail-price">{formatNaira(product.priceNgn)}{product.isDemo && <small className="sample-price-note"> Illustrative sample price</small>}</p><p className="detail-description">{product.description}</p><p className="detail-description">Availability, fabric and final details are confirmed directly with Maria Stitches before an order is confirmed.</p><ProductActions product={product} /></section>
    </div>
  </main>;
}
