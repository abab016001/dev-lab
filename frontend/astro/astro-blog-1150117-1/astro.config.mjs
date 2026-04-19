// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),

  // output: "server",
  output: "static",

  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-tw"],
    routing: {
      prefixDefaultLocale: false
    }
  },

  integrations: [react()]
});