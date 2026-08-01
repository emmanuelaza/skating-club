import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { STAFF_ROLES } from '@/lib/roles';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  type Column,
} from '@/components/dashboard/DataTable';
import { OrdersFilters } from '@/components/dashboard/orders/OrdersFilters';
import { Badge } from '@/components/ui/badge';
import { formatCOP, formatDate } from '@/lib/format';
import type { OrderStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

const ORDER_BADGE: Record<
  OrderStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }
> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  payment_pending: { label: 'Pago pendiente', variant: 'warning' },
  paid: { label: 'Pagado', variant: 'success' },
  preparing: { label: 'En preparación', variant: 'secondary' },
  shipped: { label: 'Enviado', variant: 'secondary' },
  delivered: { label: 'Entregado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'warning' },
};

const VALID_STATUSES = new Set(Object.keys(ORDER_BADGE));

interface OrderRow {
  id: string;
  status: OrderStatus;
  total_cop: number;
  created_at: string;
  memberName: string;
  itemCount: number;
}

async function OrdersTable({ status, page }: { status: string; page: number }) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('orders')
    .select('id, profile_id, status, total_cop, created_at', { count: 'exact' });
  if (VALID_STATUSES.has(status)) query = query.eq('status', status as OrderStatus);

  const { data: orders, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);

  const rows = orders ?? [];
  const orderIds = rows.map((order) => order.id);
  const profileIds = Array.from(new Set(rows.map((order) => order.profile_id)));

  const profileNames = new Map<string, string>();
  const itemCounts = new Map<string, number>();
  if (rows.length > 0) {
    const [profilesRes, itemsRes] = await Promise.all([
      profileIds.length > 0
        ? supabase.from('profiles').select('id, full_name').in('id', profileIds)
        : Promise.resolve({ data: [] }),
      supabase.from('order_items').select('order_id, quantity').in('order_id', orderIds),
    ]);
    for (const profile of profilesRes.data ?? []) {
      profileNames.set(profile.id, profile.full_name);
    }
    for (const item of itemsRes.data ?? []) {
      itemCounts.set(item.order_id, (itemCounts.get(item.order_id) ?? 0) + item.quantity);
    }
  }

  const tableRows: OrderRow[] = rows.map((order) => ({
    id: order.id,
    status: order.status,
    total_cop: order.total_cop,
    created_at: order.created_at,
    memberName: profileNames.get(order.profile_id) ?? '—',
    itemCount: itemCounts.get(order.id) ?? 0,
  }));

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const columns: Column<OrderRow>[] = [
    {
      key: 'reference',
      header: 'Pedido',
      cell: (order) => (
        <div>
          <p className="font-mono text-xs font-medium text-foreground">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'member',
      header: 'Miembro',
      cell: (order) => <span className="font-medium text-foreground">{order.memberName}</span>,
    },
    {
      key: 'items',
      header: 'Artículos',
      cell: (order) => <span className="text-muted-foreground">{order.itemCount}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (order) => (
        <Badge variant={ORDER_BADGE[order.status].variant}>{ORDER_BADGE[order.status].label}</Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      headClassName: 'text-right',
      className: 'text-right',
      cell: (order) => (
        <span className="font-medium text-foreground">{formatCOP(order.total_cop)}</span>
      ),
    },
  ];

  const hrefForPage = (target: number) => {
    const params = new URLSearchParams();
    if (status && status !== 'todos') params.set('status', status);
    if (target > 1) params.set('page', String(target));
    const qs = params.toString();
    return `/dashboard/orders${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={tableRows}
        getRowId={(order) => order.id}
        emptyMessage="No hay pedidos con ese filtro."
      />
      <Pagination page={page} pageCount={pageCount} hrefForPage={hrefForPage} />
    </div>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? 'todos';
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);

  await requireRole(STAFF_ROLES);

  return (
    <div className="space-y-6">
      <PageHeader title="Pedidos" description="Pedidos de la tienda de la sede." />

      <OrdersFilters status={status} />

      <Suspense key={`${status}-${page}`} fallback={<DataTableSkeleton columns={5} />}>
        <OrdersTable status={status} page={page} />
      </Suspense>
    </div>
  );
}
