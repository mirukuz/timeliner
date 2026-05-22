import { defineCollection } from 'astro:content';
import { daySchema } from './schema';

const days = defineCollection({
  type: 'content',
  schema: daySchema,
});

export const collections = { days };
