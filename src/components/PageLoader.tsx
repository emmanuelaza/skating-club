'use client';

import * as React from 'react';

export default function PageLoader() {
  const [phase, setPhase] = React.useState<'visible' | 'animating' | 'hidden'>('visible');

  React.useEffect(() => {
    if (sessionStorage.getItem('sk_loaded')) {
      setPhase('hidden');
      return;
    }

    // Fase 1: mostrar nombre (400ms)
    // Fase 2: expandir línea (600ms)
    // Fase 3: fade out todo (300ms)
    // Fase 4: desmontar y setear sessionStorage

    const t1 = setTimeout(() => setPhase('animating'), 400);
    const t2 = setTimeout(() => {
      setPhase('hidden');
      sessionStorage.setItem('sk_loaded', '1');
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[#0A0A0A] transition-opacity duration-300 ${
        phase === 'animating' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Nombre del club */}
      <span className="animate-fade-in font-display text-2xl font-bold uppercase tracking-[0.3em] text-white">
        Skating Club
      </span>

      {/* Línea cyan que se expande */}
      <div
        className="h-[2px] bg-accent transition-all duration-700 ease-out"
        style={{ width: phase === 'visible' ? '0px' : '180px' }}
      />
    </div>
  );
}
