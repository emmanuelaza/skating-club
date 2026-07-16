'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

/** Navegación lateral con indicador de ruta activa. */
export function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const path = href as string;
        const active = path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(path);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              collapsed && 'justify-center px-0',
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {collapsed ? null : <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
