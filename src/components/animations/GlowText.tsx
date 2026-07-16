interface GlowTextProps {
  text: string;
  /** Palabras a destacar con el glow animado (comparación sin tildes de signos). */
  highlightWords: string[];
  className?: string;
}

function normalize(word: string): string {
  return word.toLowerCase().replace(/[.,;:!?¿¡"'()]/g, '');
}

/**
 * Divide el texto y aplica un glow animado (clase `.glow-word`) a las palabras
 * destacadas, con `animation-delay` distinto para que no pulsen al unísono.
 * Respeta prefers-reduced-motion vía CSS.
 */
export function GlowText({ text, highlightWords, className }: GlowTextProps) {
  const highlightSet = new Set(highlightWords.map(normalize));
  const words = text.split(' ');
  let glowIndex = 0;

  return (
    <span className={className}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        const suffix = isLast ? '' : ' ';
        if (highlightSet.has(normalize(word))) {
          const delay = glowIndex * 0.4;
          glowIndex += 1;
          return (
            <span
              key={`${word}-${index}`}
              className="glow-word"
              style={{ animationDelay: `${delay}s` }}
            >
              {word}
              {suffix}
            </span>
          );
        }
        return (
          <span key={`${word}-${index}`}>
            {word}
            {suffix}
          </span>
        );
      })}
    </span>
  );
}
