import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, admin: null };
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== 'string') return { supabase, admin: null };
  const { data: profile } = await supabase.from('profiles').select('id, role, display_name').eq('id', userId).maybeSingle();
  if (profile?.role !== 'admin') return { supabase, admin: null };
  return { supabase, admin: { id: profile.id, displayName: profile.display_name } };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.supabase) redirect('/admin?setup=supabase');
  if (!session.admin) redirect('/admin?error=access');
  return { supabase: session.supabase, admin: session.admin };
}
