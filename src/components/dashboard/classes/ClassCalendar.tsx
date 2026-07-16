'use client';

import * as React from 'react';
import { MapPin, User, Users } from 'lucide-react';
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

  const slots = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const date = new Date(event.startsAt);
    const dayIndex = (date.getDay() + 6) % 7;
    const hour = Math.min(Math.max(date.getHours(), 7), 22);
    const key = `${dayIndex}-${hour}`;
    const list = slots.get(key) ?? [];
    list.push(event);
    slots.set(key, list);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
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
