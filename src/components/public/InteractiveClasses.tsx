'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { priceLabel, type ClubCategory } from '@/lib/club-data';

/**
 * Explorador de categorías del home. En desktop es una lista con preview
 * animado; en mobile un acordeón. Cada categoría enlaza a su detalle.
 */
export function InteractiveClasses({ categories }: { categories: ClubCategory[] }) {
  const isDesktop = useIsDesktop();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  // Auto-advance logic
  React.useEffect(() => {
    if (isHovering || !isDesktop) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, isDesktop, categories.length]);

  if (!isDesktop) {
    return (
      <div className="flex flex-col gap-4 px-6 pb-8">
        {categories.map((c, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={c.slug}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
                onClick={() => setActiveIndex(isActive ? -1 : idx)}
              >
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block font-display text-lg font-bold leading-tight transition-colors',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {c.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {priceLabel(c)}
                  </span>
                </span>
                <ChevronRight
                  className={cn(
                    'size-5 shrink-0 text-muted-foreground transition-transform',
                    isActive && 'rotate-90 text-primary'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="border-t border-border p-4 pt-2">
                      <div
                        className="mb-4 h-48 w-full rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${c.image})` }}
                      />
                      <span className="mb-3 inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {c.stage}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {c.shortDesc}
                      </p>
                      <Link
                        href={`/clases/${c.slug}` as Route}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        Ver horarios y planes
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  const activeCategory = categories[activeIndex];
  if (!activeCategory) return null;

  return (
    <div className="mx-auto flex max-w-6xl overflow-hidden px-6 pb-8">
      {/* Left Column: List */}
      <div
        className="flex w-1/3 flex-col pr-6 border-r border-border"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col gap-2 py-4">
          {categories.map((c, idx) => {
            const isActive = activeIndex === idx;
            return (
              <Link
                key={c.slug}
                href={`/clases/${c.slug}` as Route}
                className="group relative flex cursor-pointer items-center py-4 pr-4 transition-all"
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Active Indicator Line */}
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full w-[2px] transition-colors',
                    isActive ? 'bg-primary' : 'bg-transparent'
                  )}
                />

                <div className="flex w-full items-center pl-6">
                  <span
                    className={cn(
                      'mr-4 font-display text-sm font-bold transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-grow">
                    <span
                      className={cn(
                        'block font-display text-lg font-bold leading-tight transition-colors',
                        isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {c.name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block text-xs transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground/70'
                      )}
                    >
                      {priceLabel(c)}
                    </span>
                  </span>
                  <ChevronRight
                    className={cn(
                      'size-5 shrink-0 transition-transform',
                      isActive
                        ? 'translate-x-1 opacity-100 text-primary'
                        : 'opacity-0 text-muted-foreground group-hover:opacity-50'
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-2/3 pl-8">
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.slug}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeCategory.image})` }}
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="mb-3 flex items-center gap-3 text-xs text-white">
                  <span className="rounded-md bg-primary/20 px-2 py-1 font-medium text-primary backdrop-blur-sm">
                    {activeCategory.stage}
                  </span>
                  <span className="font-medium opacity-90">{priceLabel(activeCategory)}</span>
                </div>
                <p className="max-w-xl text-base text-gray-200">{activeCategory.shortDesc}</p>
                <Link
                  href={`/clases/${activeCategory.slug}` as Route}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-white"
                >
                  Ver horarios y planes
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
