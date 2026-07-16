import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

const COP_NUMBER = new Intl.NumberFormat('es-CO');

interface AnimateTextOptions {
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Entrada de texto: revela el elemento desde abajo con fade. (SplitText es un
 * plugin de pago de GSAP; aquí animamos el bloque para no depender de él.)
 */
export function animateText(
  element: gsap.TweenTarget,
  options: AnimateTextOptions = {},
): gsap.core.Tween {
  const { delay = 0, duration = 0.8, y = 24 } = options;
  return gsap.from(element, {
    opacity: 0,
    y,
    delay,
    duration,
    ease: 'power3.out',
  });
}

/** Entradas escalonadas (fade + desplazamiento hacia arriba). */
export function animateFadeUp(
  elements: gsap.TweenTarget,
  stagger = 0.1,
): gsap.core.Tween {
  return gsap.from(elements, {
    opacity: 0,
    y: 40,
    duration: 0.6,
    ease: 'power2.out',
    stagger,
  });
}

interface AnimateCounterOptions {
  duration?: number;
  /** Sufijo a concatenar (ej. "+"). */
  suffix?: string;
  scrollTrigger?: boolean;
}

/**
 * Anima un contador 0 -> target con separador de miles (es-CO). Por defecto
 * arranca cuando el elemento entra al viewport (ScrollTrigger).
 */
export function animateCounter(
  element: HTMLElement,
  target: number,
  options: AnimateCounterOptions = {},
): gsap.core.Tween {
  const { duration = 2, suffix = '', scrollTrigger = true } = options;
  const state = { value: 0 };
  return gsap.to(state, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${COP_NUMBER.format(Math.round(state.value))}${suffix}`;
    },
    scrollTrigger: scrollTrigger
      ? { trigger: element, start: 'top 85%', once: true }
      : undefined,
  });
}
