import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  root: 'playground',
  resolve: {
    alias: {
      'calcom-vue': resolve(__dirname, 'src/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
