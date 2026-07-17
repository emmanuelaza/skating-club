'use client';

import * as React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionHeading } from './Section';

interface Testimonial {
  name: string;
  text: string;
  plan: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Valentina Torres',
    text: 'Empezar en el club ha sido la mejor decisión que tomé este año. Venía con mucho miedo de caerme porque nunca había usado patines en mi vida, pero la paciencia del instructor Andrés es de otro mundo. En solo tres meses pasé de temblar en la pista a poder hacer giros básicos con total confianza.',
    plan: 'Plan Pro',
  },
  {
    name: 'Sebastián Mora',
    text: 'El nivel de exigencia en las clases de velocidad es tremendo. Justo lo que necesitaba para prepararme para competir a nivel nacional y romper mis propias marcas personales.',
    plan: 'Plan Elite',
  },
  {
    name: 'Camila Ríos',
    text: 'Me encanta que puedo ir después de la oficina. Las instalaciones están súper bien cuidadas, la iluminación nocturna es perfecta y el ambiente es una nota total para desconectarse.',
    plan: 'Plan Básico',
  },
  {
    name: 'Andrés Peña',
    text: 'Increíble la pista. Empecé en nivel básico y ya me pasaron a intermedio. Se nota mucho el profesionalismo de cada uno de los profesores y cómo se preocupan por tu técnica.',
    plan: 'Plan Pro',
  },
  {
    name: 'Daniela Vargas',
    text: 'Traigo a mis dos hijos a las clases de los sábados y no podrían estar más felices. Todo es muy organizado, seguro y siempre tienen una sonrisa para los niños.',
    plan: 'Plan Básico',
  },
  {
    name: 'Juan Ospina',
    text: 'Los profes de hockey te exigen al máximo pero siempre con buena onda. He mejorado muchísimo mi técnica de frenado y manejo del stick en los últimos meses.',
    plan: 'Plan Elite',
  },
  {
    name: 'Mariana Castro',
    text: 'Siempre le tuve respeto a los patines en línea, pero con la metodología que usan aquí se aprende súper rápido. El avance que he tenido es increíble y la comunidad es hermosa.',
    plan: 'Plan Básico',
  },
  {
    name: 'Felipe Reyes',
    text: 'De lejos el mejor club de Bogotá. La pista siempre está impecable y hacer parte de esta comunidad te motiva mucho a seguir mejorando cada semana sin falta.',
    plan: 'Plan Pro',
  },
];

const variants = {
  enter: ({ direction }: { direction: number; idx: number }) => {
    if (direction === 1) {
      // Avanzando: nueva carta al fondo
      return { opacity: 0, scale: 0.85, rotate: 9, x: 0, y: 0 };
    } else {
      // Retrocediendo: nueva carta desde el frente izquierdo
      return { opacity: 0, scale: 1, rotate: -15, x: -300, y: 0 };
    }
  },
  center: ({ idx }: { direction: number; idx: number }) => ({
    opacity: 1,
    scale: 1 - idx * 0.05,
    rotate: idx * 3,
    x: 0,
    y: 0,
    zIndex: 30 - idx * 10,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  }),
  exit: ({ direction }: { direction: number; idx: number }) => {
    if (direction === 1) {
      // Avanzando: la carta 0 sale volando a la izquierda
      return {
        opacity: 0,
        x: -300,
        rotate: -15,
        transition: { duration: 0.35, ease: 'easeIn' },
      };
    } else {
      // Retrocediendo: la carta 2 se desvanece al fondo
      return {
        opacity: 0,
        scale: 0.85,
        rotate: 9,
        transition: { duration: 0.35, ease: 'easeIn' },
      };
    }
  },
};

export function TestimonialsStack() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      paginate(1);
    } else if (info.offset.x > swipeThreshold) {
      paginate(-1);
    }
  };

  // Visibles: la actual y las 2 siguientes en el loop
  const visibleCards = [
    { card: TESTIMONIALS[currentIndex]!, idx: 0, realIndex: currentIndex },
    { card: TESTIMONIALS[(currentIndex + 1) % TESTIMONIALS.length]!, idx: 1, realIndex: (currentIndex + 1) % TESTIMONIALS.length },
    { card: TESTIMONIALS[(currentIndex + 2) % TESTIMONIALS.length]!, idx: 2, realIndex: (currentIndex + 2) % TESTIMONIALS.length },
  ].filter((item): item is { card: Testimonial; idx: number; realIndex: number } => item.card !== undefined);

  return (
    <div className="relative w-full overflow-hidden py-16 sm:py-24">
      <div className="mx-auto mb-16 max-w-7xl px-6 text-center">
        <SectionHeading title="Lo que dicen nuestros patinadores" />
      </div>

      <div className="relative flex min-h-[380px] flex-col items-center justify-center">
        <div className="relative flex h-[320px] w-full items-center justify-center md:h-[350px]">
          <AnimatePresence initial={false} custom={{ direction, idx: 0 }} mode="popLayout">
            {visibleCards.map(({ card, idx }) => (
              <motion.div
                key={card.name}
                custom={{ direction, idx }}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={idx === 0 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={idx === 0 ? handleDragEnd : undefined}
                onClick={() => {
                  if (idx === 0) paginate(1);
                }}
                className={cn(
                  'absolute flex w-[calc(100vw-32px)] cursor-grab flex-col justify-between rounded-[12px] border border-border bg-card p-8 shadow-2xl active:cursor-grabbing md:w-[420px]',
                  'min-h-[280px]',
                  idx !== 0 && 'pointer-events-none'
                )}
                style={{ originX: 0.5, originY: 1 }} // Rota sutilmente desde abajo
              >
                <Quote className="absolute right-6 top-6 size-12 rotate-180 text-primary/20" />

                <div>
                  <div className="mb-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="line-clamp-4 text-base leading-relaxed text-muted-foreground">
                    &quot;{card.text}&quot;
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between gap-2 border-t border-border/50 pt-6">
                  <span className="font-display text-base font-semibold text-foreground">
                    {card.name}
                  </span>
                  <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {card.plan}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={() => paginate(-1)}
              className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const diff = index - currentIndex;
                  if (diff !== 0) {
                    setDirection(diff > 0 ? 1 : -1);
                    setCurrentIndex(index);
                  }
                }}
                className={cn(
                  'transition-all duration-300',
                  currentIndex === index
                    ? 'h-2 w-8 rounded-full bg-primary'
                    : 'size-2.5 rounded-full bg-muted hover:bg-muted-foreground'
                )}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
