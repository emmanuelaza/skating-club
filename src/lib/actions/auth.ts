'use server';

import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { homePathForRole } from '@/lib/roles';
import { sendWelcomeEmail } from '@/lib/email/templates';
import { signInSchema, signUpSchema, resetPasswordSchema } from '@/lib/validations/auth';
import type { ActionResult } from '@/types';

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

/**
 * Inicia sesión con email/contraseña. En caso de éxito redirige a la home según
 * el rol; en error devuelve un mensaje genérico para no filtrar qué falló.
 */
export async function signInAction(formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Revisa los datos del formulario.' };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !authData.user) {
    console.log('[SIGNIN_ACTION] Auth failed:', error?.message ?? 'no user');
    return { ok: false, error: 'Credenciales incorrectas' };
  }

  console.log('[SIGNIN_ACTION] Auth success for user:', authData.user.id);

  // Obtener el rol del perfil usando authData.user.id directamente
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', authData.user.id)
    .maybeSingle();

  console.log('[SIGNIN_ACTION] Profile fetched role:', profile?.role ?? 'null', 'Error:', profileErr?.message ?? 'none');

  const destination = profile ? homePathForRole(profile.role) : '/portal';
  console.log('[SIGNIN_ACTION] Directing to destination:', destination);
  redirect(destination as Route);
}

/**
 * Registra un nuevo miembro. Pasa `tenant_id` y `role` en raw_user_meta_data
 * para que el trigger `handle_new_user()` cree el perfil con la sede correcta.
 * Inicia sesión automáticamente tras el registro y redirige al portal.
 */
export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Datos inválidos.';
    return { ok: false, error: first };
  }

  const tenant = await getCurrentTenant();
  if (!tenant) {
    return { ok: false, error: 'No se pudo determinar la sede. Accede desde el sitio de tu club.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${appUrl()}/callback`,
      data: {
        full_name: parsed.data.fullName,
        tenant_id: tenant.id,
        role: 'member',
      },
    },
  });

  if (error) {
    if (error.code === 'user_already_exists' || error.message.toLowerCase().includes('already')) {
      return { ok: false, error: 'Ya existe una cuenta con este correo.' };
    }
    return { ok: false, error: 'No se pudo crear la cuenta. Intenta de nuevo.' };
  }

  // Email de bienvenida (no bloquea el registro si falla).
  await sendWelcomeEmail({ email: parsed.data.email, full_name: parsed.data.fullName }, tenant);

  // Iniciar sesión automáticamente para evitar la pantalla de verificación
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError || !signInData.user) {
    return {
      ok: false,
      error: 'Cuenta creada, pero no se pudo iniciar sesión automáticamente. Por favor ve a iniciar sesión.',
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', signInData.user.id)
    .maybeSingle();

  const destination = profile ? homePathForRole(profile.role) : '/portal';
  redirect(destination as Route);
}

/**
 * Envía el correo de restablecimiento de contraseña. Devuelve éxito siempre que
 * la operación no falle técnicamente, para no revelar si el correo existe.
 */
export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { ok: false, error: 'Ingresa un correo válido.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl()}/callback?next=/reset-password`,
  });

  if (error) {
    return { ok: false, error: 'No se pudo enviar el correo. Intenta más tarde.' };
  }

  return { ok: true, data: undefined };
}

/** Cierra la sesión y redirige a /login. */
export async function signOutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
