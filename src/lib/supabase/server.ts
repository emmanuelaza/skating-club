import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Lee/escribe la sesión en cookies. Respeta RLS (usa la anon key + sesión del
 * usuario). Para operaciones privilegiadas usar el cliente admin (`./admin`).
 *
 * En Next 15 `cookies()` es asíncrono, por lo que esta función es async.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa tu .env.',
    );
  }

  const client = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` se invoca desde un Server Component donde las cookies son
          // de solo lectura. La sesión se refresca en el middleware, así que
          // este caso puede ignorarse con seguridad.
        }
      },
    },
  });

  // @supabase/ssr empaqueta una versión de supabase-js distinta a la del paquete
  // raíz; sus tipos de query infieren `never`. Puenteamos al tipo de cliente del
  // paquete raíz (que tipa correctamente) — el cliente en runtime es el mismo.
  return client as unknown as SupabaseClient<Database>;
}
