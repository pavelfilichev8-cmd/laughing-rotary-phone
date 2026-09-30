import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Render serves the app from the domain root.
  base: '/',
  preview: {
    allowedHosts: ['demontazh-metall-invest.onrender.com'],
  },
  build: {
    sourcemap: true,
  },
});
