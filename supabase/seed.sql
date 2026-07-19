-- =============================================================================
-- seed.sql — Datos iniciales para desarrollo y primera puesta en marcha
-- =============================================================================
-- Inserta el tenant principal si no existe. Usa ON CONFLICT para ser
-- idempotente: se puede ejecutar múltiples veces sin duplicar datos.
-- =============================================================================

INSERT INTO public.tenants (slug, name, domain, primary_color, is_active)
VALUES (
  'skatingclub',
  'Skating Club',
  'skatingclub.co',
  '#00E5A0',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  domain        = EXCLUDED.domain,
  primary_color = EXCLUDED.primary_color,
  is_active     = EXCLUDED.is_active,
  updated_at    = now();
