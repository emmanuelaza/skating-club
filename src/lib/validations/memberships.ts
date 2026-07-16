import { z } from 'zod';
import { uuidSchema } from './common';

export const planFormSchema = z.object({
  name: z.string().min(2, 'Nombre requerido').max(80, 'Nombre demasiado largo'),
  description: z.string().max(300, 'Descripción demasiado larga').optional().or(z.literal('')),
  /** Precio en pesos (COP). Se almacena en centavos. */
  priceCop: z.coerce.number().int('Precio inválido').min(0, 'Precio inválido'),
  interval: z.enum(['month', 'year']),
  /** Beneficios, uno por línea. */
  benefits: z.string().optional().or(z.literal('')),
});
export type PlanFormInput = z.infer<typeof planFormSchema>;

export const updatePlanSchema = planFormSchema.extend({ id: uuidSchema });
