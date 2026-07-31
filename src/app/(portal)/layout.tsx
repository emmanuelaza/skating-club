import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
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
  const clubName = tenant?.name ?? 'Grandes Paisas';
  const userName = profile.full_name ?? profile.email;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-card px-4">
        {/* El logo funciona como salida al sitio público */}
        <Link
          href="/"
          prefetch
          aria-label={`${clubName} — ir al sitio público`}
          className="group flex min-w-0 items-center gap-2"
        >
          <span className="relative size-7 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-[#0A0A0A] transition-colors group-hover:border-primary">
            <Image src="/logo.png" alt="" fill sizes="28px" className="object-cover" />
          </span>
          <span className="truncate font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {clubName}
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden max-w-[160px] truncate text-sm text-muted-foreground sm:inline">
            {userName}
          </span>
          <Link
            href="/"
            prefetch
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Volver al sitio
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      <PortalNav />
    </div>
  );
}
