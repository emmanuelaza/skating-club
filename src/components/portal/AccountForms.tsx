'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import {
  updateOwnProfileAction,
  changePasswordAction,
  deleteAccountAction,
} from '@/lib/actions/account';
import {
  updateOwnProfileSchema,
  changePasswordSchema,
  type UpdateOwnProfileInput,
  type ChangePasswordInput,
} from '@/lib/validations/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileDefaults {
  fullName: string;
  phone: string;
  dateOfBirth: string;
}

export function ProfileForm({ defaults }: { defaults: ProfileDefaults }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOwnProfileInput>({
    resolver: zodResolver(updateOwnProfileSchema),
    defaultValues: defaults,
  });

  function onSubmit(values: UpdateOwnProfileInput) {
    setFormError(null);
    setSaved(false);
    const formData = new FormData();
    formData.set('fullName', values.fullName);
    formData.set('phone', values.phone ?? '');
    formData.set('dateOfBirth', values.dateOfBirth ?? '');
    startTransition(async () => {
      const result = await updateOwnProfileAction(formData);
      if (result.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setFormError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="account-name">Nombre completo</Label>
        <Input id="account-name" {...register('fullName')} />
        {errors.fullName ? <p className="text-sm text-destructive">{errors.fullName.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-phone">Teléfono</Label>
        <Input id="account-phone" {...register('phone')} />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-dob">Fecha de nacimiento</Label>
        <Input id="account-dob" type="date" {...register('dateOfBirth')} />
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Guardar
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

export function PasswordForm() {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  function onSubmit(values: ChangePasswordInput) {
    setFormError(null);
    setSaved(false);
    const formData = new FormData();
    formData.set('password', values.password);
    formData.set('confirmPassword', values.confirmPassword);
    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (result.ok) {
        setSaved(true);
        reset();
      } else {
        setFormError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="account-password">Nueva contraseña</Label>
        <Input id="account-password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-confirm">Confirmar contraseña</Label>
        <Input
          id="account-confirm"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Cambiar contraseña
        </Button>
        {saved ? (
          <span className="flex items-center gap-1 text-sm text-success">
            <Check className="size-4" aria-hidden />
            Actualizada
          </span>
        ) : null}
      </div>
    </form>
  );
}

export function DeleteAccountButton() {
  const [confirming, setConfirming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccountAction();
      // Si tiene éxito, la acción redirige; solo llegamos aquí en error.
      if (result && !result.ok) setError(result.error);
    });
  }

  if (!confirming) {
    return (
      <Button variant="outline" className="w-full text-destructive" onClick={() => setConfirming(true)}>
        Eliminar cuenta
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-destructive/40 bg-destructive/5 p-4">
      <p className="flex items-start gap-2 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
        Esta acción desactivará tu cuenta y cerrará tu sesión. ¿Deseas continuar?
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button variant="destructive" className="flex-1" onClick={confirmDelete} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Confirmar
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => setConfirming(false)} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
