'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('');
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error('Email or password was not accepted.');
      router.replace('/admin/dashboard'); router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign in could not be completed.');
    } finally { setPending(false); }
  }

  return <form className="admin-login-form" onSubmit={signIn}><label htmlFor="admin-email">Administrator email</label><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />{error && <p className="form-error" role="alert">{error}</p>}<Button type="submit" disabled={pending}><LockKeyhole size={15} />{pending ? 'Signing in…' : 'Sign in securely'}</Button><p className="form-help">Administrator accounts are provisioned privately. There is no public sign-up.</p></form>;
}
