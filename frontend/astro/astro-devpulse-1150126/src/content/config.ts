import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const techs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/techs' }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['learning', 'mastered', 'wishlist']),
    icon: z.string()
  })
})

export const collections = { techs }