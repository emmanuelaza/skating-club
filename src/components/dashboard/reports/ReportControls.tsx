'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DailyPoint } from './DailyRevenueChart';

const RANGE_OPTIONS = [
  { value: '30', label: 'Últimos 30 días' },
  { value: '60', label: 'Últimos 60 días' },
  { value: '90', label: 'Últimos 90 días' },
];

export function RangeSelect({ range }: { range: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set('range', value);
    router.replace(`${pathname}?${next.toString()}` as Route);
  }

  return (
    <select
      value={range}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Rango de fechas"
      className="h-10 rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {RANGE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Exporta los ingresos por día a CSV, generado y descargado en el cliente. */
export function ExportButton({ rows, filename }: { rows: DailyPoint[]; filename: string }) {
  function onExport() {
    const header = 'Fecha,Ingresos (COP)';
    const lines = rows.map((row) => `${row.label},${Math.round(row.revenue / 100)}`);
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={onExport}>
      <Download className="size-4" aria-hidden />
      Exportar CSV
    </Button>
  );
}
