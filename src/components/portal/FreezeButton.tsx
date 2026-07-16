'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Snowflake } from 'lucide-react';
import { freezeSubscriptionAction } from '@/lib/actions/bookings';
import { Button } from '@/components/ui/button';

export function FreezeButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function freeze() {
    setError(null);
    const formData = new FormData();
    formData.set('subscriptionId', subscriptionId);
    startTransition(async () => {
      const result = await freezeSubscriptionAction(formData);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <div className="space-y-1.5">
      <Button variant="outline" className="w-full" onClick={freeze} disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Snowflake className="size-4" aria-hidden />
        )}
        Congelar membresía
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
