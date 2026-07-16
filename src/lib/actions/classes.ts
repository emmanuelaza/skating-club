'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/auth';
import { uuidSchema } from '@/lib/validations/common';
import { createClassSchema, updateClassSchema } from '@/lib/validations/classes';
import type { ActionResult } from '@/types';

function endsAtFrom(startsAtIso: string, durationMinutes: number): string {
  return new Date(new Date(startsAtIso).getTime() + durationMinutes * 60_000).toISOString();
}

export async function createClassAction(formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = createClassSchema.safeParse({
    classTypeId: formData.get('classTypeId'),
    instructorId: formData.get('instructorId') ?? '',
    location: formData.get('location') ?? '',
    capacity: formData.get('capacity'),
    startsAt: formData.get('startsAt'),
    durationMinutes: formData.get('durationMinutes'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const startsAtIso = new Date(parsed.data.startsAt).toISOString();
  const supabase = await createClient();
  const { error } = await supabase.from('classes').insert({
    tenant_id: staff.tenant_id,
    class_type_id: parsed.data.classTypeId,
    instructor_id: parsed.data.instructorId || null,
    location: parsed.data.location || null,
    capacity: parsed.data.capacity,
    starts_at: startsAtIso,
    ends_at: endsAtFrom(startsAtIso, parsed.data.durationMinutes),
    status: 'scheduled',
  });

  if (error) {
    return { ok: false, error: 'No se pudo crear la clase.' };
  }

  revalidatePath('/dashboard/classes');
  return { ok: true, data: undefined };
}

export async function updateClassAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const parsed = updateClassSchema.safeParse({
    id: formData.get('id'),
    classTypeId: formData.get('classTypeId'),
    instructorId: formData.get('instructorId') ?? '',
    location: formData.get('location') ?? '',
    capacity: formData.get('capacity'),
    startsAt: formData.get('startsAt'),
    durationMinutes: formData.get('durationMinutes'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const startsAtIso = new Date(parsed.data.startsAt).toISOString();
  const supabase = await createClient();
  const { error } = await supabase
    .from('classes')
    .update({
      class_type_id: parsed.data.classTypeId,
      instructor_id: parsed.data.instructorId || null,
      location: parsed.data.location || null,
      capacity: parsed.data.capacity,
      starts_at: startsAtIso,
      ends_at: endsAtFrom(startsAtIso, parsed.data.durationMinutes),
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { ok: false, error: 'No se pudo actualizar la clase.' };
  }

  revalidatePath('/dashboard/classes');
  return { ok: true, data: undefined };
}

export async function cancelClassAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = uuidSchema.safeParse(formData.get('id'));
  if (!id.success) {
    return { ok: false, error: 'Clase inválida.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('classes').update({ status: 'canceled' }).eq('id', id.data);
  if (error) {
    return { ok: false, error: 'No se pudo cancelar la clase.' };
  }

  revalidatePath('/dashboard/classes');
  return { ok: true, data: undefined };
}
