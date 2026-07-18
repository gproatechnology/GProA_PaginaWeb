# API Contract - GlucAI Demo / Backend

Objetivo: este documento define la interfaz esperada para reemplazar el modo mock actual por un backend real sin tocar la UI de la demo. Espejo de `proyectos/gecrai/demo/API_CONTRACT.md` pero con el dominio glucémico.

## Base URL
- Desarrollo: `/api`
- Producción: `https://gproatechnology.com/api`

## Modo mock actual
- `proyectos/glucai/demo/data.js` expone funciones síncronas que usan arrays en memoria.
- El frontend consume directamente:
  - `getRecentActivity()`
  - `getUsageByNorm()`
  - `generateMemory({ paciente, perfil, resultado })`
  - `getMemories()`
  - `getDashboardMetrics()`
- `diagnostico.js` es puro y no depende de red ni DOM; se mantiene igual.

> ⚠️ Demo funcional con datos sintéticos. No es un dispositivo médico.
> El entrenamiento con datos clínicos reales y los agentes LLM en servidor
> requieren infraestructura/producto aparte (cumplimiento COFEPRIS/FDA).

## Endpoints objetivo

### POST /api/memorias
Crea una memoria de diagnóstico glucémico.

Request:
- `paciente`: string
- `perfil`: string (Normal | Prediabetes | Riesgo glucosa)
- `resultado`: object (clasificacion, confianza, notas, explicacion, vecinos)

Response:
- `id`: string | number
- `paciente`: string
- `perfil`: string
- `fecha`: ISO string
- `resultado`: object

### GET /api/memorias
Lista memorias ordenadas por fecha descendente.

Response: array de memoria

### GET /api/metrics/dashboard
Métricas de dashboard.

Response:
- `dashExamenes`: number
- `dashDiagnosticos`: number
- `dashTopPerfil`: string
- `dashTime`: ISO string | null

### POST /api/diagnostico/knn
Calcula el diagnóstico glucémico con 33 biomarcadores de entrada.

Request: objeto con los 33 ids de `BIOMARCADORES` (glucosa, hba1c, insulina, ...).

Response: igual a `calcularRiesgoGlucosa()` del frontend.

## Criterio de migración
1. Implementar endpoints en backend real
2. Reemplazar `data.js` por `api.js` llamando a estos endpoints
3. No modificar `index.html`, `diagnostico.js`, estilos ni módulos de navegación
4. Mantener mismos nombres de funciones y misma forma de respuesta
