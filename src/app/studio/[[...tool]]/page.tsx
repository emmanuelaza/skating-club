'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/config';

/**
 * Studio embebido de Sanity en /studio. El control de acceso por rol lo aplica
 * el layout servidor (super_admin / tenant_admin). Es un componente de cliente:
 * la config se importa aquí directamente (no se pasa desde el servidor).
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
