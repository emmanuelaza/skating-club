import { z } from 'zod';
import { emailSchema, phoneSchema } from './common';

export const contactSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre').max(120, 'Nombre demasiado largo'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  subject: z.string().min(3, 'Ingresa un asunto').max(150, 'Asunto demasiado largo'),
  message: z.string().min(10, 'El mensaje es muy corto').max(2000, 'Mensaje demasiado largo'),
});
export type ContactInput = z.infer<typeof contactSchema>;
