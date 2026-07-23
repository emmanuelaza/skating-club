import type { Metadata } from 'next';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Heart, Target, Users, Award, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TeamCard } from '@/components/public/TeamCard';
import { Section, SectionHeading, PageHero, CARD_HOVER } from '@/components/public/Section';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { getPageBySlug, getAllTeamMembers, getSiteConfig } from '@/sanity/lib/queries';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const revalidate = 60;

type PortableValue = React.ComponentProps<typeof PortableText>['value'];

function img(source?: SanityImageSource): string | null {
  return source ? urlFor(source).width(800).url() : null;
}

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Heart, title: 'Pasión', text: 'Vivimos el patinaje y lo transmitimos en cada clase.' },
  { icon: Target, title: 'Excelencia', text: 'Buscamos la mejora constante de cada miembro.' },
  { icon: Users, title: 'Comunidad', text: 'Construimos un espacio para crecer juntos.' },
  { icon: Award, title: 'Disciplina', text: 'El progreso real nace de la constancia.' },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Skating Club';
  return {
    title: `Nosotros · ${name}`,
    description: `Conoce la historia y el equipo de ${name}.`,
  };
}

export default async function NosotrosPage() {
  const page = await getPageBySlug('nosotros');

  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle={page?.excerpt ?? 'La historia, el equipo y los valores detrás del club.'}
      />

      {/* Imagen Principal del Equipo (Foto 7) */}
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <Image
            src="/images/nosotros_alineados.jpg"
            alt="Equipo completo Grandes Paisas"
            fill
            priority
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
      </div>

      {page?.body ? (
        <Section className="pt-0">
          <article className="prose prose-invert mx-auto max-w-3xl text-foreground">
            <PortableText value={page.body as PortableValue} />
          </article>
        </Section>
      ) : null}

      <Section alt={Boolean(page?.body)}>
        <FadeIn>
          <SectionHeading title="Nuestros valores" subtitle="Lo que nos mueve dentro y fuera de la pista." />
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, index) => (
            <FadeIn key={title} delay={index * 0.08}>
              <Card className={cn('h-full text-center', CARD_HOVER)}>
                <CardContent className="space-y-3 p-6">
                  <span className="mx-auto flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Sección Galería / Comunidad */}
      <Section alt={!page?.body}>
        <FadeIn>
          <SectionHeading 
            title="Comunidad en competencia" 
            subtitle="Representamos con orgullo nuestros colores en cada torneo." 
          />
        </FadeIn>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Selfie grupal */}
          <div className="flex flex-col gap-3">
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg group">
              <Image
                src="/images/nosotros_selfie.jpg"
                alt="Selfie grupal del equipo"
                fill
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <p className="text-center text-sm font-medium text-muted-foreground italic">
              Nuestro equipo en competencia internacional
            </p>
          </div>

          {/* Grupo arrodillados y de pie */}
          <div className="flex flex-col gap-3">
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg group">
              <Image
                src="/images/nosotros_grupal.jpg"
                alt="Grupo del equipo completo"
                fill
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <p className="text-center text-sm font-medium text-muted-foreground italic">
              Campeonato Panamericano de Patinaje de Velocidad
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
