/**
 * Recorre cada página del portal y del dashboard con sesiones reales y reporta
 * status HTTP y errores de columna ("column ... does not exist") en el HTML.
 *
 * Crea (si no existen) dos usuarios de prueba vía service role:
 *   - qa-admin@grandespaisas.test  (tenant_admin)
 *   - qa-member@grandespaisas.test (member)
 *
 * Uso: node scripts/verify-pages.mjs [baseUrl]   (default http://localhost:3000)
 */
import { readFileSync } from 'node:fs';

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* opcional */
  }
}
loadEnv('.env.local');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE = process.argv[2] ?? 'http://localhost:3000';
const PASSWORD = 'QaPassword!2026';

const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];

const adminHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function api(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { ...adminHeaders, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* no-json */
  }
  return { res, json, text };
}

async function getTenantId() {
  const { json: tenants } = await api(
    '/rest/v1/tenants?select=id&is_active=eq.true&order=created_at.asc&limit=1',
  );
  const tenantId = tenants?.[0]?.id;
  if (!tenantId) throw new Error('No hay tenant activo.');
  return tenantId;
}

async function ensureUser(email, role, fullName, tenantId) {
  // 1. Busca el usuario de auth por email (lista paginada).
  let authUser = null;
  for (let page = 1; page <= 10 && !authUser; page += 1) {
    const { json } = await api(`/auth/v1/admin/users?page=${page}&per_page=200`);
    const users = json?.users ?? [];
    authUser = users.find((u) => u.email === email) ?? null;
    if (users.length < 200) break;
  }
  // 2. Créalo si no existe. El trigger de la DB crea el perfil y toma
  //    tenant_id/full_name de la metadata del usuario.
  if (!authUser) {
    const { res, json } = await api('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { tenant_id: tenantId, full_name: fullName },
      }),
    });
    if (!res.ok) throw new Error(`No se pudo crear ${email}: ${JSON.stringify(json)}`);
    authUser = json;
  } else {
    // Asegura la contraseña conocida.
    await api(`/auth/v1/admin/users/${authUser.id}`, {
      method: 'PUT',
      body: JSON.stringify({ password: PASSWORD }),
    });
  }

  // 4. Perfil enlazado por auth_user_id con el rol pedido.
  const { json: profiles } = await api(
    `/rest/v1/profiles?select=id,role&auth_user_id=eq.${authUser.id}`,
  );
  if (profiles?.length) {
    if (profiles[0].role !== role) {
      await api(`/rest/v1/profiles?id=eq.${profiles[0].id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role, is_active: true }),
      });
    }
  } else {
    const { res, text } = await api('/rest/v1/profiles', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        tenant_id: tenantId,
        auth_user_id: authUser.id,
        full_name: fullName,
        role,
        is_active: true,
      }),
    });
    if (!res.ok) throw new Error(`No se pudo crear perfil ${email}: ${text}`);
  }
  return authUser;
}

async function signIn(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  const session = await res.json();
  if (!res.ok) throw new Error(`Login falló ${email}: ${JSON.stringify(session)}`);
  return session;
}

/** Serializa la sesión al formato de cookie de @supabase/ssr (base64url, chunked). */
function sessionCookies(session) {
  const name = `sb-${projectRef}-auth-token`;
  const value = `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`;
  const CHUNK = 3180;
  if (value.length <= CHUNK) return [`${name}=${value}`];
  const chunks = [];
  for (let i = 0; i * CHUNK < value.length; i += 1) {
    chunks.push(`${name}.${i}=${value.slice(i * CHUNK, (i + 1) * CHUNK)}`);
  }
  return chunks;
}

const ERROR_PATTERNS = [
  /column .+? does not exist/i,
  /relation .+? does not exist/i,
  /Application error/i,
  /Internal Server Error/i,
  /Unhandled Runtime Error/i,
];

async function checkPage(path, cookies, label) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Cookie: cookies.join('; ') },
      redirect: 'manual',
    });
    const body = res.status === 200 ? await res.text() : '';
    const problems = ERROR_PATTERNS.flatMap((re) => {
      const match = body.match(re);
      return match ? [match[0]] : [];
    });
    const location = res.headers.get('location') ?? '';
    const suffix =
      res.status >= 300 && res.status < 400
        ? ` -> ${location}`
        : problems.length
          ? `  !! ${problems.join(' | ')}`
          : '';
    console.log(
      `${problems.length || res.status >= 400 ? 'FAIL' : 'ok  '} [${label}] ${res.status} ${path}${suffix}`,
    );
    return problems.length === 0 && res.status < 400;
  } catch (error) {
    console.log(`FAIL [${label}] ERR ${path} ${error.message}`);
    return false;
  }
}

// ─── main ───
const tenantId = await getTenantId();
await ensureUser('qa-admin@grandespaisas.test', 'tenant_admin', 'QA Admin', tenantId);
await ensureUser('qa-member@grandespaisas.test', 'member', 'QA Miembro', tenantId);

const adminSession = await signIn('qa-admin@grandespaisas.test');
const memberSession = await signIn('qa-member@grandespaisas.test');
const adminCookies = sessionCookies(adminSession);
const memberCookies = sessionCookies(memberSession);

const PORTAL_PAGES = [
  '/portal',
  '/portal/classes',
  '/portal/classes/my-bookings',
  '/portal/membership',
  '/portal/store',
  '/portal/store/cart',
  '/portal/account',
];
const DASHBOARD_PAGES = [
  '/dashboard',
  '/dashboard/members',
  '/dashboard/classes',
  '/dashboard/memberships',
  '/dashboard/store',
  '/dashboard/orders',
  '/dashboard/reports',
];

let allOk = true;
console.log('— Portal (miembro) —');
for (const path of PORTAL_PAGES) {
  allOk = (await checkPage(path, memberCookies, 'member')) && allOk;
}
console.log('— Dashboard (admin) —');
for (const path of DASHBOARD_PAGES) {
  allOk = (await checkPage(path, adminCookies, 'admin')) && allOk;
}

console.log(allOk ? '\nTODO OK' : '\nHAY FALLAS');
process.exit(allOk ? 0 : 1);
