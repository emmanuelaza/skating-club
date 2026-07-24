'use client';

import * as React from 'react';
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
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Asegurar reproducción automática silenciosa y limpia
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Ignorar restricciones de autostart si el navegador requiere interacción extra
      });
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-10 sm:py-14 lg:py-16 flex items-center min-h-[420px] lg:min-h-[480px]">
      {/* ── AMBIENT BACKGROUND GLOW & NOISE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Glow violáceo ambiental sutil detrás del hero */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#8B5CF6]/12 blur-[140px] mix-blend-screen"
          style={{
            animation: 'glowPulse 6s ease-in-out infinite alternate',
          }}
        />
        {/* Glow cyan secundario sutil en el lado izquierdo */}
        <div
          className="absolute left-0 bottom-0 size-[350px] rounded-full bg-[#22D3EE]/05 blur-[120px] mix-blend-screen"
        />

        {/* Textura de ruido sutil */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />

        {/* Transiciones suaves superior e inferior */}
        <div
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A0A0A] to-transparent z-10"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10"
        />
      </div>

      {/* ── CONTENT & VIDEO GRID ── */}
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

            {/* Indicators */}
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

          {/* COLUMNA DERECHA: Video como protagonista visual */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center mt-4 lg:mt-0">
            <motion.div
              {...fadeUp(0.2)}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
              style={{
                // Máscara radial / lineal suave para fundir completamente con el fondo negro sin bordes ni cajas marcadas
                maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 70%, transparent 100%)',
              }}
            >
              {/* Overlay suave de integración en los bordes del video */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, #0A0A0A 100%)',
                }}
              />

              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-auto max-h-[380px] sm:max-h-[420px] lg:max-h-[460px] object-cover rounded-2xl select-none"
                style={{
                  filter: 'contrast(1.05) brightness(0.95)',
                }}
              >
                <source src="/hero-store.webm" type="video/webm" />
              </video>
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}
