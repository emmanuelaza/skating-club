'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, ShieldCheck, Truck, Lock } from 'lucide-react';
import { PUBLIC_CONTAINER } from '@/components/public/Section';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const trustBadges = [
  { icon: ShieldCheck, label: 'Productos originales' },
  { icon: Truck, label: 'Envíos nacionales' },
  { icon: Lock, label: 'Pagos seguros' },
];

export function StoreHero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A]">
      {/* Background texture and ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 60%, rgba(0,229,160,0.055) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 15% 50%, rgba(0,229,160,0.025) 0%, transparent 60%)
          `,
        }}
      />
      {/* Noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <div className={`${PUBLIC_CONTAINER} relative`}>
        {/* ── DESKTOP: two-column layout ── */}
        <div className="hidden min-h-[340px] items-center gap-8 py-12 lg:flex xl:gap-16">
          {/* Left column — 42% */}
          <div className="flex w-[42%] shrink-0 flex-col gap-6">
            <motion.div {...fadeUp(0.1)}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E5A0]">
                Tienda oficial
              </p>
              <h1 className="font-display text-[2.6rem] font-black leading-[1.05] tracking-tight text-[#F5F5F5] xl:text-[3.1rem]">
                Equipo de{' '}
                <span
                  className="text-[#00E5A0]"
                  style={{ textShadow: '0 0 32px rgba(0,229,160,0.35)' }}
                >
                  alto rendimiento
                </span>
              </h1>
            </motion.div>

            <motion.p
              {...fadeUp(0.2)}
              className="max-w-sm text-[0.95rem] leading-relaxed text-[#888888]"
            >
              Patines, protecciones y accesorios seleccionados para cada nivel.
              Todo lo que necesitas para rodar más rápido.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.3)} className="flex items-center gap-3">
              <a
                href="#productos"
                id="store-cta-primary"
                className="group flex items-center gap-2 rounded-xl border border-[#00E5A0] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#00E5A0] transition-all duration-300 hover:bg-[#00E5A0] hover:text-[#0A0A0A]"
              >
                Explorar productos
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#categorias"
                id="store-cta-secondary"
                className="flex items-center gap-2 rounded-xl border border-[#222222] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#888888] transition-all duration-300 hover:border-[#444] hover:text-[#F5F5F5]"
              >
                <LayoutGrid className="size-4" />
                Ver categorías
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-5">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="size-3.5 text-[#00E5A0]/60" />
                  <span className="text-[11px] text-[#888888]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — 58% */}
          <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow behind image */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(ellipse 70% 60% at 60% 55%, rgba(0,229,160,0.1) 0%, transparent 65%)',
                animation: 'heroGlow 4s ease-in-out infinite',
              }}
            />
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
              <Image
                src="/hero-store.jpg"
                alt="Patín inline de alto rendimiento con ruedas de luz verde"
                fill
                priority
                sizes="(min-width: 1024px) 58vw"
                className="object-cover"
                style={{
                  filter: 'brightness(1.05) contrast(1.02)',
                }}
              />
              {/* Subtle vignette to blend edges */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(10,10,10,0.25) 0%, transparent 25%, transparent 75%, rgba(10,10,10,0.15) 100%), linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.5) 100%)',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── MOBILE: purpose-built layout ── */}
        <div className="flex flex-col items-center pt-8 pb-10 lg:hidden">
          {/* Image — 47% of viewport height */}
          <motion.div
            className="relative w-full max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ aspectRatio: '16/9' }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at 60% 60%, rgba(0,229,160,0.12) 0%, transparent 70%)',
                animation: 'heroGlow 4s ease-in-out infinite',
              }}
            />
            <Image
              src="/hero-store.jpg"
              alt="Patín inline de alto rendimiento"
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>

          {/* Text */}
          <motion.div {...fadeUp(0.15)} className="mt-6 w-full text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00E5A0]">
              Tienda oficial
            </p>
            <h1 className="font-display text-[2rem] font-black leading-[1.1] tracking-tight text-[#F5F5F5]">
              Equipo de{' '}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: '0 0 24px rgba(0,229,160,0.35)' }}
              >
                alto rendimiento
              </span>
            </h1>
          </motion.div>

          <motion.p
            {...fadeUp(0.25)}
            className="mt-3 max-w-xs text-center text-sm leading-relaxed text-[#888888]"
          >
            Todo lo que necesitas para rodar más rápido, protegido y con estilo.
          </motion.p>

          {/* Mobile CTAs */}
          <motion.div {...fadeUp(0.35)} className="mt-6 flex w-full max-w-xs flex-col gap-3">
            <a
              href="#productos"
              id="store-cta-primary-mobile"
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#00E5A0] bg-transparent text-base font-semibold text-[#00E5A0] transition-all duration-300 active:bg-[#00E5A0] active:text-[#0A0A0A]"
            >
              Explorar productos
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#categorias"
              id="store-cta-secondary-mobile"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#222222] bg-transparent text-base font-semibold text-[#888888] transition-all duration-300 active:border-[#444]"
            >
              <LayoutGrid className="size-4" />
              Ver categorías
            </a>
          </motion.div>

          {/* Mobile trust badges */}
          <motion.div
            {...fadeUp(0.45)}
            className="mt-6 flex items-center justify-center gap-4"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon className="size-3 text-[#00E5A0]/60" />
                <span className="text-[10px] text-[#888888]">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0A0A0A 100%)',
        }}
      />

      {/* CSS for breathing glow animation */}
      <style jsx>{`
        @keyframes heroGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
