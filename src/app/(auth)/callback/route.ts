import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { homePathForRole } from '@/lib/roles';

/**
 * Callback de OAuth y verificación de email.
 * Intercambia el `code` por una sesión y redirige al destino: el parámetro
 * `next` si viene (p. ej. flujo de reset), o la home según el rol del perfil.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const profile = await getProfile();
  const destination = profile ? homePathForRole(profile.role) : '/';
  return NextResponse.redirect(`${origin}${destination}`);
}
