import { z } from 'zod';
import { uuidSchema } from './common';

export const variantSchema = z.object({
  name: z.string().min(1, 'Requerido').max(60, 'Demasiado largo'),
  sku: z.string().max(40, 'SKU demasiado largo').optional().or(z.literal('')),
  /** Precio en pesos (COP). Se almacena en centavos. */
  priceCop: z.coerce.number().int('Precio inválido').min(0, 'Precio inválido'),
  stock: z.coerce.number().int('Stock inválido').min(0, 'Stock inválido'),
});
export type VariantInput = z.infer<typeof variantSchema>;

export const createProductSchema = z.object({
  name: z.string().min(2, 'Nombre requerido').max(100, 'Nombre demasiado largo'),
  description: z.string().max(500, 'Descripción demasiado larga').optional().or(z.literal('')),
  category: z.string().max(60, 'Categoría demasiado larga').optional().or(z.literal('')),
  /** URLs de imágenes, una por línea. */
  images: z.string().optional().or(z.literal('')),
  lowStockAlert: z.coerce.number().int().min(0).default(5),
  variants: z.array(variantSchema).min(1, 'Agrega al menos una variante'),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: uuidSchema,
  name: z.string().min(2, 'Nombre requerido').max(100, 'Nombre demasiado largo'),
  description: z.string().max(500).optional().or(z.literal('')),
  category: z.string().max(60).optional().or(z.literal('')),
  images: z.string().optional().or(z.literal('')),
  lowStockAlert: z.coerce.number().int().min(0),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const createVariantSchema = variantSchema.extend({ productId: uuidSchema });
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
