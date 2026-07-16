import { Snowflake } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { PORTAL_ROLES } from '@/lib/roles';
import { PortalNav } from '@/components/portal/PortalNav';

/**
 * Layout del portal del miembro. Mobile-first: columna centrada con header
 * superior y barra de navegación inferior. `requireRole(['member'])` protege el
 * acceso (defensa en profundidad junto al middleware).
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(PORTAL_ROLES);
  const tenant = await getCurrentTenant();
  const clubName = tenant?.name ?? 'Skating Club';
  const userName = profile.full_name ?? profile.email;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Snowflake className="size-4" aria-hidden />
          </span>
          <span className="font-display text-sm font-semibold text-foreground">{clubName}</span>
        </div>
        <span className="max-w-[55%] truncate text-sm text-muted-foreground">{userName}</span>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      <PortalNav />
    </div>
  );
}
