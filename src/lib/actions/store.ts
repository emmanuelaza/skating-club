'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/auth';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
} from '@/lib/validations/store';
import type { ActionResult } from '@/types';

function parseImages(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      tenant_id: staff.tenant_id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      image_urls: parseImages(parsed.data.images ?? ''),
    })
    .select('id')
    .single();

  if (error || !product) {
    return { ok: false, error: 'No se pudo crear el producto.' };
  }

  // `product_variants.sku` es NOT NULL y no hay columna `name`: el nombre de la
  // variante (talla/color) se usa como SKU legible si no se especifica uno.
  const variantsPayload = parsed.data.variants.map((variant, index) => ({
    tenant_id: staff.tenant_id,
    product_id: product.id,
    sku: variant.sku || `${parsed.data.name}-${variant.name || index + 1}`.replace(/\s+/g, '-').toUpperCase(),
    size: variant.name || null,
    price_cop: variant.priceCop,
    stock: variant.stock,
    low_stock_alert: parsed.data.lowStockAlert,
  }));

  const { error: variantsError } = await supabase.from('product_variants').insert(variantsPayload);
  if (variantsError) {
    // Rollback best-effort: el producto no debe quedar sin variantes.
    await supabase.from('products').delete().eq('id', product.id);
    return { ok: false, error: 'No se pudieron crear las variantes.' };
  }

  revalidatePath('/dashboard/store');
  return { ok: true, data: undefined };
}

export async function updateProductAction(input: unknown): Promise<ActionResult> {
  await requireStaff();

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      image_urls: parseImages(parsed.data.images ?? ''),
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { ok: false, error: 'No se pudo actualizar el producto.' };
  }

  revalidatePath('/dashboard/store');
  return { ok: true, data: undefined };
}

export async function createVariantAction(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = createVariantSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('product_variants').insert({
    tenant_id: staff.tenant_id,
    product_id: parsed.data.productId,
    sku:
      parsed.data.sku ||
      `VAR-${parsed.data.name || Date.now()}`.replace(/\s+/g, '-').toUpperCase(),
    size: parsed.data.name || null,
    price_cop: parsed.data.priceCop,
    stock: parsed.data.stock,
  });

  if (error) {
    return { ok: false, error: 'No se pudo crear la variante.' };
  }

  revalidatePath('/dashboard/store');
  return { ok: true, data: undefined };
}
