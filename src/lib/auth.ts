import 'server-only';
import { redirect } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { STAFF_ROLES } from '@/lib/roles';
import type { UserRole } from '@/types/database';
import type { Profile, SessionProfile } from '@/types';

/**
 * Helpers de autenticación para Server Components, Server Actions y Route
 * Handlers. La seguridad real la impone RLS; estas funciones gobiernan el
 * acceso a nivel de aplicación (sesión y rol).
 */

/** Sesión actual o null. */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Perfil completo del usuario autenticado. Resuelve por
 * `auth_user_id = auth.uid()` (recordar: `profiles.id` es un uuid propio).
 * Usa `getUser()` (revalida el token) en lugar de la sesión de cookie.
 *
 * El correo se adjunta desde `auth.users`: la tabla `profiles` no lo almacena.
 */
export async function getProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const withEmail = (row: Profile): SessionProfile => ({ ...row, email: user.email ?? null });

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (data) return withEmail(data);

  // Fallback a cliente admin en el servidor si RLS o cookies filtraron la lectura
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const adminSupabase = createAdminClient();
  const { data: adminData } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  return adminData ? withEmail(adminData) : null;
}

/** Exige sesión; redirige a /login si no la hay. Devuelve el usuario validado. */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Exige que el usuario tenga uno de los roles permitidos.
 * Redirige a /login si no hay perfil y a / si el rol no está permitido.
 * Devuelve el perfil cuando el acceso es válido.
 */
export async function requireRole(roles: readonly UserRole[]): Promise<SessionProfile> {
  const profile = await getProfile();
  if (!profile) {
    redirect('/login');
  }
  if (!roles.includes(profile.role)) {
    redirect('/');
  }
  return profile;
}

/** Atajo: exige rol de staff (acceso a /dashboard). */
export async function requireStaff(): Promise<SessionProfile> {
  return requireRole(STAFF_ROLES);
}

/** Cierra la sesión y redirige a /login. */
export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
