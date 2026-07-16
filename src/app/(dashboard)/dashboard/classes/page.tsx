import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { STAFF_ROLES } from '@/lib/roles';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { NewClassSheet, type Option } from '@/components/dashboard/classes/NewClassSheet';
import {
  ClassCalendar,
  type CalendarDay,
  type CalendarEvent,
} from '@/components/dashboard/classes/ClassCalendar';

export const dynamic = 'force-dynamic';

const WEEKDAY = new Intl.DateTimeFormat('es-CO', { weekday: 'short' });
const RANGE_LABEL = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' });

function mondayOf(offset: number): Date {
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayIndex + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const offset = Number.parseInt(params.week ?? '0', 10) || 0;

  await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const weekStart = mondayOf(offset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const days: CalendarDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return { iso: date.toISOString(), weekday: WEEKDAY.format(date), day: String(date.getDate()) };
  });

  const [classesResult, typesResult, instructorsResult] = await Promise.all([
    supabase
      .from('classes')
      .select('id, class_type_id, instructor_id, capacity, starts_at, ends_at, location, status')
      .gte('starts_at', weekStart.toISOString())
      .lt('starts_at', weekEnd.toISOString())
      .order('starts_at', { ascending: true }),
    supabase.from('class_types').select('id, name').eq('is_active', true).order('name'),
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('role', ['instructor', 'tenant_admin', 'super_admin'])
      .order('full_name'),
  ]);
  if (classesResult.error) throw new Error(classesResult.error.message);
  if (typesResult.error) throw new Error(typesResult.error.message);
  if (instructorsResult.error) throw new Error(instructorsResult.error.message);

  const classes = classesResult.data ?? [];
  const typeNames = new Map((typesResult.data ?? []).map((type) => [type.id, type.name]));
  const instructorNames = new Map(
    (instructorsResult.data ?? []).map((person) => [person.id, person.full_name ?? person.email]),
  );

  // Inscritos por clase (no cancelados).
  const classIds = classes.map((cls) => cls.id);
  const enrolledByClass = new Map<string, string[]>();
  if (classIds.length > 0) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('class_id, profile_id')
      .in('class_id', classIds)
      .neq('status', 'canceled');
    const profileIds = Array.from(new Set((bookings ?? []).map((booking) => booking.profile_id)));
    const profileNames = new Map<string, string>();
    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', profileIds);
      for (const profile of profiles ?? []) {
        profileNames.set(profile.id, profile.full_name ?? profile.email);
      }
    }
    for (const booking of bookings ?? []) {
      const list = enrolledByClass.get(booking.class_id) ?? [];
      list.push(profileNames.get(booking.profile_id) ?? '—');
      enrolledByClass.set(booking.class_id, list);
    }
  }

  const events: CalendarEvent[] = classes.map((cls) => {
    const enrolled = enrolledByClass.get(cls.id) ?? [];
    return {
      id: cls.id,
      startsAt: cls.starts_at,
      endsAt: cls.ends_at,
      typeName: typeNames.get(cls.class_type_id) ?? 'Clase',
      instructorName: cls.instructor_id ? (instructorNames.get(cls.instructor_id) ?? null) : null,
      location: cls.location,
      capacity: cls.capacity,
      booked: enrolled.length,
      enrolled,
      canceled: cls.status === 'canceled',
    };
  });

  const classTypeOptions: Option[] = (typesResult.data ?? []).map((type) => ({
    id: type.id,
    name: type.name,
  }));
  const instructorOptions: Option[] = (instructorsResult.data ?? []).map((person) => ({
    id: person.id,
    name: person.full_name ?? person.email,
  }));

  const rangeLabel = `${RANGE_LABEL.format(weekStart)} – ${RANGE_LABEL.format(
    new Date(weekEnd.getTime() - 1),
  )}`;
  const navLink = 'inline-flex size-9 items-center justify-center rounded-md border border-border hover:bg-secondary';

  return (
    <div className="space-y-6">
      <PageHeader title="Clases" description="Calendario semanal de clases de la sede.">
        <NewClassSheet classTypes={classTypeOptions} instructors={instructorOptions} />
      </PageHeader>

      <div className="flex items-center gap-3">
        <Link href={`/dashboard/classes?week=${offset - 1}` as Route} className={navLink} aria-label="Semana anterior">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
        <Link
          href={'/dashboard/classes' as Route}
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-secondary"
        >
          Hoy
        </Link>
        <Link href={`/dashboard/classes?week=${offset + 1}` as Route} className={navLink} aria-label="Semana siguiente">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
        <span className="text-sm font-medium text-foreground">{rangeLabel}</span>
      </div>

      <ClassCalendar days={days} events={events} />
    </div>
  );
}
