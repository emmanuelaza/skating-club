import { createClient, type QueryParams, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

let cached: SanityClient | null = null;

/**
 * Cliente Sanity inicializado de forma perezosa. `createClient` lanza si
 * `projectId` está vacío, por lo que solo se construye cuando hay configuración
 * (sanityFetch protege la llamada).
 */
function getClient(): SanityClient {
  if (!cached) {
    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
    });
  }
  return cached;
}

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  /** Segundos de ISR para la cache de datos. */
  revalidate?: number;
  tags?: string[];
}

/**
 * Fetch tipado a Sanity con cache/revalidación. Devuelve null cuando Sanity no
 * está configurado (sin projectId), para degradar elegante en el sitio público.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T | null> {
  if (!projectId) return null;
  return getClient().fetch<T>(query, params, {
    next: { revalidate: tags.length > 0 ? false : revalidate, tags },
  });
}
