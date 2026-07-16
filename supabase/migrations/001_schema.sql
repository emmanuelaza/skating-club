-- =============================================================================
-- 001_schema.sql — Esquema base multi-sede (Skating Club)
-- =============================================================================
-- DOCUMENTACIÓN del esquema ya ejecutado en Supabase. Este archivo NO debe
-- re-ejecutarse contra producción; existe para mantener historial de
-- migraciones y como fuente de verdad versionada.
--
-- Invariantes clave:
--   * Cada sede es un tenant. Toda tabla de negocio lleva `tenant_id` NOT NULL
--     con RLS activo para aislar datos entre sedes.
--   * `profiles.id` es un uuid propio (NO el de auth.users).
--   * `profiles.auth_user_id` (uuid, NULLABLE) referencia a auth.users. Es
--     nullable para permitir perfiles creados por el staff antes de que el
--     usuario active su cuenta de autenticación.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.user_role as enum ('super_admin', 'tenant_admin', 'instructor', 'member');

create type public.subscription_status as enum (
  'active', 'past_due', 'canceled', 'paused', 'pending'
);

create type public.class_status as enum (
  'scheduled', 'in_progress', 'completed', 'canceled'
);

create type public.booking_status as enum (
  'confirmed', 'waitlisted', 'canceled', 'attended', 'no_show'
);

create type public.order_status as enum (
  'pending', 'paid', 'fulfilled', 'canceled', 'refunded'
);

create type public.loyalty_type as enum (
  'earned', 'redeemed', 'expired', 'adjusted'
);

create type public.ticket_status as enum ('open', 'pending', 'resolved', 'closed');

create type public.ticket_priority as enum ('low', 'medium', 'high', 'urgent');

create type public.announcement_audience as enum ('all', 'members', 'coaches', 'admins');

-- -----------------------------------------------------------------------------
-- Utilidad: trigger updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- Tablas
-- =============================================================================

