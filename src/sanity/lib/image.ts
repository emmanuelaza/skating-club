import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, projectId } from '../env';

let cached: ReturnType<typeof imageUrlBuilder> | null = null;

function getBuilder(): ReturnType<typeof imageUrlBuilder> {
  if (!cached) {
    cached = imageUrlBuilder({ projectId, dataset });
  }
  return cached;
}

/** Construye URLs de imágenes de Sanity. Uso: urlFor(image).width(800).url() */
export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}
