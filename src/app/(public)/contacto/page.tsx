import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Navigation } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';
import { Section, PageHero } from '@/components/public/Section';
import { getSiteConfig } from '@/sanity/lib/queries';
import { getCurrentTenant } from '@/lib/tenant';
import { CLUB_LOCATION } from '@/lib/club-data';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Grandes Paisas';
  return { title: `Contacto · ${name}`, description: `Ponte en contacto con ${name}.` };
}

export default async function ContactoPage() {
  const [config, tenant] = await Promise.all([getSiteConfig(), getCurrentTenant()]);
  const email = config?.contact?.email;
  const phone = config?.contact?.phone;
  const clubName = config?.name ?? tenant?.name ?? 'Grandes Paisas';

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
          </div>

          {/* Sede de entrenamiento */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-primary" aria-hidden />
              Dónde entrenamos
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {CLUB_LOCATION.venue}
              <br />
              <span className="text-muted-foreground">{CLUB_LOCATION.unit}</span>
            </p>

            <div className="mt-4 flex items-start gap-2 border-t border-border pt-4">
              <Navigation className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{CLUB_LOCATION.altVenue}</p>
                <p className="text-xs leading-relaxed">{CLUB_LOCATION.altNote}</p>
              </div>
            </div>
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
