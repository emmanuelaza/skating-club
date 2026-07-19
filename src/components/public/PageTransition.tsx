'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Transición entre páginas con Framer Motion.
 * - Fade + slide vertical suave (8px) en entrada y salida.
 * - Scroll-to-top automático en cada cambio de ruta.
 * - Se desactiva si el usuario prefiere movimiento reducido.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Scroll al tope en cada cambio de página — mejora la percepción de velocidad
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
        }}
        exit={{
          opacity: 0,
          y: -6,
          transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
