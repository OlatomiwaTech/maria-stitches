import { NextResponse } from 'next/server';
import { z } from 'zod';
import { brand, whatsappUrl } from '@/lib/brand';
import { hasSupabaseConfig, createSupabaseServerClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/database.types';

const requestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(24).regex(/^[+\d\s().-]+$/),
  note: z.string().trim().max(1000).optional().default(''),
  idempotencyKey: z.string().uuid(),
  items: z.array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1).max(10) })).min(1).max(30),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Check your name, WhatsApp number and selected items.' }, { status: 400 });
  if (!hasSupabaseConfig()) return NextResponse.json({ message: 'Order requests are not connected yet. Please ask Maria Stitches on WhatsApp.' }, { status: 503 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ message: 'Order requests are not connected yet.' }, { status: 503 });
  const { data, error } = await supabase.rpc('create_order_request', {
    p_customer_name: parsed.data.name,
    p_customer_phone: parsed.data.phone,
    p_note: parsed.data.note || null,
    p_items: parsed.data.items.map(({ variantId, quantity }) => ({ variant_id: variantId, quantity })) as unknown as Json,
    p_idempotency_key: parsed.data.idempotencyKey,
  });

  if (error) return NextResponse.json({ message: error.message.includes('DEMO_PRODUCT') ? 'Sample products cannot be submitted as real orders.' : 'The selected styles could not be requested. Please contact Maria Stitches.' }, { status: error.message.includes('DEMO_PRODUCT') ? 409 : 400 });
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ message: 'The order request response was incomplete.' }, { status: 502 });

  const result = data as { reference?: unknown; total_estimate_ngn?: unknown; items?: unknown };
  if (typeof result.reference !== 'string' || typeof result.total_estimate_ngn !== 'number' || !Array.isArray(result.items)) return NextResponse.json({ message: 'The order request response was incomplete.' }, { status: 502 });
  const itemLines = result.items.map((item, index) => {
    if (!item || typeof item !== 'object') return '';
    const row = item as { name?: unknown; size?: unknown; color?: unknown; quantity?: unknown; unit_price_ngn?: unknown };
    if (typeof row.name !== 'string' || typeof row.quantity !== 'number' || typeof row.size !== 'string' || typeof row.unit_price_ngn !== 'number') return '';
    return `${index + 1}. ${row.name}\n   Size: ${row.size}${typeof row.color === 'string' ? ` · Colour: ${row.color}` : ''}\n   Quantity: ${row.quantity}\n   Price: ${formatNaira(row.unit_price_ngn)} each`;
  }).filter(Boolean).join('\n\n');
  const message = `Hello ${brand.name}!\n\nI would like to enquire about placing an order.\n\nOrder Reference: ${result.reference}\n\nItems:\n${itemLines}\n\nEstimated Total: ${formatNaira(result.total_estimate_ngn)}\n\nCustomer Name: ${parsed.data.name}\nPhone: ${parsed.data.phone}\n\nFulfilment: Customer Pickup\nLocation: ${brand.location}.\n\nPlease confirm availability and the next steps.\n\nThank you!`;
  const link = whatsappUrl(message);
  if (!link) return NextResponse.json({ message: 'The WhatsApp number is not configured.' }, { status: 503 });
  return NextResponse.json({ reference: result.reference, totalEstimateNgn: result.total_estimate_ngn, whatsappUrl: link }, { status: 201 });
}

function formatNaira(amount: number) { return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount); }
