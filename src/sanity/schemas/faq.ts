import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Pregunta', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'answer', title: 'Respuesta', type: 'text', rows: 4 }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Planes', value: 'planes' },
          { title: 'Clases', value: 'clases' },
          { title: 'Pagos', value: 'pagos' },
        ],
      },
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
});
