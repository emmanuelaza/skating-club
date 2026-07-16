import { z } from 'zod';
import { phoneSchema } from './common';

export const updateOwnProfileSchema = z.object({
  fullName: z.string().min(2, 'Ingresa tu nombre completo').max(120, 'Nombre demasiado largo'),
  phone: phoneSchema.optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
});
export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
