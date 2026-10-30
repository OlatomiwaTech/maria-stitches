import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient, hasSupabaseConfig } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(24).regex(/^[+\d\s().-]+$/),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(2000),
  size: z.string().trim().max(40).optional().default(''),
  desiredDate: z.string().date().optional().or(z.literal('')),
  inspirationPath: z.string().regex(/^pending\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$/i).optional().nullable(),
  notes: z.string().trim().max(1000).optional().default(''),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Please check the required fields and try again.' }, { status: 400 });
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
    p_inspiration_path: parsed.data.inspirationPath || null,
    p_notes: parsed.data.notes || null,
  });
  if (error) return NextResponse.json({ message: 'We could not save your enquiry. Please contact Maria Stitches on WhatsApp.' }, { status: 400 });
  const reference = data && typeof data === 'object' && !Array.isArray(data) && 'reference' in data && typeof data.reference === 'string' ? data.reference : null;
  if (!reference) return NextResponse.json({ message: 'Your enquiry response was incomplete.' }, { status: 502 });
  return NextResponse.json({ reference }, { status: 201 });
}
