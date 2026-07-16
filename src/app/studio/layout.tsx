import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { ADMIN_ROLES } from '@/lib/roles';

export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/** Restringe el Studio embebido a super_admin / tenant_admin. */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  await requireRole(ADMIN_ROLES);
  return <>{children}</>;
}
