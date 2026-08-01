/**
 * Tipos de la base de datos — GENERADO, no editar a mano.
 *
 * Reflejan 1:1 el esquema real de Supabase. Para regenerar tras un cambio de
 * esquema (o si aparece un error "column X does not exist"):
 *
 *   node scripts/gen-database-types.mjs
 *
 * Nota de invariante: `profiles.id` es un uuid propio; `profiles.auth_user_id`
 * (uuid, nullable) referencia a auth.users. `profiles` NO tiene columna
 * `email`: el correo vive en auth.users.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AnnouncementAudience = 'all' | 'members' | 'instructors' | 'admins';
export type BookingStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type LoyaltyType = 'earned_booking' | 'earned_purchase' | 'earned_referral' | 'earned_manual' | 'redeemed' | 'expired';
export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type SubscriptionStatus = 'trialing' | 'active' | 'frozen' | 'past_due' | 'cancelled' | 'expired';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
export type UserRole = 'super_admin' | 'tenant_admin' | 'instructor' | 'member';

export interface Database {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          tenant_id: string;
          author_id: string;
          title: string;
          body: string;
          audience: AnnouncementAudience;
          is_pinned: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          published: boolean;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          author_id: string;
          title: string;
          body: string;
          audience?: AnnouncementAudience;
          is_pinned?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          published?: boolean;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          author_id?: string;
          title?: string;
          body?: string;
          audience?: AnnouncementAudience;
          is_pinned?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          published?: boolean;
          published_at?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          class_id: string;
          status: BookingStatus;
          booked_at: string;
          cancelled_at: string | null;
          cancel_reason: string | null;
          attended_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          class_id: string;
          status?: BookingStatus;
          booked_at?: string;
          cancelled_at?: string | null;
          cancel_reason?: string | null;
          attended_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          class_id?: string;
          status?: BookingStatus;
          booked_at?: string;
          cancelled_at?: string | null;
          cancel_reason?: string | null;
          attended_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      class_types: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          level: string;
          image_url: string | null;
          color: string | null;
          duration_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          level?: string;
          image_url?: string | null;
          color?: string | null;
          duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          level?: string;
          image_url?: string | null;
          color?: string | null;
          duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          tenant_id: string;
          class_type_id: string;
          instructor_id: string;
          room: string | null;
          capacity: number;
          scheduled_at: string;
          duration_minutes: number;
          status: ClassStatus;
          notes: string | null;
          is_recurring: boolean;
          recurrence_rule: string | null;
          parent_class_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_type_id: string;
          instructor_id: string;
          room?: string | null;
          capacity: number;
          scheduled_at: string;
          duration_minutes?: number;
          status?: ClassStatus;
          notes?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          parent_class_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_type_id?: string;
          instructor_id?: string;
          room?: string | null;
          capacity?: number;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: ClassStatus;
          notes?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          parent_class_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      loyalty_points: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          points: number;
          type: LoyaltyType;
          reference_id: string | null;
          description: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          points: number;
          type: LoyaltyType;
          reference_id?: string | null;
          description?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          points?: number;
          type?: LoyaltyType;
          reference_id?: string | null;
          description?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      membership_plans: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          price_cop: number;
          duration_days: number;
          benefits: Json;
          classes_per_week: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          price_cop: number;
          duration_days: number;
          benefits: Json;
          classes_per_week?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          price_cop?: number;
          duration_days?: number;
          benefits?: Json;
          classes_per_week?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          tenant_id: string;
          variant_id: string;
          quantity: number;
          unit_price_cop: number;
          total_cop: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          tenant_id: string;
          variant_id: string;
          quantity: number;
          unit_price_cop: number;
          total_cop: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          tenant_id?: string;
          variant_id?: string;
          quantity?: number;
          unit_price_cop?: number;
          total_cop?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          status: OrderStatus;
          subtotal_cop: number;
          discount_cop: number;
          total_cop: number;
          wompi_transaction_id: string | null;
          coupon_code: string | null;
          shipping_address: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          status?: OrderStatus;
          subtotal_cop?: number;
          discount_cop?: number;
          total_cop?: number;
          wompi_transaction_id?: string | null;
          coupon_code?: string | null;
          shipping_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          status?: OrderStatus;
          subtotal_cop?: number;
          discount_cop?: number;
          total_cop?: number;
          wompi_transaction_id?: string | null;
          coupon_code?: string | null;
          shipping_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      payment_events: {
        Row: {
          id: string;
          tenant_id: string;
          provider: string;
          event_type: string;
          reference_id: string | null;
          payload: Json;
          status: string;
          processed_at: string | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider?: string;
          event_type: string;
          reference_id?: string | null;
          payload: Json;
          status?: string;
          processed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          provider?: string;
          event_type?: string;
          reference_id?: string | null;
          payload?: Json;
          status?: string;
          processed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          tenant_id: string;
          sku: string;
          size: string | null;
          color: string | null;
          price_cop: number;
          compare_price: number | null;
          stock: number;
          low_stock_alert: number;
          weight_grams: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          tenant_id: string;
          sku: string;
          size?: string | null;
          color?: string | null;
          price_cop: number;
          compare_price?: number | null;
          stock?: number;
          low_stock_alert?: number;
          weight_grams?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          tenant_id?: string;
          sku?: string;
          size?: string | null;
          color?: string | null;
          price_cop?: number;
          compare_price?: number | null;
          stock?: number;
          low_stock_alert?: number;
          weight_grams?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          category: string | null;
          image_urls: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          image_urls: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          image_urls?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          tenant_id: string;
          full_name: string;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          birth_date: string | null;
          gender: string | null;
          emergency_name: string | null;
          emergency_phone: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          tenant_id: string;
          full_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          emergency_name?: string | null;
          emergency_phone?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          tenant_id?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          emergency_name?: string | null;
          emergency_phone?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          wompi_token: string | null;
          wompi_subscription_id: string | null;
          starts_at: string;
          ends_at: string;
          frozen_at: string | null;
          frozen_days_used: number;
          cancelled_at: string | null;
          cancel_reason: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          wompi_token?: string | null;
          wompi_subscription_id?: string | null;
          starts_at: string;
          ends_at: string;
          frozen_at?: string | null;
          frozen_days_used?: number;
          cancelled_at?: string | null;
          cancel_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          plan_id?: string;
          status?: SubscriptionStatus;
          wompi_token?: string | null;
          wompi_subscription_id?: string | null;
          starts_at?: string;
          ends_at?: string;
          frozen_at?: string | null;
          frozen_days_used?: number;
          cancelled_at?: string | null;
          cancel_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          assigned_to: string | null;
          subject: string;
          status: TicketStatus;
          priority: TicketPriority;
          category: string | null;
          resolved_at: string | null;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          assigned_to?: string | null;
          subject: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          category?: string | null;
          resolved_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          assigned_to?: string | null;
          subject?: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          category?: string | null;
          resolved_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          id: string;
          name: string;
          subdomain: string;
          logo_url: string | null;
          theme: Json;
          contact_email: string | null;
          contact_phone: string | null;
          address: string | null;
          city: string | null;
          country: string;
          timezone: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          subdomain: string;
          logo_url?: string | null;
          theme: Json;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          subdomain?: string;
          logo_url?: string | null;
          theme?: Json;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          tenant_id: string;
          sender_id: string;
          body: string;
          attachments: Json;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          tenant_id: string;
          sender_id: string;
          body: string;
          attachments: Json;
          is_internal?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          tenant_id?: string;
          sender_id?: string;
          body?: string;
          attachments?: Json;
          is_internal?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      class_availability: {
        Row: {
          class_id: string | null;
          tenant_id: string | null;
          capacity: number | null;
          booked_count: number | null;
          waitlist_count: number | null;
          available_spots: number | null;
        };
        Relationships: [];
      };
      loyalty_balance: {
        Row: {
          tenant_id: string | null;
          profile_id: string | null;
          balance: number | null;
          total_earned: number | null;
          total_redeemed: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      current_profile_id: { Args: Record<string, never>; Returns: string };
      current_tenant_id: { Args: Record<string, never>; Returns: string };
      current_user_role: { Args: Record<string, never>; Returns: UserRole };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      announcement_audience: AnnouncementAudience;
      booking_status: BookingStatus;
      class_status: ClassStatus;
      loyalty_type: LoyaltyType;
      order_status: OrderStatus;
      subscription_status: SubscriptionStatus;
      ticket_priority: TicketPriority;
      ticket_status: TicketStatus;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Views<T extends keyof PublicSchema['Views']> = PublicSchema['Views'][T]['Row'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
