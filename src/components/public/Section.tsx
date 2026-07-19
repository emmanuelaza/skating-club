import { cn } from '@/lib/utils';
import { TextReveal } from '@/components/animations/TextReveal';
import { GlowText } from '@/components/animations/GlowText';

/** Ancho de contenedor del sitio público: 1280px centrado con padding lateral. */
export const PUBLIC_CONTAINER = 'mx-auto w-full max-w-[1280px] px-6';

/**
 * Clases de hover para cards del sitio público: elevación + borde acento +
 * sombra. Aplicar al componente Card.
 */
export const CARD_HOVER =
  'transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_32px_rgba(0,212,255,0.15)]';

interface SectionProps {
  /** true -> fondo #13131A (card); false -> #0A0A0F (background). */
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Sección con fondo alternable y espaciado generoso (py-20 en desktop). */
export function Section({ alt = false, className, children }: SectionProps) {
  return (
    <section className={cn('py-12 sm:py-20', alt ? 'bg-card' : 'bg-background', className)}>
      <div className={PUBLIC_CONTAINER}>{children}</div>
    </section>
  );
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

/** Hero compacto para páginas internas (nosotros, clases, planes, blog…). */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)] py-14 sm:py-24">
      <div className={cn(PUBLIC_CONTAINER, 'flex flex-col items-center text-center')}>
        <h1
          className="max-w-3xl font-display font-black leading-[1.05] tracking-tight text-foreground"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
        >
          <TextReveal text={title} />
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-[600px] text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  /** Palabras del título a destacar con glow animado. */
  highlight?: string[];
  className?: string;
}

/** Encabezado de sección: línea acento + título Syne + subtítulo. */
export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  highlight,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-12', centered ? 'flex flex-col items-center text-center' : '', className)}>
      <span className={cn('mb-5 block h-[3px] w-10 rounded-full bg-primary', centered && 'mx-auto')} />
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-[2.5rem] sm:leading-tight">
        {highlight && highlight.length > 0 ? (
          <GlowText text={title} highlightWords={highlight} />
        ) : (
          title
        )}
      </h2>
      {subtitle ? (
        <p className={cn('mt-4 max-w-[600px] text-base text-muted-foreground', centered && 'mx-auto')}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
