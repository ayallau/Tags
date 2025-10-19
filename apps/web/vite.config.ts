import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@models': fileURLToPath(new URL('../../packages/models/src', import.meta.url)),
      '@api': fileURLToPath(new URL('../../packages/api/src', import.meta.url)),
      '@config': fileURLToPath(new URL('../../packages/config/src', import.meta.url)),
    },
  },
});
