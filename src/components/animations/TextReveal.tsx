'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/** Revela el texto palabra por palabra (slide up desde overflow hidden). */
export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          // El padding/margen extra evita que `overflow:hidden` recorte
          // descendentes (p, g) y tildes (ó) sin afectar la maquetación.
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            paddingBottom: '0.15em',
            marginBottom: '-0.15em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: delay + index * 0.05, ease: [0.33, 1, 0.68, 1] }}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
