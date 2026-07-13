# 📋 Informe de Auditoría - GProA Technology Landing Page

**Fecha de auditoría:** 12 de marzo de 2026 (actualizado: 09 de julio de 2026)  
**Versión del sitio:** Landing Page v3  
**Auditor:** Equipo de Desarrollo

---

## Resumen Ejecutivo

El proyecto es un sitio web corporativo bien estructurado con tecnología moderna (ES6 modules, CSS modular, Canvas animations). El código está organizado de manera profesional con una separación clara entre estructura (HTML), presentación (CSS) y funcionalidad (JavaScript).

**Puntuación estimada:**
- Performance: ~85-90/100
- Accessibility: ~90/100 ⬆️
- Best Practices: ~90/100
- SEO: ~100/100

---

## ✅ PUNTOS FUERTES

### Arquitectura y Estructura

| Aspecto | Descripción | Archivo |
|---------|-------------|---------|
| **Organización modular** | CSS y JavaScript bien separados en módulos | [`src/css/modules/`](src/css/modules/), [`src/js/modules/`](src/js/modules/) |
| **ES6 Modules** | Uso correcto de imports/exports | [`src/js/main.js:1`](src/js/main.js:1) |
| **CSS Variables** | Sistema de design tokens bien implementado | [`src/css/modules/variables.css:1`](src/css/modules/variables.css:1) |
| **SEO completo** | Schema.org, Open Graph, Twitter Cards + sitemap.xml + robots.txt | [`index.html:9-83`](index.html:9-83), [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml) |

### Accesibilidad

| Característica | Ubicación |
|----------------|-----------|
| Skip link para navegación por teclado | [`index.html:88`](index.html:88) |
| Atributos `aria-label` en botones | Buttons de navegación y redes sociales |
| `aria-expanded` en servicios | [`index.html:395`](index.html:395) |
| Labels de formulario asociados | [`index.html:891-910`](index.html:891-910) |
| Buen contraste de colores | Primary #00e0ff sobre fondo oscuro |
| Focus trap en modal | [`js/modules/org-modal.js`](js/modules/org-modal.js) |

### Funcionalidad

| Módulo | Descripción | Archivo |
|--------|-------------|---------|
| Validación de formulario | Robusta con reglas personalizables | [`src/js/modules/contact-form.js`](src/js/modules/contact-form.js) |
| Canvas animation | Animación optimizada de partículas | [`src/js/modules/hero-canvas.js`](src/js/modules/hero-canvas.js) |
| Navegación móvil | Toggle con smooth scroll + aria-expanded | [`src/js/modules/navigation.js`](src/js/modules/navigation.js) |
| Honeypot anti-spam | Protección contra spam | [`index.html:665`](index.html:665) |
| Carrusel de noticias | Filtros y navegación por puntos | [`src/js/modules/noticias-ia.js`](src/js/modules/noticias-ia.js) |
| Video fallback | Canvas se muestra solo si video falla | [`src/js/main.js`](src/js/main.js) |

---

## ✅ CORRECCIONES IMPLEMENTADAS (12 marzo 2026)

### Problemas Críticos - RESUELTOS ✅

| # | Problema | Solución | Archivo |
|---|----------|----------|---------|
| 1 | onclick en articles sin accesibilidad | Agregado `tabindex="0"`, `role="button"`, `aria-label`, `onkeydown` | index.html |
| 2 | Gráficos Gartner sin aria-label | Agregado `aria-label` descriptivo a todos los botones | index.html |
| 3 | Modal sin focus trap | Implementado focus trap + restore focus al cerrar | js/modules/org-modal.js |
| 4 | Botones demo con href="#" | Convertidos a `<button>` con `aria-disabled="true"` | index.html |

### Problemas Medios - RESUELTOS ✅

| # | Problema | Solución | Archivo |
|---|----------|----------|---------|
| 5 | Menú móvil sin aria-expanded | Agregado `aria-expanded` y `aria-label` dinámico | js/modules/navigation.js |
| 6 | Formulario sin autocomplete | Agregado `autocomplete` a todos los campos | index.html |
| 7 | Imágenes sin decoding | Agregado `decoding="async"` a imágenes CEO/COO | index.html |
| 8 | Video sin fallback | Implementado JS para mostrar canvas solo si video falla | js/main.js |

### Archivos Modificados

