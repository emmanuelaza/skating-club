import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { FreezeButton } from '@/components/portal/FreezeButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCOP, formatDate } from '@/lib/format';
import type { SubscriptionStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<SubscriptionStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  active: { label: 'Activa', variant: 'success' },
  paused: { label: 'Congelada', variant: 'secondary' },
  past_due: { label: 'Vencida', variant: 'warning' },
  canceled: { label: 'Cancelada', variant: 'destructive' },
  pending: { label: 'Pendiente', variant: 'secondary' },
};

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / 86_400_000);
}

function asBenefits(features: unknown): string[] {
  return Array.isArray(features) ? features.filter((item): item is string => typeof item === 'string') : [];
}

export default async function MembershipPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const [subsResult, plansResult] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false }),
    supabase.from('membership_plans').select('*').eq('is_active', true).order('price_cop', { ascending: true }),
  ]);
  if (subsResult.error) throw new Error(subsResult.error.message);
  if (plansResult.error) throw new Error(plansResult.error.message);

  const subscriptions = subsResult.data ?? [];
  const availablePlans = plansResult.data ?? [];
  const planNames = new Map<string, string>();
  const planIds = Array.from(new Set(subscriptions.map((sub) => sub.plan_id)));
  let currentBenefits: string[] = [];
  if (planIds.length > 0) {
    const { data: plans } = await supabase
      .from('membership_plans')
      .select('id, name, features')
      .in('id', planIds);
    for (const plan of plans ?? []) planNames.set(plan.id, plan.name);
  }

  const current =
    subscriptions.find((sub) => ['active', 'paused', 'past_due'].includes(sub.status)) ??
    subscriptions[0] ??
    null;
  if (current) {
    const benefitsPlan = availablePlans.find((plan) => plan.id === current.plan_id);
    currentBenefits = asBenefits(benefitsPlan?.features);
  }

  let remainingDays: number | null = null;
  let progress = 0;
  if (current?.current_period_start && current.current_period_end) {
    const start = new Date(current.current_period_start);
    const end = new Date(current.current_period_end);
    const now = new Date();
    const total = Math.max(daysBetween(start, end), 1);
    const elapsed = Math.min(Math.max(daysBetween(start, now), 0), total);
    remainingDays = Math.max(daysBetween(now, end), 0);
    progress = Math.round((elapsed / total) * 100);
  }

  const history = subscriptions.filter((sub) => sub.id !== current?.id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">Mi membresía</h1>

      {current ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-foreground">
                {planNames.get(current.plan_id) ?? 'Plan'}
              </span>
              <Badge variant={STATUS_BADGE[current.status].variant}>
                {STATUS_BADGE[current.status].label}
              </Badge>
            </div>

            {current.current_period_start || current.current_period_end ? (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Inicio: {formatDate(current.current_period_start)}</span>
                <span>Vence: {formatDate(current.current_period_end)}</span>
              </div>
            ) : null}

            {remainingDays !== null ? (
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">{remainingDays} días restantes</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}

            {currentBenefits.length > 0 ? (
              <ul className="space-y-1.5 border-t border-border pt-4">
                {currentBenefits.map((benefit, index) => (
                  <li key={`${benefit}-${index}`} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : null}

            {current.status === 'active' ? (
              <div className="space-y-1 border-t border-border pt-4">
                <FreezeButton subscriptionId={current.id} />
                <p className="text-center text-xs text-muted-foreground">
                  Días de congelamiento usados: {current.freeze_days_used}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">No tienes una membresía.</p>
      )}

      {history.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Historial</h2>
          <div className="space-y-2">
            {history.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {planNames.get(sub.plan_id) ?? 'Plan'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(sub.current_period_start)} – {formatDate(sub.current_period_end)}
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[sub.status].variant}>
                    {STATUS_BADGE[sub.status].label}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Cambiar plan</h2>
        <div className="space-y-2">
          {availablePlans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCOP(plan.price_cop)}/{plan.interval === 'year' ? 'año' : 'mes'}
                  </p>
                </div>
                <Button size="sm" variant="secondary" disabled title="Pagos disponibles próximamente">
                  Elegir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          El cambio de plan estará disponible cuando se habiliten los pagos.
        </p>
      </section>
    </div>
  );
}
