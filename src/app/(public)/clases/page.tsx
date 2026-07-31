import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/public/CategoryCard';
import { Section, PageHero } from '@/components/public/Section';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { getSiteConfig } from '@/sanity/lib/queries';
import { CLUB_CATEGORIES, CLUB_LOCATION } from '@/lib/club-data';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Grandes Paisas';
  return {
    title: `Clases · ${name}`,
    description:
      'Escuela, Menores Alto Rendimiento, Transición y Semillero Jóvenes y Adultos. Encuentra la etapa que se ajusta a ti.',
  };
}

export default function ClasesPage() {
  return (
    <>
      <PageHero
        title="Clases"
        subtitle="Nuestras categorías están organizadas por etapa de formación deportiva. Encuentra la que se ajusta a ti."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLUB_CATEGORIES.map((category, index) => (
            <FadeIn key={category.slug} delay={index * 0.08}>
              <CategoryCard category={category} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-primary/30 bg-primary/[0.06] p-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Semana de prueba gratis
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
                Antes de inscribirte, ven a entrenar una semana completa por cortesía del club.
                Agenda tu cupo y conoce el proceso por dentro.
              </p>
            </div>
            <MagneticButton>
              <Button asChild size="lg">
                <Link href={'/contacto' as Route}>Agendar semana de prueba</Link>
              </Button>
            </MagneticButton>
          </div>
        </FadeIn>

        <p className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>
            Entrenamos en {CLUB_LOCATION.full}. {CLUB_LOCATION.altNote}
          </span>
        </p>
      </Section>
    </>
  );
}
