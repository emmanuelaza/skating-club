import { notFound } from 'next/navigation';
import { Award, TrendingDown, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileEditForm } from '@/components/dashboard/members/ProfileEditForm';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCOP, formatDate, formatNumber, formatTime } from '@/lib/format';
import type {
  UserRole,
  SubscriptionStatus,
  BookingStatus,
  OrderStatus,
  LoyaltyType,
} from '@/types/database';
import type { LoyaltyBalance } from '@/types';

export const dynamic = 'force-dynamic';

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'secondary' | 'default';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super admin',
  tenant_admin: 'Administrador',
  instructor: 'Instructor',
  member: 'Miembro',
};

const SUBSCRIPTION_BADGE: Record<SubscriptionStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: 'Activa', variant: 'success' },
  past_due: { label: 'Vencida', variant: 'warning' },
  canceled: { label: 'Cancelada', variant: 'destructive' },
  paused: { label: 'Pausada', variant: 'secondary' },
  pending: { label: 'Pendiente', variant: 'secondary' },
};

const BOOKING_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Confirmada',
  waitlisted: 'Lista de espera',
  canceled: 'Cancelada',
  attended: 'Asistió',
  no_show: 'No asistió',
};

const ORDER_BADGE: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
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

function computeBalance(
  profileId: string,
  movements: { type: LoyaltyType; points: number }[],
): LoyaltyBalance {
  let earned = 0;
  let redeemed = 0;
  let balance = 0;
  for (const movement of movements) {
    const points = movement.points;
    switch (movement.type) {
      case 'earned':
        earned += points;
        balance += points;
        break;
      case 'redeemed':
        redeemed += Math.abs(points);
        balance -= Math.abs(points);
        break;
      case 'expired':
        balance -= Math.abs(points);
        break;
      case 'adjusted':
        balance += points;
        if (points >= 0) earned += points;
        else redeemed += Math.abs(points);
        break;
    }
  }
  return { profile_id: profileId, balance, total_earned: earned, total_redeemed: redeemed };
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);
  if (!profile) notFound();

  const [subsResult, bookingsResult, ordersResult, loyaltyResult] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('profile_id', id).order('created_at', { ascending: false }),
    supabase.from('bookings').select('*').eq('profile_id', id).order('booked_at', { ascending: false }).limit(50),
    supabase.from('orders').select('*').eq('profile_id', id).order('created_at', { ascending: false }).limit(50),
    supabase.from('loyalty_points').select('*').eq('profile_id', id).order('created_at', { ascending: false }).limit(100),
  ]);
  if (subsResult.error) throw new Error(subsResult.error.message);
  if (bookingsResult.error) throw new Error(bookingsResult.error.message);
  if (ordersResult.error) throw new Error(ordersResult.error.message);
  if (loyaltyResult.error) throw new Error(loyaltyResult.error.message);

  const subscriptions = subsResult.data ?? [];
  const bookings = bookingsResult.data ?? [];
  const orders = ordersResult.data ?? [];
  const loyalty = loyaltyResult.data ?? [];

  // Nombres de planes para el historial de suscripciones.
  const planNames = new Map<string, string>();
  const planIds = Array.from(new Set(subscriptions.map((sub) => sub.plan_id)));
  if (planIds.length > 0) {
    const { data: plans } = await supabase.from('membership_plans').select('id, name').in('id', planIds);
    for (const plan of plans ?? []) planNames.set(plan.id, plan.name);
  }

  // Info de clases para las reservas.
  const classInfo = new Map<string, { startsAt: string; typeName: string }>();
  const classIds = Array.from(new Set(bookings.map((booking) => booking.class_id)));
  if (classIds.length > 0) {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, starts_at, class_type_id')
      .in('id', classIds);
    const typeIds = Array.from(new Set((classes ?? []).map((cls) => cls.class_type_id)));
    const typeNames = new Map<string, string>();
    if (typeIds.length > 0) {
      const { data: types } = await supabase.from('class_types').select('id, name').in('id', typeIds);
      for (const type of types ?? []) typeNames.set(type.id, type.name);
    }
    for (const cls of classes ?? []) {
      classInfo.set(cls.id, {
        startsAt: cls.starts_at,
        typeName: typeNames.get(cls.class_type_id) ?? 'Clase',
      });
    }
  }

  const activeSub = subscriptions.find((sub) => sub.status === 'active') ?? subscriptions[0] ?? null;
  const membershipBadge = activeSub ? SUBSCRIPTION_BADGE[activeSub.status] : null;
  const balance = computeBalance(id, loyalty);
  const displayName = profile.full_name ?? profile.email;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={displayName} src={profile.avatar_url} className="size-14 text-base" />
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{ROLE_LABELS[profile.role]}</Badge>
          {membershipBadge ? (
            <Badge variant={membershipBadge.variant}>{membershipBadge.label}</Badge>
          ) : (
            <Badge variant="warning">Sin membresía</Badge>
          )}
          {profile.is_active ? null : <Badge variant="destructive">Suspendido</Badge>}
        </div>
      </div>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="membresia">Membresía</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="puntos">Puntos</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <ProfileEditForm profile={profile} />
        </TabsContent>

        <TabsContent value="membresia">
          {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este miembro no tiene suscripciones.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Inicio período</TableHead>
                      <TableHead>Fin período</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium text-foreground">
                          {planNames.get(sub.plan_id) ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={SUBSCRIPTION_BADGE[sub.status].variant}>
                            {SUBSCRIPTION_BADGE[sub.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(sub.current_period_start)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(sub.current_period_end)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reservas">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin reservas.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Clase</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const info = classInfo.get(booking.class_id);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium text-foreground">
                            {info?.typeName ?? 'Clase'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {info ? `${formatDate(info.startsAt)} · ${formatTime(info.startsAt)}` : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{BOOKING_LABELS[booking.status]}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pedidos">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin pedidos.</p>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Referencia</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs text-foreground">
                          {order.reference}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ORDER_BADGE[order.status].variant}>
                            {ORDER_BADGE[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {formatCOP(order.total_cop)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="puntos">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-6">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Award className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className="font-display text-2xl font-semibold text-foreground">
                      {formatNumber(balance.balance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-6">
                  <span className="flex size-9 items-center justify-center rounded-md bg-success/10 text-success">
                    <TrendingUp className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Ganados</p>
                    <p className="font-display text-2xl font-semibold text-foreground">
                      {formatNumber(balance.total_earned)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-6">
                  <span className="flex size-9 items-center justify-center rounded-md bg-warning/10 text-warning">
                    <TrendingDown className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Canjeados</p>
                    <p className="font-display text-2xl font-semibold text-foreground">
                      {formatNumber(balance.total_redeemed)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {loyalty.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin movimientos de puntos.</p>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo</TableHead>
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
                            {movement.reason ?? '—'}
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
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
