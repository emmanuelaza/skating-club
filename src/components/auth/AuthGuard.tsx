import { requireRole } from '@/lib/auth';
import type { UserRole } from '@/types/database';

interface AuthGuardProps {
  allowedRoles: readonly UserRole[];
  children: React.ReactNode;
}

/**
 * Guarda de servidor por rol. Llama a `requireRole` (que redirige si no hay
 * sesión o el rol no está permitido) y solo renderiza children cuando el acceso
 * es válido. Pensado para envolver los layouts de /dashboard y /portal — defensa
 * en profundidad junto a la verificación del middleware.
 */
export async function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  await requireRole(allowedRoles);
  return <>{children}</>;
}
