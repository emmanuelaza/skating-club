'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { createMemberAction } from '@/lib/actions/members';
import { createMemberSchema, type CreateMemberInput } from '@/lib/validations/members';
import { QuickSheet } from '@/components/dashboard/QuickSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function NewMemberForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMemberInput>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: { fullName: '', email: '', phone: '', role: 'member' },
  });

  function onSubmit(values: CreateMemberInput) {
    setFormError(null);
    const formData = new FormData();
    formData.set('fullName', values.fullName);
    formData.set('email', values.email);
    formData.set('phone', values.phone ?? '');
    formData.set('role', values.role);
    startTransition(async () => {
      const result = await createMemberAction(formData);
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
        <Label htmlFor="member-fullName">Nombre completo</Label>
        <Input id="member-fullName" {...register('fullName')} />
        {errors.fullName ? (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="member-email">Correo</Label>
        <Input id="member-email" type="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="member-phone">Teléfono (opcional)</Label>
        <Input id="member-phone" {...register('phone')} />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="member-role">Rol</Label>
        <select
          id="member-role"
          {...register('role')}
          className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <option value="member">Miembro</option>
          <option value="instructor">Instructor</option>
          <option value="tenant_admin">Administrador</option>
        </select>
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Crear miembro
      </Button>
    </form>
  );
}

export function NewMemberSheet() {
  return (
    <QuickSheet
      triggerLabel="Nuevo miembro"
      title="Nuevo miembro"
      description="Crea el perfil de un miembro de la sede."
    >
      {(close) => <NewMemberForm onDone={close} />}
    </QuickSheet>
  );
}
