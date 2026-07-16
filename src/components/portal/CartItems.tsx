'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { updateCartQuantityAction, removeFromCartAction } from '@/lib/actions/cart';
import { Card, CardContent } from '@/components/ui/card';
import { formatCOP } from '@/lib/format';
import type { CartItem } from '@/lib/cart';

export function CartItems({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function setQuantity(variantId: string, quantity: number) {
    startTransition(async () => {
      await updateCartQuantityAction(variantId, Math.max(quantity, 0));
      router.refresh();
    });
  }

  function remove(variantId: string) {
    startTransition(async () => {
      await removeFromCartAction(variantId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.variantId}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              {item.sku ? <p className="text-xs text-muted-foreground">SKU: {item.sku}</p> : null}
              <p className="mt-1 text-sm text-muted-foreground">
                {formatCOP(item.price_cop)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                  disabled={isPending}
                  className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="w-8 text-center text-sm font-medium text-foreground">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                  disabled={isPending}
                  className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(item.variantId)}
                disabled={isPending}
                className="flex size-8 items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-50"
                aria-label="Quitar del carrito"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
