import Link from 'next/link';
import type { Route } from 'next';
import { Award, Clock, Megaphone, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { computeLoyaltyBalance } from '@/lib/loyalty';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime, formatNumber } from '@/lib/format';

export const dynamic = 'force-dynamic';

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / 86_400_000);
}

export default async function PortalHomePage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [subResult, bookingsResult, loyaltyResult, announcementsResult] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('id, plan_id, status, current_period_start, current_period_end')
      .eq('profile_id', profile.id)
      .in('status', ['active', 'paused', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('bookings')
      .select('id, class_id, status')
      .eq('profile_id', profile.id)
      .in('status', ['confirmed', 'waitlisted'])
      .limit(20),
    supabase.from('loyalty_points').select('type, points').eq('profile_id', profile.id),
    supabase
      .from('announcements')
      .select('id, title, body, published_at')
      .eq('published', true)
      .in('audience', ['all', 'members'])
      .order('published_at', { ascending: false })
      .limit(5),
  ]);
  if (bookingsResult.error) throw new Error(bookingsResult.error.message);
  if (loyaltyResult.error) throw new Error(loyaltyResult.error.message);
  if (announcementsResult.error) throw new Error(announcementsResult.error.message);

  const subscription = subResult.data;
  let planName = '';
  if (subscription) {
    const { data: plan } = await supabase
      .from('membership_plans')
      .select('name')
      .eq('id', subscription.plan_id)
      .maybeSingle();
    planName = plan?.name ?? '';
  }

  // Próximas reservas (máx 3) con info de clase.
  const bookingClassIds = (bookingsResult.data ?? []).map((booking) => booking.class_id);
  const upcoming: { id: string; status: string; startsAt: string; typeName: string }[] = [];
  if (bookingClassIds.length > 0) {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, starts_at, class_type_id')
      .in('id', bookingClassIds)
      .gte('starts_at', nowIso);
    const typeIds = Array.from(new Set((classes ?? []).map((cls) => cls.class_type_id)));
    const typeNames = new Map<string, string>();
    if (typeIds.length > 0) {
      const { data: types } = await supabase.from('class_types').select('id, name').in('id', typeIds);
      for (const type of types ?? []) typeNames.set(type.id, type.name);
    }
    const classById = new Map((classes ?? []).map((cls) => [cls.id, cls]));
    for (const booking of bookingsResult.data ?? []) {
      const cls = classById.get(booking.class_id);
      if (!cls) continue;
      upcoming.push({
        id: booking.id,
        status: booking.status,
        startsAt: cls.starts_at,
        typeName: typeNames.get(cls.class_type_id) ?? 'Clase',
      });
    }
    upcoming.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  const balance = computeLoyaltyBalance(profile.id, loyaltyResult.data ?? []);
  const announcements = announcementsResult.data ?? [];

  // Progreso de membresía.
  let remainingDays: number | null = null;
  let progress = 0;
  if (subscription?.current_period_start && subscription.current_period_end) {
    const start = new Date(subscription.current_period_start);
    const end = new Date(subscription.current_period_end);
    const now = new Date();
    const total = Math.max(daysBetween(start, end), 1);
    const elapsed = Math.min(Math.max(daysBetween(start, now), 0), total);
    remainingDays = Math.max(daysBetween(now, end), 0);
    progress = Math.round((elapsed / total) * 100);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Hola,</p>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {profile.full_name ?? profile.email}
        </h1>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{planName || 'Membresía'}</span>
                <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                  {subscription.status === 'active'
                    ? 'Activa'
                    : subscription.status === 'paused'
                      ? 'Congelada'
                      : 'Vencida'}
                </Badge>
              </div>
              {remainingDays !== null ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {remainingDays} días restantes
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">No tienes una membresía activa.</span>
              <Link href={'/portal/membership' as Route} className="text-sm font-medium text-primary">
                Ver planes
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Award className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Puntos de fidelización</p>
            <p className="font-display text-xl font-semibold text-foreground">
              {formatNumber(balance.balance)}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Próximas reservas</h2>
          <Link
            href={'/portal/classes/my-bookings' as Route}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            Ver todas
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tienes reservas próximas.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.slice(0, 3).map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Clock className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{booking.typeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(booking.startsAt)} · {formatTime(booking.startsAt)}
                    </p>
                  </div>
                  {booking.status === 'waitlisted' ? (
                    <Badge variant="warning">Lista de espera</Badge>
                  ) : (
                    <Badge variant="success">Reservada</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {announcements.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Anuncios</h2>
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="flex gap-3 p-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Megaphone className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                      {announcement.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
