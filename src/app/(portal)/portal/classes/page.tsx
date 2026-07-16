import Link from 'next/link';
import type { Route } from 'next';
import { Clock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { ClassActions } from '@/components/portal/ClassActions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 86_400_000);

  let classesQuery = supabase
    .from('classes')
    .select('id, class_type_id, instructor_id, capacity, starts_at, ends_at, location')
    .neq('status', 'canceled')
    .gte('starts_at', now.toISOString())
    .lt('starts_at', weekAhead.toISOString())
    .order('starts_at', { ascending: true });
  if (type) classesQuery = classesQuery.eq('class_type_id', type);

  const [classesResult, typesResult] = await Promise.all([
    classesQuery,
    supabase.from('class_types').select('id, name').eq('is_active', true).order('name'),
  ]);
  if (classesResult.error) throw new Error(classesResult.error.message);
  if (typesResult.error) throw new Error(typesResult.error.message);

  const classes = classesResult.data ?? [];
  const types = typesResult.data ?? [];
  const typeNames = new Map(types.map((classType) => [classType.id, classType.name]));

  const classIds = classes.map((cls) => cls.id);
  const bookedConfirmed = new Map<string, number>();
  const myBooking = new Map<string, { id: string; status: string }>();
  const instructorNames = new Map<string, string>();

  if (classIds.length > 0) {
    const instructorIds = classes
      .map((cls) => cls.instructor_id)
      .filter((id): id is string => id !== null);
    const [bookingsAll, myBookings, instructors] = await Promise.all([
      supabase.from('bookings').select('class_id').in('class_id', classIds).eq('status', 'confirmed'),
      supabase
        .from('bookings')
        .select('id, class_id, status')
        .in('class_id', classIds)
        .eq('profile_id', profile.id)
        .in('status', ['confirmed', 'waitlisted']),
      instructorIds.length > 0
        ? supabase.from('profiles').select('id, full_name, email').in('id', instructorIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
    for (const booking of bookingsAll.data ?? []) {
      bookedConfirmed.set(booking.class_id, (bookedConfirmed.get(booking.class_id) ?? 0) + 1);
    }
    for (const booking of myBookings.data ?? []) {
      myBooking.set(booking.class_id, { id: booking.id, status: booking.status });
    }
    for (const person of instructors.data ?? []) {
      instructorNames.set(person.id, person.full_name ?? person.email);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Clases</h1>
        <Link
          href={'/portal/classes/my-bookings' as Route}
          className="text-sm font-medium text-primary"
        >
          Mis reservas
        </Link>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link
          href={'/portal/classes' as Route}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors',
            !type
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground',
          )}
        >
          Todas
        </Link>
        {types.map((classType) => (
          <Link
            key={classType.id}
            href={`/portal/classes?type=${classType.id}` as Route}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors',
              type === classType.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground',
            )}
          >
            {classType.name}
          </Link>
        ))}
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay clases programadas esta semana.</p>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => {
            const booked = bookedConfirmed.get(cls.id) ?? 0;
            const available = Math.max(cls.capacity - booked, 0);
            const mine = myBooking.get(cls.id) ?? null;
            const durationMin = Math.round(
              (new Date(cls.ends_at).getTime() - new Date(cls.starts_at).getTime()) / 60_000,
            );
            return (
              <Card key={cls.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {typeNames.get(cls.class_type_id) ?? 'Clase'}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDate(cls.starts_at)} · {formatTime(cls.starts_at)} · {durationMin} min
                      </p>
                      {cls.instructor_id ? (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="size-3.5" aria-hidden />
                          {instructorNames.get(cls.instructor_id) ?? '—'}
                        </p>
                      ) : null}
                    </div>
                    {mine ? (
                      <Badge variant={mine.status === 'waitlisted' ? 'warning' : 'success'}>
                        {mine.status === 'waitlisted' ? 'En lista' : 'Reservado'}
                      </Badge>
                    ) : (
                      <Badge variant={available === 0 ? 'destructive' : 'secondary'}>
                        {available}/{cls.capacity}
                      </Badge>
                    )}
                  </div>
                  <ClassActions
                    classId={cls.id}
                    bookingId={mine?.id ?? null}
                    reserved={mine !== null}
                    full={available === 0}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