-- tenants -- la tabla raíz (NO lleva tenant_id; ella ES el tenant).
create table public.tenants (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  domain        text unique,
  logo_url      text,
  primary_color text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- profiles
create table public.profiles (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid references auth.users (id) on delete set null,
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  email         text not null,
  full_name     text,
  phone         text,
  role          public.user_role not null default 'member',
  avatar_url    text,
  document_id   text,
  date_of_birth date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (tenant_id, email)
);
create index profiles_auth_user_id_idx on public.profiles (auth_user_id);
create index profiles_tenant_id_idx on public.profiles (tenant_id);

-- membership_plans
create table public.membership_plans (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  name          text not null,
  description   text,
  price_cop     numeric not null check (price_cop >= 0),
  currency      text not null default 'COP',
  interval      text not null default 'month' check (interval in ('month', 'year')),
  features      jsonb not null default '[]'::jsonb,
  treli_plan_id text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index membership_plans_tenant_id_idx on public.membership_plans (tenant_id);

-- subscriptions
create table public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  tenant_id                uuid not null references public.tenants (id) on delete cascade,
  profile_id               uuid not null references public.profiles (id) on delete cascade,
  plan_id                  uuid not null references public.membership_plans (id) on delete restrict,
  status                   public.subscription_status not null default 'pending',
  provider                 text,
  provider_subscription_id text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index subscriptions_tenant_id_idx on public.subscriptions (tenant_id);
create index subscriptions_profile_id_idx on public.subscriptions (profile_id);
create index subscriptions_status_idx on public.subscriptions (status);

-- class_types
create table public.class_types (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants (id) on delete cascade,
  name             text not null,
  description      text,
  color            text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  default_capacity integer not null default 10 check (default_capacity > 0),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index class_types_tenant_id_idx on public.class_types (tenant_id);

-- classes
create table public.classes (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  class_type_id uuid not null references public.class_types (id) on delete restrict,
  instructor_id uuid references public.profiles (id) on delete set null,
  title         text,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  capacity      integer not null check (capacity > 0),
  location      text,
  status        public.class_status not null default 'scheduled',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index classes_tenant_id_idx on public.classes (tenant_id);
create index classes_starts_at_idx on public.classes (starts_at);
create index classes_instructor_id_idx on public.classes (instructor_id);

-- bookings
create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  class_id      uuid not null references public.classes (id) on delete cascade,
  profile_id    uuid not null references public.profiles (id) on delete cascade,
  status        public.booking_status not null default 'confirmed',
  booked_at     timestamptz not null default now(),
  checked_in_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (class_id, profile_id)
);
create index bookings_tenant_id_idx on public.bookings (tenant_id);
create index bookings_class_id_idx on public.bookings (class_id);
create index bookings_profile_id_idx on public.bookings (profile_id);

-- products
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  name        text not null,
  description text,
  slug        text,
  images      jsonb not null default '[]'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index products_tenant_id_idx on public.products (tenant_id);

-- product_variants
create table public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  product_id  uuid not null references public.products (id) on delete cascade,
  name        text not null,
  sku         text,
  price_cop   numeric not null check (price_cop >= 0),
  currency    text not null default 'COP',
  stock       integer not null default 0 check (stock >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (tenant_id, sku)
);
create index product_variants_tenant_id_idx on public.product_variants (tenant_id);
create index product_variants_product_id_idx on public.product_variants (product_id);

-- orders
create table public.orders (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              uuid not null references public.tenants (id) on delete cascade,
  profile_id             uuid not null references public.profiles (id) on delete restrict,
  status                 public.order_status not null default 'pending',
  subtotal_cop           numeric not null default 0 check (subtotal_cop >= 0),
  discount_cop           numeric not null default 0 check (discount_cop >= 0),
  total_cop              numeric not null default 0 check (total_cop >= 0),
  currency               text not null default 'COP',
  provider               text,
  provider_transaction_id text,
  reference              text not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (tenant_id, reference)
);
create index orders_tenant_id_idx on public.orders (tenant_id);
create index orders_profile_id_idx on public.orders (profile_id);
create index orders_status_idx on public.orders (status);

-- order_items
create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants (id) on delete cascade,
  order_id         uuid not null references public.orders (id) on delete cascade,
  variant_id       uuid not null references public.product_variants (id) on delete restrict,
  quantity         integer not null default 1 check (quantity > 0),
  unit_price_cop   numeric not null check (unit_price_cop >= 0),
  created_at       timestamptz not null default now()
);
create index order_items_tenant_id_idx on public.order_items (tenant_id);
create index order_items_order_id_idx on public.order_items (order_id);

-- loyalty_points
create table public.loyalty_points (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants (id) on delete cascade,
  profile_id     uuid not null references public.profiles (id) on delete cascade,
  type           public.loyalty_type not null,
  points         integer not null,
  reason         text,
  reference_type text,
  reference_id   uuid,
  created_at     timestamptz not null default now()
);
create index loyalty_points_tenant_id_idx on public.loyalty_points (tenant_id);
create index loyalty_points_profile_id_idx on public.loyalty_points (profile_id);

-- support_tickets
create table public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  subject     text not null,
  status      public.ticket_status not null default 'open',
  priority    public.ticket_priority not null default 'medium',
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index support_tickets_tenant_id_idx on public.support_tickets (tenant_id);
create index support_tickets_profile_id_idx on public.support_tickets (profile_id);
create index support_tickets_status_idx on public.support_tickets (status);

-- ticket_messages
create table public.ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  ticket_id   uuid not null references public.support_tickets (id) on delete cascade,
  sender_id   uuid not null references public.profiles (id) on delete cascade,
  body        text not null,
  is_internal boolean not null default false,
  created_at  timestamptz not null default now()
);
create index ticket_messages_tenant_id_idx on public.ticket_messages (tenant_id);
create index ticket_messages_ticket_id_idx on public.ticket_messages (ticket_id);

-- payment_events -- bitácora idempotente de eventos de pasarela.
create table public.payment_events (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants (id) on delete cascade,
  provider          text not null,
  provider_event_id text,
  event_type        text not null,
  reference         text,
  status            text,
  amount_cop        numeric,
  currency          text,
  payload           jsonb not null,
  processed         boolean not null default false,
  created_at        timestamptz not null default now(),
  unique (provider, provider_event_id)
);
create index payment_events_tenant_id_idx on public.payment_events (tenant_id);
create index payment_events_reference_idx on public.payment_events (reference);

-- announcements
create table public.announcements (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants (id) on delete cascade,
  title        text not null,
  body         text not null,
  audience     public.announcement_audience not null default 'all',
  published    boolean not null default false,
  published_at timestamptz,
  author_id    uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index announcements_tenant_id_idx on public.announcements (tenant_id);

-- -----------------------------------------------------------------------------
-- Triggers updated_at
-- -----------------------------------------------------------------------------
create trigger set_updated_at before update on public.tenants
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.membership_plans
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.class_types
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.classes
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.support_tickets
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS — aislamiento por sede
-- =============================================================================
-- Funciones de contexto: resuelven el perfil/tenant/rol del usuario autenticado
-- a partir de auth.uid(). SECURITY DEFINER para poder leer profiles sin que la
-- propia política recurse.
create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('super_admin', 'tenant_admin'), false);
$$;

-- Habilitar RLS en todas las tablas.
alter table public.tenants            enable row level security;
alter table public.profiles           enable row level security;
alter table public.membership_plans   enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.class_types        enable row level security;
alter table public.classes            enable row level security;
alter table public.bookings           enable row level security;
alter table public.products           enable row level security;
alter table public.product_variants   enable row level security;
alter table public.orders             enable row level security;
alter table public.order_items        enable row level security;
alter table public.loyalty_points     enable row level security;
alter table public.support_tickets    enable row level security;
alter table public.ticket_messages    enable row level security;
alter table public.payment_events     enable row level security;
alter table public.announcements      enable row level security;

-- tenants: lectura pública de sedes activas (el sitio público necesita la marca
-- —nombre, logo— y el middleware resuelve el tenant por slug sin sesión). La
-- gestión queda reservada al service_role.
create policy "tenants_public_read" on public.tenants
  for select using (is_active = true);

-- profiles: cada quien ve/edita su propio perfil; el staff gestiona su sede.
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (
    auth_user_id = auth.uid()
    or (tenant_id = public.current_tenant_id() and public.is_staff())
  );
create policy "profiles_update_own" on public.profiles
  for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "profiles_staff_manage" on public.profiles
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- Catálogos legibles por todos los miembros de la sede; escritura solo staff.
create policy "membership_plans_select" on public.membership_plans
  for select using (tenant_id = public.current_tenant_id());
create policy "membership_plans_staff_write" on public.membership_plans
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy "class_types_select" on public.class_types
  for select using (tenant_id = public.current_tenant_id());
create policy "class_types_staff_write" on public.class_types
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy "classes_select" on public.classes
  for select using (tenant_id = public.current_tenant_id());
create policy "classes_staff_write" on public.classes
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy "products_select" on public.products
  for select using (tenant_id = public.current_tenant_id());
create policy "products_staff_write" on public.products
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy "product_variants_select" on public.product_variants
  for select using (tenant_id = public.current_tenant_id());
create policy "product_variants_staff_write" on public.product_variants
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- subscriptions: el miembro ve las suyas; el staff gestiona toda la sede.
create policy "subscriptions_select_own_or_staff" on public.subscriptions
  for select using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "subscriptions_staff_write" on public.subscriptions
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- bookings: el miembro crea/ve/cancela las suyas; el staff gestiona todas.
create policy "bookings_select_own_or_staff" on public.bookings
  for select using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "bookings_insert_own" on public.bookings
  for insert with check (
    tenant_id = public.current_tenant_id() and profile_id = public.current_profile_id()
  );
create policy "bookings_update_own_or_staff" on public.bookings
  for update using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "bookings_delete_own_or_staff" on public.bookings
  for delete using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );

