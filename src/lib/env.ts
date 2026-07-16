import { z } from 'zod';

/**
 * Validación de variables de entorno en tiempo de arranque.
 * Falla rápido y con un mensaje claro si falta configuración crítica.
 *
 * Las variables aún sin credenciales (Wompi, Treli, Stripe, Sanity, Resend)
 * se declaran como opcionales para no romper el desarrollo local mientras
 * llegan las llaves. La capa que las consume valida su presencia en runtime.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  PAYMENT_PROVIDER: z.enum(['wompi', 'stripe']).default('wompi'),

  WOMPI_PUBLIC_KEY: z.string().optional(),
  WOMPI_PRIVATE_KEY: z.string().optional(),
  WOMPI_EVENTS_SECRET: z.string().optional(),
  WOMPI_INTEGRITY_SECRET: z.string().optional(),
  WOMPI_ENVIRONMENT: z.enum(['production', 'sandbox']).default('sandbox'),

  TRELI_API_KEY: z.string().optional(),
  TRELI_WEBHOOK_SECRET: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2024-10-01'),
  SANITY_API_READ_TOKEN: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  RESEND_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

/**
 * Devuelve el entorno validado. Lanza un error agregado y legible si la
 * configuración es inválida. Se memoiza para no revalidar en cada acceso.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Variables de entorno inválidas o faltantes:\n${issues}\n\n` +
        'Revisa tu archivo .env contra .env.example.',
    );
  }

  cached = parsed.data;
  return cached;
}
