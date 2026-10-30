import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient, hasSupabaseConfig } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';

export const runtime = 'nodejs';
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const formSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(24).regex(/^[+\d\s().-]+$/),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(2000),
  size: z.string().trim().max(40).optional().default(''),
  desiredDate: z.union([z.literal(''), z.iso.date()]).optional().default(''),
  notes: z.string().trim().max(1000).optional().default(''),
});

export async function POST(request: Request) {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 6 * 1024 * 1024) return NextResponse.json({ message: 'Please keep the entire request under 6 MB.' }, { status: 413 });
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ message: 'The enquiry form could not be read.' }, { status: 400 });
  const parsed = formSchema.safeParse({ name: form.get('name'), phone: form.get('phone'), category: form.get('category'), description: form.get('description'), size: form.get('size'), desiredDate: form.get('desiredDate'), notes: form.get('notes') });
  if (!parsed.success) return NextResponse.json({ message: 'Please check the required fields and try again.' }, { status: 400 });
  const photoEntry = form.get('inspiration');
  const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  if (photo && (!imageTypes.has(photo.type) || photo.size > 5 * 1024 * 1024)) return NextResponse.json({ message: 'Please use a JPG, PNG or WebP image under 5 MB.' }, { status: 400 });
  if (!hasSupabaseConfig()) return NextResponse.json({ message: 'Online enquiry saving is not configured yet.' }, { status: 503 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: 'Online enquiry saving is not configured yet.' }, { status: 503 });
  const { data, error } = await supabase.rpc('create_custom_enquiry', {
    p_customer_name: parsed.data.name,
    p_customer_phone: parsed.data.phone,
    p_category_label: parsed.data.category,
    p_description: parsed.data.description,
    p_preferred_size: parsed.data.size || null,
    p_desired_date: parsed.data.desiredDate || null,
    p_inspiration_path: null,
    p_notes: parsed.data.notes || null,
  });
  if (error) return NextResponse.json({ message: error.message.includes('RATE_LIMITED') ? 'A few enquiries have already been sent from this phone number. Please try again later or contact Maria Stitches on WhatsApp.' : 'We could not save your enquiry. Please contact Maria Stitches on WhatsApp.' }, { status: error.message.includes('RATE_LIMITED') ? 429 : 400 });
  const record = data && typeof data === 'object' && !Array.isArray(data) ? data as { id?: unknown; reference?: unknown } : {};
  if (typeof record.id !== 'string' || typeof record.reference !== 'string') return NextResponse.json({ message: 'Your enquiry response was incomplete.' }, { status: 502 });

  let photoSaved = false;
  let photoWarning: string | null = null;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (photo && secret && projectUrl) {
    const extension = photo.type === 'image/jpeg' ? 'jpg' : photo.type.split('/')[1];
    const path = `pending/${crypto.randomUUID()}.${extension}`;
    const privileged = createClient<Database>(projectUrl, secret, { auth: { autoRefreshToken: false, persistSession: false } });
    const upload = await privileged.storage.from('custom-inspiration').upload(path, photo, { contentType: photo.type, upsert: false });
    if (!upload.error) {
      const { error: updateError } = await privileged.from('custom_enquiries').update({ inspiration_path: path }).eq('id', record.id);
      if (!updateError) photoSaved = true;
      else { await privileged.storage.from('custom-inspiration').remove([path]); photoWarning = 'Your enquiry is saved, but the image did not attach. Please share it in WhatsApp.'; }
    } else photoWarning = 'Your enquiry is saved, but the image could not be uploaded. Please share it in WhatsApp.';
  } else if (photo) photoWarning = 'Your enquiry is saved, but image storage is not configured. Please share the image in WhatsApp.';

  return NextResponse.json({ reference: record.reference, photoSaved, photoWarning }, { status: 201 });
}
