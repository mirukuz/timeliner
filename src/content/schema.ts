import { z } from 'zod';

export const daySchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  photos: z.array(z.string()).optional(),
});
