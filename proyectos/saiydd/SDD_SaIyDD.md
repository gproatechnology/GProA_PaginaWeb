# Documento de Diseño de Software (SDD) — SaIyDD

**Proyecto:** SaIyDD (Sistema de Aprendizaje Inclusivo con IA)  
**Versión:** 1.0.0  
**Fecha:** 2026-07-22  
**Autor:** Arquitecto de Software Senior — GProA Technology  
**Estado:** Borrador inicial  

---

## 1. Resumen Ejecutivo y Objetivos del Sistema

### 1.1 Propósito
SaIyDD es una solución de inteligencia artificial diseñada específicamente para infantes en etapa preescolar y escolar temprana (4 a 8 años). Su objetivo es ofrecer una interacción segura, educativa y altamente estimulante, integrada como **demo** dentro del ecosistema existente de GProA Technology.

### 1.2 Alcance
- Interfaz web estática desplegada mediante Vite dentro de `proyectos/saiydd/demo/`.
- Módulos de aprendizaje gamificado, avatar guía y panel oculto de progreso para padres.
- Capa de datos inicial con **mock data** en memoria; preparada para conexión futura a backend seguro.

### 1.3 Objetivos específicos
- Diseñar una experiencia **kid-safe** sin exposición a contenido inapropiado.
- Implementar interacciones por voz y sonidos para usuarios con literacy emergente.
- Proveer métricas de progreso accesibles solo para tutores.
- Mantener una arquitectura modular, liviana y alineada con el stack actual del proyecto.

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Componentes Lógicos

                    ┌──────────────────────┐
                    │   index.html (Entry) │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
          ┌──────▼──────┐ ┌───▼─────┐ ┌─────▼──────┐
          │  src/css/   │ │ src/js/ │ │ src/data/  │
          │  styles.css │ │ main.js │ │            │
          └─────────────┘ └────┬────┘ │  data.js   │
                               │      │  noticias.js│
                        ┌──────▼─────▼─────────────┐
                        │   Módulos JS (ES6+)      │
                        │  ├─ mascota.js           │
                        │  ├─ juego.js             │
                        │  ├─ voz.js               │
                        │  ├─ dashboard.js         │
                        │  └─ api.js               │
                        └──────────────────────────┘

### 2.2 Estructura de carpetas propuesta

```
proyectos/
  saiydd/
    demo/
      index.html
      src/
        css/
          styles.css
          modules/
            variables.css
            mascota.css
            juego.css
            dashboard.css
        js/
          main.js
          modules/
            mascota.js
            juego.js
            voz.js
            dashboard.js
            api.js
          data/
            data.js
            noticias.js
        assets/
          images/
          audio/
          video/
      package.json
      vite.config.js
```

### 2.3 Stack tecnológico
- **Empaquetador:** Vite 5.x
- **Lenguajes:** HTML5 semántico, CSS3 (variables y módulos), Vanilla JS (ES6+ modules)
- **Frameworks:** No se utilizan frameworks pesados (sin React, Angular, Vue)
- **APIs nativas:** Web Audio API, Web Speech API, localStorage (mock backend)

---

## 3. Diseño de la Interfaz de Usuario (UI)

### 3.1 Pantallas principales

| Pantalla | Propósito | Elementos clave |
|----------|-----------|-----------------|
| **Bienvenida** | Ingreso seguro del niño con selección de avatar | Mascota animada, botones grandes, selección de avatar |
| **Mascota guía** | Navegación central con interacción por voz | Avatar reactivo, indicadores visuales de estado, onomatopeyas |
| **Juego/Aprendizaje** | Actividades educativas adaptativas | Actividades cortas (<3 min), retroalimentación inmediata, sonidos positivos |
| **Dashboard padres** | Panel oculto con métricas de progreso | Acceso por PIN/session token, gráficas simples, exportable |

### 3.2 Flujo de usuario

