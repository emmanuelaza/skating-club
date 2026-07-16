'use client';

import * as React from 'react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Cursor personalizado (solo desktop, no touch): un círculo que sigue al mouse
 * con lag (lerp) y crece + baja opacidad al pasar sobre links/botones.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const dotRef = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

  const enabled = isDesktop && !reduced;

  React.useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setShow(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let scale = 1;
    let opacity = 1;
    const hovering = { value: false };

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const onOver = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      hovering.value = Boolean(el?.closest('a, button, [role="button"]'));
    };

    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      const targetScale = hovering.value ? 2.6 : 1;
      const targetOpacity = hovering.value ? 0.3 : 1;
      scale += (targetScale - scale) * 0.2;
      opacity += (targetOpacity - opacity) * 0.2;
      const node = dotRef.current;
      if (node) {
        node.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled || !show) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] size-3 rounded-full bg-primary"
      style={{ willChange: 'transform, opacity' }}
    />
  );
}
