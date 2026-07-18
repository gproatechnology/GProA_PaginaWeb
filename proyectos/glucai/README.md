# GlucAI 1.5 — Demo Enterprise

> Diagnóstico de glucosa en sangre a partir de química sanguínea (33 elementos) usando
> un motor KNN, presentado como una arquitectura de IA enterprise 2026 con agentes autónomos.

⚠️ **Demo funcional con datos sintéticos. No es un dispositivo médico.** El entrenamiento con
datos clínicos reales y los agentes LLM en servidor requieren infraestructura/producto aparte
(ver `api.js` como stub listo para cablear).

---

## Estado

- **Fase 0 (scaffold): COMPLETADA** — demo navegable con el mismo formato que GECRAI
  (login mock → dashboard → asistente 6 pasos → comparar → memorias → reportes).
- **Fase 1 (motor KNN): COMPLETADA** — `diagnostico.js` real (normalización z-score,
  KNN, explicabilidad) + dataset sintético (90 muestras) + `_test_knn.mjs` en verde (12/12).
- **Fase 2 (wizard + agentes + validación): COMPLETADA** — asistente 6 pasos,
  `orquestarDiagnostico()`, validación por rango clínico en tiempo real.
- **Fase 3 (modelo anatómico SVG + explicabilidad): COMPLETADA** — SVG interactivo de
  cuerpo humano (páncreas, riñones, hígado, corazón, vasos) iluminado por diagnóstico.
- **Fase 4 (docs + api stub): COMPLETADA** — `docs/manual-usuario.html` + `manual.css`
  + `data.js`, `api.js` rebrandizado a glucémico, y `docsUrl` en el landing.

---

## Idea original (propuesta aprobada — conservada para no perder la línea)

Revisado: el demo de GECRAI es **autocontenido** (`index.html` con `<style>` inline + `<script type="module">` que importa `./data.js` y `./calculo.js`), y el motor (`calculo.js`) son funciones puras testeables. Esa arquitectura es ideal para replicar.

# Propuesta: demo GlucAI (formato GECRAI)

## 1. Arquitectura espejo (no rompe nada)
Mismo patrón de carpetas y archivos, solo rebrand y diferente motor:

| GECRAI | GlucAI |
|---|---|
| `gecrai/demo/index.html` | `glucai/demo/index.html` (mismo `<style>` inline, rebrand) |
| `gecrai/demo/calculo.js` | `glucai/demo/diagnostico.js` (motor KNN puro + testeable) |
| `gecrai/demo/data.js` | `glucai/demo/data.js` (mock API + dataset sintético de 33 elementos) |
| `gecrai/demo/api.js` | `glucai/demo/api.js` (stub, `USE_API=false`) |
| `gecrai/docs/*` | `glucai/docs/*` (manual-usuario.html + manual.css + data.js) |
| `_test_*.mjs` | `_test_knn.mjs` (KNN + integración) |

Al crear `glucai/demo/` y poner `demoUrl` en `src/data/proyectos.js`, la tarjeta GlucAI del landing ya mostrará "Ver Demo" automáticamente (igual que GECRAI).

## 2. Motor KNN (`diagnostico.js`)
- **Entrada:** 33 elementos de química sanguínea (Glucosa, HbA1c, Insulina, Na, K, Cl, Ca, Mg, P, BUN, Creatinina, eGFR, ALT, AST, ALP, Bilirrubina, Proteína total, Albúmina, Colesterol, Triglicéridos, HDL, LDL, PCR, Ferritina, TSH, T4, Ácido úrico, LDH, CPK, Amilasa, Lipasa, etc.).
- **Dataset sintético** etiquetado (Normal / Prediabetes / Riesgo glucosa), generado con medias/desvíos realistas y semilla fija (determinista, para tests).
- **Funciones puras** (estilo GECRAI): `normalizar()`, `distanciaPonderada()`, `clasificarKNN()`, `explicarResultado()` (qué elementos más pesaron), `validarEntradas()` (rangos por elemento), `calcularRiesgoGlucosa()` (orquestador).
- **Normalización obligatoria** (z-score con media/de desvío del dataset) porque las escalas de los 33 elementos difieren mucho.

## 3. "Agentes autónomos 2026" (simulados, on-device)
Modelas la IA enterprise como un **pipeline de agentes**, cada uno función pura, orquestado por `orquestarDiagnostico()`:
1. **Ingestión** — parsea/normaliza los 33 valores.
2. **Validación** — rangos, valores faltantes.
3. **Clasificador KNN** — el ML.
4. **Explicabilidad** — contribución por elemento (tipo SHAP local).
5. **Reporte** — memoria legible + recomendaciones.

