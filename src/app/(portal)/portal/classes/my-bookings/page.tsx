import { Clock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { ClassActions } from '@/components/portal/ClassActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/format';
import type { BookingStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

interface BookingView {
  id: string;
  classId: string;
  status: BookingStatus;
  startsAt: string | null;
  typeName: string;
  instructorName: string | null;
}

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  confirmed: { label: 'Confirmada', variant: 'success' },
  waitlisted: { label: 'En lista', variant: 'warning' },
  attended: { label: 'Asistió', variant: 'secondary' },
  canceled: { label: 'Cancelada', variant: 'destructive' },
  no_show: { label: 'No asistió', variant: 'secondary' },
};

const UPCOMING: BookingStatus[] = ['confirmed', 'waitlisted'];

function BookingCard({ booking, cancellable }: { booking: BookingView; cancellable: boolean }) {
  const badge = STATUS_BADGE[booking.status];
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-foreground">{booking.typeName}</p>
            {booking.startsAt ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" aria-hidden />
                {formatDate(booking.startsAt)} · {formatTime(booking.startsAt)}
              </p>
            ) : null}
            {booking.instructorName ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <User className="size-3.5" aria-hidden />
                {booking.instructorName}
              </p>
            ) : null}
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        {cancellable ? (
          <ClassActions classId={booking.classId} bookingId={booking.id} reserved full={false} />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function MyBookingsPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, class_id, status, booked_at')
    .eq('profile_id', profile.id)
    .order('booked_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  const rows = bookings ?? [];
  const classIds = Array.from(new Set(rows.map((booking) => booking.class_id)));
  const classInfo = new Map<string, { startsAt: string; typeName: string; instructorName: string | null }>();

  if (classIds.length > 0) {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, starts_at, class_type_id, instructor_id')
      .in('id', classIds);
    const typeIds = Array.from(new Set((classes ?? []).map((cls) => cls.class_type_id)));
    const instructorIds = (classes ?? [])
      .map((cls) => cls.instructor_id)
      .filter((id): id is string => id !== null);
    const [typesRes, instructorsRes] = await Promise.all([
      typeIds.length > 0
        ? supabase.from('class_types').select('id, name').in('id', typeIds)
        : Promise.resolve({ data: [], error: null }),
      instructorIds.length > 0
        ? supabase.from('profiles').select('id, full_name, email').in('id', instructorIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
    const typeNames = new Map((typesRes.data ?? []).map((type) => [type.id, type.name]));
    const instructorNames = new Map(
      (instructorsRes.data ?? []).map((person) => [person.id, person.full_name ?? person.email]),
    );
    for (const cls of classes ?? []) {
      classInfo.set(cls.id, {
        startsAt: cls.starts_at,
        typeName: typeNames.get(cls.class_type_id) ?? 'Clase',
        instructorName: cls.instructor_id ? (instructorNames.get(cls.instructor_id) ?? null) : null,
      });
    }
  }

  const views: BookingView[] = rows.map((booking) => {
    const info = classInfo.get(booking.class_id);
    return {
      id: booking.id,
      classId: booking.class_id,
      status: booking.status,
      startsAt: info?.startsAt ?? null,
      typeName: info?.typeName ?? 'Clase',
      instructorName: info?.instructorName ?? null,
    };
  });

  const nowMs = Date.now();
  const upcoming = views
    .filter((view) => UPCOMING.includes(view.status))
    .sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''));
  const history = views.filter((view) => !UPCOMING.includes(view.status));

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-foreground">Mis reservas</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes reservas próximas.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => {
                const future = booking.startsAt ? new Date(booking.startsAt).getTime() > nowMs : false;
                return <BookingCard key={booking.id} booking={booking} cancellable={future} />;
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin historial de reservas.</p>
          ) : (
            <div className="space-y-3">
              {history.map((booking) => (
                <BookingCard key={booking.id} booking={booking} cancellable={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
