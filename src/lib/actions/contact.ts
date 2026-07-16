'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentTenant } from '@/lib/tenant';
import { contactSchema } from '@/lib/validations/contact';
import type { ActionResult } from '@/types';

/**
 * Crea un ticket de soporte desde el formulario público de contacto.
 * El visitante no tiene sesión, así que la inserción usa el cliente admin
 * (bypass RLS) y `profile_id` queda nulo.
 */
export async function createContactAction(formData: FormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    subject: formData.get('subject'),
    message: formData.get('message'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const tenant = await getCurrentTenant();
  if (!tenant) {
    return { ok: false, error: 'No se pudo determinar la sede. Inténtalo más tarde.' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('support_tickets').insert({
    tenant_id: tenant.id,
    profile_id: null,
    subject: parsed.data.subject,
    status: 'open',
    priority: 'low',
    contact_name: parsed.data.name,
    contact_email: parsed.data.email,
    contact_phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { ok: false, error: 'No se pudo enviar tu mensaje. Inténtalo más tarde.' };
  }

  return { ok: true, data: undefined };
}
