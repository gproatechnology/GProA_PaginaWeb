# SaIyDD - Sistema de Aprendizaje Inclusivo

> Demo educativa infantil segura y estimulante para preescolar y escolar temprana, integrada dentro del ecosistema GProA Technology.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- Navegador moderno

### Desarrollo local

```bash
cd proyectos/saiydd/demo
npm install
npm run dev
```

Luego abrir `http://localhost:5174`.

### Build de producción

```bash
npm run build
```

## 📁 Estructura del módulo

```
proyectos/saiydd/
├── SDD_SaIyDD.md                 # Documento de Diseño de Software
├── README.md                     # Esta documentación
└── demo/
    ├── index.html                # Entry point
    ├── package.json
    ├── vite.config.js
    ├── dist/                     # Build de producción
    └── src/
        ├── css/
        │   ├── styles.css
        │   ├── variables.css
        │   └── modules/
        │       └── screens.css
        ├── js/
        │   ├── main.js
        │   ├── modules/
        │   │   ├── app.js
        │   │   ├── bienvenida.js
        │   │   ├── menu.js
        │   │   ├── chatbot.js
        │   │   ├── dashboard.js
        │   │   ├── juego.js
        │   │   ├── mascota.js
        │   │   ├── voz.js
        │   │   └── api.js
        │   └── data/
        │       └── data.js
        └── assets/
            ├── images/
            └── audio/
```

## 🧩 Módulos de lógica

| Módulo | Responsabilidad |
|--------|----------------|
| `app.js` | Router y orquestación de vistas |
| `bienvenida.js` | Selección de avatar infantil |
| `menu.js` | Menú principal con opciones gamificadas |
| `chatbot.js` | Asistente local con respuestas kid-safe |
| `juego.js` | Motor de actividades, validación y retroalimentación |
| `mascota.js` | TTS (Web Speech API) y expresiones del avatar guía |
| `voz.js` | Reconocimiento de voz limitado (Web Speech API) |
| `dashboard.js` | Panel de progreso para padres/tutores |
| `api.js` | Capa mock API preparada para conexión backend |

## 🛡️ Seguridad y guardrails

- No se recopila información personal del menor en la demo.
- Respuestas preaprobadas; no hay generación libre de contenido.
- Rate limiting sugerido en futuro backend: máximo 10 interacciones/minuto.
- Cumplimiento COPPA/GDPR-K en fase demo.

## 📋 Próximos pasos

- Agregar assets de audio reales en `src/assets/audio/`.
- Pruebas de accesibilidad: navegación por teclado, contraste WCAG AA.
- Pruebas de seguridad: listas blancas, rate limiting, manejo de errores.
- Conexión al backend cuando se defina API segura.
