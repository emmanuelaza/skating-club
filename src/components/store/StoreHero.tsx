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
    <section className="relative overflow-hidden bg-[#0A0A0A] h-[360px] sm:h-[380px] lg:h-[400px] flex items-center">
      {/* ── BACKGROUND IMAGE & OVERLAYS ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-store.jpg"
          alt="Patín inline de alto rendimiento"
          fill
          priority
          className="object-cover object-right sm:object-right-center lg:object-right"
          style={{
            filter: 'brightness(0.95) contrast(1.02)',
          }}
        />

        {/* Green ambient glow behind the skate area */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/4 size-[400px] rounded-full bg-[#00E5A0]/10 blur-[120px] mix-blend-screen hidden lg:block"
          style={{
            animation: 'glowPulse 6s ease-in-out infinite alternate',
          }}
        />

        {/* Noise overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />

        {/* ── GRADIENTS FOR IMMERSIVE INTEGRATION ── */}
        
        {/* Desktop horizontal gradient (Left -> Right) to blend background to solid #0A0A0A */}
        <div 
          className="absolute inset-0 z-10 hidden lg:block"
          style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, #0A0A0A 32%, rgba(10,10,10,0.85) 45%, rgba(10,10,10,0.4) 60%, transparent 85%)'
          }}
        />

        {/* Tablet horizontal gradient */}
        <div 
          className="absolute inset-0 z-10 hidden sm:block lg:hidden"
          style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, #0A0A0A 20%, rgba(10,10,10,0.8) 45%, rgba(10,10,10,0.3) 70%, transparent 95%)'
          }}
        />

        {/* Mobile vertical overlay for absolute readability */}
        <div 
          className="absolute inset-0 z-10 block sm:hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.9) 80%, #0A0A0A 100%)'
          }}
        />

        {/* Top fade (for navbar transition) */}
        <div 
          className="absolute inset-x-0 top-0 z-10 h-20"
          style={{
            background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)'
          }}
        />

        {/* Bottom fade (for content transition - extremely smooth) */}
        <div 
          className="absolute inset-x-0 bottom-0 z-10 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.4) 30%, rgba(10,10,10,0.85) 70%, #0A0A0A 100%)'
          }}
        />
      </div>

      {/* ── CONTENT OVER LAYOUT ── */}
      <div className={`${PUBLIC_CONTAINER} relative z-20 w-full`}>
        <div className="max-w-md md:max-w-lg lg:max-w-xl flex flex-col gap-5 sm:gap-6 text-left">
          
          {/* Subheading */}
          <motion.div {...fadeUp(0.05)}>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#00E5A0]">
              Tienda Oficial
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div {...fadeUp(0.15)}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold leading-[1.1] tracking-tight text-[#F5F5F5]">
              Equipamiento de <br className="hidden sm:inline" />
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: '0 0 40px rgba(0,229,160,0.2)' }}
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
          <motion.div {...fadeUp(0.35)} className="flex items-center gap-3 mt-1">
            <a
              href="#productos"
              id="store-cta-primary"
              className="group flex items-center gap-2 rounded-lg border border-[#00E5A0] bg-[#00E5A0] px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:bg-[#00C988] hover:border-[#00C988] hover:shadow-[0_0_24px_rgba(0,229,160,0.3)]"
            >
              Explorar productos
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#categorias"
              id="store-cta-secondary"
              className="flex items-center gap-2 rounded-lg border border-[#222222] bg-[#111111]/80 backdrop-blur-sm px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#888888] transition-all duration-300 hover:border-[#444] hover:text-[#F5F5F5]"
            >
              <LayoutGrid className="size-3.5" />
              Ver categorías
            </a>
          </motion.div>

          {/* Indicators */}
          <motion.div 
            {...fadeUp(0.45)} 
            className="flex items-center gap-4 sm:gap-5 mt-2 border-t border-[#222222]/40 pt-4 max-w-xs sm:max-w-sm"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-[#00E5A0]/50" />
                <span className="text-[10px] text-[#888888] font-medium">{label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Global CSS for Glow Pulse Animation */}
      <style jsx global>{`
        @keyframes glowPulse {
          from {
            transform: scale(0.95) translate(0px, 0px);
            opacity: 0.8;
          }
          to {
            transform: scale(1.05) translate(10px, -10px);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
