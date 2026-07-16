import { defineType, defineField } from 'sanity';

export const classType = defineType({
  name: 'classType',
  title: 'Tipo de clase',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'level',
      title: 'Nivel',
      type: 'string',
      options: {
        list: [
          { title: 'Principiante', value: 'principiante' },
          { title: 'Intermedio', value: 'intermedio' },
          { title: 'Avanzado', value: 'avanzado' },
          { title: 'Todos los niveles', value: 'todos' },
        ],
      },
    }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'color', title: 'Color (hex)', type: 'string' }),
    defineField({ name: 'durationMinutes', title: 'Duración (min)', type: 'number' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
});
