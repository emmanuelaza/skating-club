import { z } from 'zod';
import { emailSchema } from './common';

/**
 * Esquemas de autenticación. Compartidos entre los formularios (react-hook-form)
 * y las Server Actions para validar en cliente y servidor con las mismas reglas.
 */

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Ingresa tu nombre completo').max(120, 'Nombre demasiado largo'),
    email: emailSchema,
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const resetPasswordSchema = z.object({
  email: emailSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
