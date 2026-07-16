import { defineType, defineField } from 'sanity';

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre del club', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contacto',
      type: 'object',
      fields: [
        defineField({ name: 'email', title: 'Correo', type: 'string' }),
        defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
        defineField({ name: 'address', title: 'Dirección', type: 'string' }),
      ],
    }),
  ],
});
