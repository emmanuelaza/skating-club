import 'server-only';
import { unstable_cache } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSubdomainFromHost } from '@/lib/tenant-host';
import type { Tenant } from '@/types';

// Reexporta el parser puro para mantener un único punto de entrada del módulo
// de tenancy. El middleware debe importarlo desde '@/lib/tenant-host'
// directamente (este archivo es server-only).
export { getSubdomainFromHost };

/** Cookie usada para fijar la sede en desarrollo local (guarda el uuid). */
export const TENANT_COOKIE = 'tenant_id';

/** Segundos de cache de la resolución de tenant. */
const TENANT_CACHE_TTL = 300;

/**
 * Resuelve un tenant por su slug (subdominio) desde Supabase.
 * Memoizado con `unstable_cache`: la resolución de sede es de alta frecuencia
 * y baja volatilidad. Se invalida con la tag `tenant:<slug>`.
 *
 * Usa el cliente admin porque la resolución ocurre antes de cualquier sesión
 * de usuario y `tenants` es metadata de la plataforma.
 */
export async function getTenant(subdomain: string): Promise<Tenant | null> {
  if (!subdomain) return null;

  const load = unstable_cache(
    async (): Promise<Tenant | null> => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', subdomain)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        throw new Error(`Error resolviendo el tenant "${subdomain}": ${error.message}`);
      }
      return data;
    },
    ['tenant-by-subdomain', subdomain],
    { revalidate: TENANT_CACHE_TTL, tags: [`tenant:${subdomain}`] },
  );

  return load();
}

/**
 * Resuelve un tenant por su id (uuid). Usado cuando la sede se fija por cookie
 * en desarrollo local.
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  if (!id) return null;

  const load = unstable_cache(
    async (): Promise<Tenant | null> => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        throw new Error(`Error resolviendo el tenant con id "${id}": ${error.message}`);
      }
      return data;
    },
    ['tenant-by-id', id],
    { revalidate: TENANT_CACHE_TTL, tags: [`tenant:id:${id}`] },
  );

  return load();
}

/**
 * Resuelve el tenant del request actual dentro de un Server Component / Server
 * Action / Route Handler.
 *
 * Orden (según CLAUDE.md):
 * 1. Subdominio del host (`bogota.clubx.com`).
 * 2. Cookie `tenant_id` para desarrollo local.
 *
 * Devuelve null si no hay sede en contexto (p. ej. dominio raíz).
 */
export async function getCurrentTenant(): Promise<Tenant | null> {
  const host = (await headers()).get('host');
  const subdomain = getSubdomainFromHost(host);
  if (subdomain) {
    const t = await getTenant(subdomain);
    if (t) return t;
  }

  const tenantId = (await cookies()).get(TENANT_COOKIE)?.value;
  if (tenantId) {
    const t = await getTenantById(tenantId);
    if (t) return t;
  }

  // Fallback si es localhost o dominio de Vercel sin subdominio personalizado
  if (host) {
    const hostname = host.split(':')[0]?.toLowerCase() ?? '';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercel = hostname.endsWith('.vercel.app');

    if (isLocalhost || isVercel) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (data) {
        return data;
      }
    }
  }

  return null;
}

/**
 * Igual que `getCurrentTenant` pero lanza si no hay sede en contexto.
 * Usar en rutas que requieren obligatoriamente una sede resuelta.
 */
export async function requireCurrentTenant(): Promise<Tenant> {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error('No hay una sede (tenant) en el contexto de la request.');
  }
  return tenant;
}
