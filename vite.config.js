import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const path = require('path');

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '$$': path.resolve(__dirname, './node_modules'),
    },
  },
  build: {
    emptyOutDir: false,
  },
  css: {
    modules: {
      scopeBehaviour: 'global',
    },
    preprocessorOptions: {
      scss: { 
        additionalData: 
          `@use '@/scss/breakpoints';
          @import "@/scss/variables";`,
      },
    },
  },
});
