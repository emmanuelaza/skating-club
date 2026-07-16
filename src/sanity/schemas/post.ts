import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Entrada de blog',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Noticias', value: 'noticias' },
          { title: 'Consejos', value: 'consejos' },
          { title: 'Eventos', value: 'eventos' },
          { title: 'Comunidad', value: 'comunidad' },
        ],
      },
    }),
    defineField({ name: 'author', title: 'Autor', type: 'string' }),
    defineField({ name: 'mainImage', title: 'Imagen principal', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'excerpt', title: 'Resumen', type: 'text', rows: 3 }),
    defineField({ name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime' }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  orderings: [
    {
      title: 'Fecha (reciente primero)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
