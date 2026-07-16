import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { STAFF_ROLES } from '@/lib/roles';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DailyRevenueChart, type DailyPoint } from '@/components/dashboard/reports/DailyRevenueChart';
import { AttendancePie, type SlicePoint } from '@/components/dashboard/reports/AttendancePie';
import { RangeSelect, ExportButton } from '@/components/dashboard/reports/ReportControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/format';

export const dynamic = 'force-dynamic';

const DAY_LABEL = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit' });
const ALLOWED_RANGES = new Set(['30', '60', '90']);

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = ALLOWED_RANGES.has(params.range ?? '') ? (params.range as string) : '30';
  const days = Number.parseInt(range, 10);

  await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const sinceIso = start.toISOString();

  const [ordersResult, attendedResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('total_cop, created_at').eq('status', 'paid').gte('created_at', sinceIso),
    supabase.from('bookings').select('class_id').eq('status', 'attended').gte('booked_at', sinceIso),
    supabase.from('order_items').select('variant_id, quantity').gte('created_at', sinceIso),
  ]);
  if (ordersResult.error) throw new Error(ordersResult.error.message);
  if (attendedResult.error) throw new Error(attendedResult.error.message);
  if (itemsResult.error) throw new Error(itemsResult.error.message);

  // Ingresos por día.
  const dayMs = 86_400_000;
  const indexByKey = new Map<string, number>();
  const daily: DailyPoint[] = [];
  for (let index = 0; index < days; index += 1) {
    const date = new Date(start.getTime() + index * dayMs);
    indexByKey.set(date.toISOString().slice(0, 10), index);
    daily.push({ label: DAY_LABEL.format(date), revenue: 0 });
  }
  for (const order of ordersResult.data ?? []) {
    const key = new Date(order.created_at).toISOString().slice(0, 10);
    const index = indexByKey.get(key);
    if (index === undefined) continue;
    const bucket = daily[index];
    if (bucket) bucket.revenue += order.total_cop;
  }

  // Asistencia por tipo de clase.
  const attendedClassIds = (attendedResult.data ?? []).map((booking) => booking.class_id);
  const attendance: SlicePoint[] = [];
  if (attendedClassIds.length > 0) {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, class_type_id')
      .in('id', attendedClassIds);
    const typeOfClass = new Map((classes ?? []).map((cls) => [cls.id, cls.class_type_id]));
    const typeIds = Array.from(new Set((classes ?? []).map((cls) => cls.class_type_id)));
    const typeNames = new Map<string, string>();
    if (typeIds.length > 0) {
      const { data: types } = await supabase.from('class_types').select('id, name').in('id', typeIds);
      for (const type of types ?? []) typeNames.set(type.id, type.name);
    }
    const counts = new Map<string, number>();
    for (const classId of attendedClassIds) {
      const typeId = typeOfClass.get(classId);
      if (!typeId) continue;
      const name = typeNames.get(typeId) ?? 'Otro';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    for (const [name, value] of counts) attendance.push({ name, value });
    attendance.sort((a, b) => b.value - a.value);
  }

  // Top 5 productos más vendidos.
  const quantityByVariant = new Map<string, number>();
  for (const item of itemsResult.data ?? []) {
    quantityByVariant.set(item.variant_id, (quantityByVariant.get(item.variant_id) ?? 0) + item.quantity);
  }
  const topProducts: { name: string; quantity: number }[] = [];
  const variantIds = Array.from(quantityByVariant.keys());
  if (variantIds.length > 0) {
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, product_id')
      .in('id', variantIds);
    const productOfVariant = new Map((variants ?? []).map((variant) => [variant.id, variant.product_id]));
    const productIds = Array.from(new Set((variants ?? []).map((variant) => variant.product_id)));
    const productNames = new Map<string, string>();
    if (productIds.length > 0) {
      const { data: products } = await supabase.from('products').select('id, name').in('id', productIds);
      for (const product of products ?? []) productNames.set(product.id, product.name);
    }
    const quantityByProduct = new Map<string, number>();
    for (const [variantId, quantity] of quantityByVariant) {
      const productId = productOfVariant.get(variantId);
      if (!productId) continue;
      quantityByProduct.set(productId, (quantityByProduct.get(productId) ?? 0) + quantity);
    }
    for (const [productId, quantity] of quantityByProduct) {
      topProducts.push({ name: productNames.get(productId) ?? '—', quantity });
    }
    topProducts.sort((a, b) => b.quantity - a.quantity);
  }
  const top5 = topProducts.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" description="Análisis de ingresos, asistencia y ventas.">
        <RangeSelect range={range} />
        <ExportButton rows={daily} filename={`ingresos-${range}d.csv`} />
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ingresos por día</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyRevenueChart data={daily} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asistencia por tipo de clase</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendancePie data={attendance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 productos más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top5.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={2} className="py-10 text-center text-sm text-muted-foreground">
                      Sin ventas en el rango.
                    </TableCell>
                  </TableRow>
                ) : (
                  top5.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                      <TableCell className="text-right text-foreground">
                        {formatNumber(product.quantity)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
