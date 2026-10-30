export function customerWhatsAppUrl(phone: string, message: string) {
  const raw = phone.trim();
  const digits = raw.replace(/\D/g, '');
  const normalized = raw.startsWith('+') ? digits : digits.startsWith('0') && digits.length === 11 ? `234${digits.slice(1)}` : digits;
  if (normalized.length < 8 || normalized.length > 15) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
