/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  define: {
    __APP_BUILD_ID__: JSON.stringify(Date.now().toString()),
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.css')) {
            return 'assets/app.css';
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
  },
});
