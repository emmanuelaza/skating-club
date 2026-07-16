'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  id: string;
  question: string;
  answer?: string;
}

/** Acordeón con estado local, sin Radix. */
export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className={cn(open && 'bg-popover')}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-secondary/50 sm:px-6 sm:py-5"
              aria-expanded={open}
            >
              <span className="font-display text-sm font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform',
                  open && 'rotate-180',
                )}
                aria-hidden
              />
            </button>
            {open && item.answer ? (
              <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-5">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
