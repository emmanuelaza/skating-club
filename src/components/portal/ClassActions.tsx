'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createBookingAction, cancelBookingAction } from '@/lib/actions/bookings';
import { Button } from '@/components/ui/button';

interface ClassActionsProps {
  classId: string;
  bookingId: string | null;
  reserved: boolean;
  full: boolean;
}

export function ClassActions({ classId, bookingId, reserved, full }: ClassActionsProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function reserve() {
    setError(null);
    const formData = new FormData();
    formData.set('classId', classId);
    startTransition(async () => {
      const result = await createBookingAction(formData);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  function cancel() {
    if (!bookingId) return;
    setError(null);
    const formData = new FormData();
    formData.set('bookingId', bookingId);
    startTransition(async () => {
      const result = await cancelBookingAction(formData);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <div className="space-y-1.5">
      {reserved ? (
        <Button variant="outline" size="sm" className="w-full" onClick={cancel} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Cancelar
        </Button>
      ) : full ? (
        <Button variant="secondary" size="sm" className="w-full" onClick={reserve} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Unirse a lista de espera
        </Button>
      ) : (
        <Button size="sm" className="w-full" onClick={reserve} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Reservar
        </Button>
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
