/**
 * Utilidades de formato (es-CO). El dinero se almacena en centavos.
 */

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});
const NUMBER = new Intl.NumberFormat('es-CO');
const DATE = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });
const TIME = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });
const MONTH = new Intl.DateTimeFormat('es-CO', { month: 'short' });

/** Pesos (COP, columnas *_cop numeric) -> "$ 1.234.567". */
export function formatCOP(pesos: number): string {
  return COP.format(Math.round(pesos));
}

/** Pesos -> forma compacta para ejes de gráficos ("$1.2M", "$45k"). */
export function formatCompactCOP(pesos: number): string {
  if (pesos >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (pesos >= 1_000) return `$${Math.round(pesos / 1_000)}k`;
  return `$${Math.round(pesos)}`;
}

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export function formatDate(iso: string | null): string {
  return iso ? DATE.format(new Date(iso)) : '—';
}

export function formatTime(iso: string): string {
  return TIME.format(new Date(iso));
}

/**
 * Cambio porcentual entre dos valores. Devuelve null cuando no es definible
 * (base 0 con valor actual positivo) para poder ocultar el delta.
 */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

/** Rango [start, end) de un día completo, en ISO. */
export function dayRange(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Rango [start, end) de un mes desplazado `offset` meses hacia atrás. */
export function monthRange(offset = 0): { start: string; end: string; label: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
  return { start: start.toISOString(), end: end.toISOString(), label: MONTH.format(start) };
}
