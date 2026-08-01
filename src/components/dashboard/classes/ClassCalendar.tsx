'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Users } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/format';

export interface CalendarEvent {
  id: string;
  startsAt: string;
  endsAt: string;
  typeName: string;
  instructorName: string | null;
  location: string | null;
  capacity: number;
  booked: number;
  enrolled: string[];
  canceled: boolean;
}

export interface CalendarDay {
  iso: string;
  weekday: string;
  day: string;
}

const HOURS = Array.from({ length: 16 }, (_, index) => 7 + index); // 7:00 – 22:00

function ClassDetail({ event }: { event: CalendarEvent }) {
  return (
    <div className="space-y-5">
      <dl className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="size-4" aria-hidden />
          <span>{event.instructorName ?? 'Sin instructor asignado'}</span>
        </div>
        {event.location ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            <span>{event.location}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4" aria-hidden />
          <span>
            {event.booked}/{event.capacity} inscritos
          </span>
        </div>
      </dl>

      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">Inscritos</h3>
        {event.enrolled.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay inscritos.</p>
        ) : (
          <ul className="space-y-1">
            {event.enrolled.map((name, index) => (
              <li key={`${name}-${index}`} className="rounded-sm bg-secondary px-3 py-2 text-sm">
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ClassCalendar({ days, events }: { days: CalendarDay[]; events: CalendarEvent[] }) {
  const [selected, setSelected] = React.useState<CalendarEvent | null>(null);
  // Índice del día visible en la vista mobile (por defecto, hoy si cae en la semana).
  const todayIndex = days.findIndex(
    (day) => new Date(day.iso).toDateString() === new Date().toDateString(),
  );
  const [mobileDay, setMobileDay] = React.useState(Math.max(todayIndex, 0));

  const slots = new Map<string, CalendarEvent[]>();
  const byDay = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const date = new Date(event.startsAt);
    const dayIndex = (date.getDay() + 6) % 7;
    const hour = Math.min(Math.max(date.getHours(), 7), 22);
    const key = `${dayIndex}-${hour}`;
    const list = slots.get(key) ?? [];
    list.push(event);
    slots.set(key, list);
    const dayList = byDay.get(dayIndex) ?? [];
    dayList.push(event);
    byDay.set(dayIndex, dayList);
  }
  for (const list of byDay.values()) {
    list.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  const activeDay = days[mobileDay];
  const activeEvents = byDay.get(mobileDay) ?? [];

  return (
    <>
      {/* ─── MOBILE: un día a la vez con navegación ─── */}
      <div className="space-y-3 lg:hidden">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-2 py-2">
          <button
            type="button"
            onClick={() => setMobileDay((value) => Math.max(value - 1, 0))}
            disabled={mobileDay === 0}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
            aria-label="Día anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <div className="flex gap-1">
            {days.map((day, index) => (
              <button
                key={day.iso}
                type="button"
                onClick={() => setMobileDay(index)}
                className={cn(
                  'flex min-w-9 flex-col items-center rounded-md px-1.5 py-1 text-center transition-colors',
                  index === mobileDay
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="text-[10px] font-medium uppercase">{day.weekday}</span>
                <span className="text-sm font-semibold">{day.day}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMobileDay((value) => Math.min(value + 1, days.length - 1))}
            disabled={mobileDay === days.length - 1}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
            aria-label="Día siguiente"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        {activeEvents.length === 0 ? (
          <p className="rounded-lg border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            Sin clases el {activeDay ? `${activeDay.weekday} ${activeDay.day}` : 'día seleccionado'}.
          </p>
        ) : (
          <div className="space-y-2">
            {activeEvents.map((event) => {
              const full = event.booked >= event.capacity;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelected(event)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                    event.canceled
                      ? 'border-destructive/30 bg-destructive/10'
                      : 'border-border bg-card hover:border-primary/50',
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Clock className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-sm font-medium text-foreground',
                        event.canceled && 'line-through',
                      )}
                    >
                      {event.typeName}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatTime(event.startsAt)}–{formatTime(event.endsAt)}
                      {event.instructorName ? ` · ${event.instructorName}` : ''}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-xs font-medium',
                      full ? 'text-destructive' : 'text-muted-foreground',
                    )}
                  >
                    {Math.max(event.capacity - event.booked, 0)}/{event.capacity}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── DESKTOP: grilla semanal ─── */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card lg:block">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border">
            <div />
            {days.map((day) => (
              <div key={day.iso} className="border-l border-border px-2 py-3 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">{day.weekday}</p>
                <p className="text-sm font-semibold text-foreground">{day.day}</p>
              </div>
            ))}
          </div>

          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border last:border-0"
            >
              <div className="px-2 py-2 text-right text-xs text-muted-foreground">{hour}:00</div>
              {days.map((day, dayIndex) => {
                const cell = slots.get(`${dayIndex}-${hour}`) ?? [];
                return (
                  <div key={day.iso} className="min-h-14 space-y-1 border-l border-border p-1">
                    {cell.map((event) => {
                      const full = event.booked >= event.capacity;
                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelected(event)}
                          className={cn(
                            'w-full rounded-sm border p-1.5 text-left text-xs transition-colors',
                            event.canceled
                              ? 'border-destructive/30 bg-destructive/10 line-through'
                              : 'border-primary/30 bg-primary/10 hover:bg-primary/20',
                          )}
                        >
                          <p className="truncate font-medium text-foreground">{event.typeName}</p>
                          {event.instructorName ? (
                            <p className="truncate text-muted-foreground">{event.instructorName}</p>
                          ) : null}
                          <p
                            className={cn(
                              'text-[11px]',
                              full ? 'text-destructive' : 'text-muted-foreground',
                            )}
                          >
                            {Math.max(event.capacity - event.booked, 0)}/{event.capacity} cupos
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.typeName ?? ''}
        description={
          selected
            ? `${formatDate(selected.startsAt)} · ${formatTime(selected.startsAt)}–${formatTime(selected.endsAt)}`
            : undefined
        }
      >
        {selected ? <ClassDetail event={selected} /> : null}
      </Sheet>
    </>
  );
}
