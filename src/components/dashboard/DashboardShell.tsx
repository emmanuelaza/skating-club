'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Snowflake, PanelLeft, PanelLeftClose, LogOut, Menu, X } from 'lucide-react';
import { signOutAction } from '@/lib/actions/auth';
import { Avatar } from '@/components/ui/avatar';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { SidebarNav } from './SidebarNav';
import { SEGMENT_LABELS } from './nav-items';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  clubName: string;
  userName: string;
  roleLabel: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}

function buildBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return ['Dashboard'];
  return segments.map((segment) => SEGMENT_LABELS[segment] ?? 'Detalle');
}

export function DashboardShell({
  clubName,
  userName,
  roleLabel,
  avatarUrl,
  children,
}: DashboardShellProps) {
  // `collapsed` solo aplica en escritorio; `mobileOpen` controla el drawer (<lg).
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  // En escritorio puede colapsarse; en mobile el sidebar siempre va expandido
  // (cuando se abre como drawer) para mostrar las etiquetas.
  const showCollapsed = collapsed && isDesktop;

  // Cierra el drawer al cambiar de ruta y bloquea el scroll mientras está abierto.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Backdrop del drawer (solo mobile) */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-60 flex-col border-r border-border bg-card transition-transform duration-200',
          'lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          showCollapsed ? 'lg:w-16' : 'lg:w-60',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center gap-2 border-b border-border px-4',
            showCollapsed && 'lg:justify-center lg:px-0',
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Snowflake className="size-5" aria-hidden />
          </span>
          {showCollapsed ? null : (
            <span className="truncate font-display text-sm font-semibold text-foreground">
              {clubName}
            </span>
          )}
          {/* Cerrar drawer (solo mobile) */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav collapsed={showCollapsed} />
        </div>

        <div className="border-t border-border p-3">
          <div className={cn('flex items-center gap-3', showCollapsed && 'lg:justify-center')}>
            <Avatar name={userName} src={avatarUrl} />
            {showCollapsed ? null : (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            )}
          </div>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                showCollapsed && 'lg:justify-center lg:px-0',
              )}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              {showCollapsed ? null : 'Cerrar sesión'}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 lg:px-6">
          {/* Abrir drawer (mobile) */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          {/* Colapsar sidebar (escritorio) */}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden text-muted-foreground transition-colors hover:text-foreground lg:block"
            aria-label="Alternar menú lateral"
          >
            {collapsed ? (
              <PanelLeft className="size-5" aria-hidden />
            ) : (
              <PanelLeftClose className="size-5" aria-hidden />
            )}
          </button>
          <nav aria-label="Ruta" className="flex items-center gap-2 text-sm text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb}-${index}`}>
                {index > 0 ? <span aria-hidden>/</span> : null}
                <span className={cn(index === crumbs.length - 1 && 'font-medium text-foreground')}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
