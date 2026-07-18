import type { Metadata } from 'next';
import { StorePage } from '@/components/store/StorePage';

export const metadata: Metadata = {
  title: 'Tienda',
  description:
    'Equipamiento de patinaje de alto rendimiento — patines, protecciones, ruedas, accesorios, ropa y mantenimiento.',
};

export default function TiendaRoute() {
  return <StorePage />;
}
