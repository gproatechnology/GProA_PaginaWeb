import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: ['assets', 'proyectos'],
  server: {
    port: 5173,
    open: true
  }
});
