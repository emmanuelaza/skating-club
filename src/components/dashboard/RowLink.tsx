'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { cn } from '@/lib/utils';

interface RowLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Fila de tabla clicable que navega a `href`. Cliente mínimo: solo recibe el
 * href (serializable) para no romper el límite servidor/cliente de DataTable.
 */
export function RowLink({ href, children, className }: RowLinkProps) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(href as Route)}
      className={cn(
        'cursor-pointer border-b border-border transition-colors hover:bg-secondary/50',
        className,
      )}
    >
      {children}
    </tr>
  );
}