1. Niño accede a `proyectos/saiydd/demo/`.
2. Selecciona avatar/mascota preferida.
3. Mascota presenta opciones de actividad mediante voz + iconografía.
4. Niño selecciona mediante gesto o voz.
5. Actividad se ejecuta con límite de tiempo y retroalimentación auditiva/visual.
6. Al finalizar, se almacena progreso en `localStorage`.
7. Padre accede al panel mediante clave temporal (ej. URL con token o PIN).

### 3.3 Directrices de accesibilidad infantil
- **Botones:** Mínimo 64x64 px, bordes redondeados, contraste WCAG AA mínimo 4.5:1.
- **Tipografía:** Fuente amigable (ej. `Comic Sans MS`, `Fredoka`, o similar), tamaño base 18-24 px, interlineado amplio.
- **Paleta:** Colores cálidos de alto contraste; evitar combinaciones que produzcan fatiga visual (ej. rojo/verde puro sin contexto).
- **Audio:** Sonidos no superiores a 60 dB, posibilidad de silenciar.
- **Navegación:** Sin scroll horizontal, animaciones desactivables, tiempo de respuesta máximo 2 segundos.

---

## 4. Contrato de Datos (Data Layer)

### 4.1 Estructura de mocks (`data.js`)

```javascript
// Perfiles de niño
const childProfiles = [
  {
    id: "child_001",
    name: "Luna",
    age: 5,
    avatar: "estelar",
    preferences: { topic: "animales", difficulty: "easy" },
    createdAt: "2026-07-22T10:00:00Z"
  }
];

// Actividades educativas
const activities = [
  {
    id: "act_001",
    title: "Sonidos de la granja",
    type: "listening",
    category: "naturaleza",
    difficulty: "easy",
    durationSeconds: 120,
    prompts: ["¿Qué animal hace 'mu'?", "¿Qué animal hace 'oink'?"],
    correctIndices: [0, 1],
    audioAssets: ["cow.mp3", "pig.mp3"]
  }
];

// Sesiones de juego
const sessions = [
  {
    id: "sess_001",
    childId: "child_001",
    activityId: "act_001",
    startedAt: "2026-07-22T10:05:00Z",
    finishedAt: "2026-07-22T10:07:00Z",
    score: 80,
    interactions: [
      { promptIndex: 0, selectedIndex: 0, correct: true, responseTimeMs: 3000 }
    ]
  }
];

// Configuración de mascota
const mascotaConfig = {
  id: "masc_001",
  name: "Orion",
  voice: {
    pitch: 1.3,
    rate: 0.9,
    lang: "es-MX"
  },
  expressions: ["happy", "encourage", "neutral", "surprise"],
  animationSprites: {
    happy: "mascota_happy.webp",
    encourage: "mascota_encourage.webp"
  }
};
```

### 4.2 Endpoints API (diseño inicial para futuro backend)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/children` | Crear perfil de niño | Token de tutor |
| `GET` | `/api/v1/children/{id}` | Obtener perfil | Token de tutor |
| `GET` | `/api/v1/activities` | Listar actividades filtradas por edad/dificultad | Público (demo) |
| `POST` | `/api/v1/sessions` | Registrar sesión de juego | Token de tutor |
| `GET` | `/api/v1/progress/{childId}` | Obtener progreso agregado | Token de tutor |
| `POST` | `/api/v1/voice/interact` | Registrar interacción por voz | Token de tutor |
| `POST` | `/api/v1/auth/parent-login` | Login de padre/tutor | Credenciales |

### 4.3 Modelo de datos relacional (mock)

```
child_profiles
  ├── id (PK)
  ├── name
  ├── age
  ├── avatar
  └── preferences (JSON)

activities
  ├── id (PK)
  ├── title
  ├── type
  ├── category
  ├── difficulty
  └── assets (JSON)

sessions
  ├── id (PK)
  ├── child_id (FK)
  ├── activity_id (FK)
  ├── score
  └── interactions (JSON)

parent_tokens
  ├── token (PK)
  ├── child_id (FK)
  ├── expires_at
  └── created_by
```

