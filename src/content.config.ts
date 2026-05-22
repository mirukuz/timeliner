import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { daySchema } from './content/schema';

const days = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/days' }),
  schema: daySchema,
});

export const collections = { days };
