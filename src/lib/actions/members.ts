'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/auth';
import { uuidSchema } from '@/lib/validations/common';
import { createMemberSchema, updateProfileSchema } from '@/lib/validations/members';
import type { ActionResult } from '@/types';

/** Actualiza datos editables del perfil de un miembro. */
export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const parsed = updateProfileSchema.safeParse({
    id: formData.get('id'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone') ?? '',
    documentId: formData.get('documentId') ?? '',
    role: formData.get('role'),
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
      document_id: parsed.data.documentId || null,
      role: parsed.data.role,
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { ok: false, error: 'No se pudo actualizar el perfil.' };
  }

  revalidatePath(`/dashboard/members/${parsed.data.id}`);
  revalidatePath('/dashboard/members');
  return { ok: true, data: undefined };
}

/** Activa o suspende un miembro (profiles.is_active). */
export async function toggleMemberStatusAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = uuidSchema.safeParse(formData.get('id'));
  if (!id.success) {
    return { ok: false, error: 'Miembro inválido.' };
  }
  const nextActive = formData.get('isActive') === 'true';

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: nextActive })
    .eq('id', id.data);

  if (error) {
    return { ok: false, error: 'No se pudo cambiar el estado del miembro.' };
  }

  revalidatePath(`/dashboard/members/${id.data}`);
  revalidatePath('/dashboard/members');
  return { ok: true, data: undefined };
}

/**
 * Crea un miembro desde el panel. Aprovecha el invariante de que `profiles.id`
 * es propio y `auth_user_id` es nullable: el perfil puede existir antes de que
 * la persona active su cuenta de autenticación.
 */
export async function createMemberAction(formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = createMemberSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    role: formData.get('role') ?? 'member',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('profiles').insert({
    tenant_id: staff.tenant_id,
    auth_user_id: null,
    email: parsed.data.email,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    role: parsed.data.role,
  });

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'Ya existe un miembro con ese correo en la sede.' };
    }
    return { ok: false, error: 'No se pudo crear el miembro.' };
  }

  revalidatePath('/dashboard/members');
  return { ok: true, data: undefined };
}
