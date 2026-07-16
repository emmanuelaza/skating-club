import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';
import { Section, PageHero } from '@/components/public/Section';
import { getSiteConfig } from '@/sanity/lib/queries';
import { getCurrentTenant } from '@/lib/tenant';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Skating Club';
  return { title: `Contacto · ${name}`, description: `Ponte en contacto con ${name}.` };
}

export default async function ContactoPage() {
  const [config, tenant] = await Promise.all([getSiteConfig(), getCurrentTenant()]);
  const email = config?.contact?.email;
  const phone = config?.contact?.phone;
  const address = config?.contact?.address;
  const clubName = config?.name ?? tenant?.name ?? 'Skating Club';

  return (
    <>
      <PageHero title="Contacto" subtitle="¿Tienes preguntas? Escríbenos y te responderemos pronto." />

      <Section>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{clubName}</h2>
            {email ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 text-primary" aria-hidden />
                {email}
              </p>
            ) : null}
            {phone ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-primary" aria-hidden />
                {phone}
              </p>
            ) : null}
            {address ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" aria-hidden />
                {address}
              </p>
            ) : null}
          </div>

          <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-secondary text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden />
              Mapa próximamente
            </span>
          </div>
        </div>
      </div>
      </Section>
    </>
  );
}
