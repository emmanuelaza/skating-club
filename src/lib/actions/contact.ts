'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentTenant } from '@/lib/tenant';
import { contactSchema } from '@/lib/validations/contact';
import type { ActionResult } from '@/types';

/**
 * Crea un ticket de soporte desde el formulario público de contacto.
 *
 * En el esquema real `support_tickets.profile_id` es NOT NULL y el cuerpo del
 * mensaje vive en `ticket_messages`, así que el flujo con el cliente admin
 * (bypass RLS) es: perfil de visitante (auth_user_id nulo, is_active false) ->
 * ticket -> primer mensaje. El correo y teléfono quedan en `notes` del perfil.
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

  const contactNotes = [
    `Contacto web — Correo: ${parsed.data.email}`,
    parsed.data.phone ? `Tel: ${parsed.data.phone}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const { data: visitor, error: profileError } = await supabase
    .from('profiles')
    .insert({
      tenant_id: tenant.id,
      auth_user_id: null,
      full_name: parsed.data.name,
      phone: parsed.data.phone || null,
      notes: contactNotes,
      role: 'member',
      is_active: false,
    })
    .select('id')
    .single();
  if (profileError || !visitor) {
    return { ok: false, error: 'No se pudo enviar tu mensaje. Inténtalo más tarde.' };
  }

  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert({
      tenant_id: tenant.id,
      profile_id: visitor.id,
      subject: parsed.data.subject,
      status: 'open',
      priority: 'low',
      category: 'contacto-web',
    })
    .select('id')
    .single();
  if (ticketError || !ticket) {
    return { ok: false, error: 'No se pudo enviar tu mensaje. Inténtalo más tarde.' };
  }

  const { error: messageError } = await supabase.from('ticket_messages').insert({
    tenant_id: tenant.id,
    ticket_id: ticket.id,
    sender_id: visitor.id,
    body: parsed.data.message,
    attachments: [],
  });
  if (messageError) {
    return { ok: false, error: 'No se pudo enviar tu mensaje. Inténtalo más tarde.' };
  }

  return { ok: true, data: undefined };
}
