import { z } from 'zod';
import { uuidSchema } from './common';

export const createClassSchema = z.object({
  classTypeId: uuidSchema,
  instructorId: uuidSchema.optional().or(z.literal('')),
  location: z.string().max(120, 'Sala demasiado larga').optional().or(z.literal('')),
  capacity: z.coerce.number().int().min(1, 'Capacidad mínima de 1').max(500, 'Capacidad demasiado alta'),
  startsAt: z.string().min(1, 'Selecciona fecha y hora'),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(15, 'Duración mínima de 15 minutos')
    .max(480, 'Duración demasiado larga'),
});
export type CreateClassInput = z.infer<typeof createClassSchema>;

export const updateClassSchema = createClassSchema.extend({ id: uuidSchema });
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
