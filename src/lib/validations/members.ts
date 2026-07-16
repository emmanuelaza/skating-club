import { z } from 'zod';
import { emailSchema, phoneSchema, uuidSchema } from './common';

const roleEnum = z.enum(['super_admin', 'tenant_admin', 'instructor', 'member']);

export const createMemberSchema = z.object({
  fullName: z.string().min(2, 'Ingresa el nombre completo').max(120, 'Nombre demasiado largo'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  role: roleEnum.default('member'),
});
export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateProfileSchema = z.object({
  id: uuidSchema,
  fullName: z.string().min(2, 'Ingresa el nombre completo').max(120, 'Nombre demasiado largo'),
  phone: phoneSchema.optional().or(z.literal('')),
  documentId: z.string().max(20, 'Documento inválido').optional().or(z.literal('')),
  role: roleEnum,
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
