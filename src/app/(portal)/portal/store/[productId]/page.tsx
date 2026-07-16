import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AddToCart, type VariantOption } from '@/components/portal/AddToCart';

export const dynamic = 'force-dynamic';

function toImages(images: unknown): string[] {
  return Array.isArray(images) ? images.filter((item): item is string => typeof item === 'string') : [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, description, images, is_active')
    .eq('id', productId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!product || !product.is_active) notFound();

  const { data: variantsData } = await supabase
    .from('product_variants')
    .select('id, name, sku, price_cop, compare_price_cop, stock')
    .eq('product_id', product.id)
    .eq('is_active', true)
    .order('name', { ascending: true });

  const variants: VariantOption[] = variantsData ?? [];
  const images = toImages(product.images);

  return (
    <div className="space-y-5">
      <Link
        href={'/portal/store' as Route}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Tienda
      </Link>

      <div className="space-y-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-secondary">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.name} className="size-full object-cover" />
          ) : (
            <Package className="size-12 text-muted-foreground" aria-hidden />
          )}
        </div>
        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto">
            {images.slice(1).map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 2}`}
                className="size-16 shrink-0 rounded-md object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-xl font-semibold text-foreground">{product.name}</h1>
        {product.description ? (
          <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
        ) : null}
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-muted-foreground">Este producto no tiene variantes disponibles.</p>
      ) : (
        <AddToCart productId={product.id} productName={product.name} variants={variants} />
      )}
    </div>
  );
}
