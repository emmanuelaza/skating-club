/**
 * Tipos de dominio compuestos de la plataforma.
 * Componen las filas de la base (ver `@/types/database`) en estructuras de
 * lectura que consumen la UI y las Server Actions.
 */
import type { Tables, UserRole } from '@/types/database';

// Alias de filas para uso ergonómico en la app.
export type Tenant = Tables<'tenants'>;
export type Profile = Tables<'profiles'>;
export type MembershipPlan = Tables<'membership_plans'>;
export type Subscription = Tables<'subscriptions'>;
export type ClassType = Tables<'class_types'>;
export type Class = Tables<'classes'>;
export type Booking = Tables<'bookings'>;
export type Product = Tables<'products'>;
export type ProductVariant = Tables<'product_variants'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type LoyaltyPoint = Tables<'loyalty_points'>;
export type SupportTicket = Tables<'support_tickets'>;
export type TicketMessage = Tables<'ticket_messages'>;
export type PaymentEvent = Tables<'payment_events'>;
export type Announcement = Tables<'announcements'>;

export type { UserRole };

/** Resultado estándar de una Server Action con manejo de error tipado. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Miembro con su suscripción activa (si la tiene) y el plan asociado. */
export interface MemberWithSubscription {
  profile: Profile;
  subscription: Subscription | null;
  plan: MembershipPlan | null;
}

/** Disponibilidad calculada de una clase. */
export interface ClassAvailability {
  capacity: number;
  booked: number;
  available: number;
}

/** Clase con su tipo, instructor y disponibilidad. */
export interface ClassWithDetails {
  class: Class;
  classType: ClassType;
  instructor: Profile | null;
  availability: ClassAvailability;
}

/** Ítem de orden con la variante de producto resuelta. */
export interface OrderItemWithVariant {
  item: OrderItem;
  variant: ProductVariant;
}

/** Orden con sus ítems y variantes. */
export interface OrderWithItems {
  order: Order;
  items: OrderItemWithVariant[];
}

/** Mensaje de ticket con su remitente resuelto. */
export interface TicketMessageWithSender {
  message: TicketMessage;
  sender: Profile;
}

/** Ticket de soporte con su hilo de mensajes. */
export interface TicketWithMessages {
  ticket: SupportTicket;
  messages: TicketMessageWithSender[];
}

/** Saldo de puntos de fidelidad de un perfil. */
export interface LoyaltyBalance {
  profile_id: string;
  balance: number;
  total_earned: number;
  total_redeemed: number;
}

/** KPIs del panel de la sede. */
export interface DashboardKPIs {
  active_members: number;
  mrr_cop: number;
  classes_today: number;
  bookings_today: number;
}
