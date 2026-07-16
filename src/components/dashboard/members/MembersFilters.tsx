'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'activos', label: 'Activos' },
  { value: 'vencidos', label: 'Vencidos' },
  { value: 'suspendidos', label: 'Suspendidos' },
];

/** Búsqueda (debounce) y filtro de estado; reflejan su valor en la URL. */
export function MembersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = React.useState(params.get('search') ?? '');
  const status = params.get('status') ?? 'todos';

  React.useEffect(() => {
    const current = params.get('search') ?? '';
    if (current === search) return;
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (search) next.set('search', search);
      else next.delete('search');
      next.delete('page');
      router.replace(`${pathname}?${next.toString()}` as Route);
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, params, pathname, router]);

  function onStatusChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== 'todos') next.set('status', value);
    else next.delete('status');
    next.delete('page');
    router.replace(`${pathname}?${next.toString()}` as Route);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:w-72">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o correo"
          className="pl-9"
          aria-label="Buscar miembros"
        />
      </div>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filtrar por estado"
        className="h-10 rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
