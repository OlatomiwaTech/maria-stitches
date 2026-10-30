import { createSupabaseServerClient, hasSupabaseConfig } from '@/lib/supabase/server';

export type SiteSettings = {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  location: string;
  pickupInstructions: string;
  announcement: string;
  contactEmail: string;
  instagramUrl: string;
  colors: { espresso: string; ivory: string; burgundy: string; beige: string; champagne: string };
};

export const defaultSiteSettings: SiteSettings = {
  businessName: 'Maria Stitches',
  tagline: 'Style, beautifully stitched.',
  whatsappNumber: '2348033646143',
  location: 'Sango Ota, Ogun State, Nigeria',
  pickupInstructions: 'Customer pickup only. Exact pickup arrangements are shared after an order is confirmed.',
  announcement: '', contactEmail: '', instagramUrl: '',
  colors: { espresso: '#2B1D1A', ivory: '#F7F2E9', burgundy: '#7A263A', beige: '#E8DED1', champagne: '#B9975B' },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabaseConfig()) return defaultSiteSettings;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultSiteSettings;
  const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
  if (!data) return defaultSiteSettings;
  const colors = typeof data.brand_settings === 'object' && data.brand_settings && !Array.isArray(data.brand_settings) ? data.brand_settings : {};
  return {
    businessName: data.business_name || defaultSiteSettings.businessName,
    tagline: data.tagline || defaultSiteSettings.tagline,
    whatsappNumber: data.whatsapp_number.replace(/\D/g, '') || defaultSiteSettings.whatsappNumber,
    location: data.location || defaultSiteSettings.location,
    pickupInstructions: data.pickup_instructions || defaultSiteSettings.pickupInstructions,
    announcement: data.announcement || '',
    contactEmail: data.contact_email || '',
    instagramUrl: data.instagram_url || '',
    colors: {
      espresso: readColor(colors, 'espresso', defaultSiteSettings.colors.espresso),
      ivory: readColor(colors, 'ivory', defaultSiteSettings.colors.ivory),
      burgundy: readColor(colors, 'burgundy', defaultSiteSettings.colors.burgundy),
      beige: readColor(colors, 'beige', defaultSiteSettings.colors.beige),
      champagne: readColor(colors, 'champagne', defaultSiteSettings.colors.champagne),
    },
  };
}

function readColor(value: object, key: string, fallback: string) {
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'string' && /^#[\da-f]{6}$/i.test(candidate) ? candidate : fallback;
}

