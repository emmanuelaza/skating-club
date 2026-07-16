import { z } from 'zod';

/**
 * Esquemas zod reutilizables a lo largo de la plataforma.
 * Los formularios y Server Actions deben componer a partir de estos para
 * mantener mensajes de validación consistentes (en español).
 */

export const emailSchema = z
  .string()
  .min(1, 'El correo es obligatorio')
  .email('Correo inválido');

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{7,15}$/, 'Teléfono inválido (7 a 15 dígitos, opcional +)');

/** Cédula de ciudadanía colombiana: 6 a 10 dígitos. */
export const colombianIdSchema = z
  .string()
  .regex(/^[0-9]{6,10}$/, 'Documento inválido (6 a 10 dígitos)');

export const uuidSchema = z.string().uuid('Identificador inválido');

/** Slug de sede: minúsculas, números y guiones. */
export const slugSchema = z
  .string()
  .min(2, 'Mínimo 2 caracteres')
  .max(63, 'Máximo 63 caracteres')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;
