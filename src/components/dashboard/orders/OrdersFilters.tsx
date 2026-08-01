'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'payment_pending', label: 'Pago pendiente' },
  { value: 'paid', label: 'Pagados' },
  { value: 'preparing', label: 'En preparación' },
  { value: 'shipped', label: 'Enviados' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'refunded', label: 'Reembolsados' },
];

/** Filtro de estado de pedidos; refleja su valor en la URL. */
export function OrdersFilters({ status }: { status: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onStatusChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== 'todos') next.set('status', value);
    else next.delete('status');
    next.delete('page');
    router.replace(`${pathname}?${next.toString()}` as Route);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filtrar por estado"
        className="h-10 rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-56"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
