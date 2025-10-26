import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env['VITE_HTTPS'] === 'true' ? 5174 : 5173,
    host: 'localhost',
    // Support for HTTPS development
    ...(process.env['VITE_HTTPS'] === 'true' && {
      https: {
        key: fs.readFileSync(path.resolve('../server/certs/server.key')),
        cert: fs.readFileSync(path.resolve('../server/certs/server.crt')),
      },
    }),
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
