/**
 * Vuelca el esquema real de Supabase (tablas + columnas + tipos) leyendo la
 * especificación OpenAPI que expone PostgREST en /rest/v1/.
 *
 * Uso: node scripts/dump-schema.mjs [--json]
 */
import { readFileSync } from 'node:fs';

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* archivo opcional */
  }
}

loadEnv('.env.local');
loadEnv('.env');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o la llave de servicio.');
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/`, {
  headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/openapi+json' },
});

if (!res.ok) {
  console.error(`HTTP ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const spec = await res.json();
const defs = spec.definitions ?? spec.components?.schemas ?? {};

const tables = {};
for (const [table, def] of Object.entries(defs)) {
  const props = def.properties ?? {};
  tables[table] = Object.entries(props).map(([name, p]) => ({
    name,
    type: p.format ?? p.type ?? '?',
    pk: /Primary Key/i.test(p.description ?? ''),
    fk: (p.description ?? '').match(/Foreign Key to `([^`]+)`/)?.[1] ?? null,
    required: Array.isArray(def.required) && def.required.includes(name),
  }));
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(tables, null, 2));
} else {
  const names = Object.keys(tables).sort();
  console.log(`TABLAS (${names.length}): ${names.join(', ')}\n`);
  for (const t of names) {
    console.log(`== ${t}`);
    for (const c of tables[t]) {
      const flags = [c.pk ? 'PK' : null, c.fk ? `FK->${c.fk}` : null, c.required ? 'NOT NULL' : null]
        .filter(Boolean)
        .join(' ');
      console.log(`   ${c.name.padEnd(28)} ${String(c.type).padEnd(22)} ${flags}`);
    }
    console.log('');
  }
}
