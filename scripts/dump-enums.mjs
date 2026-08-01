/** Vuelca los valores reales de cada enum de Postgres desde la spec OpenAPI. */
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
const spec = await res.json();

const enums = new Map();
for (const [table, def] of Object.entries(spec.definitions ?? {})) {
  for (const [col, p] of Object.entries(def.properties ?? {})) {
    if (Array.isArray(p.enum)) {
      const key = typeof p.format === 'string' && p.format.includes('.') ? p.format : `${table}.${col}`;
      if (!enums.has(key)) enums.set(key, { values: p.enum, seen: [] });
      enums.get(key).seen.push(`${table}.${col}`);
    }
  }
}

for (const [name, { values, seen }] of [...enums].sort()) {
  console.log(`${name}`);
  console.log(`   values: ${JSON.stringify(values)}`);
  console.log(`   used in: ${seen.join(', ')}\n`);
}
