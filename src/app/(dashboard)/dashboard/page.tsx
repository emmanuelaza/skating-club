import { Suspense } from 'react';
import { Users, CreditCard, Calendar, CalendarCheck, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart, type RevenuePoint } from '@/components/dashboard/RevenueChart';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  formatCOP,
  formatDate,
  formatNumber,
  formatTime,
  dayRange,
  monthRange,
  percentChange,
} from '@/lib/format';

export const dynamic = 'force-dynamic';

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

// --- KPIs --------------------------------------------------------------------

async function KpiSection() {
  const supabase = await createClient();
  const today = dayRange();
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(1);

  const { count: activeMembers } = await supabase
    .from('subscriptions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: activeSubs, error: subsError } = await supabase
    .from('subscriptions')
    .select('plan_id')
    .eq('status', 'active');
  if (subsError) throw new Error(subsError.message);

  const planIds = Array.from(new Set((activeSubs ?? []).map((subscription) => subscription.plan_id)));
  let mrrCop = 0;
  if (planIds.length > 0) {
    const { data: plans, error: plansError } = await supabase
      .from('membership_plans')
      .select('id, price_cop, interval')
      .in('id', planIds);
    if (plansError) throw new Error(plansError.message);
    const priceByPlan = new Map((plans ?? []).map((plan) => [plan.id, plan]));
    for (const subscription of activeSubs ?? []) {
      const plan = priceByPlan.get(subscription.plan_id);
      if (!plan) continue;
      mrrCop += plan.interval === 'year' ? plan.price_cop / 12 : plan.price_cop;
    }
  }

  const { count: classesToday } = await supabase
    .from('classes')
    .select('id', { count: 'exact', head: true })
    .gte('starts_at', today.start)
    .lt('starts_at', today.end);

  const { count: bookingsToday } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.start)
    .lt('created_at', today.end);

  const { count: membersThisMonth } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', thisMonth.start)
    .lt('created_at', thisMonth.end);
  const { count: membersLastMonth } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', lastMonth.start)
    .lt('created_at', lastMonth.end);

  const { data: ordersThisMonth } = await supabase
    .from('orders')
    .select('total_cop')
    .eq('status', 'paid')
    .gte('created_at', thisMonth.start)
    .lt('created_at', thisMonth.end);
  const { data: ordersLastMonth } = await supabase
    .from('orders')
    .select('total_cop')
    .eq('status', 'paid')
    .gte('created_at', lastMonth.start)
    .lt('created_at', lastMonth.end);

  const membersDelta = percentChange(membersThisMonth ?? 0, membersLastMonth ?? 0);
  const revenueDelta = percentChange(
    sum((ordersThisMonth ?? []).map((order) => order.total_cop)),
    sum((ordersLastMonth ?? []).map((order) => order.total_cop)),
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KPICard
        label="Miembros activos"
        value={formatNumber(activeMembers ?? 0)}
        countTo={activeMembers ?? 0}
        icon={Users}
        delta={membersDelta}
        index={0}
      />
      <KPICard
        label="MRR"
        value={formatCOP(mrrCop)}
        countTo={mrrCop}
        countFormat="cop"
        icon={CreditCard}
        delta={revenueDelta}
        index={1}
      />
      <KPICard
        label="Clases hoy"
        value={formatNumber(classesToday ?? 0)}
        countTo={classesToday ?? 0}
        icon={Calendar}
        index={2}
      />
      <KPICard
        label="Reservas hoy"
        value={formatNumber(bookingsToday ?? 0)}
        countTo={bookingsToday ?? 0}
        icon={CalendarCheck}
        index={3}
      />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[132px]" />
      ))}
    </div>
  );
}

// --- Revenue chart -----------------------------------------------------------

async function RevenueSection() {
  const supabase = await createClient();
  const months = [5, 4, 3, 2, 1, 0].map((offset) => monthRange(offset));
  const since = monthRange(5).start;

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_cop, created_at')
    .eq('status', 'paid')
    .gte('created_at', since);
  if (error) throw new Error(error.message);

  const data: RevenuePoint[] = months.map((month) => ({
    month: month.label,
    revenue: sum(
      (orders ?? [])
        .filter((order) => order.created_at >= month.start && order.created_at < month.end)
        .map((order) => order.total_cop),
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ingresos · últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent>
        <RevenueChart data={data} />
      </CardContent>
    </Card>
  );
}

// --- Recent members ----------------------------------------------------------

async function RecentMembersSection() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Últimos miembros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(members ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay miembros registrados.</p>
        ) : (
          (members ?? []).map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar name={member.full_name ?? member.email} src={member.avatar_url} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.full_name ?? member.email}
                </p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(member.created_at)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// --- Upcoming classes --------------------------------------------------------

async function UpcomingClassesSection() {
  const supabase = await createClient();
  const today = dayRange();
  const nowIso = new Date().toISOString();

  const { data: classes, error } = await supabase
    .from('classes')
    .select('id, class_type_id, instructor_id, capacity, starts_at, location')
    .gte('starts_at', nowIso)
    .lt('starts_at', today.end)
    .order('starts_at', { ascending: true })
    .limit(3);
  if (error) throw new Error(error.message);

  const rows = classes ?? [];
  const typeIds = Array.from(new Set(rows.map((row) => row.class_type_id)));
  const instructorIds = rows
    .map((row) => row.instructor_id)
    .filter((id): id is string => id !== null);
  const classIds = rows.map((row) => row.id);

  const typeNames = new Map<string, string>();
  if (typeIds.length > 0) {
    const { data } = await supabase.from('class_types').select('id, name').in('id', typeIds);
    for (const type of data ?? []) typeNames.set(type.id, type.name);
  }
  const instructorNames = new Map<string, string>();
  if (instructorIds.length > 0) {
    const { data } = await supabase.from('profiles').select('id, full_name').in('id', instructorIds);
    for (const person of data ?? []) instructorNames.set(person.id, person.full_name ?? '—');
  }
  const bookedByClass = new Map<string, number>();
  if (classIds.length > 0) {
    const { data } = await supabase
      .from('bookings')
      .select('class_id')
      .in('class_id', classIds)
      .neq('status', 'canceled');
    for (const booking of data ?? []) {
      bookedByClass.set(booking.class_id, (bookedByClass.get(booking.class_id) ?? 0) + 1);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próximas clases de hoy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No quedan clases por hoy.</p>
        ) : (
          rows.map((row) => {
            const booked = bookedByClass.get(row.id) ?? 0;
            const available = Math.max(row.capacity - booked, 0);
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 rounded-md border border-border p-3"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Clock className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {typeNames.get(row.class_type_id) ?? 'Clase'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatTime(row.starts_at)}
                    {row.instructor_id
                      ? ` · ${instructorNames.get(row.instructor_id) ?? '—'}`
                      : ''}
                  </p>
                </div>
                <Badge variant={available === 0 ? 'destructive' : 'secondary'}>
                  {available}/{row.capacity} cupos
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function CardSkeleton({ height }: { height: string }) {
  return <Skeleton className={height} />;
}

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resumen" description="Vista general de la actividad de tu sede." />

      <Suspense fallback={<KpiSkeleton />}>
        <KpiSection />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<CardSkeleton height="h-[360px]" />}>
            <RevenueSection />
          </Suspense>
        </div>
        <Suspense fallback={<CardSkeleton height="h-[360px]" />}>
          <UpcomingClassesSection />
        </Suspense>
      </div>

      <Suspense fallback={<CardSkeleton height="h-[320px]" />}>
        <RecentMembersSection />
      </Suspense>
    </div>
  );
}