---

## 5. Estrategia de Seguridad y Moderación de la IA

### 5.1 Principios Kid-Safe
- **Sin almacenamiento de información personal del niño** en servidores durante la fase demo.
- **Moderación previa y post-generación:** Todo contenido textual/visual pasa por filtros de seguridad.
- **Rate limiting estricto:** Máximo 10 interacciones por minuto para evitar sobrecarga o conductas repetitivas.
- **Logs locales únicamente:** No se envían logs con PII a servicios de terceros.

### 5.2 Guardrails técnicos

| Capa | Implementación |
|------|----------------|
| **Input** | Web Speech API con `continuous=false` y `interimResults=false` para limitar exposición de audio. |
| **Procesamiento** | Lista blanca de respuestas esperadas por actividad; rechazo cualquier respuesta fuera del dominio educativo. |
| **Output** | Respuestas generadas desde catálogo pre-aprobado; no se permite generación libre o streaming. |
| **Validación** | Regex y lista negra de palabras prohibidas; longitud máxima estricta en entradas de texto. |

### 5.3 Cumplimiento normativo (fase demo)
- **COPPA (children's online privacy):** No se recopila información personal del menor sin consentimiento verificable.
- **GDPR-K (EU):** Derecho al olvido implementado vía botón de borrado local.
- **Accesibilidad:** WCAG 2.1 AA adaptable a niños.

---

## 6. Plan de Implementación Paso a Paso

### Fase 0 — Estructura base (Día 1)
1. Crear carpetas: `demo/`, `src/css/modules/`, `src/js/modules/`, `src/js/data/`, `src/assets/audio/`.
2. Inicializar `package.json` con dependencias mínimas (Vite).
3. Configurar `vite.config.js` copiando la estructura de GProA Technology.
4. Crear `index.html` semántico con secciones: Bienvenida, Mascota, Juego, Dashboard (oculto).

### Fase 1 — Variables y base CSS (Día 2)
1. Definir `variables.css` con paleta kid-safe, espaciados, tipografía.
2. Estructurar `styles.css` con resets y layout base.
3. Implementar estilos de navegación accesible (focus visible, alto contraste).

### Fase 2 — Data layer (Día 3)
1. Crear `src/js/data/data.js` con mocks de `childProfiles`, `activities`, `sessions`.
2. Crear `src/js/modules/api.js` con funciones mock (`getProfile`, `saveSession`, `getActivities`).
3. Implementar almacenamiento en `localStorage` como respaldo.

### Fase 3 — Módulos de lógica (Día 4)
1. `mascota.js`: Sistema de expresiones, TTS (Web Speech API), animaciones básicas.
2. `juego.js`: Motor de actividades, validación de respuestas, feedback auditivo.
3. `voz.js`: Manejo de reconocimiento de voz (Web Speech API) con comandos limitados.
4. `dashboard.js`: Panel de padres con PIN, gráficas de progreso.

### Fase 4 — Integración y testing (Día 5)
1. `main.js`: Inicialización modular en orden correcto.
2. Pruebas de accesibilidad: navegación por teclado, contraste, tiempos de respuesta.
3. Pruebas de seguridad: listas blancas, rate limiting, manejo de errores.
4. Validación en navegadores objetivo (Chrome, Edge, Safari).

### Fase 5 — Documentación y deployment (Día 6)
1. README.md local con instrucciones de ejecución (`npm run dev`).
2. Actualizar `proyectos/saiydd/` con `demo/` completa funcional.
3. Actualizar `src/data/proyectos.js` con `demoUrl` apuntando a `./proyectos/saiydd/demo/`.

---

## 7. Referencias y Estándares

- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **COPPA:** https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

*Fin del documento*