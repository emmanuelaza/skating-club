-- =============================================================================
-- 005_email.sql — Estado de email del perfil (rebotes de Resend)
-- =============================================================================
-- Permite marcar perfiles cuyo correo rebotó para no seguir enviándoles.
-- =============================================================================

alter table public.profiles
  add column if not exists email_invalid boolean not null default false;
