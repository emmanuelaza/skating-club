'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { Section, SectionHeading, PUBLIC_CONTAINER, CARD_HOVER } from './Section';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * useLayoutEffect en cliente, useEffect en SSR. La limpieza de ScrollTrigger
 * (que reparenta el <section> dentro de un `.pin-spacer`) DEBE ejecutarse en la
 * fase de mutación, antes de que React desmonte el DOM; si corriera en un
 * useEffect normal, React intentaría quitar el <section> de un padre que GSAP ya
 * cambió -> "removeChild: node is not a child of this node".
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export interface ClassItem {
  name: string;
  level: string;
  duration: number;
  desc: string;
  image: string;
}

function ClassCard({ item }: { item: ClassItem }) {
  return (
    <SpotlightCard className="h-full">
      <div className={cn('group h-full overflow-hidden rounded-lg border border-border bg-card', CARD_HOVER)}>
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Imagen remota (Unsplash) cargada por el navegador. Usamos <img> y no
              next/image porque el optimizador hace fetch server-side y la red de
              Node (undici) da ETIMEDOUT en esta máquina aunque el navegador sí
              alcanza el CDN. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge de nivel sobre la imagen */}
          <span className="absolute left-3 top-3 rounded-sm border border-primary/30 bg-black/60 px-2 py-1 text-xs text-primary backdrop-blur-sm">
            {item.level}
          </span>
        </div>
        <div className="space-y-2 p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.desc}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {item.duration} min
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
}

/**
 * Sección de tipos de clase. En desktop (con movimiento permitido) las cards se
 * desplazan horizontalmente al hacer scroll vertical (GSAP ScrollTrigger pin +
 * scrub). En mobile o con reduced-motion cae a una grilla normal.
 */
export function HorizontalClasses({ items }: { items: ClassItem[] }) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const enabled = isDesktop && !reduced;

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      revert = () => context.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <Section alt>
        <SectionHeading
          title="Tipos de clase"
          subtitle="Seis disciplinas para encontrar tu estilo sobre ruedas."
          highlight={['clase']}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ClassCard key={item.name} item={item} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <section ref={sectionRef} className="overflow-hidden bg-card py-16 sm:py-24">
      <div className={PUBLIC_CONTAINER}>
        <SectionHeading
          title="Tipos de clase"
          subtitle="Seis disciplinas para encontrar tu estilo sobre ruedas."
          highlight={['clase']}
        />
      </div>
      <div ref={trackRef} className="flex w-max gap-6 px-[8vw] will-change-transform">
        {items.map((item) => (
          <div key={item.name} className="w-[340px] shrink-0">
            <ClassCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
