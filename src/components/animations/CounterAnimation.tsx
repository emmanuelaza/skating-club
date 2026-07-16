'use client';

import * as React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/animations/gsap';
import { formatCOP } from '@/lib/format';

interface CounterAnimationProps {
  target: number;
  duration?: number;
  /** Sufijo para formato numérico (ej. "+"). Ignorado en formato 'cop'. */
  suffix?: string;
  format?: 'number' | 'cop';
  className?: string;
}

const NUMBER = new Intl.NumberFormat('es-CO');

export function CounterAnimation({
  target,
  duration = 2,
  suffix = '',
  format = 'number',
  className,
}: CounterAnimationProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);

  const formatValue = React.useCallback(
    (value: number) =>
      format === 'cop'
        ? formatCOP(value)
        : `${NUMBER.format(Math.round(value))}${suffix}`,
    [format, suffix],
  );

  React.useEffect(() => {
    if (reduced) return;
    const element = ref.current;
    if (!element) return;

    const context = gsap.context(() => {
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          element.textContent = formatValue(state.value);
        },
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
    }, element);

    return () => context.revert();
  }, [target, duration, reduced, formatValue]);

  // SSR / reduced-motion muestran el valor final; si no, arranca en 0.
  return (
    <span ref={ref} className={className}>
      {formatValue(reduced ? target : 0)}
    </span>
  );
}
