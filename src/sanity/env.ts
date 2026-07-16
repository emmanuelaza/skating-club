/**
 * Configuración de Sanity leída de variables de entorno (sin lanzar errores en
 * import, para no romper el build/studio cuando aún no hay credenciales).
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
