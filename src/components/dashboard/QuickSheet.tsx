'use client';

import * as React from 'react';
import { Plus, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';

interface QuickSheetProps {
  triggerLabel: string;
  triggerIcon?: LucideIcon;
  title: string;
  description?: string;
  /** Render-prop: recibe `close` para cerrar tras enviar el formulario. */
  children: (close: () => void) => React.ReactNode;
}

/**
 * Botón + panel lateral reutilizable para formularios de creación/edición.
 */
export function QuickSheet({
  triggerLabel,
  triggerIcon: Icon = Plus,
  title,
  description,
  children,
}: QuickSheetProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon className="size-4" aria-hidden />
        {triggerLabel}
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title={title} description={description}>
        {children(() => setOpen(false))}
      </Sheet>
    </>
  );
}
