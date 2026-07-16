import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { getCart, cartSubtotal } from '@/lib/cart';
import { clearCartAction } from '@/lib/actions/cart';
import { CartItems } from '@/components/portal/CartItems';
import { Button } from '@/components/ui/button';
import { formatCOP } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const items = await getCart();
  const subtotal = cartSubtotal(items);
  const total = subtotal;

  return (
    <div className="space-y-5">
      <Link
        href={'/portal/store' as Route}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Seguir comprando
      </Link>

      <h1 className="font-display text-2xl font-semibold text-foreground">Carrito</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <ShoppingBag className="size-6" aria-hidden />
          </span>
          <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
        </div>
      ) : (
        <>
          <CartItems items={items} />

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full" disabled title="Pagos disponibles próximamente">
              Ir a pagar
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pagos disponibles próximamente
            </p>
            <form action={clearCartAction}>
              <Button type="submit" variant="ghost" className="w-full text-muted-foreground">
                Vaciar carrito
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
