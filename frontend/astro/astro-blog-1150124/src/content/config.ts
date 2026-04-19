import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const products = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/products'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
  })
});

export const collections = { products }