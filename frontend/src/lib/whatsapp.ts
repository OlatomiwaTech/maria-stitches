export function customerWhatsAppUrl(phone: string, message: string) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function siteWhatsAppUrl(number: string, message: string) {
  const normalized = normalizePhoneNumber(number);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function normalizePhoneNumber(value: string) {
  const raw = value.trim();
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, '');
  const normalized = !raw.startsWith('+') && digits.startsWith('0') && digits.length === 11 ? `234${digits.slice(1)}` : digits;
  return /^[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}
