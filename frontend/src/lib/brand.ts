export const brand = {
  name: 'Maria Stitches',
  tagline: 'Style, beautifully stitched.',
  location: 'Sango Ota, Ogun State, Nigeria',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348033646143',
  whatsappDisplay: '+234 803 364 6143',
  pickup: 'Customer pickup in Sango Ota, Ogun State. Exact pickup arrangements are shared after an order is confirmed.',
};

export function whatsappUrl(message: string) {
  const number = brand.whatsappNumber.replace(/\D/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
