'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';

const orderStatuses = ['awaiting_whatsapp', 'confirmed', 'in_production', 'ready_for_pickup', 'completed', 'cancelled'] as const;
const enquiryStatuses = ['pending', 'contacted', 'accepted', 'declined'] as const;

export async function updateOrderStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(orderStatuses) }).safeParse({ id: formData.get('id'), status: formData.get('status') });
  if (!parsed.success) return;
  const { supabase } = await requireAdmin();
  await supabase.from('order_requests').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  revalidatePath('/admin/orders'); revalidatePath('/admin/dashboard');
}

export async function updateEnquiryStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(enquiryStatuses) }).safeParse({ id: formData.get('id'), status: formData.get('status') });
  if (!parsed.success) return;
  const { supabase } = await requireAdmin();
  await supabase.from('custom_enquiries').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  revalidatePath('/admin/enquiries'); revalidatePath('/admin/dashboard');
}

export async function updateBusinessSettings(_previous: string, formData: FormData): Promise<string> {
  const parsed = z.object({
    businessName: z.string().trim().min(2).max(100),
    tagline: z.string().trim().min(2).max(120),
    whatsapp: z.string().trim().regex(/^\d{8,15}$/),
    location: z.string().trim().min(3).max(150),
    pickup: z.string().trim().min(10).max(500),
    announcement: z.string().trim().max(180),
    email: z.union([z.literal(''), z.email().max(254)]),
    instagram: z.union([z.literal(''), z.url().max(300)]),
    espresso: z.string().regex(/^#[\da-f]{6}$/i),
    ivory: z.string().regex(/^#[\da-f]{6}$/i),
    burgundy: z.string().regex(/^#[\da-f]{6}$/i),
    beige: z.string().regex(/^#[\da-f]{6}$/i),
    champagne: z.string().regex(/^#[\da-f]{6}$/i),
  }).safeParse({
    businessName: formData.get('businessName'), tagline: formData.get('tagline'), whatsapp: formData.get('whatsapp'),
    location: formData.get('location'), pickup: formData.get('pickup'), announcement: formData.get('announcement'),
    email: formData.get('email'), instagram: formData.get('instagram'),
    espresso: formData.get('espresso'), ivory: formData.get('ivory'), burgundy: formData.get('burgundy'), beige: formData.get('beige'), champagne: formData.get('champagne'),
  });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? 'Please check the settings and try again.';
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('site_settings').update({
    business_name: parsed.data.businessName,
    tagline: parsed.data.tagline,
    whatsapp_number: parsed.data.whatsapp,
    location: parsed.data.location,
    pickup_instructions: parsed.data.pickup,
    announcement: parsed.data.announcement || null,
    contact_email: parsed.data.email || null,
    instagram_url: parsed.data.instagram || null,
    brand_settings: { espresso: parsed.data.espresso, ivory: parsed.data.ivory, burgundy: parsed.data.burgundy, beige: parsed.data.beige, champagne: parsed.data.champagne },
  }).eq('id', true);
  if (error) return 'Settings could not be saved. Check the database connection and try again.';
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return 'Business settings saved.';
}
