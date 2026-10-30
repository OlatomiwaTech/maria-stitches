'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateBusinessSettings } from '@/app/admin/actions';
import type { SiteSettings } from '@/lib/site-settings';

export function BusinessSettingsForm({ settings }: { settings: SiteSettings }) {
  const [message, action, pending] = useActionState(updateBusinessSettings, '');
  return <form className="business-settings-form" action={action}>
    <section className="admin-panel"><h2>Business information</h2><div className="settings-grid"><label>Business name<input name="businessName" defaultValue={settings.businessName} required maxLength={100} /></label><label>Tagline<input name="tagline" defaultValue={settings.tagline} required maxLength={120} /></label><label>WhatsApp number<input name="whatsapp" defaultValue={settings.whatsappNumber} required inputMode="numeric" pattern="[0-9]{8,15}" aria-describedby="whatsapp-help" /><small id="whatsapp-help">International format, digits only. Example: 2348033646143.</small></label><label>Location<input name="location" defaultValue={settings.location} required maxLength={150} /></label><label className="settings-span">Pickup instructions<textarea name="pickup" defaultValue={settings.pickupInstructions} required maxLength={500} rows={3} /></label><label>Website announcement<input name="announcement" defaultValue={settings.announcement} maxLength={180} /><small>Leave blank to hide the announcement bar.</small></label><label>Public contact email (optional)<input name="email" type="email" defaultValue={settings.contactEmail} maxLength={254} /></label><label>Instagram URL (optional)<input name="instagram" type="url" defaultValue={settings.instagramUrl} maxLength={300} /></label></div></section>
    <section className="admin-panel"><h2>Brand colours</h2><p className="form-help">These colours update the storefront theme. Use accessible combinations.</p><div className="color-settings">{(['espresso', 'ivory', 'burgundy', 'beige', 'champagne'] as const).map((key) => <label className="color-setting" key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><input type="color" name={key} defaultValue={settings.colors[key]} /><code>{settings.colors[key]}</code></label>)}</div><Button type="submit" disabled={pending}><Save size={15} />{pending ? 'Saving settings…' : 'Save business settings'}</Button>{message && <p className={message === 'Business settings saved.' ? 'form-success' : 'form-error'} role="status">{message}</p>}</section>
  </form>;
}
