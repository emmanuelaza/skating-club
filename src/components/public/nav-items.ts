import type { Route } from 'next';

export interface PublicNavItem {
  href: Route;
  label: string;
}

export const PUBLIC_NAV: PublicNavItem[] = [
  { href: '/' as Route, label: 'Inicio' },
  { href: '/nosotros' as Route, label: 'Nosotros' },
  { href: '/clases' as Route, label: 'Clases' },
  { href: '/planes' as Route, label: 'Planes' },
  { href: '/tienda' as Route, label: 'Tienda' },
  { href: '/blog' as Route, label: 'Blog' },
  { href: '/contacto' as Route, label: 'Contacto' },
];
