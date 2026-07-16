'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { createPlanAction, updatePlanAction } from '@/lib/actions/memberships';
import { planFormSchema, type PlanFormInput } from '@/lib/validations/memberships';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface PlanFormData {
  id: string;
  name: string;
  description: string;
  priceCop: number;
  interval: 'month' | 'year';
  benefits: string;
}

const selectClass =
  'h-10 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function PlanForm({ plan, onDone }: { plan?: PlanFormData; onDone: () => void }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormInput>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name ?? '',
      description: plan?.description ?? '',
      priceCop: plan?.priceCop ?? 0,
      interval: plan?.interval ?? 'month',
      benefits: plan?.benefits ?? '',
    },
  });

  function onSubmit(values: PlanFormInput) {
    setFormError(null);
    const formData = new FormData();
    if (plan) formData.set('id', plan.id);
    formData.set('name', values.name);
    formData.set('description', values.description ?? '');
    formData.set('priceCop', String(values.priceCop));
    formData.set('interval', values.interval);
    formData.set('benefits', values.benefits ?? '');
    startTransition(async () => {
      const result = plan
        ? await updatePlanAction(formData)
        : await createPlanAction(formData);
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
        <Label htmlFor="plan-name">Nombre</Label>
        <Input id="plan-name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan-description">Descripción</Label>
        <Input id="plan-description" {...register('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan-price">Precio (COP)</Label>
          <Input id="plan-price" type="number" min={0} step={1000} {...register('priceCop')} />
          {errors.priceCop ? (
            <p className="text-sm text-destructive">{errors.priceCop.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan-interval">Periodicidad</Label>
          <select id="plan-interval" className={selectClass} {...register('interval')}>
            <option value="month">Mensual</option>
            <option value="year">Anual</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan-benefits">Beneficios (uno por línea)</Label>
        <textarea
          id="plan-benefits"
          rows={4}
          className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          {...register('benefits')}
        />
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {plan ? 'Guardar cambios' : 'Crear plan'}
      </Button>
    </form>
  );
}

export function PlanSheet({ plan }: { plan?: PlanFormData }) {
  const [open, setOpen] = React.useState(false);
  const isEdit = Boolean(plan);

  return (
    <>
      {isEdit ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="size-4" aria-hidden />
          Editar
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Nuevo plan
        </Button>
      )}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={isEdit ? 'Editar plan' : 'Nuevo plan'}
        description="Define el nombre, precio y beneficios del plan."
      >
        <PlanForm plan={plan} onDone={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
