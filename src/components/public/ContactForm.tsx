'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check } from 'lucide-react';
import { createContactAction } from '@/lib/actions/contact';
import { contactSchema, type ContactInput } from '@/lib/validations/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactForm() {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  function onSubmit(values: ContactInput) {
    setFormError(null);
    const formData = new FormData();
    formData.set('name', values.name);
    formData.set('email', values.email);
    formData.set('phone', values.phone ?? '');
    formData.set('subject', values.subject);
    formData.set('message', values.message);
    startTransition(async () => {
      const result = await createContactAction(formData);
      if (result.ok) {
        setSent(true);
        reset();
      } else {
        setFormError(result.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-6" aria-hidden />
        </span>
        <p className="text-sm text-muted-foreground">
          Gracias por escribirnos. Te responderemos pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre</Label>
          <Input id="contact-name" {...register('name')} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Correo</Label>
          <Input id="contact-email" type="email" {...register('email')} />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Teléfono (opcional)</Label>
          <Input id="contact-phone" {...register('phone')} />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Asunto</Label>
          <Input id="contact-subject" {...register('subject')} />
          {errors.subject ? <p className="text-sm text-destructive">{errors.subject.message}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensaje</Label>
        <textarea
          id="contact-message"
          rows={5}
          className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          {...register('message')}
        />
        {errors.message ? <p className="text-sm text-destructive">{errors.message.message}</p> : null}
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Enviar mensaje
      </Button>
    </form>
  );
}
