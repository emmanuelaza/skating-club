'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

/** Filtro de categoría reflejado en la URL (?category=). */
export function StoreFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('category') ?? '';

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set('category', value);
    else next.delete('category');
    router.replace(`${pathname}?${next.toString()}` as Route);
  }

  return (
    <select
      value={current}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Filtrar por categoría"
      className="h-10 rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <option value="">Todas las categorías</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
