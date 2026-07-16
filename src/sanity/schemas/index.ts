import type { SchemaTypeDefinition } from 'sanity';
import { siteConfig } from './siteConfig';
import { page } from './page';
import { post } from './post';
import { classType } from './classType';
import { teamMember } from './teamMember';
import { testimonial } from './testimonial';
import { faq } from './faq';

export const schemaTypes: SchemaTypeDefinition[] = [
  siteConfig,
  page,
  post,
  classType,
  teamMember,
  testimonial,
  faq,
];
