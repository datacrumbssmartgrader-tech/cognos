import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        dine:  resolve(__dirname, 'dine.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
