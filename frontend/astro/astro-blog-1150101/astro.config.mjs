// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://abab016001.github.io',
  base: '/astro-blog-1150101/',
  // trailingSlash: 'always',
  build: {
    assets: 'assets'
  },
});
