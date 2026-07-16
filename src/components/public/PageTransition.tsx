'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Transición entre páginas: salida (y:-8) y entrada (y:8) con Framer Motion. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
