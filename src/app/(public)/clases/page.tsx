import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { ClassTypeCard } from '@/components/public/ClassTypeCard';
import { Section, PageHero } from '@/components/public/Section';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { urlFor } from '@/sanity/lib/image';
import { getAllClassTypes, getSiteConfig } from '@/sanity/lib/queries';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const revalidate = 60;

function img(source?: SanityImageSource): string | null {
  return source ? urlFor(source).width(1000).url() : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Grandes Paisas';
  return {
    title: `Clases · ${name}`,
    description: 'Tipos de clase para todos los niveles.',
  };
}

export default async function ClasesPage() {
  const classTypes = await getAllClassTypes();

  return (
    <>
      <PageHero title="Clases" subtitle="Encuentra la disciplina y el nivel que se ajustan a ti." />

      <Section>
        {classTypes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Pronto publicaremos nuestras clases.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classTypes.map((classType, index) => (
              <FadeIn key={classType._id} delay={index * 0.08}>
                <ClassTypeCard
                  name={classType.name}
                  description={classType.description}
                  level={classType.level}
                  image={img(classType.image)}
                  durationMinutes={classType.durationMinutes}
                />
              </FadeIn>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <MagneticButton>
            <Button asChild size="lg">
              <Link href={'/portal/classes' as Route}>Ver horarios</Link>
            </Button>
          </MagneticButton>
        </div>
      </Section>
    </>
  );
}
