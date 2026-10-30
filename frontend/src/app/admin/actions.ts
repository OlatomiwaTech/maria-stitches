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

export async function updateBusinessSettings(formData: FormData) {
  const parsed = z.object({
    businessName: z.string().trim().min(2).max(100),
    tagline: z.string().trim().min(2).max(120),
    whatsapp: z.string().trim().regex(/^\d{8,15}$/),
    location: z.string().trim().min(3).max(150),
    pickup: z.string().trim().min(10).max(500),
    announcement: z.string().trim().max(180),
    email: z.union([z.literal(''), z.email().max(254)]),
    instagram: z.union([z.literal(''), z.url().max(300)]),
  }).safeParse({
    businessName: formData.get('businessName'), tagline: formData.get('tagline'), whatsapp: formData.get('whatsapp'),
    location: formData.get('location'), pickup: formData.get('pickup'), announcement: formData.get('announcement'),
    email: formData.get('email'), instagram: formData.get('instagram'),
  });
  if (!parsed.success) return;
  const { supabase } = await requireAdmin();
  await supabase.from('site_settings').update({
    business_name: parsed.data.businessName,
    tagline: parsed.data.tagline,
    whatsapp_number: parsed.data.whatsapp,
    location: parsed.data.location,
    pickup_instructions: parsed.data.pickup,
    announcement: parsed.data.announcement || null,
    contact_email: parsed.data.email || null,
    instagram_url: parsed.data.instagram || null,
  }).eq('id', true);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
}
