'use client';

import * as React from 'react';

/**
 * Detecta `prefers-reduced-motion: reduce`. Devuelve `true` cuando el usuario
 * pidió menos movimiento (o durante SSR, para no animar antes de hidratar).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(true);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
