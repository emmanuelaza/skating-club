'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';

const options: LenisOptions = {
  duration: 0.8,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
};

/** Provider global de smooth scroll (Lenis). Envuelve el body en el layout. */
export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
