import type { Metadata } from 'next';
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
  const [page, team] = await Promise.all([getPageBySlug('nosotros'), getAllTeamMembers()]);

  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle={page?.excerpt ?? 'La historia, el equipo y los valores detrás del club.'}
      />

      {page?.body ? (
        <Section>
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

      {team.length > 0 ? (
        <Section alt={!page?.body}>
          <FadeIn>
            <SectionHeading title="Equipo" subtitle="Quienes hacen posible cada clase." />
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <FadeIn key={member._id} delay={index * 0.08}>
                <TeamCard
                  name={member.name}
                  photo={img(member.photo)}
                  bio={member.bio}
                  specialty={member.specialty}
                />
              </FadeIn>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
