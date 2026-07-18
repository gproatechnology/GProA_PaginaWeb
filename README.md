# GProA Technology - Landing Page v3

> Transformando ideas en realidad digital - Innovación en desarrollo de software con IA

## 🚀 Inicio Rápido

Esta es una SPA estática construida con **Vite**. El HTML usa módulos ES (`<script type="module">`), por lo que **no** se puede abrir `index.html` directamente con `file://` (los navegadores bloquean módulos por CORS). Usá el servidor de desarrollo o el build.

```bash
# 1. Entrar al directorio
cd Pagina_web

# 2. Instalar dependencias
npm install

# 3. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 4. Build de producción -> dist/
npm run build

# 5. Previsualizar el build
npm run preview
```

> El despliegue en producción usa la carpeta `dist/`. Los archivos estáticos
> (`proyectos/`, `404.html`, `robots.txt`, `sitemap.xml`, `CNAME`) se copian
> a `dist/` mediante un plugin en `vite.config.js` (Vite no acepta múltiples
> `publicDir`, por eso se usa el plugin).

## 📋 Requisitos

- Node.js 18+ (para Vite)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción en `dist/` |
| `npm run preview` | Vista previa del build de producción |

## 📁 Estructura del Proyecto

```
Pagina_web/
├── index.html              # Landing principal (entry de Vite)
├── 404.html               # Página de error (CSS inline, autónoma)
├── robots.txt
├── sitemap.xml
├── CNAME                  # gproatechnology.com
├── vite.config.js         # Build + plugin de copia de estáticos
├── package.json
├── src/
│   ├── css/
│   │   ├── styles.css
│   │   └── modules/        # base, buttons, components, navigation, hero, ...
│   ├── js/
│   │   ├── main.js         # Entry point, inicializa módulos
│   │   ├── modules/        # navigation, hero-canvas, servicios, gartner-charts, ...
│   │   └── utils/          # focus-trap, ...
│   └── data/
│       ├── proyectos.js    # Datos de proyectos (tabs)
│       └── noticias.js      # Datos de noticias IA
├── assets/
│   ├── images/             # WebP (CEO, COO, logos, favicon)
│   └── video/             # WebM (hero-background)
└── proyectos/
    ├── gecrai/
    │   ├── demo/            # Demo enterprise GECRAI (data.js, calculo.js, api.js)
    │   └── docs/            # Manual de usuario data-driven (data.js + manual-usuario.html)
    └── glucai/
        ├── README.md        # Propuesta y estado de fases (0-4 completadas)
        ├── demo/            # Demo GlucAI (data.js, diagnostico.js, api.js) - motor KNN 33 biomarcadores
        └── docs/            # Manual de usuario data-driven (data.js + manual-usuario.html)
```

## 🎨 Características

- ✅ Landing page completa y responsiva (móvil y desktop)
- ✅ SEO optimizado (schema.org, Open Graph, Twitter Cards, sitemap, robots)
- ✅ Google Tag Manager integrado
- ✅ Animaciones (Canvas fallback + video WebM de fondo)
- ✅ Gráficas interactivas (Chart.js) - métricas Gartner
- ✅ Formulario de contacto funcional (Formspree + validación + honeypot)
- ✅ Imágenes en WebP y video en WebM (optimización)
- ✅ Demo GECRAI: login, dashboard, wizard NOM-001, cálculos y capa API
- ✅ Documentación interactiva GECRAI (tema claro/oscuro, búsqueda, TOC auto)

## 📞 Contacto

- **Email**: admin@gproatechnology.com
- **Teléfono**: +52 1 468 120 8570
- **Dirección**: San José Iturbide, Guanajuato, México

## 📄 Licencia

© 2026 GProA Technology S. de R.L. de C.V. Todos los derechos reservados.
