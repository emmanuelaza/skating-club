'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FAMILY_DISCOUNT_COP,
  formatCop,
  type MonthlyPlan,
} from '@/lib/club-data';

/**
 * Lista de planes mensuales seleccionables. Agrupa por jornada y refleja la
 * selección en el resumen inferior (mensualidad + descuento familiar).
 */
export function PlanSelector({ plans }: { plans: MonthlyPlan[] }) {
  const defaultId = plans.find((plan) => plan.popular)?.id ?? plans[0]?.id ?? '';
  const [selectedId, setSelectedId] = React.useState(defaultId);

  const selected = plans.find((plan) => plan.id === selectedId) ?? plans[0];

  const groups = React.useMemo(() => {
    const map = new Map<string, MonthlyPlan[]>();
    for (const plan of plans) {
      const list = map.get(plan.group) ?? [];
      list.push(plan);
      map.set(plan.group, list);
    }
    return Array.from(map.entries());
  }, [plans]);

  const showGroupLabels = groups.length > 1;

  return (
    <div className="space-y-6">
      {groups.map(([group, groupPlans]) => (
        <div key={group} className="space-y-3">
          {showGroupLabels ? (
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {group}
            </h3>
          ) : null}

          <div className="space-y-3">
            {groupPlans.map((plan) => {
              const active = plan.id === selected?.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(plan.id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all',
                    active
                      ? 'border-primary bg-primary/[0.07] shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                      : 'border-border bg-card hover:border-primary/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                      active ? 'border-primary bg-primary text-background' : 'border-border',
                    )}
                    aria-hidden
                  >
                    {active ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-medium text-foreground">{plan.days}</span>
                    {plan.popular ? (
                      <span className="mt-1 inline-block text-xs font-medium text-primary">
                        La opción más elegida
                      </span>
                    ) : null}
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block font-display text-lg font-bold text-foreground">
                      {formatCop(plan.priceCop)}
                    </span>
                    <span className="block text-xs text-muted-foreground">al mes</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selected ? (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted-foreground">Mensualidad seleccionada</span>
            <span className="font-display text-2xl font-bold text-primary">
              {formatCop(selected.priceCop)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{selected.days}</p>

          <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <Users className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              Con descuento familiar pagas{' '}
              <strong className="font-semibold text-foreground">
                {formatCop(selected.priceCop - FAMILY_DISCOUNT_COP)}
              </strong>{' '}
              en cada mensualidad.
            </span>
          </p>

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={'/register' as Route}>Inscribirme</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
