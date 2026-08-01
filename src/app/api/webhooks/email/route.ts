import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import type { Json } from '@/types/database';

/**
 * Webhook de eventos de Resend (entrega, rebote, queja).
 * - email.delivered  -> log en payment_events (provider 'resend').
 * - email.bounced    -> log + anota el rebote en `profiles.notes`.
 * - email.complained -> log.
 *
 * `profiles` no guarda el correo (vive en auth.users), así que el destinatario
 * se resuelve vía la API admin de auth y de ahí a su perfil por `auth_user_id`.
 * Verifica la firma Svix si RESEND_WEBHOOK_SECRET está configurado.
 */

interface ResendEvent {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    subject?: string;
  };
}

function verifySvixSignature(
  payload: string,
  headers: Headers,
  secret: string,
): boolean {
  const svixId = headers.get('svix-id');
  const svixTimestamp = headers.get('svix-timestamp');
  const svixSignature = headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest('base64');

  // El header puede traer varias firmas separadas por espacio ("v1,<sig> v1,<sig>").
  return svixSignature.split(' ').some((part) => {
    const signature = part.split(',')[1];
    if (!signature) return false;
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

/** Extrae la dirección de "Nombre <correo>" o de un correo plano. */
function extractEmail(recipient: string): string {
  const match = recipient.match(/<([^>]+)>/);
  return (match?.[1] ?? recipient).trim().toLowerCase();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (secret && !verifySvixSignature(rawBody, request.headers, secret)) {
    logger.warn('resend.webhook.invalid_signature', {});
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody) as ResendEvent;
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const recipientRaw = event.data?.to?.[0];
  const recipient = recipientRaw ? extractEmail(recipientRaw) : null;
  logger.info('resend.webhook', { type: event.type, recipient });

  const supabase = createAdminClient();

  // Resuelve el perfil del destinatario: correo -> auth.users -> profiles.
  let profile: { id: string; tenant_id: string; notes: string | null } | null = null;
  if (recipient) {
    const { data: userList } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const authUser = userList?.users.find(
      (user) => user.email?.toLowerCase() === recipient,
    );
    if (authUser) {
      const { data } = await supabase
        .from('profiles')
        .select('id, tenant_id, notes')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();
      profile = data;
    }
  }

  if (event.type === 'email.bounced' && profile) {
    const marker = '[correo rebotado]';
    if (!profile.notes?.includes(marker)) {
      await supabase
        .from('profiles')
        .update({ notes: [profile.notes, marker].filter(Boolean).join(' ') })
        .eq('id', profile.id);
    }
  }

  // Bitácora del evento (requiere tenant; si no se resuelve, solo queda el log).
  if (profile) {
    await supabase.from('payment_events').insert({
      tenant_id: profile.tenant_id,
      provider: 'resend',
      event_type: event.type,
      reference_id: event.data?.email_id ?? null,
      payload: event as unknown as Json,
      status: 'processed',
      processed_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
