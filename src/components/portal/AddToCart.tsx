'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ShoppingBag } from 'lucide-react';
import { addToCartAction } from '@/lib/actions/cart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCOP } from '@/lib/format';

export interface VariantOption {
  id: string;
  name: string;
  sku: string | null;
  price_cop: number;
  compare_price_cop: number | null;
  stock: number;
}

export function AddToCart({
  productId,
  productName,
  variants,
}: {
  productId: string;
  productName: string;
  variants: VariantOption[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState(variants[0]?.id ?? '');
  const [added, setAdded] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const selected = variants.find((variant) => variant.id === selectedId) ?? null;
  const outOfStock = !selected || selected.stock <= 0;

  function add() {
    if (!selected) return;
    setAdded(false);
    startTransition(async () => {
      await addToCartAction({
        variantId: selected.id,
        productId,
        name: `${productName} · ${selected.name}`,
        sku: selected.sku,
        price_cop: selected.price_cop,
        quantity: 1,
      });
      setAdded(true);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-foreground">
            {selected ? formatCOP(selected.price_cop) : '—'}
          </span>
          {selected?.compare_price_cop && selected.compare_price_cop > selected.price_cop ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatCOP(selected.compare_price_cop)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => {
              setSelectedId(variant.id);
              setAdded(false);
            }}
            className={cn(
              'rounded-md border px-3 py-2 text-sm transition-colors',
              variant.id === selectedId
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-foreground hover:bg-secondary',
              variant.stock <= 0 && 'opacity-50',
            )}
          >
            {variant.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {selected
          ? selected.stock > 0
            ? `${selected.stock} disponibles`
            : 'Sin stock'
          : 'Selecciona una variante'}
      </p>

      <Button className="w-full" onClick={add} disabled={isPending || outOfStock}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : added ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <ShoppingBag className="size-4" aria-hidden />
        )}
        {added ? 'Agregado' : 'Agregar al carrito'}
      </Button>
    </div>
  );
}
