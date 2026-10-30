'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, ImagePlus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { brand, whatsappUrl } from '@/lib/brand';

const categories = ['Dresses and Gowns', 'Two-Piece Outfits', 'Native and Traditional Wear', 'Trousers and Shirts', "Children's Clothing", 'Other'];
const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export function CustomOrderForm() {
  const [form, setForm] = useState({ name: '', phone: '', category: categories[0], description: '', size: '', desiredDate: '', notes: '' });
  const [image, setImage] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fallbackLink, setFallbackLink] = useState<string | null>(null);
  const fallbackText = `Hello ${brand.name}, I would like to ask about a custom-made outfit.\n\nName: ${form.name}\nPhone: ${form.phone}\nCategory: ${form.category}\nDescription: ${form.description}\nPreferred size: ${form.size || 'To discuss'}\nDesired date: ${form.desiredDate || 'To discuss'}\nNotes: ${form.notes || 'None'}\n\nI can share an inspiration photo in the chat.`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(''); setSuccess(''); setFallbackLink(null);
    try {
      let inspirationPath: string | null = null;
      if (image) {
        const extension = image.name.split('.').pop()?.toLowerCase() ?? '';
        const safeExtension = extension === 'jpeg' ? 'jpg' : extension;
        const supabase = createSupabaseBrowserClient();
        const path = `pending/${crypto.randomUUID()}.${safeExtension}`;
        const { error: uploadError } = await supabase.storage.from('custom-inspiration').upload(path, image, { upsert: false, contentType: image.type });
        if (uploadError) throw new Error('Your photo could not be uploaded. You can still send the enquiry and attach it in WhatsApp.');
        inspirationPath = path;
      }
      const response = await fetch('/api/custom-enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, inspirationPath }) });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' ? data.message : 'We could not save your enquiry.';
        throw new Error(message);
      }
      const reference = data && typeof data === 'object' && 'reference' in data && typeof data.reference === 'string' ? data.reference : 'received';
      setSuccess(`Thank you. Your custom enquiry is saved as ${reference}. You can continue the conversation on WhatsApp.`);
      setFallbackLink(whatsappUrl(`${fallbackText}\n\nEnquiry reference: ${reference}`));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not save your enquiry.');
      setFallbackLink(whatsappUrl(fallbackText));
    } finally { setPending(false); }
  }

  function setField(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })); }

  return <form className="form-card" onSubmit={submit}>
    <div className="form-field"><label htmlFor="custom-name">Your name</label><input required minLength={2} maxLength={100} id="custom-name" autoComplete="name" value={form.name} onChange={(event) => setField('name', event.target.value)} /></div>
    <div className="form-field"><label htmlFor="custom-phone">WhatsApp phone number</label><input required minLength={7} maxLength={24} id="custom-phone" type="tel" autoComplete="tel" placeholder="+234…" value={form.phone} onChange={(event) => setField('phone', event.target.value)} /></div>
    <div className="form-field"><label htmlFor="custom-category">Clothing category</label><select id="custom-category" value={form.category} onChange={(event) => setField('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
    <div className="form-field"><label htmlFor="custom-description">Tell us about the outfit</label><textarea required minLength={10} maxLength={2000} id="custom-description" rows={4} placeholder="The style, occasion, fabric or details you have in mind…" value={form.description} onChange={(event) => setField('description', event.target.value)} /></div>
    <div className="form-grid-two"><div className="form-field"><label htmlFor="custom-size">Preferred size (optional)</label><input id="custom-size" maxLength={40} placeholder="We can discuss this privately" value={form.size} onChange={(event) => setField('size', event.target.value)} /></div><div className="form-field"><label htmlFor="custom-date">Desired completion date (optional)</label><input id="custom-date" type="date" value={form.desiredDate} onChange={(event) => setField('desiredDate', event.target.value)} /></div></div>
    <div className="form-field"><label htmlFor="custom-image">Inspiration photo (optional)</label><label className="upload-control" htmlFor="custom-image"><ImagePlus size={17} />{image ? image.name : 'Choose a JPG, PNG or WebP photo'}<input className="sr-only" id="custom-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0] ?? null; if (file && (!imageTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) { setImage(null); setError('Please select a JPG, PNG or WebP image under 5 MB.'); return; } setError(''); setImage(file); }} /></label><span className="form-help">Maximum 5 MB. Please don’t upload sensitive body measurements.</span></div>
    <div className="form-field"><label htmlFor="custom-notes">Additional notes (optional)</label><textarea id="custom-notes" rows={3} maxLength={1000} value={form.notes} onChange={(event) => setField('notes', event.target.value)} /></div>
    {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success" role="status">{success}</p>}
    <Button type="submit" disabled={pending}>{pending ? 'Sending enquiry…' : 'Send custom enquiry'}</Button>
    {fallbackLink && <Button asChild variant="whatsapp"><a href={fallbackLink} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Continue in WhatsApp <ArrowUpRight size={14} /></a></Button>}
    <p className="form-help">Submitting an enquiry does not confirm an order, availability or completion date.</p>
  </form>;
}
