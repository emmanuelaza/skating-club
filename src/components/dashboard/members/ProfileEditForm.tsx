'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check } from 'lucide-react';
import { updateProfileAction } from '@/lib/actions/members';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/types';

export function ProfileEditForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      id: profile.id,
      fullName: profile.full_name ?? '',
      phone: profile.phone ?? '',
      documentId: profile.document_id ?? '',
      role: profile.role,
    },
  });

  function onSubmit(values: UpdateProfileInput) {
    setFormError(null);
    setSaved(false);
    const formData = new FormData();
    formData.set('id', values.id);
    formData.set('fullName', values.fullName);
    formData.set('phone', values.phone ?? '');
    formData.set('documentId', values.documentId ?? '');
    formData.set('role', values.role);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setFormError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4" noValidate>
      <input type="hidden" {...register('id')} />
      <div className="space-y-2">
        <Label htmlFor="edit-fullName">Nombre completo</Label>
        <Input id="edit-fullName" {...register('fullName')} />
        {errors.fullName ? (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-phone">Teléfono</Label>
          <Input id="edit-phone" {...register('phone')} />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-document">Documento</Label>
          <Input id="edit-document" {...register('documentId')} />
          {errors.documentId ? (
            <p className="text-sm text-destructive">{errors.documentId.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-role">Rol</Label>
        <select
          id="edit-role"
          {...register('role')}
          className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <option value="member">Miembro</option>
          <option value="instructor">Instructor</option>
          <option value="tenant_admin">Administrador</option>
          <option value="super_admin">Super admin</option>
        </select>
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Guardar cambios
        </Button>
        {saved ? (
          <span className="flex items-center gap-1 text-sm text-success">
            <Check className="size-4" aria-hidden />
            Guardado
          </span>
        ) : null}
      </div>
    </form>
  );
}
