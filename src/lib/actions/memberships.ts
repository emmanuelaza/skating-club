'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/auth';
import { uuidSchema } from '@/lib/validations/common';
import { planFormSchema, updatePlanSchema } from '@/lib/validations/memberships';
import type { ActionResult } from '@/types';

function parseBenefits(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createPlanAction(formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = planFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    priceCop: formData.get('priceCop'),
    interval: formData.get('interval'),
    benefits: formData.get('benefits') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('membership_plans').insert({
    tenant_id: staff.tenant_id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price_cop: parsed.data.priceCop,
    currency: 'COP',
    interval: parsed.data.interval,
    features: parseBenefits(parsed.data.benefits ?? ''),
  });

  if (error) {
    return { ok: false, error: 'No se pudo crear el plan.' };
  }

  revalidatePath('/dashboard/memberships');
  return { ok: true, data: undefined };
}

export async function updatePlanAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const parsed = updatePlanSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    priceCop: formData.get('priceCop'),
    interval: formData.get('interval'),
    benefits: formData.get('benefits') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('membership_plans')
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cop: parsed.data.priceCop,
      interval: parsed.data.interval,
      features: parseBenefits(parsed.data.benefits ?? ''),
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { ok: false, error: 'No se pudo actualizar el plan.' };
  }

  revalidatePath('/dashboard/memberships');
  return { ok: true, data: undefined };
}

export async function togglePlanAction(formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = uuidSchema.safeParse(formData.get('id'));
  if (!id.success) {
    return { ok: false, error: 'Plan inválido.' };
  }
  const nextActive = formData.get('isActive') === 'true';

  const supabase = await createClient();
  const { error } = await supabase
    .from('membership_plans')
    .update({ is_active: nextActive })
    .eq('id', id.data);

  if (error) {
    return { ok: false, error: 'No se pudo cambiar el estado del plan.' };
  }

  revalidatePath('/dashboard/memberships');
  return { ok: true, data: undefined };
}
