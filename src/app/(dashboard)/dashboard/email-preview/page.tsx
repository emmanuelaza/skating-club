import { notFound } from 'next/navigation';
import { render } from '@react-email/components';
import { PageHeader } from '@/components/dashboard/PageHeader';
import WelcomeEmail from '@/emails/WelcomeEmail';
import EmailVerification from '@/emails/EmailVerification';
import PasswordReset from '@/emails/PasswordReset';
import BookingConfirmation from '@/emails/BookingConfirmation';
import BookingCancellation from '@/emails/BookingCancellation';
import MembershipActivated from '@/emails/MembershipActivated';
import MembershipExpiringSoon from '@/emails/MembershipExpiringSoon';
import MembershipExpired from '@/emails/MembershipExpired';
import OrderConfirmation from '@/emails/OrderConfirmation';
import PasswordChanged from '@/emails/PasswordChanged';
import type { EmailTenant } from '@/emails/components/styles';

export const dynamic = 'force-dynamic';

const tenant: EmailTenant = {
  name: 'Club Demo',
  logoUrl: null,
  supportEmail: 'hola@clubdemo.com',
  url: 'http://localhost:3000',
};
const now = new Date().toISOString();

const TEMPLATES: { title: string; element: React.ReactElement }[] = [
  { title: 'Bienvenida', element: WelcomeEmail({ name: 'Ana', tenant }) },
  {
    title: 'Verificación de email',
    element: EmailVerification({ confirmUrl: 'https://ejemplo.com/verify', tenant }),
  },
  {
    title: 'Restablecer contraseña',
    element: PasswordReset({ resetUrl: 'https://ejemplo.com/reset', tenant }),
  },
  {
    title: 'Reserva confirmada',
    element: BookingConfirmation({
      classType: 'Patinaje artístico',
      instructor: 'Laura Gómez',
      location: 'Sala A',
      startsAt: now,
      durationMinutes: 60,
      tenant,
    }),
  },
  {
    title: 'Reserva cancelada',
    element: BookingCancellation({ classType: 'Patinaje artístico', startsAt: now, tenant }),
  },
  {
    title: 'Membresía activada',
    element: MembershipActivated({
      planName: 'Plan Pro',
      startDate: now,
      endDate: now,
      benefits: ['Clases ilimitadas', '2 invitados al mes'],
      tenant,
    }),
  },
  {
    title: 'Membresía por vencer',
    element: MembershipExpiringSoon({ planName: 'Plan Pro', endDate: now, daysLeft: 5, tenant }),
  },
  { title: 'Membresía vencida', element: MembershipExpired({ planName: 'Plan Pro', tenant }) },
  {
    title: 'Pedido confirmado',
    element: OrderConfirmation({
      orderRef: 'A1B2C3',
      items: [{ name: 'Camiseta del club', variant: 'M / Negro', quantity: 2, price_cop: 80000 }],
      totalCop: 160000,
      shippingAddress: 'Calle 1 #2-3, Bogotá',
      tenant,
    }),
  },
  {
    title: 'Contraseña cambiada',
    element: PasswordChanged({ name: 'Ana', changedAt: now, tenant }),
  },
];

export default async function EmailPreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const previews = await Promise.all(
    TEMPLATES.map(async (template) => ({
      title: template.title,
      html: await render(template.element),
    })),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Previsualización de emails"
        description="Plantillas renderizadas con datos de ejemplo (solo en desarrollo)."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {previews.map((preview) => (
          <div key={preview.title} className="space-y-2">
            <h2 className="font-display text-sm font-semibold text-foreground">{preview.title}</h2>
            <iframe
              title={preview.title}
              srcDoc={preview.html}
              className="h-[560px] w-full rounded-lg border border-border bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
