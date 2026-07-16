import { Check, Power } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { STAFF_ROLES } from '@/lib/roles';
import { togglePlanAction } from '@/lib/actions/memberships';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PlanSheet, type PlanFormData } from '@/components/dashboard/memberships/PlanSheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatCOP, formatDate } from '@/lib/format';
import type { SubscriptionStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

const SUBSCRIPTION_BADGE: Record<
  SubscriptionStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }
> = {
  active: { label: 'Activa', variant: 'success' },
  past_due: { label: 'Vencida', variant: 'warning' },
  canceled: { label: 'Cancelada', variant: 'destructive' },
  paused: { label: 'Pausada', variant: 'secondary' },
  pending: { label: 'Pendiente', variant: 'secondary' },
};

function asBenefits(features: unknown): string[] {
  return Array.isArray(features) ? features.filter((item): item is string => typeof item === 'string') : [];
}

export default async function MembershipsPage() {
  await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const [plansResult, activeSubsResult, recentSubsResult] = await Promise.all([
    supabase.from('membership_plans').select('*').order('created_at', { ascending: true }),
    supabase.from('subscriptions').select('plan_id').eq('status', 'active'),
    supabase
      .from('subscriptions')
      .select('id, profile_id, plan_id, status, current_period_start')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);
  if (plansResult.error) throw new Error(plansResult.error.message);
  if (activeSubsResult.error) throw new Error(activeSubsResult.error.message);
  if (recentSubsResult.error) throw new Error(recentSubsResult.error.message);

  const plans = plansResult.data ?? [];
  const recentSubs = recentSubsResult.data ?? [];

  const subscribersByPlan = new Map<string, number>();
  for (const sub of activeSubsResult.data ?? []) {
    subscribersByPlan.set(sub.plan_id, (subscribersByPlan.get(sub.plan_id) ?? 0) + 1);
  }

  // Nombres para la tabla de suscripciones recientes.
  const planNames = new Map(plans.map((plan) => [plan.id, plan.name]));
  const profileNames = new Map<string, string>();
  const profileIds = Array.from(new Set(recentSubs.map((sub) => sub.profile_id)));
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', profileIds);
    for (const profile of profiles ?? []) {
      profileNames.set(profile.id, profile.full_name ?? profile.email);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Membresías" description="Planes de membresía y suscripciones de la sede.">
        <PlanSheet />
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay planes creados.</p>
        ) : (
          plans.map((plan) => {
            const benefits = asBenefits(plan.features);
            const editable: PlanFormData = {
              id: plan.id,
              name: plan.name,
              description: plan.description ?? '',
              priceCop: Math.round(plan.price_cop),
              interval: plan.interval === 'year' ? 'year' : 'month',
              benefits: benefits.join('\n'),
            };
            return (
              <Card key={plan.id} className={cn(!plan.is_active && 'opacity-60')}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      {plan.is_active ? null : <Badge variant="secondary">Inactivo</Badge>}
                    </div>
                    <form
                      action={async (formData) => {
                        'use server';
                        await togglePlanAction(formData);
                      }}
                    >
                      <input type="hidden" name="id" value={plan.id} />
                      <input type="hidden" name="isActive" value={(!plan.is_active).toString()} />
                      <button
                        type="submit"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={plan.is_active ? 'Desactivar plan' : 'Activar plan'}
                        title={plan.is_active ? 'Desactivar' : 'Activar'}
                      >
                        <Power
                          className={cn('size-5', plan.is_active ? 'text-success' : 'text-muted-foreground')}
                          aria-hidden
                        />
                      </button>
                    </form>
                  </div>

                  <p className="font-display text-2xl font-semibold text-foreground">
                    {formatCOP(plan.price_cop)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      /{plan.interval === 'year' ? 'año' : 'mes'}
                    </span>
                  </p>

                  {plan.description ? (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  ) : null}

                  {benefits.length > 0 ? (
                    <ul className="space-y-1.5">
                      {benefits.map((benefit, index) => (
                        <li
                          key={`${benefit}-${index}`}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">
                      {subscribersByPlan.get(plan.id) ?? 0} suscriptores activos
                    </span>
                    <PlanSheet plan={editable} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Suscripciones recientes
        </h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Miembro</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inicio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      Sin suscripciones.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSubs.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-foreground">
                        {profileNames.get(sub.profile_id) ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {planNames.get(sub.plan_id) ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={SUBSCRIPTION_BADGE[sub.status].variant}>
                          {SUBSCRIPTION_BADGE[sub.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sub.current_period_start)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
