-- =============================================================================
-- 004_contact.sql — Soporte para el formulario de contacto público
-- =============================================================================
-- Permite tickets sin perfil (visitantes anónimos) y guarda los datos de
-- contacto del formulario público. La inserción la realiza el service_role
-- desde la Server Action (el visitante no tiene sesión).
-- =============================================================================

alter table public.support_tickets
  alter column profile_id drop not null;

alter table public.support_tickets
  add column if not exists contact_name text;
alter table public.support_tickets
  add column if not exists contact_email text;
alter table public.support_tickets
  add column if not exists contact_phone text;
alter table public.support_tickets
  add column if not exists message text;