-- orders / order_items: el miembro ve los suyos; el staff gestiona la sede.
create policy "orders_select_own_or_staff" on public.orders
  for select using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "orders_insert_own" on public.orders
  for insert with check (
    tenant_id = public.current_tenant_id() and profile_id = public.current_profile_id()
  );
create policy "orders_staff_write" on public.orders
  for update using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy "order_items_select_own_or_staff" on public.order_items
  for select using (
    tenant_id = public.current_tenant_id()
    and exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.profile_id = public.current_profile_id() or public.is_staff())
    )
  );
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    tenant_id = public.current_tenant_id()
    and exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.profile_id = public.current_profile_id()
    )
  );

-- loyalty_points: el miembro ve los suyos; el staff gestiona (otorga/ajusta).
create policy "loyalty_points_select_own_or_staff" on public.loyalty_points
  for select using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "loyalty_points_staff_write" on public.loyalty_points
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- support_tickets: el miembro abre/ve los suyos; el staff gestiona todos.
create policy "support_tickets_select_own_or_staff" on public.support_tickets
  for select using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );
create policy "support_tickets_insert_own" on public.support_tickets
  for insert with check (
    tenant_id = public.current_tenant_id() and profile_id = public.current_profile_id()
  );
create policy "support_tickets_update_own_or_staff" on public.support_tickets
  for update using (
    tenant_id = public.current_tenant_id()
    and (profile_id = public.current_profile_id() or public.is_staff())
  );

-- ticket_messages: visibles para el dueño del ticket (salvo notas internas) y staff.
create policy "ticket_messages_select" on public.ticket_messages
  for select using (
    tenant_id = public.current_tenant_id()
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_messages.ticket_id
        and (
          public.is_staff()
          or (t.profile_id = public.current_profile_id() and ticket_messages.is_internal = false)
        )
    )
  );
create policy "ticket_messages_insert" on public.ticket_messages
  for insert with check (
    tenant_id = public.current_tenant_id()
    and sender_id = public.current_profile_id()
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_messages.ticket_id
        and (t.profile_id = public.current_profile_id() or public.is_staff())
    )
  );

-- payment_events: solo lectura para staff; la escritura la hace el service_role
-- desde los webhooks (que bypasea RLS).
create policy "payment_events_staff_select" on public.payment_events
  for select using (tenant_id = public.current_tenant_id() and public.is_staff());

-- announcements: el miembro ve las publicadas para su audiencia; staff gestiona.
create policy "announcements_select_audience" on public.announcements
  for select using (
    tenant_id = public.current_tenant_id()
    and (
      public.is_staff()
      or (
        published = true
        and (
          audience = 'all'
          or (audience = 'members' and public.current_user_role() = 'member')
          or (audience = 'coaches' and public.current_user_role() = 'instructor')
          or (audience = 'admins' and public.is_staff())
        )
      )
    )
  );
create policy "announcements_staff_write" on public.announcements
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());