En la UI se ven como pasos con estado (como el wizard de GECRAI), dando la sensación agentic. **Honestidad técnica:** el demo *simula* la orquestación en el navegador; un producto real necesita backend (`api.js`), model serving y cumplimiento COFEPRIS/FDA (es dispositivo médico). Lo dejaremos claro en el manual ("demo funcional, datos sintéticos").

## 4. Modelo anatómico — respuesta a tu duda
**No es ambicioso si lo haces ligero.** Recomiendo **SVG interactivo de cuerpo humano** (silueta frontal con regiones clicables: páncreas, riñones, hígado, corazón, sistema circulatorio) que se **iluminan según el diagnóstico** (glucosa alta → resalta páncreas + cardiovascular + riñones). Es:
- sin dependencias (igual filosofía GECRAI),
- data-driven (regiones ↔ elementos de laboratorio),
- muy vistoso y coherente con el estilo.

Un **modelo 3D (Three.js + .glb)** es posible pero más pesado (assets, bundle, rendimiento) — lo dejaría como **fase opcional 2**, no como base.

## 5. UI del demo (mirror GECRAI)
Login (mock) → Dashboard (exámenes analizados, métricas) → **Asistente de diagnóstico** (wizard 6 pasos: Antecedentes + 33 elementos → Normalización → KNN → Explicabilidad → Modelo anatómico → Memoria) → Comparador de perfiles → Memorias → Reportes.

## 6. Fases sugeridas
- **Fase 0:** scaffold (copiar estructura GECRAI, rebrand, login/dashboard vacíos).
- **Fase 1:** motor KNN + dataset sintético + `_test_knn.mjs` (verde).
- **Fase 2:** wizard + pipeline de agentes + validación.
- **Fase 3:** modelo anatómico SVG + explicabilidad visual.
- **Fase 4:** docs (manual + manual.css) + `api.js` stub + push.

---

**Sobre "empresa 2026 con agentes":** lo entrego como **arquitectura agentic demostrable y creíble**, con el motor KNN real funcionando sobre datos sintéticos, y el backend listo para cablear (stub). Lo que NO será real es el entrenamiento con datos clínicos reales ni LLMs en servidor — eso requiere infra/producto aparte.

---

## Plán estructurado (YAML)

```yaml
proyecto: GlucAI
version: "1.5"
formato_base: GECRAI          # mismo patrón de demo autocontenido
estado: todas_las_fases_completadas

arquitectura:
  demo/index.html: "UI autocontenida (style inline + module script)"
  demo/diagnostico.js: "Motor KNN real (normalización z-score + clasificación + explicabilidad)"
  demo/data.js: "Mock API + dataset sintético 33 elementos"
  demo/api.js: "Stub backend (USE_API=false)"
  docs/manual-usuario.html + manual.css + data.js: "Manual data-driven (Fase 4)"

motor:
  tipo: KNN
  entrada: "33 elementos de química sanguínea"
  salida: ["Normal", "Prediabetes", "Riesgo glucosa"]
  requisitos:
    - normalizacion_zscore: obligatoria
    - dataset_sintetico_etiquetado: semilla_fija
  funciones_puras:
    - normalizar
    - distanciaPonderada
    - clasificarKNN
    - explicarResultado
    - validarEntradas
    - calcularRiesgoGlucosa
  tests: "_test_knn.mjs (12/12 OK)"

agentes_pipeline:
  - Ingestión
  - Validación
  - Clasificador_KNN
  - Explicabilidad_SHAP_local
  - Reporte
  orquestador: orquestarDiagnostico

modelo_anatomico:
  decision: SVG_interactivo   # recomendado (sin dependencias)
  regiones: [páncreas, riñones, hígado, corazón, sistema_circulatorio]
  alternativa_3D: Three.js+.glb  # fase opcional 2 (más pesado)

fases:
  - { id: 0, nombre: "scaffold", estado: completada }
  - { id: 1, nombre: "motor KNN + dataset + tests", estado: completada }
  - { id: 2, nombre: "wizard + agentes + validación", estado: completada }
  - { id: 3, nombre: "modelo anatómico SVG + explicabilidad", estado: completada }
  - { id: 4, nombre: "docs + api stub + push", estado: completada }

disclaimer: "Demo funcional con datos sintéticos. No es dispositivo médico (COFEPRIS/FDA)."
```
