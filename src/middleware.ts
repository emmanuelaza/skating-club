import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getSubdomainFromHost } from '@/lib/tenant-host';
import { isStaffRole, homePathForRole } from '@/lib/roles';
import type { Database, UserRole } from '@/types/database';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Prefijos de rutas públicas (no requieren sesión). */
const PUBLIC_PREFIXES = ['/nosotros', '/clases', '/planes', '/contacto', '/blog', '/tienda'];
/** Rutas de autenticación: públicas, pero un usuario autenticado se redirige fuera. */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname === '/callback') return true;
  if (AUTH_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Middleware raíz:
 *  1. Refresca la sesión de Supabase en cada request.
 *  2. Resuelve la sede por host y la expone en la cabecera `x-tenant-id`.
 *  3. Protege /dashboard/** (staff) y /portal/** (member) por rol.
 *  4. Redirige `/` y las rutas de auth al destino correcto según el rol.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  // Cliente bound al request; reescribe cookies de sesión en `cookieJar`.
  const cookieJar: CookieToSet[] = [];
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        cookieJar.push(...cookiesToSet);
      },
    },
  });

  // Revalida el token y refresca la sesión.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolución de tenant por subdominio (lectura pública de sedes activas).
  const host = request.headers.get('host') ?? '';
  const subdomain = getSubdomainFromHost(host);
  let tenantIdToSet: string | null = null;

  if (subdomain) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', subdomain)
      .eq('is_active', true)
      .maybeSingle<{ id: string }>();
    if (tenant) {
      tenantIdToSet = tenant.id;
    }
  }

  // Fallback si es localhost o dominio de Vercel sin subdominio personalizado
  if (!tenantIdToSet && host) {
    const hostname = host.split(':')[0]?.toLowerCase() ?? '';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercel = hostname.endsWith('.vercel.app');

    if (isLocalhost || isVercel) {
      const { data: firstTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle<{ id: string }>();
      if (firstTenant) {
        tenantIdToSet = firstTenant.id;
      }
    }
  }

  if (tenantIdToSet) {
    requestHeaders.set('x-tenant-id', tenantIdToSet);
  }

  // Rol del usuario (solo si hay sesión y la ruta lo necesita).
  const needsRole =
    user !== null &&
    (pathname === '/' ||
      AUTH_ROUTES.includes(pathname) ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/portal'));

  let role: UserRole | null = null;
  if (needsRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', user.id)
      .maybeSingle<{ role: UserRole }>();
    role = profile?.role ?? null;
  }

  // Construye la respuesta final propagando cookies de sesión y x-tenant-id.
  const finalize = (response: NextResponse): NextResponse => {
    for (const { name, value, options } of cookieJar) {
      response.cookies.set(name, value, options);
    }
    return response;
  };
  const redirectTo = (path: string): NextResponse =>
    finalize(NextResponse.redirect(new URL(path, request.url)));
  const next = (): NextResponse =>
    finalize(NextResponse.next({ request: { headers: requestHeaders } }));

  // --- Reglas de acceso -------------------------------------------------------

  // /dashboard/** -> sesión + rol staff.
  if (pathname.startsWith('/dashboard')) {
    if (!user) return redirectTo('/login');
    if (!role || !isStaffRole(role)) return redirectTo('/portal');
    return next();
  }

  // /portal/** -> sesión + rol member.
  if (pathname.startsWith('/portal')) {
    if (!user) return redirectTo('/login');
    if (role !== 'member') return redirectTo('/dashboard');
    return next();
  }

  // Usuario autenticado en una ruta de auth -> a su home.
  if (user && role && AUTH_ROUTES.includes(pathname)) {
    return redirectTo(homePathForRole(role));
  }

  // Raíz: usuario autenticado -> su home; anónimo -> landing pública.
  if (pathname === '/' && user && role) {
    return redirectTo(homePathForRole(role));
  }

  // Resto: rutas públicas u otras pasan con la sesión refrescada.
  if (!isPublicPath(pathname) && !user) {
    return redirectTo('/login');
  }

  return next();
}

export const config = {
  /**
   * Excluye assets estáticos y archivos con extensión. El resto pasa por el
   * middleware para mantener viva la sesión y aplicar las reglas de acceso.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|webmanifest|txt|woff|woff2)$).*)',
  ],
};
