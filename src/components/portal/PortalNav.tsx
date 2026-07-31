'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { House, Calendar, ShoppingBag, CreditCard, User, Globe, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortalNavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
  /** Sale del portal hacia el sitio público: nunca se marca como activo. */
  external?: boolean;
}

const ITEMS: PortalNavItem[] = [
  { href: '/portal' as Route, label: 'Inicio', icon: House },
  { href: '/portal/classes' as Route, label: 'Clases', icon: Calendar },
  { href: '/portal/store' as Route, label: 'Tienda', icon: ShoppingBag },
  { href: '/portal/membership' as Route, label: 'Plan', icon: CreditCard },
  { href: '/portal/account' as Route, label: 'Cuenta', icon: User },
  { href: '/' as Route, label: 'Sitio', icon: Globe, external: true },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-6">
        {ITEMS.map(({ href, label, icon: Icon, external }) => {
          const path = href as string;
          const active = external
            ? false
            : path === '/portal'
              ? pathname === '/portal'
              : pathname.startsWith(path);
          return (
            <li key={href} className={cn(external && 'border-l border-border')}>
              <Link
                href={href}
                prefetch={!external}
                className={cn(
                  'flex flex-col items-center gap-1 px-0.5 py-2.5 text-[10px] font-medium leading-none transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="w-full truncate text-center">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
