import Link from 'next/link';
import type { Route } from 'next';
import { Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCOP } from '@/lib/format';

export const dynamic = 'force-dynamic';

function firstImage(images: unknown): string | null {
  if (!Array.isArray(images)) return null;
  return images.find((item): item is string => typeof item === 'string') ?? null;
}

export default async function PortalStorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let productsQuery = supabase
    .from('products')
    .select('id, name, images, category')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (category) productsQuery = productsQuery.eq('category', category);

  const [productsResult, categoriesResult] = await Promise.all([
    productsQuery,
    supabase.from('products').select('category').eq('is_active', true),
  ]);
  if (productsResult.error) throw new Error(productsResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  const products = productsResult.data ?? [];
  const categories = Array.from(
    new Set(
      (categoriesResult.data ?? [])
        .map((row) => row.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();

  const fromPrice = new Map<string, number>();
  const productIds = products.map((product) => product.id);
  if (productIds.length > 0) {
    const { data: variants } = await supabase
      .from('product_variants')
      .select('product_id, price_cop')
      .in('product_id', productIds)
      .eq('is_active', true);
    for (const variant of variants ?? []) {
      const current = fromPrice.get(variant.product_id);
      if (current === undefined || variant.price_cop < current) {
        fromPrice.set(variant.product_id, variant.price_cop);
      }
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-foreground">Tienda</h1>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link
          href={'/portal/store' as Route}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors',
            !category ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground',
          )}
        >
          Todo
        </Link>
        {categories.map((value) => (
          <Link
            key={value}
            href={`/portal/store?category=${encodeURIComponent(value)}` as Route}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors',
              category === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground',
            )}
          >
            {value}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => {
            const image = firstImage(product.images);
            const price = fromPrice.get(product.id);
            return (
              <Link key={product.id} href={`/portal/store/${product.id}` as Route}>
                <Card className="overflow-hidden">
                  <div className="flex aspect-square items-center justify-center bg-secondary">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={product.name} className="size-full object-cover" />
                    ) : (
                      <Package className="size-8 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                  <CardContent className="space-y-1 p-3">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {price !== undefined ? `Desde ${formatCOP(price)}` : 'No disponible'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
