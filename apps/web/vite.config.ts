import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    // Support for HTTPS development
    https: process.env.VITE_HTTPS === 'true' ? {
      key: '../../apps/server/certs/server.key',
      cert: '../../apps/server/certs/server.crt',
    } : undefined,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@models': fileURLToPath(new URL('../../packages/models/src', import.meta.url)),
      '@api': fileURLToPath(new URL('../../packages/api/src', import.meta.url)),
      '@config': fileURLToPath(new URL('../../packages/config/src', import.meta.url)),
    },
  },
});
