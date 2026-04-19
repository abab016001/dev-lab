import { defineCollection, z } from "astro:content";

export const collections = {
  'stream': defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      source: z.enum(['GitHub', 'News', 'Tech']),
      url: z.string().url(),
      tags: z.array(z.string())
    })
  })
}