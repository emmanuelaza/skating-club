import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { computeLoyaltyBalance } from '@/lib/loyalty';
import {
  ProfileForm,
  PasswordForm,
  DeleteAccountButton,
} from '@/components/portal/AccountForms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCOP, formatDate, formatNumber } from '@/lib/format';
import type { OrderStatus, LoyaltyType } from '@/types/database';

export const dynamic = 'force-dynamic';

const ORDER_BADGE: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  paid: { label: 'Pagado', variant: 'success' },
  fulfilled: { label: 'Entregado', variant: 'success' },
  canceled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'warning' },
};

const LOYALTY_LABELS: Record<LoyaltyType, string> = {
  earned: 'Ganados',
  redeemed: 'Canjeados',
  expired: 'Expirados',
  adjusted: 'Ajuste',
};

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const [ordersResult, loyaltyResult] = await Promise.all([
    supabase
      .from('orders')
      .select('id, reference, status, total_cop, created_at')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('loyalty_points')
      .select('id, type, points, reason, created_at')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);
  if (ordersResult.error) throw new Error(ordersResult.error.message);
  if (loyaltyResult.error) throw new Error(loyaltyResult.error.message);

  const orders = ordersResult.data ?? [];
  const loyalty = loyaltyResult.data ?? [];
  const balance = computeLoyaltyBalance(profile.id, loyalty);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">Mi cuenta</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaults={{
              fullName: profile.full_name ?? '',
              phone: profile.phone ?? '',
              dateOfBirth: profile.date_of_birth ? profile.date_of_birth.slice(0, 10) : '',
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mis pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">Aún no tienes pedidos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Pedido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-mono text-xs text-foreground">{order.reference}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ORDER_BADGE[order.status].variant}>
                        {ORDER_BADGE[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCOP(order.total_cop)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        title="Descarga de factura próximamente"
                        aria-label="Descargar factura"
                      >
                        <Download className="size-4" aria-hidden />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Puntos de fidelización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-foreground">
              {formatNumber(balance.balance)}
            </span>
            <span className="text-sm text-muted-foreground">puntos</span>
          </div>
          {loyalty.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin movimientos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyalty.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-foreground">
                      {LOYALTY_LABELS[movement.type]}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(movement.created_at)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatNumber(movement.points)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Zona de peligro</CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
