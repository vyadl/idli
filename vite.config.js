import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('/src', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: false,
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@import "@/scss/variables";' },
    },
  },
});
