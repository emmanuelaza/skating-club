'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole, getProfile } from '@/lib/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { PORTAL_ROLES } from '@/lib/roles';
import { updateOwnProfileSchema, changePasswordSchema } from '@/lib/validations/account';
import { sendPasswordChanged } from '@/lib/email/templates';
import type { ActionResult } from '@/types';

/** Actualiza los datos del perfil del propio miembro. */
export async function updateOwnProfileAction(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(PORTAL_ROLES);

  const parsed = updateOwnProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone') ?? '',
    dateOfBirth: formData.get('dateOfBirth') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      date_of_birth: parsed.data.dateOfBirth || null,
    })
    .eq('id', profile.id);

  if (error) return { ok: false, error: 'No se pudo actualizar el perfil.' };

  revalidatePath('/portal/account');
  revalidatePath('/portal');
  return { ok: true, data: undefined };
}

/** Cambia la contraseña del usuario autenticado. */
export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(PORTAL_ROLES);

  const parsed = changePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: 'No se pudo cambiar la contraseña.' };

  // Aviso de seguridad por email (no bloquea el cambio).
  const tenant = await getCurrentTenant();
  if (tenant) {
    await sendPasswordChanged(
      { email: profile.email, full_name: profile.full_name },
      new Date().toISOString(),
      tenant,
    );
  }

  return { ok: true, data: undefined };
}

/**
 * Elimina la cuenta del miembro. Soft-delete: desactiva el perfil y cierra
 * sesión. La eliminación definitiva del usuario de auth requiere un proceso
 * administrativo (service_role) y queda fuera de la autogestión del miembro.
 */
export async function deleteAccountAction(): Promise<ActionResult> {
  const profile = await getProfile();
  if (!profile) {
    return { ok: false, error: 'No hay sesión activa.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', profile.id);
  if (error) return { ok: false, error: 'No se pudo eliminar la cuenta.' };

  await supabase.auth.signOut();
  redirect('/login');
}
