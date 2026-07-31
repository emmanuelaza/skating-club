import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Shirt,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section, PUBLIC_CONTAINER } from '@/components/public/Section';
import { PlanSelector } from '@/components/public/PlanSelector';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { cn } from '@/lib/utils';
import {
  CLUB_CATEGORIES,
  CLUB_LOCATION,
  ENROLLMENT_FEE_COP,
  FAMILY_DISCOUNT_COP,
  formatCop,
  getCategoryBySlug,
  priceLabel,
} from '@/lib/club-data';

export const revalidate = 60;

export function generateStaticParams() {
  return CLUB_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Categoría no encontrada' };

  return {
    title: `${category.name} · Grandes Paisas`,
    description: category.shortDesc,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      {/* ═════════════════════════════════════════ HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
        </div>

        <div className={cn(PUBLIC_CONTAINER, 'relative py-14 sm:py-20')}>
          <Link
            href={'/clases' as Route}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Todas las categorías
          </Link>

          <Badge variant="secondary" className="mt-6">
            {category.stage}
          </Badge>

          <h1
            className="mt-4 max-w-3xl font-display font-black leading-[1.05] tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {category.name}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {category.fullDesc}
          </p>

          <p className="mt-6 font-display text-xl font-bold text-primary">
            {priceLabel(category)}
          </p>
        </div>
      </section>

      {/* ═════════════════════════════════════════ SEMANA DE PRUEBA */}
      <section className="bg-background pb-4">
        <div className={PUBLIC_CONTAINER}>
          <FadeIn>
            <div className="flex flex-col gap-5 rounded-2xl border border-primary/40 bg-gradient-to-r from-violet-500/10 via-primary/10 to-cyan-500/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    Semana de prueba gratis
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Entrena una semana completa en {category.name} por cortesía del club, sin
                    ningún compromiso. Agenda tu cupo antes de inscribirte.
                  </p>
                </div>
              </div>
              <MagneticButton className="shrink-0">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={'/contacto' as Route}>Agendar mi cortesía</Link>
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═════════════════════════════════════════ HORARIOS + PLANES */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* ─── Columna izquierda: horarios, incluye, requisitos ─── */}
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Horarios</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Elige la jornada que mejor se acomode a tu semana.
              </p>

              <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {category.schedule.map((block) => (
                  <li key={`${block.label}-${block.time}`} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Clock className="size-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{block.label}</p>
                        <p className="text-xs text-muted-foreground">{block.days}</p>
                      </div>
                    </div>
                    <div className="pl-11 sm:pl-0 sm:text-right">
                      <p className="text-sm font-medium text-foreground">{block.time}</p>
                      {block.venue ? (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-primary sm:justify-end">
                          <MapPin className="size-3" aria-hidden />
                          {block.venue}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                <span>
                  Sede principal: {CLUB_LOCATION.venue}, {CLUB_LOCATION.unit}.
                </span>
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Qué incluye</h2>
              <ul className="mt-5 space-y-3">
                {category.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {category.requirements?.length ? (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.08] p-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-amber-400">
                  <AlertTriangle className="size-4" aria-hidden />
                  Requisito de inscripción
                </h3>
                <ul className="mt-3 space-y-2">
                  {category.requirements.map((requirement) => (
                    <li key={requirement} className="text-sm leading-relaxed text-foreground/90">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* ─── Columna derecha: planes mensuales ─── */}
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Planes mensuales</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              El valor cambia según los días que entrenes. Selecciona tu opción.
            </p>

            <div className="mt-6">
              <PlanSelector plans={category.plans} />
            </div>

            {/* Matrícula y descuento familiar */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Shirt className="size-4" aria-hidden />
                </span>
                <p className="mt-3 font-display text-lg font-bold text-foreground">
                  Matrícula {formatCop(ENROLLMENT_FEE_COP)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Pago único de inscripción. Incluye la camiseta oficial del club.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Users className="size-4" aria-hidden />
                </span>
                <p className="mt-3 font-display text-lg font-bold text-foreground">
                  Descuento familiar
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {formatCop(FAMILY_DISCOUNT_COP)} menos en cada mensualidad cuando se inscriben
                  familiares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═════════════════════════════════════════ OTRAS CATEGORÍAS */}
      <Section alt>
        <h2 className="mb-8 font-display text-2xl font-bold text-foreground">Otras categorías</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CLUB_CATEGORIES.filter((item) => item.slug !== category.slug).map((item) => (
            <Link
              key={item.slug}
              href={`/clases/${item.slug}` as Route}
              className="group rounded-lg border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-primary"
            >
              <p className="font-display text-base font-bold text-foreground group-hover:text-primary">
                {item.name}
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.shortDesc}
              </p>
              <p className="mt-3 text-xs font-semibold text-primary">{priceLabel(item)}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
