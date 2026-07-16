import 'server-only';
import { sendEmail, type SendEmailResult } from './resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import EmailVerification from '@/emails/EmailVerification';
import PasswordReset from '@/emails/PasswordReset';
import BookingConfirmation from '@/emails/BookingConfirmation';
import BookingCancellation from '@/emails/BookingCancellation';
import MembershipActivated from '@/emails/MembershipActivated';
import MembershipExpiringSoon from '@/emails/MembershipExpiringSoon';
import MembershipExpired from '@/emails/MembershipExpired';
import OrderConfirmation, { type OrderEmailItem } from '@/emails/OrderConfirmation';
import PasswordChanged from '@/emails/PasswordChanged';
import type { EmailTenant } from '@/emails/components/styles';
import type { Tenant } from '@/types';

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

/** Extrae la dirección de correo del remitente configurado (sin el nombre). */
function fromAddress(): string | undefined {
  const raw = process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM;
  if (!raw) return undefined;
  const match = raw.match(/<([^>]+)>/);
  return match ? match[1] : raw;
}

/** Mapea una fila de tenant al subconjunto que consumen las plantillas. */
function toEmailTenant(tenant: Tenant): EmailTenant {
  return {
    name: tenant.name,
    logoUrl: tenant.logo_url,
    supportEmail: fromAddress(),
    url: appUrl(),
  };
}

interface Recipient {
  email: string;
  full_name: string | null;
}

export function sendWelcomeEmail(recipient: Recipient, tenant: Tenant): Promise<SendEmailResult> {
  return sendEmail({
    to: recipient.email,
    subject: `Bienvenido/a a ${tenant.name}`,
    react: WelcomeEmail({ name: recipient.full_name ?? 'patinador/a', tenant: toEmailTenant(tenant) }),
  });
}

export function sendEmailVerification(
  email: string,
  confirmUrl: string,
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to: email,
    subject: 'Verifica tu email',
    react: EmailVerification({ confirmUrl, tenant: toEmailTenant(tenant) }),
  });
}

export function sendPasswordReset(
  email: string,
  resetUrl: string,
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to: email,
    subject: 'Restablecer contraseña',
    react: PasswordReset({ resetUrl, tenant: toEmailTenant(tenant) }),
  });
}

export interface BookingEmailDetails {
  classType: string;
  instructor: string | null;
  location: string | null;
  startsAt: string;
  durationMinutes: number;
}

export function sendBookingConfirmation(
  to: string,
  details: BookingEmailDetails,
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: `Reserva confirmada · ${details.classType}`,
    react: BookingConfirmation({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendBookingCancellation(
  to: string,
  details: { classType: string; startsAt: string },
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: `Reserva cancelada · ${details.classType}`,
    react: BookingCancellation({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendMembershipActivated(
  to: string,
  details: { planName: string; startDate: string | null; endDate: string | null; benefits: string[] },
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: 'Tu membresía está activa',
    react: MembershipActivated({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendMembershipExpiringSoon(
  to: string,
  details: { planName: string; endDate: string | null; daysLeft: number },
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: `Tu membresía vence en ${details.daysLeft} días`,
    react: MembershipExpiringSoon({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendMembershipExpired(
  to: string,
  details: { planName: string },
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: 'Tu membresía ha vencido',
    react: MembershipExpired({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendOrderConfirmation(
  to: string,
  details: { orderRef: string; items: OrderEmailItem[]; totalCop: number; shippingAddress?: string | null },
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: `Pedido confirmado #${details.orderRef}`,
    react: OrderConfirmation({ ...details, tenant: toEmailTenant(tenant) }),
  });
}

export function sendPasswordChanged(
  recipient: Recipient,
  changedAt: string,
  tenant: Tenant,
): Promise<SendEmailResult> {
  return sendEmail({
    to: recipient.email,
    subject: 'Tu contraseña fue cambiada',
    react: PasswordChanged({
      name: recipient.full_name ?? 'patinador/a',
      changedAt,
      tenant: toEmailTenant(tenant),
    }),
  });
}
