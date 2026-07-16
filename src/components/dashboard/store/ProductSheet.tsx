'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createProductAction } from '@/lib/actions/store';
import { createProductSchema, type CreateProductInput } from '@/lib/validations/store';
import { QuickSheet } from '@/components/dashboard/QuickSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const textareaClass =
  'w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function NewProductForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      images: '',
      lowStockAlert: 5,
      variants: [{ name: '', sku: '', priceCop: 0, stock: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  function onSubmit(values: CreateProductInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await createProductAction(values);
      if (result.ok) {
        onDone();
        router.refresh();
      } else {
        setFormError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="product-name">Nombre</Label>
        <Input id="product-name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-category">Categoría</Label>
          <Input id="product-category" {...register('category')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-lowstock">Alerta de stock bajo</Label>
          <Input id="product-lowstock" type="number" min={0} {...register('lowStockAlert')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-description">Descripción</Label>
        <textarea id="product-description" rows={3} className={textareaClass} {...register('description')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-images">Imágenes (una URL por línea)</Label>
        <textarea id="product-images" rows={2} className={textareaClass} {...register('images')} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Variantes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', sku: '', priceCop: 0, stock: 0 })}
          >
            <Plus className="size-4" aria-hidden />
            Agregar
          </Button>
        </div>

        {errors.variants?.message ? (
          <p className="text-sm text-destructive">{errors.variants.message}</p>
        ) : null}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-md border border-border p-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Input
                    placeholder="Talla / color"
                    {...register(`variants.${index}.name`)}
                  />
                  {errors.variants?.[index]?.name ? (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.variants[index]?.name?.message}
                    </p>
                  ) : null}
                </div>
                <Input placeholder="SKU" {...register(`variants.${index}.sku`)} />
                <Input
                  type="number"
                  min={0}
                  placeholder="Precio (COP)"
                  {...register(`variants.${index}.priceCop`)}
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Stock"
                  {...register(`variants.${index}.stock`)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="flex items-center justify-center gap-1 rounded-sm border border-border text-sm text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                  aria-label="Quitar variante"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Crear producto
      </Button>
    </form>
  );
}

export function ProductSheet() {
  return (
    <QuickSheet
      triggerLabel="Nuevo producto"
      title="Nuevo producto"
      description="Crea un producto con sus variantes."
    >
      {(close) => <NewProductForm onDone={close} />}
    </QuickSheet>
  );
}
