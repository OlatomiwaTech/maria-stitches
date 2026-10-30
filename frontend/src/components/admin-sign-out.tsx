'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function AdminSignOut() {
  const router = useRouter();
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace('/admin'); router.refresh();
  }
  return <Button variant="outline" size="sm" onClick={signOut}><LogOut size={14} /> Sign out</Button>;
}