```
M css/modules/buttons.css      (estilos para botones deshabilitados)
M index.html                   (noticias, Gartner, formulario, botones demo)
M js/main.js                   (video fallback)
M js/modules/navigation.js     (aria-expanded menú)
M js/modules/org-modal.js       (focus trap)
```

---

## 📊 RENDIMIENTO

### Buenos prácticas implementadas ✅

| Práctica | Ubicación |
|----------|-----------|
| Preconnect a recursos externos | [`index.html:37-39`](index.html:37) |
| Video con `poster` | [`index.html:123`](index.html:123) |
| Canvas como fallback | [`index.html:130`](index.html:130) |
| CSS modular | [`css/styles.css`](css/styles.css) |
| Video fallback JS | [`js/main.js`](js/main.js) |

### Mejoras de rendimiento recomendadas

1. **Comprimir imágenes:** ✅ Hecho - fotos CEO/COO/logos en WebP, favicon en `.webp`/`.ico`.

2. **Lazy loading:** Ya implementado ✅

3. **Video codec:** ✅ Hecho - `assets/video/hero-background.webm` (WebM).

4. **Font display:** Agregar `font-display: swap` en CSS de fuentes para evitar FOIT

---

## 📋 LISTA DE VERIFICACIÓN DE CORRECCIONES

| Prioridad | Severidad | Estado | Problema |
|-----------|-----------|--------|----------|
| 1 | Crítica | ✅ RESUELTO | onclick en articles → buttons/links |
| 2 | Crítica | ✅ RESUELTO | onClick Gartner sin aria |
| 3 | Crítica | ✅ RESUELTO | Modal sin focus trap |
| 4 | Crítica | ✅ RESUELTO | Botones demo con href="#" |
| 5 | Media | ✅ RESUELTO | aria-expanded toggle |
| 6 | Media | ✅ RESUELTO | autocomplete campos |
| 7 | Media | ✅ RESUELTO | decoding="async" imágenes |
| 8 | Media | ✅ RESUELTO | Video fallback |

---

## 🏗️ RECOMENDACIONES ADICIONALES

### Corto plazo
- [x] Corregir los 4 problemas críticos de accesibilidad
- [x] Agregar atributos `loading="lazy"` a imágenes below-the-fold
- [x] Implementar `aria-expanded` en menú móvil
- [x] Video fallback implementado

### Mediano plazo
- [x] Agregar Google Analytics 4 o herramienta de analítica → ✅ Hecho con Google Tag Manager (GTM-P9MSFN8L)
- [x] Comprimir imágenes a WebP → ✅ Hecho
- [ ] Agregar pruebas automatizadas con Lighthouse CI

### Largo plazo
- [ ] Implementar PWA con manifest.json
- [ ] Agregar Core Web Vitals monitoring
- [ ] Considerar migración a Next.js para mejor SEO

---

## 📁 Archivos auditados

