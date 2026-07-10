# API Contract - GECRAI Demo / Backend

Objetivo: este documento define la interfaz esperada para reemplazar el modo mock actual por un backend real sin tocar la UI de la demo.

## Base URL
- Desarrollo: `/api`
- Producción: `https://gproatechnology.com/api`

## Modo mock actual
- `proyectos/gecrai/demo/data.js` expone funciones síncronas que usan arrays en memoria.
- El frontend consume directamente:
  - `getRecentActivity()`
  - `getUsageByNorm()`
  - `generateMemory({ normativa, voltaje, corriente, proyecto, tag, resultado })`
  - `getMemories()`
  - `getDashboardMetrics()`
- `calculo.js` es puro y no depende de red ni DOM; se mantiene igual.

## Endpoints objetivo

### POST /api/memorias
Crea una memoria de cálculo.

Request:
- `normativa`: string
- `voltaje`: number
- `corriente`: number
- `proyecto`: string
- `tag`: string
- `resultado`: object

Response:
- `id`: string | number
- `normativa`: string
- `voltaje`: number
- `corriente`: number
- `potencia`: number
- `fecha`: ISO string
- `proyecto`: string
- `tag`: string
- `resultado`: object

### GET /api/memorias
Lista memorias ordenadas por fecha descendente.

Response: array de memoria

### GET /api/metrics/dashboard
Métricas de dashboard.

Response:
- `dashConsultas`: number
- `dashMemorias`: number
- `dashTopNorm`: string
- `dashTime`: ISO string | null

### POST /api/calcular/nom-001
Calcula memoria NOM-001 con parámetros de entrada.

Request bodies iguales a `getWizardParams()` en el frontend.

Response: igual a `calcularMemoriaCompleta()` del frontend.

## Criterio de migración
1. Implementar endpoints en backend real
2. Reemplazar `data.js` por `api.js` llamando a estos endpoints
3. No modificar `index.html`, `calculo.js`, estilos ni módulos de navegación
4. Mantener mismos nombres de funciones y misma forma de respuesta
