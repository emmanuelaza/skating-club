import type { UserRole } from '@/types/database';

/**
 * Agrupaciones de roles, sin dependencias de servidor (seguras para el
 * middleware en Edge).
 *
 * Enum en producción: super_admin | tenant_admin | instructor | member.
 */

/** Roles con acceso al panel de gestión (/dashboard). */
export const STAFF_ROLES: readonly UserRole[] = ['super_admin', 'tenant_admin', 'instructor'];

/** Roles administradores de sede (gestión completa). */
export const ADMIN_ROLES: readonly UserRole[] = ['super_admin', 'tenant_admin'];

/** Roles con acceso al portal del miembro (/portal). */
export const PORTAL_ROLES: readonly UserRole[] = ['member'];

/** True si el rol pertenece al staff (acceso a /dashboard). */
export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

/** Ruta de inicio según el rol: staff -> /dashboard, member -> /portal. */
export function homePathForRole(role: UserRole): '/dashboard' | '/portal' {
  return role === 'member' ? '/portal' : '/dashboard';
}
