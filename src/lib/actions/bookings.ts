'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { PORTAL_ROLES } from '@/lib/roles';
import { uuidSchema } from '@/lib/validations/common';
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/email/templates';
import type { ActionResult } from '@/types';

const CANCEL_WINDOW_HOURS = 2;

/**
 * Crea una reserva. Si la clase tiene cupo disponible queda 'confirmed', de lo
 * contrario 'waitlisted'. Evita reservas duplicadas.
 */
export async function createBookingAction(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(PORTAL_ROLES);

  const classId = uuidSchema.safeParse(formData.get('classId'));
  if (!classId.success) {
    return { ok: false, error: 'Clase inválida.' };
  }

  const supabase = await createClient();
  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('id, capacity, status, starts_at, ends_at, location, class_type_id, instructor_id')
    .eq('id', classId.data)
    .maybeSingle();
  if (classError) return { ok: false, error: 'No se pudo cargar la clase.' };
  if (!cls) return { ok: false, error: 'Clase no encontrada.' };
  if (cls.status === 'canceled') return { ok: false, error: 'La clase fue cancelada.' };

  const { data: existing } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('class_id', cls.id)
    .eq('profile_id', profile.id)
    .maybeSingle();
  if (existing && existing.status !== 'canceled') {
    return { ok: false, error: 'Ya tienes una reserva para esta clase.' };
  }

  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('class_id', cls.id)
    .eq('status', 'confirmed');
  const status = (count ?? 0) < cls.capacity ? 'confirmed' : 'waitlisted';

  const mutation = existing
    ? supabase.from('bookings').update({ status, booked_at: new Date().toISOString() }).eq('id', existing.id)
    : supabase.from('bookings').insert({
        tenant_id: profile.tenant_id,
        class_id: cls.id,
        profile_id: profile.id,
        status,
      });
  const { error } = await mutation;
  if (error) return { ok: false, error: 'No se pudo crear la reserva.' };

  // Email de confirmación (solo cuando queda confirmada; no bloquea la reserva).
  if (status === 'confirmed') {
    const tenant = await getCurrentTenant();
    if (tenant) {
      const [{ data: classType }, instructorResult] = await Promise.all([
        supabase.from('class_types').select('name').eq('id', cls.class_type_id).maybeSingle(),
        cls.instructor_id
          ? supabase.from('profiles').select('full_name').eq('id', cls.instructor_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      const durationMinutes = Math.round(
        (new Date(cls.ends_at).getTime() - new Date(cls.starts_at).getTime()) / 60_000,
      );
      await sendBookingConfirmation(
        profile.email,
        {
          classType: classType?.name ?? 'Clase',
          instructor: instructorResult.data?.full_name ?? null,
          location: cls.location,
          startsAt: cls.starts_at,
          durationMinutes,
        },
        tenant,
      );
    }
  }

  revalidatePath('/portal/classes');
  revalidatePath('/portal/classes/my-bookings');
  revalidatePath('/portal');
  return { ok: true, data: undefined };
}

/** Cancela una reserva, respetando la ventana mínima de cancelación (2h). */
export async function cancelBookingAction(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(PORTAL_ROLES);

  const bookingId = uuidSchema.safeParse(formData.get('bookingId'));
  if (!bookingId.success) {
    return { ok: false, error: 'Reserva inválida.' };
  }

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, class_id, profile_id, status')
    .eq('id', bookingId.data)
    .maybeSingle();
  if (!booking || booking.profile_id !== profile.id) {
    return { ok: false, error: 'Reserva no encontrada.' };
  }

  const { data: cls } = await supabase
    .from('classes')
    .select('starts_at, class_type_id')
    .eq('id', booking.class_id)
    .maybeSingle();
  if (cls) {
    const hoursUntil = (new Date(cls.starts_at).getTime() - Date.now()) / 3_600_000;
    if (hoursUntil < CANCEL_WINDOW_HOURS) {
      return {
        ok: false,
        error: 'Solo puedes cancelar con más de 2 horas de anticipación.',
      };
    }
  }

  const { error } = await supabase.from('bookings').update({ status: 'canceled' }).eq('id', booking.id);
  if (error) return { ok: false, error: 'No se pudo cancelar la reserva.' };

  // Email de cancelación (no bloquea la operación).
  if (cls) {
    const tenant = await getCurrentTenant();
    if (tenant) {
      const { data: classType } = await supabase
        .from('class_types')
        .select('name')
        .eq('id', cls.class_type_id)
        .maybeSingle();
      await sendBookingCancellation(
        profile.email,
        { classType: classType?.name ?? 'Clase', startsAt: cls.starts_at },
        tenant,
      );
    }
  }

  revalidatePath('/portal/classes');
  revalidatePath('/portal/classes/my-bookings');
  revalidatePath('/portal');
  return { ok: true, data: undefined };
}

/** Congela la membresía activa (status -> paused, registra frozen_at). */
export async function freezeSubscriptionAction(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(PORTAL_ROLES);

  const subscriptionId = uuidSchema.safeParse(formData.get('subscriptionId'));
  if (!subscriptionId.success) {
    return { ok: false, error: 'Suscripción inválida.' };
  }

  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, profile_id, status')
    .eq('id', subscriptionId.data)
    .maybeSingle();
  if (!subscription || subscription.profile_id !== profile.id) {
    return { ok: false, error: 'Suscripción no encontrada.' };
  }
  if (subscription.status !== 'active') {
    return { ok: false, error: 'Solo puedes congelar una membresía activa.' };
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'paused', frozen_at: new Date().toISOString() })
    .eq('id', subscription.id);
  if (error) return { ok: false, error: 'No se pudo congelar la membresía.' };

  revalidatePath('/portal/membership');
  return { ok: true, data: undefined };
}
