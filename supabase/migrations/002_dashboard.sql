-- =============================================================================
-- 002_dashboard.sql — Columnas requeridas por el panel de tienda
-- =============================================================================
-- Añade categorización y umbral de alerta de stock a productos. Documentado
-- para historial de migraciones; mantener sincronizado con types/database.ts.
-- =============================================================================

alter table public.products
  add column if not exists category text;

alter table public.products
  add column if not exists low_stock_alert integer not null default 5;

create index if not exists products_category_idx on public.products (category);
