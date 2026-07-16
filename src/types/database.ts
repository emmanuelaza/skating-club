/**
 * Tipos de la base de datos — fuente de tipos de toda la app.
 *
 * Refleja 1:1 el esquema documentado en `supabase/migrations/001_schema.sql`.
 * En cuanto el proyecto esté conectado, regenerar con:
 *   supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * Nota de invariante: `profiles.id` es un uuid propio; `profiles.auth_user_id`
 * (uuid, nullable) referencia a auth.users.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'tenant_admin' | 'instructor' | 'member';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'paused' | 'pending';
export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled';
export type BookingStatus = 'confirmed' | 'waitlisted' | 'canceled' | 'attended' | 'no_show';
export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'canceled' | 'refunded';
export type LoyaltyType = 'earned' | 'redeemed' | 'expired' | 'adjusted';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AnnouncementAudience = 'all' | 'members' | 'coaches' | 'admins';

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          domain: string | null;
          logo_url: string | null;
          primary_color: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          domain?: string | null;
          logo_url?: string | null;
          primary_color?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          domain?: string | null;
          logo_url?: string | null;
          primary_color?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          tenant_id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          document_id: string | null;
          date_of_birth: string | null;
          is_active: boolean;
          email_invalid: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          tenant_id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          document_id?: string | null;
          date_of_birth?: string | null;
          is_active?: boolean;
          email_invalid?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          tenant_id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          document_id?: string | null;
          date_of_birth?: string | null;
          is_active?: boolean;
          email_invalid?: boolean;
          created_at?: string;
          updated_at?: string;
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
          currency: string;
          interval: string;
          features: Json;
          treli_plan_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          price_cop: number;
          currency?: string;
          interval?: string;
          features?: Json;
          treli_plan_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          price_cop?: number;
          currency?: string;
          interval?: string;
          features?: Json;
          treli_plan_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
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
          provider: string | null;
          provider_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          frozen_at: string | null;
          freeze_days_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          provider?: string | null;
          provider_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          frozen_at?: string | null;
          freeze_days_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          plan_id?: string;
          status?: SubscriptionStatus;
          provider?: string | null;
          provider_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          frozen_at?: string | null;
          freeze_days_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class_types: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          color: string | null;
          duration_minutes: number;
          default_capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          duration_minutes?: number;
          default_capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          duration_minutes?: number;
          default_capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          tenant_id: string;
          class_type_id: string;
          instructor_id: string | null;
          title: string | null;
          starts_at: string;
          ends_at: string;
          capacity: number;
          location: string | null;
          status: ClassStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_type_id: string;
          instructor_id?: string | null;
          title?: string | null;
          starts_at: string;
          ends_at: string;
          capacity: number;
          location?: string | null;
          status?: ClassStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_type_id?: string;
          instructor_id?: string | null;
          title?: string | null;
          starts_at?: string;
          ends_at?: string;
          capacity?: number;
          location?: string | null;
          status?: ClassStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          tenant_id: string;
          class_id: string;
          profile_id: string;
          status: BookingStatus;
          booked_at: string;
          checked_in_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_id: string;
          profile_id: string;
          status?: BookingStatus;
          booked_at?: string;
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_id?: string;
          profile_id?: string;
          status?: BookingStatus;
          booked_at?: string;
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          slug: string | null;
          category: string | null;
          images: Json;
          low_stock_alert: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          slug?: string | null;
          category?: string | null;
          images?: Json;
          low_stock_alert?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          slug?: string | null;
          category?: string | null;
          images?: Json;
          low_stock_alert?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          tenant_id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_cop: number;
          compare_price_cop: number | null;
          currency: string;
          stock: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          product_id: string;
          name: string;
          sku?: string | null;
          price_cop: number;
          compare_price_cop?: number | null;
          currency?: string;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          product_id?: string;
          name?: string;
          sku?: string | null;
          price_cop?: number;
          compare_price_cop?: number | null;
          currency?: string;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
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
          currency: string;
          provider: string | null;
          provider_transaction_id: string | null;
          reference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          status?: OrderStatus;
          subtotal_cop?: number;
          discount_cop?: number;
          total_cop?: number;
          currency?: string;
          provider?: string | null;
          provider_transaction_id?: string | null;
          reference: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          status?: OrderStatus;
          subtotal_cop?: number;
          discount_cop?: number;
          total_cop?: number;
          currency?: string;
          provider?: string | null;
          provider_transaction_id?: string | null;
          reference?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          variant_id: string;
          quantity: number;
          unit_price_cop: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          variant_id: string;
          quantity?: number;
          unit_price_cop: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_id?: string;
          variant_id?: string;
          quantity?: number;
          unit_price_cop?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      loyalty_points: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          type: LoyaltyType;
          points: number;
          reason: string | null;
          reference_type: string | null;
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          type: LoyaltyType;
          points: number;
          reason?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string;
          type?: LoyaltyType;
          points?: number;
          reason?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string | null;
          subject: string;
          status: TicketStatus;
          priority: TicketPriority;
          assigned_to: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id?: string | null;
          subject: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          assigned_to?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string | null;
          subject?: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          assigned_to?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          tenant_id: string;
          ticket_id: string;
          sender_id: string;
          body: string;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          ticket_id: string;
          sender_id: string;
          body: string;
          is_internal?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          ticket_id?: string;
          sender_id?: string;
          body?: string;
          is_internal?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      payment_events: {
        Row: {
          id: string;
          tenant_id: string;
          provider: string;
          provider_event_id: string | null;
          event_type: string;
          reference: string | null;
          status: string | null;
          amount_cop: number | null;
          currency: string | null;
          payload: Json;
          processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider: string;
          provider_event_id?: string | null;
          event_type: string;
          reference?: string | null;
          status?: string | null;
          amount_cop?: number | null;
          currency?: string | null;
          payload: Json;
          processed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          provider?: string;
          provider_event_id?: string | null;
          event_type?: string;
          reference?: string | null;
          status?: string | null;
          amount_cop?: number | null;
          currency?: string | null;
          payload?: Json;
          processed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          tenant_id: string;
          title: string;
          body: string;
          audience: AnnouncementAudience;
          published: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          title: string;
          body: string;
          audience?: AnnouncementAudience;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          title?: string;
          body?: string;
          audience?: AnnouncementAudience;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_profile_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      subscription_status: SubscriptionStatus;
      class_status: ClassStatus;
      booking_status: BookingStatus;
      order_status: OrderStatus;
      loyalty_type: LoyaltyType;
      ticket_status: TicketStatus;
      ticket_priority: TicketPriority;
      announcement_audience: AnnouncementAudience;
    };
    CompositeTypes: Record<string, never>;
  };
}

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
