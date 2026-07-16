import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refresca la sesión de Supabase en cada request y propaga las cookies
 * actualizadas tanto al request entrante (para Server Components aguas abajo)
 * como a la respuesta saliente (para el navegador).
 *
 * Devuelve la respuesta y el usuario resuelto para que el middleware raíz
 * pueda combinar esto con la resolución de tenant y las reglas de protección
 * de rutas sin crear el cliente dos veces.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: Awaited<ReturnType<ReturnType<typeof createServerClient<Database>>['auth']['getUser']>>['data']['user'];
}> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa tu .env.',
    );
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // No ejecutar lógica entre createServerClient y getUser: getUser revalida
  // el token con el servidor de Auth y, de paso, refresca las cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
