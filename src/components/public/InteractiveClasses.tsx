'use client';

import * as React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useMediaQuery';

export interface ClassType {
  name: string;
  level: string;
  duration: number;
  desc: string;
  image: string;
}

export function InteractiveClasses({ classTypes }: { classTypes: ClassType[] }) {
  const isDesktop = useIsDesktop();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  // Auto-advance logic
  React.useEffect(() => {
    if (isHovering || !isDesktop) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % classTypes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, isDesktop, classTypes.length]);

  if (!isDesktop) {
    return (
      <div className="flex flex-col gap-4 px-6 pb-8">
        {classTypes.map((c, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={c.name}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => setActiveIndex(isActive ? -1 : idx)}
              >
                <span
                  className={cn(
                    'font-display text-lg font-bold transition-colors',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {c.name}
                </span>
                <ChevronRight
                  className={cn(
                    'size-5 text-muted-foreground transition-transform',
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
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                          {c.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {c.duration} min
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {c.desc}
                      </p>
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

  const activeClass = classTypes[activeIndex];
  if (!activeClass) return null;

  return (
    <div className="mx-auto flex max-w-6xl overflow-hidden px-6 pb-8">
      {/* Left Column: List */}
      <div
        className="flex w-1/3 flex-col pr-6 border-r border-border"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col gap-2 py-4">
          {classTypes.map((c, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={c.name}
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
                      isActive ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'flex-grow font-display text-lg font-bold transition-colors',
                      isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {c.name}
                  </span>
                  <ChevronRight
                    className={cn(
                      'size-5 transition-transform',
                      isActive ? 'translate-x-1 opacity-100 text-primary' : 'opacity-0 text-muted-foreground group-hover:opacity-50'
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-2/3 pl-8">
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClass.name}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeClass.image})` }}
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="mb-3 flex items-center gap-3 text-xs text-white">
                  <span className="rounded-md bg-primary/20 px-2 py-1 font-medium text-primary backdrop-blur-sm">
                    {activeClass.level}
                  </span>
                  <span className="flex items-center gap-1 opacity-80">
                    <Clock className="size-3" />
                    {activeClass.duration} min
                  </span>
                </div>
                <p className="line-clamp-2 max-w-xl text-base text-gray-200">
                  {activeClass.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
