'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SESSION_KEY = 'sk_loaded';

/**
 * Loader de primera visita (por sessionStorage): nombre del club con fade y una
 * línea acento que se expande, luego fade out total. Se omite con reduced-motion.
 */
export function PageLoader() {
  const [visible, setVisible] = React.useState(false);

  // Efecto sin dependencias: corre una sola vez al montar. Leemos la preferencia
  // de movimiento de forma síncrona (no vía hook con estado) para no recrear el
  // efecto si la media query cambia — eso disparaba un cleanup que cancelaba el
  // temporizador y dejaba el loader pegado en pantalla con reduced-motion.
  React.useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.span
            className="font-display text-[32px] font-bold tracking-tight text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Skating Club
          </motion.span>
          <motion.span
            className="mt-4 block h-[3px] rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
