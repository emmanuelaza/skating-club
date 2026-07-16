import { requireRole } from '@/lib/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { STAFF_ROLES } from '@/lib/roles';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import type { UserRole } from '@/types/database';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super admin',
  tenant_admin: 'Administrador',
  instructor: 'Instructor',
  member: 'Miembro',
};

/**
 * Layout del panel de gestión. `requireRole` protege el acceso (staff) y
 * devuelve el perfil; el resto del chrome (sidebar/header) vive en
 * DashboardShell. Defensa en profundidad junto al middleware.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(STAFF_ROLES);
  const tenant = await getCurrentTenant();

  return (
    <DashboardShell
      clubName={tenant?.name ?? 'Skating Club'}
      userName={profile.full_name ?? profile.email}
      roleLabel={ROLE_LABELS[profile.role]}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardShell>
  );
}
