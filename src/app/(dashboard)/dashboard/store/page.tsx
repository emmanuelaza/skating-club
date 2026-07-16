import { Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { STAFF_ROLES } from '@/lib/roles';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/dashboard/DataTable';
import { ProductSheet } from '@/components/dashboard/store/ProductSheet';
import { StoreFilters } from '@/components/dashboard/store/StoreFilters';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface ProductRow {
  id: string;
  name: string;
  category: string | null;
  images: string[];
  lowStockAlert: number;
  isActive: boolean;
  variantCount: number;
  stockTotal: number;
}

function firstImage(images: unknown): string | null {
  if (!Array.isArray(images)) return null;
  const first = images.find((item): item is string => typeof item === 'string');
  return first ?? null;
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  let productsQuery = supabase
    .from('products')
    .select('id, name, category, images, low_stock_alert, is_active')
    .order('created_at', { ascending: false });
  if (category) productsQuery = productsQuery.eq('category', category);

  const [productsResult, categoriesResult] = await Promise.all([
    productsQuery,
    supabase.from('products').select('category'),
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

  // Variantes -> conteo y stock total por producto.
  const variantCount = new Map<string, number>();
  const stockTotal = new Map<string, number>();
  const productIds = products.map((product) => product.id);
  if (productIds.length > 0) {
    const { data: variants } = await supabase
      .from('product_variants')
      .select('product_id, stock')
      .in('product_id', productIds);
    for (const variant of variants ?? []) {
      variantCount.set(variant.product_id, (variantCount.get(variant.product_id) ?? 0) + 1);
      stockTotal.set(variant.product_id, (stockTotal.get(variant.product_id) ?? 0) + variant.stock);
    }
  }

  const rows: ProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    images: Array.isArray(product.images)
      ? product.images.filter((item): item is string => typeof item === 'string')
      : [],
    lowStockAlert: product.low_stock_alert,
    isActive: product.is_active,
    variantCount: variantCount.get(product.id) ?? 0,
    stockTotal: stockTotal.get(product.id) ?? 0,
  }));

  const columns: Column<ProductRow>[] = [
    {
      key: 'image',
      header: '',
      headClassName: 'w-14',
      cell: (product) => {
        const image = firstImage(product.images);
        return image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="size-10 rounded-sm object-cover" />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-sm bg-secondary text-muted-foreground">
            <Package className="size-5" aria-hidden />
          </span>
        );
      },
    },
    {
      key: 'name',
      header: 'Nombre',
      cell: (product) => <span className="font-medium text-foreground">{product.name}</span>,
    },
    {
      key: 'category',
      header: 'Categoría',
      cell: (product) =>
        product.category ? (
          <span className="text-foreground">{product.category}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'variants',
      header: 'Variantes',
      cell: (product) => <span className="text-muted-foreground">{product.variantCount}</span>,
    },
    {
      key: 'stock',
      header: 'Stock total',
      cell: (product) => {
        const low = product.stockTotal <= product.lowStockAlert;
        return (
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', low ? 'text-destructive' : 'text-foreground')}>
              {formatNumber(product.stockTotal)}
            </span>
            {low ? <Badge variant="destructive">Stock bajo</Badge> : null}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (product) =>
        product.isActive ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="secondary">Inactivo</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tienda" description="Productos y variantes de la sede.">
        <ProductSheet />
      </PageHeader>

      <StoreFilters categories={categories} />

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(product) => product.id}
        emptyMessage="No hay productos."
      />
    </div>
  );
}
