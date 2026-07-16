'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { House, Calendar, ShoppingBag, CreditCard, User, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortalNavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
}

const ITEMS: PortalNavItem[] = [
  { href: '/portal' as Route, label: 'Inicio', icon: House },
  { href: '/portal/classes' as Route, label: 'Clases', icon: Calendar },
  { href: '/portal/store' as Route, label: 'Tienda', icon: ShoppingBag },
  { href: '/portal/membership' as Route, label: 'Membresía', icon: CreditCard },
  { href: '/portal/account' as Route, label: 'Cuenta', icon: User },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const path = href as string;
          const active = path === '/portal' ? pathname === '/portal' : pathname.startsWith(path);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
