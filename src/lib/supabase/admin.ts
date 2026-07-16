import 'server-only';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Cliente admin de Supabase con la service_role key.
 *
 * BYPASEA RLS. Usar SOLO en servidor para operaciones de plataforma que no
 * tienen sesión de usuario: webhooks de Wompi/Treli, seed y jobs. Nunca
 * exponer al cliente ni usar para datos de un usuario autenticado.
 *
 * No persiste ni refresca sesión: es un cliente sin estado de auth.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY para el cliente admin.',
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
