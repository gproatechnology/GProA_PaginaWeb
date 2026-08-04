import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const EXTRA_STATIC = [
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'CNAME',
  'proyectos',
  'clientes',
  'favicon.ico',
  'assets/fontawesome',
  'assets/chartjs',
  'assets/video',
  // Imágenes con nombre estable para OG/Twitter/favicon/apple-touch
  // (Vite hashea los assets referenciados en HTML, así que estas rutas
  //  no existirían en producción si solo usáramos las hasheadas).
  'assets/images/logoweb.webp',
  'assets/images/favicon.webp'
];

function copyExtraStatic() {
  return {
    name: 'copy-extra-static',
    apply: 'build',
    closeBundle() {
      for (const entry of EXTRA_STATIC) {
        const src = path.join(rootDir, entry);
        if (!fs.existsSync(src)) continue;
        const dest = path.join(rootDir, 'dist', entry);
        fs.cpSync(src, dest, {
          recursive: true,
          // Excluye scripts de prueba (*.mjs) del build de producción.
          filter: (src) => !src.toLowerCase().endsWith('.mjs')
        });
      }
    }
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [copyExtraStatic()],
  server: {
    port: 5173,
    open: true
  }
});