| Archivo | Tamaño | Líneas |
|---------|--------|--------|
| index.html | ~52 KB | ~776 |
| src/css/styles.css | ~0.75 KB | 20 (imports) |
| src/js/main.js | ~1.2 KB | ~69 |
| src/css/modules/*.css | ~20 KB total | - |
| src/js/modules/*.js | ~30 KB total | - |
| src/data/*.js | proyectos.js, noticias.js | - |
| proyectos/gecrai/demo/* | demo enterprise GECRAI | - |
| proyectos/gecrai/docs/* | manual data-driven | - |

---

## 🎯 Conclusión

El proyecto ha sido completamente corregido. Todos los problemas críticos y medios de accesibilidad han sido resueltos. La puntuación de accesibilidad ha mejorado de ~75/100 a ~90/100.

**Estado actual:**
- ✅ 4 problemas críticos corregidos
- ✅ 4 problemas medios corregidos
- ✅ Video fallback implementado
- ✅ Focus trap en modal implementado
- ✅ aria-expanded en menú móvil

**Próximos pasos:**
1. Agregar analytics para medir comportamiento de usuarios
2. Comprimir imágenes a WebP
3. Implementar PWA

---

## 🔄 Actualización de Auditoría - 09 de julio de 2026

### Problemas detectados y resueltos

| # | Sev | Problema | Solución | Archivo |
|---|-----|----------|----------|---------|
| 1 | 🔴 Crítico | `vite.config.js` usaba `publicDir: ['assets','proyectos']` (array). Vite solo acepta `string` o `false`, así que ignoraba el valor y **no copiaba** `proyectos/`, `404.html`, `robots.txt`, `sitemap.xml` ni `CNAME` a `dist/` → no se desplegaban. | Reemplazado por plugin `copyExtraStatic` que copia esos archivos en `closeBundle`. | `vite.config.js` |
| 2 | 🟠 Alto | `404.html` linkeaba `./src/css/styles.css` y `./src/js/main.js` (no desplegados) → se veía sin estilo en producción. | CSS inline (autónomo) y eliminado el `<script>` a `src/`. | `404.html` |
| 3 | 🟡 Medio | `README.md` y `AUDITORIA.md` desactualizados (rutas `css/`,`js/`, afirmaban que faltaban WebP/analytics ya hechos, y "abrir index.html" ya no funciona con módulos ES). | Actualizados a la estructura `src/` real, marcando WebP/WebM/GTM como hechos. | `README.md`, `AUDITORIA.md` |

### Pendiente conocido (fuera de este commit)
~ (sin pendientes abiertos — ver addendum 2026-07-09) ~

### Resuelto en commit 2026-07-09 (babc336 + posterior)
- `og:image`/`twitter:image`/`apple-touch-icon`/`favicon` apuntaban a `./assets/images/*.webp`, rutas que Vite hashea y no existen en producción. Ahora se copian `logoweb.webp` y `favicon.webp` con nombre estable a `dist/assets/images/` y se referencian con URL absoluta `https://gproatechnology.com/...`.
- `hero-canvas.js`: eliminado typo `this.connections` (línea muerta) y la animación ahora se pausa cuando el canvas está oculto (`offsetParent === null`), evitando trabajo de dibujo innecesario mientras se muestra el video.

### Estado de sincronización
- `origin` → `github.com/gproatechnology/GProA_PaginaWeb.git` (rama `main`).
- Commit de este ciclo: `2e35fe5` (fix de despliegue + Paso 2 docs). Cambios posteriores pendientes de commit.

---

## 🧮 Validación del motor de cálculo GECRAI - 13 de julio de 2026

Se validó `proyectos/gecrai/demo/calculo.js` contra la fuente de verdad
`proyectos/gecrai/docs/Memoria de Cálculo Rev 8.xlsx - Hoja1.csv`
(caso: motor 20 HP, 440 V, 3 fases, L=70 m, FP=0.95, FU=1.25).

### Bugs de ingeniería corregidos

| # | Sev | Problema | Corrección |
|---|-----|----------|------------|
| 1 | 🔴 | `Ipc` se calculaba por fórmula e incluía el factor de utilización → ~28.6 A en vez de los 27 A tabulados. | Implementada **Tabla 430-250 NOM-001-SEDE-2012** (`obtenerIpcTabla`); `calcularIpc` toma el valor tabulado para motores trifásicos y solo cae a la fórmula (ya sin FU) si el HP/tensión no está en tabla. |
| 2 | 🔴 | Factor `1.25` aplicado dos veces: `calcularIpc` (×FU) y luego `calcularIm` (×1.25) → Im inflado ×1.5625. | `Ipc` ya no aplica FU; `Im = Ipc × 1.25` una sola vez → 33.75 A correcto. |
| 3 | 🟠 | Interruptor con escala que incluía 25/35 A → daba 35 A en vez de 40 A. | Escala comercial estándar (…30, 40, 50…) dimensionada sobre 125% de Ipc → 40 A. |

### Resultado de la verificación numérica (caso 20 HP)

Todos los parámetros coinciden con el Excel: Ipc 27 A, Im 33.75 A, Id 33.75 A,
calibre por ampacidad 8 AWG, caída 8.136 V / 1.85 %, interruptor 3 × 40 A,
calibre a tierra 10 AWG, calibre sugerido 8 AWG. ✅

### Limitaciones conocidas (siguientes pasos)
- `compararCalibres` usa R/XL fijos de los parámetros, no los R/XL propios de cada calibre; la comparación de caída entre calibres es aproximada.
- Faltaría validar más casos (otros HP, 220 V, temperaturas ≠ 30 °C, >3 conductores) contra memorias de referencia.

---

## 🔌 Soporte monofásico / bifásico / trifásico + validación dinámica - 13 de julio de 2026

Se extendió el motor de cálculo para **motores monofásicos (1F), bifásicos 4 hilos (2F) y trifásicos (3F)** usando las Tablas de plena carga NOM-001-SEDE-2012:

| Fases | Tabla NOM | Columnas disponibles (V) |
|-------|-----------|--------------------------|
| 1F | **430-248** | 115, 200, 208, 230 |
| 2F (4 hilos) | **430-249** | 115, 230, 460, 575, 2300 |
| 3F | **430-250** | 115, 200, 208, 230, 460, 575, 2300 |

### Cambios en `calculo.js`
- Nuevas `TABLA_430_248` y `TABLA_430_249` + sus mapeos de tensión (`columnaTension430248`, `columnaTension430249`).
- Dispatcher único `obtenerIpcTabla(hp, voltaje, fases)` que elige tabla por fases.
- `calcularIpc` ahora toma valor tabulado para **las 3** configuraciones (antes solo 3F); la fórmula es fallback.
- Helpers para la UI: `voltajesDisponibles(fases)`, `hpDisponibles(fases, voltaje)`, `validarCombinacion(fases, voltaje, hp)`.
- `columnaTension430248` devuelve `null` fuera de rango (110-240 V) para rechazar tensiones inválidas en 1F (ej. 460 V no es monofásico NOM).

### Cambios en `index.html` (wizard)
- `voltaje` y `hp` pasan de inputs libres a **`<select>` poblados en cascada** según el número de fases → el usuario solo puede elegir combinaciones válidas en tabla (filtro de origen).
- Se agregó opción **Bifásico 4 hilos (2F)** en el selector de fases.
- `validarEntradas()` valida en tiempo real (al escribir/cambiar): FP ∈ (0,1], temperatura ambiente ∈ [-20,120] °C, longitud > 0, R > 0, XL ≥ 0, y que la combinación fases/tensión/HP sea tabulada. Muestra errores inline y bloquea el cálculo/guardado si hay datos incorrectos.

### Verificación (`_test_ipc.mjs`)
21/21 pruebas OK, incluyendo: 3F 20HP@440V→27 A, 1F 20HP@230V→54 A (430-248),
2F 20HP@460V→23 A (430-249), validación de rangos (1F@460V rechazado), y consistencia
Im = 125% × Ipc por fase.

---

## 🔍 Segunda auditoría (caja completa) - 13 de julio de 2026

Se corrió una verificación de memoria de caja completa (`_audit_full.mjs`, 24/24 OK) contra
la fuente de verdad y casos 1F/2F/3F, incluyendo caída de tensión, factores NOM e interruptor.

### Caso de referencia (20 HP / 440 V / 3F / L=0.07 km / FP=0.95)
| Parámetro | Valor | Estado |
|-----------|-------|--------|
| Ipc | 27 A | ✅ |
| Im = 125%·Ipc | 33.75 A | ✅ |
| Id (fc=1, ft=1) | 33.75 A | ✅ |
| Calibre por ampacidad | 8 AWG | ✅ |
| Caída de tensión | 8.14 V / 1.85 % | ✅ |
| Interruptor | 40 A (3F) | ✅ |
| Calibre a tierra | 10 AWG | ✅ |
| Calibre sugerido | 8 AWG | ✅ |

### Corrección aplicada
- **Etiqueta de polos del interruptor:** antes mostraba `2 x ... A` para 1F y 2F (ambiguio/incorrecto).
  Ahora `seleccionarInterruptor` devuelve `1F (2P)`, `2F (2P)` o `3F (3P)` según el número de fases.

### Limitaciones conocidas (no bloqueantes, propias del modelo demo)
1. **Caída de tensión con R/XL fijos:** `calcularCaidaTension` usa los `r`/`xl` que ingresa el usuario,
   no la R/XL propia del calibre seleccionado. Por eso `calibreCaida` es referencial (subir calibre no
   reduce la caída en este modelo). Para comparar calibres por caída real, usar `compararCalibres`.
2. **Tabla de ampacidad hasta 4/0 AWG (195 A):** motores muy grandes (>~150 HP a 460 V) dan
   `calibreAmpacidad = 'No encontrado'`. Ampliar `TABLA_AMPACIDAD` si se requiere.
3. **Factor de temperatura por tramos** (`obtenerFactorTemperatura`) es aproximación; ignora
   `temperaturaCable` y asume 75 °C de base.
4. **Eficiencia fija 0.9:** solo afecta el fallback por fórmula (fuera de tabla); lo tabulado no la usa.

---

*Este informe fue generado como parte del proceso de auditoría de calidad del proyecto GProA Technology Landing Page.*