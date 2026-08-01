/**
 * Genera src/types/database.ts a partir del esquema REAL de Supabase.
 *
 * Lee la spec OpenAPI de PostgREST (nombres de columna, tipos, nullability,
 * defaults y valores de enum) y escribe el archivo de tipos. Es la única forma
 * de garantizar que los tipos coincidan 1:1 con la base de datos.
 *
 * Uso: node scripts/gen-database-types.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

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
if (!url || !key) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');

const spec = await (
  await fetch(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
).json();

const defs = spec.definitions ?? {};

/* ── Vistas: no tienen PK real ni required; PostgREST las expone igual ── */
const VIEWS = new Set(['class_availability', 'loyalty_balance']);

/* ── Enums ── */
const enums = new Map(); // pgName -> values
for (const def of Object.values(defs)) {
  for (const p of Object.values(def.properties ?? {})) {
    if (Array.isArray(p.enum) && typeof p.format === 'string' && p.format.includes('.')) {
      enums.set(p.format.replace(/^public\./, ''), p.enum);
    }
  }
}

const pascal = (s) => s.replace(/(^|_)([a-z])/g, (_, __, c) => c.toUpperCase());

function tsType(prop) {
  if (Array.isArray(prop.enum)) {
    const pg = typeof prop.format === 'string' ? prop.format.replace(/^public\./, '') : null;
    if (pg && enums.has(pg)) return pascal(pg);
    return prop.enum.map((v) => `'${v}'`).join(' | ');
  }
  const f = prop.format ?? '';
  if (f === 'jsonb' || f === 'json') return 'Json';
  if (/^(integer|bigint|smallint|numeric|real|double precision)$/.test(f)) return 'number';
  if (f === 'boolean') return 'boolean';
  if (f.startsWith('timestamp') || f === 'date' || f === 'time' || f === 'uuid' || f === 'text')
    return 'string';
  if (prop.type === 'integer' || prop.type === 'number') return 'number';
  if (prop.type === 'boolean') return 'boolean';
  if (prop.type === 'array') return 'Json';
  return 'string';
}

const lines = [];
lines.push(`/**
 * Tipos de la base de datos — GENERADO, no editar a mano.
 *
 * Reflejan 1:1 el esquema real de Supabase. Para regenerar tras un cambio de
 * esquema (o si aparece un error "column X does not exist"):
 *
 *   node scripts/gen-database-types.mjs
 *
 * Nota de invariante: \`profiles.id\` es un uuid propio; \`profiles.auth_user_id\`
 * (uuid, nullable) referencia a auth.users. \`profiles\` NO tiene columna
 * \`email\`: el correo vive en auth.users.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
`);

/* ── Tipos de enum ── */
for (const [name, values] of [...enums].sort()) {
  lines.push(`export type ${pascal(name)} = ${values.map((v) => `'${v}'`).join(' | ')};`);
}
lines.push('');

const tableNames = Object.keys(defs)
  .filter((t) => !VIEWS.has(t))
  .sort();
const viewNames = Object.keys(defs)
  .filter((t) => VIEWS.has(t))
  .sort();

lines.push('export interface Database {');
lines.push('  public: {');
lines.push('    Tables: {');

for (const table of tableNames) {
  const def = defs[table];
  const props = Object.entries(def.properties ?? {});
  const required = new Set(def.required ?? []);

  const rowField = ([name, p]) => {
    const t = tsType(p);
    return `          ${name}: ${t}${required.has(name) ? '' : ' | null'};`;
  };
  // Insert: opcional si es nullable, tiene default, o es PK.
  const insertField = ([name, p]) => {
    const t = tsType(p);
    const isPk = /Primary Key/i.test(p.description ?? '');
    const hasDefault = p.default !== undefined;
    const optional = !required.has(name) || hasDefault || isPk;
    return `          ${name}${optional ? '?' : ''}: ${t}${required.has(name) ? '' : ' | null'};`;
  };
  const updateField = ([name, p]) => {
    const t = tsType(p);
    return `          ${name}?: ${t}${required.has(name) ? '' : ' | null'};`;
  };

  lines.push(`      ${table}: {`);
  lines.push('        Row: {');
  props.forEach((e) => lines.push(rowField(e)));
  lines.push('        };');
  lines.push('        Insert: {');
  props.forEach((e) => lines.push(insertField(e)));
  lines.push('        };');
  lines.push('        Update: {');
  props.forEach((e) => lines.push(updateField(e)));
  lines.push('        };');
  lines.push('        Relationships: [];');
  lines.push('      };');
}

lines.push('    };');
lines.push('    Views: {');
for (const view of viewNames) {
  const props = Object.entries(defs[view].properties ?? {});
  lines.push(`      ${view}: {`);
  lines.push('        Row: {');
  props.forEach(([name, p]) => lines.push(`          ${name}: ${tsType(p)} | null;`));
  lines.push('        };');
  lines.push('        Relationships: [];');
  lines.push('      };');
}
lines.push('    };');

lines.push(`    Functions: {
      current_profile_id: { Args: Record<string, never>; Returns: string };
      current_tenant_id: { Args: Record<string, never>; Returns: string };
      current_user_role: { Args: Record<string, never>; Returns: UserRole };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };`);

lines.push('    Enums: {');
for (const [name] of [...enums].sort()) {
  lines.push(`      ${name}: ${pascal(name)};`);
}
lines.push('    };');
lines.push('    CompositeTypes: Record<string, never>;');
lines.push('  };');
lines.push('}');
lines.push('');
lines.push(`type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Views<T extends keyof PublicSchema['Views']> = PublicSchema['Views'][T]['Row'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
`);

writeFileSync('src/types/database.ts', lines.join('\n'), 'utf8');
console.log(`OK: ${tableNames.length} tablas, ${viewNames.length} vistas, ${enums.size} enums`);
console.log(`Tablas: ${tableNames.join(', ')}`);
