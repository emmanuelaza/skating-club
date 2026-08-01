/**
 * Puente entre el intervalo que muestra la UI (mensual / anual) y la columna
 * real `membership_plans.duration_days`, que es lo que existe en la base.
 */

export type PlanInterval = 'month' | 'year';

export const DURATION_DAYS: Record<PlanInterval, number> = {
  month: 30,
  year: 365,
};

/** Intervalo -> días de duración para escribir en `duration_days`. */
export function intervalToDurationDays(interval: PlanInterval): number {
  return DURATION_DAYS[interval];
}

/** `duration_days` -> intervalo para mostrar en la UI. */
export function durationDaysToInterval(durationDays: number): PlanInterval {
  return durationDays >= 180 ? 'year' : 'month';
}

/** Normaliza `membership_plans.benefits` (jsonb) a una lista de strings. */
export function parseBenefitsJson(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
}
