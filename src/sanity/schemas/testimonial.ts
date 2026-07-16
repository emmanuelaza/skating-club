import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'text', title: 'Texto', type: 'text', rows: 4 }),
    defineField({ name: 'plan', title: 'Plan', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
});
