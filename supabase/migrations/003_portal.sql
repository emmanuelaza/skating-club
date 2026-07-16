-- =============================================================================
-- 003_portal.sql — Columnas requeridas por el portal del miembro
-- =============================================================================
-- Congelamiento de membresía y precio comparativo de variantes. Documentado
-- para historial; mantener sincronizado con types/database.ts.
-- =============================================================================

-- Congelamiento de suscripción (estado "paused").
alter table public.subscriptions
  add column if not exists frozen_at timestamptz;
alter table public.subscriptions
  add column if not exists freeze_days_used integer not null default 0;

-- Precio comparativo (tachado) de la variante, en pesos.
alter table public.product_variants
  add column if not exists compare_price_cop numeric;
