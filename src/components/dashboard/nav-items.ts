import type { Route } from 'next';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
}

/**
 * Navegación del dashboard. Los href se castean a `Route` porque algunas
 * secciones (classes/store/etc.) llegan en módulos posteriores y `typedRoutes`
 * aún no las conoce.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard' as Route, label: 'Resumen', icon: LayoutDashboard },
  { href: '/dashboard/members' as Route, label: 'Miembros', icon: Users },
  { href: '/dashboard/classes' as Route, label: 'Clases', icon: Calendar },
  { href: '/dashboard/memberships' as Route, label: 'Membresías', icon: CreditCard },
  { href: '/dashboard/store' as Route, label: 'Tienda', icon: ShoppingBag },
  { href: '/dashboard/reports' as Route, label: 'Reportes', icon: BarChart3 },
  { href: '/dashboard/announcements' as Route, label: 'Anuncios', icon: Megaphone },
  { href: '/dashboard/settings' as Route, label: 'Configuración', icon: Settings },
];

/** Etiquetas legibles por segmento de ruta, para el breadcrumb. */
export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  members: 'Miembros',
  classes: 'Clases',
  memberships: 'Membresías',
  store: 'Tienda',
  reports: 'Reportes',
  announcements: 'Anuncios',
  settings: 'Configuración',
};
