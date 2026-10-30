import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin-login-form';
import { getAdminSession } from '@/lib/admin';

export const metadata: Metadata = { title: 'Administrator sign in', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ setup?: string; error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, admin } = await getAdminSession();
  if (admin) redirect('/admin/dashboard');
  return <main className="admin-shell"><section className="admin-login-panel"><span className="eyebrow">PRIVATE AREA</span><h1 className="story-title">Maria Stitches<br /><em>admin.</em></h1><p>Sign in to manage products, customer enquiries, order requests and business details.</p>{!supabase || params.setup ? <div className="setup-callout"><strong>Connect Supabase to enable administrator sign-in.</strong><p>Copy <code>frontend/.env.example</code> to <code>frontend/.env.local</code>, add the Supabase project URL and publishable key, then apply the database migration.</p></div> : <AdminLoginForm />}{params.error && <p className="form-error" role="alert">Your account does not have the administrator role. Please contact the project owner.</p>}<Link className="back-home" href="/">Return to storefront</Link></section></main>;
}
