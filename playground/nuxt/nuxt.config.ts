import { defineNuxtConfig } from 'nuxt/config';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  alias: {
    'calcom-vue': fileURLToPath(new URL('../../src/index.ts', import.meta.url))
  },
  app: {
    head: {
      title: 'Cal.com Nuxt Playground',
      script: [
        { src: 'https://cdn.tailwindcss.com' }
      ]
    }
  }
});
