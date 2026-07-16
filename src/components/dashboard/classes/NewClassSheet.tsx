'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { createClassAction } from '@/lib/actions/classes';
import { createClassSchema, type CreateClassInput } from '@/lib/validations/classes';
import { QuickSheet } from '@/components/dashboard/QuickSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Option {
  id: string;
  name: string;
}

const selectClass =
  'h-10 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function NewClassForm({
  classTypes,
  instructors,
  onDone,
}: {
  classTypes: Option[];
  instructors: Option[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassInput>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      classTypeId: classTypes[0]?.id ?? '',
      instructorId: '',
      location: '',
      capacity: 10,
      startsAt: '',
      durationMinutes: 60,
    },
  });

  function onSubmit(values: CreateClassInput) {
    setFormError(null);
    const formData = new FormData();
    formData.set('classTypeId', values.classTypeId);
    formData.set('instructorId', values.instructorId ?? '');
    formData.set('location', values.location ?? '');
    formData.set('capacity', String(values.capacity));
    formData.set('startsAt', values.startsAt);
    formData.set('durationMinutes', String(values.durationMinutes));
    startTransition(async () => {
      const result = await createClassAction(formData);
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
        <Label htmlFor="class-type">Tipo de clase</Label>
        <select id="class-type" className={selectClass} {...register('classTypeId')}>
          {classTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.classTypeId ? (
          <p className="text-sm text-destructive">{errors.classTypeId.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="class-instructor">Instructor</Label>
        <select id="class-instructor" className={selectClass} {...register('instructorId')}>
          <option value="">Sin asignar</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class-location">Sala</Label>
          <Input id="class-location" {...register('location')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="class-capacity">Capacidad</Label>
          <Input id="class-capacity" type="number" min={1} {...register('capacity')} />
          {errors.capacity ? (
            <p className="text-sm text-destructive">{errors.capacity.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class-startsAt">Fecha y hora</Label>
          <Input id="class-startsAt" type="datetime-local" {...register('startsAt')} />
          {errors.startsAt ? (
            <p className="text-sm text-destructive">{errors.startsAt.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="class-duration">Duración (min)</Label>
          <Input id="class-duration" type="number" min={15} step={15} {...register('durationMinutes')} />
          {errors.durationMinutes ? (
            <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Crear clase
      </Button>
    </form>
  );
}

export function NewClassSheet({
  classTypes,
  instructors,
}: {
  classTypes: Option[];
  instructors: Option[];
}) {
  return (
    <QuickSheet
      triggerLabel="Nueva clase"
      title="Nueva clase"
      description="Programa una clase en el calendario."
    >
      {(close) => (
        <NewClassForm classTypes={classTypes} instructors={instructors} onDone={close} />
      )}
    </QuickSheet>
  );
}
