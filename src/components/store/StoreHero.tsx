'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, ShieldCheck, Truck, Lock } from 'lucide-react';
import { PUBLIC_CONTAINER } from '@/components/public/Section';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const trustBadges = [
  { icon: ShieldCheck, label: 'Productos originales' },
  { icon: Truck, label: 'Envíos nacionales' },
  { icon: Lock, label: 'Pagos seguros' },
];

export function StoreHero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-10 sm:py-14 lg:py-16 flex items-center min-h-[420px] lg:min-h-[520px]">

      {/* ── IMAGEN DE FONDO ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/hero-store-bg.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Overlay oscuro izquierda → transparente derecha: legibilidad del texto */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to right, #0A0A0A 0%, #0A0A0A 35%, rgba(10,10,10,0.75) 58%, rgba(10,10,10,0.15) 100%)',
          }}
        />

        {/* Halo violáceo ambiental */}
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 size-[420px] rounded-full bg-[#8B5CF6]/10 blur-[120px] mix-blend-screen z-10" />

        {/* Fade superior e inferior para integración con la página */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A0A0A] to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
      </div>

      {/* ── CONTENIDO ── */}
      <div className={`${PUBLIC_CONTAINER} relative z-20 w-full`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* COLUMNA IZQUIERDA: Texto y CTAs */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 text-left">

            {/* Eyebrow */}
            <motion.div {...fadeUp(0.05)}>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5CF6]">
                Tienda Oficial
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div {...fadeUp(0.15)}>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold leading-[1.1] tracking-tight text-[#F5F5F5]">
                Equipamiento de <br className="hidden sm:inline" />
                <span
                  className="text-[#8B5CF6]"
                  style={{ textShadow: '0 0 40px rgba(139,92,246,0.25)' }}
                >
                  alto rendimiento
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              {...fadeUp(0.25)}
              className="text-xs sm:text-sm leading-relaxed text-[#888888] max-w-sm sm:max-w-md"
            >
              Navega por nuestro catálogo exclusivo de patines profesionales,
              protecciones certificadas y repuestos diseñados para rodar sin límites.
            </motion.p>

            {/* Buttons */}
            <motion.div {...fadeUp(0.35)} className="flex flex-wrap items-center gap-3 mt-1">
              <a
                href="#productos"
                id="store-cta-primary"
                className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-[18px] py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:from-[#7c4df2] hover:to-[#5457e5] hover:shadow-[0_0_24px_rgba(139,92,246,0.35)]"
              >
                Explorar productos
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#categorias"
                id="store-cta-secondary"
                className="flex items-center gap-2 rounded-lg border border-[#222222] bg-[#111111]/80 backdrop-blur-sm px-[18px] py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#888888] transition-all duration-300 hover:border-[#444] hover:text-[#F5F5F5]"
              >
                <LayoutGrid className="size-3.5" />
                Ver categorías
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              {...fadeUp(0.45)}
              className="flex items-center gap-4 sm:gap-5 mt-2 border-t border-[#222222]/40 pt-4 max-w-xs sm:max-w-sm"
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="size-3.5 text-[#8B5CF6]/50" />
                  <span className="text-[10px] text-[#888888] font-medium">{label}</span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* COLUMNA DERECHA: vacía — la imagen de fondo es el protagonista visual */}
          <div className="hidden lg:block lg:col-span-7" aria-hidden="true" />

        </div>
      </div>

    </section>
  );
}
