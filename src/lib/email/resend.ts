import 'server-only';
import type { ReactElement } from 'react';
import { Resend } from 'resend';
import { logger } from '@/lib/logger';

let client: Resend | null = null;

function getClient(apiKey: string): Resend {
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: ReactElement;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Envía un email vía Resend. No lanza: devuelve { success, error } y registra
 * el resultado con el logger estructurado. Degrada si Resend no está configurado.
 */
export async function sendEmail({ to, subject, react }: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    logger.warn('email.not_configured', { subject });
    return { success: false, error: 'Resend no está configurado.' };
  }

  try {
    const { data, error } = await getClient(apiKey).emails.send({ from, to, subject, react });
    if (error) {
      logger.error('email.send_failed', { subject, error: error.message });
      return { success: false, error: error.message };
    }
    logger.info('email.sent', { subject, id: data?.id });
    return { success: true, id: data?.id ?? undefined };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Error desconocido';
    logger.error('email.exception', { subject, error: message });
    return { success: false, error: message };
  }
}
