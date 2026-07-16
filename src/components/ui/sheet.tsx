'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: 'right' | 'left';
  children: React.ReactNode;
}

/**
 * Panel lateral (drawer) sin dependencia de Radix. Cierra con Escape, click en
 * el overlay o el botón. Bloquea el scroll del body mientras está abierto.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  children,
}: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 animate-in fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute top-0 flex h-full w-full max-w-md flex-col bg-card shadow-xl',
          side === 'right'
            ? 'right-0 border-l border-border animate-in slide-in-from-right'
            : 'left-0 border-r border-border animate-in slide-in-from-left',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
