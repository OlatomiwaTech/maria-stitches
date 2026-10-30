import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'Frequently asked questions', description: 'Answers about sample styles, custom-made enquiries and pickup from Maria Stitches.', alternates: { canonical: '/faq' } };

const faqs = [
  ['Are the products shown currently available?', 'The initial catalogue contains sample styles and photographs. Please message Maria Stitches to confirm actual designs, price and availability before placing a request.'],
  ['How do I order?', 'Add styles to your bag and submit an order request once genuine products are published. You can then continue in WhatsApp. An order is not confirmed until Maria Stitches confirms it directly.'],
  ['Can I request a custom outfit?', 'Yes. Use the custom-made enquiry form to describe the category, idea and desired date. Detailed measurements are not required in the first enquiry.'],
  ['Do you deliver?', 'Fulfilment is customer pickup only. Exact pickup arrangements are shared after an order is confirmed.'],
  ['Are sample prices final?', 'No. Sample prices are illustrative and are not confirmed business prices. Maria Stitches will confirm real pricing and availability directly.'],
];

export default async function FaqPage() {
  const settings = await getSiteSettings();
  const updatedFaqs = faqs.map(([question, answer]) => [question, question === 'Do you deliver?' ? `Fulfilment is customer pickup only in ${settings.location}. ${settings.pickupInstructions}` : answer] as const);
  return <main className="page-shell"><span className="eyebrow">A FEW USEFUL DETAILS</span><h1 className="page-title">Frequently asked<br /><em>questions.</em></h1><div className="faq-list">{updatedFaqs.map(([question, answer]) => <section className="faq-item" key={question}><h2>{question}</h2><p>{answer}</p></section>)}</div><p className="faq-contact">Have another question? <Link href="/contact">Contact {settings.businessName}</Link>.</p></main>;
}
