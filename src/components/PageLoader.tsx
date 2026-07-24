'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SESSION_KEY = 'sk_loaded';

export default function PageLoader() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Si ya cargó en esta sesión, omitimos el loader de primera visita
    if (sessionStorage.getItem(SESSION_KEY)) return;
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    setVisible(true);
    
    const timeout = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="first-visit-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo o Marca */}
            <motion.span
              className="font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.35em] text-[#F5F5F5]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Skating Club
            </motion.span>

            {/* Línea de Carga Premium de Grandes Paisas */}
            <div className="relative h-[2px] w-[160px] overflow-hidden rounded-full bg-[#222222]">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]"
                style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
