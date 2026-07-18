/**
 * GlucAI - Motor de diagnóstico de glucosa (Fase 1).
 *
 * Motor KNN real sobre dataset sintético de 33 elementos de química sanguínea.
 * Funciones puras testeables: normalización z-score, distancia ponderada,
 * clasificación k-NN, explicabilidad local y orquestación.
 *
 * ⚠️ Demo funcional con datos sintéticos. No es un dispositivo médico.
 */

import { BIOMARCADORES, DATASET, estadisticasDataset } from './data.js';

const STATS = estadisticasDataset();

const RANGOS = {
  glucosa: [20, 600], hba1c: [2, 15], insulina: [0, 100], sodio: [120, 160],
  potasio: [2, 7], cloro: [80, 120], calcio: [7, 12], magnesio: [1, 3],
  fosforo: [1, 6], bun: [5, 50], creatinina: [0.3, 3], egfr: [30, 150],
  alt: [5, 150], ast: [5, 150], alp: [20, 200], bilirrubina: [0.1, 3],
  proteina_total: [5, 9], albumina: [3, 5.5], colesterol: [100, 350],
  trigliceridos: [50, 400], hdl: [20, 100], ldl: [50, 250], pcr: [0.5, 20],
  ferritina: [20, 500], tsh: [0.1, 10], t4: [3, 14], acido_urico: [2, 12],
  ldh: [80, 400], cpk: [30, 400], amilasa: [20, 200], lipasa: [10, 150],
  ggt: [10, 100], homocisteina: [5, 30]
};

export function validarEntradas(valores = {}) {
    for (const b of BIOMARCADORES) {
        const v = valores[b.id];
        if (v === undefined || v === null || typeof v !== 'number' || !isFinite(v)) {
            return { valido: false, motivo: `Valor faltante o no numérico: ${b.nombre}` };
        }
        const [min, max] = RANGOS[b.id] || [0, Infinity];
        if (v < min || v > max) {
            return { valido: false, motivo: `${b.nombre} fuera de rango clínico (${min}-${max})` };
        }
    }
    return { valido: true, motivo: '' };
}

export function normalizar(valores = {}) {
    return BIOMARCADORES.map(b => {
        const v = Number(valores[b.id]) || 0;
        const { mean, std } = STATS[b.id] || { mean: 0, std: 1 };
        const z = std === 0 ? 0 : (v - mean) / std;
        return Math.round(z * 1000) / 1000;
    });
}

export function distanciaPonderada(a, b, pesos) {
    const n = Math.min(a.length, b.length);
    const hasPesos = Array.isArray(pesos) && pesos.length === n;
    let suma = 0;
    for (let i = 0; i < n; i++) {
        const diff = (a[i] || 0) - (b[i] || 0);
        const peso = hasPesos ? (pesos[i] || 1) : 1;
        suma += (diff * diff) * peso;
    }
    return Math.sqrt(suma);
}

export function clasificarKNN(dataset, entradaObj, k = 5, pesos) {
    if (!dataset || !entradaObj || !BIOMARCADORES.length) {
        return { clasificacion: 'Error', confianza: 0, vecinos: [] };
    }
    const entradaVec = normalizar(entradaObj);
    const conDistancias = dataset.map(muestra => ({
        id: muestra.id,
        clase: muestra.clase,
        distancia: distanciaPonderada(entradaVec, normalizar(muestra), pesos)
    }));
    conDistancias.sort((a, b) => a.distancia - b.distancia);
    const vecinos = conDistancias.slice(0, k);
    const votos = {};
    vecinos.forEach(v => { votos[v.clase] = (votos[v.clase] || 0) + 1; });
    let clasificacion = 'Normal';
    let maxVotos = 0;
    for (const [cls, cnt] of Object.entries(votos)) {
        if (cnt > maxVotos) { maxVotos = cnt; clasificacion = cls; }
    }
    const confianza = Math.round((maxVotos / Math.max(1, k)) * 100);
    return { clasificacion, confianza, vecinos };
}

export function explicarResultado(entradaObj, resultadoKNN, topN = 5) {
    if (!resultadoKNN || !resultadoKNN.vecinos || !resultadoKNN.vecinos.length) {
        return [];
    }
    const entradaVec = normalizar(entradaObj);
    const vecinoId = resultadoKNN.vecinos[0].id;
    const muestraVecino = DATASET.find(m => m.id === vecinoId) || resultadoKNN.vecinos[0];
    const vecinoVec = normalizar(muestraVecino);

    const contribuciones = BIOMARCADORES.map((b, i) => ({
        id: b.id,
        nombre: b.nombre,
        unidad: b.unidad,
        valor: entradaObj[b.id],
        diff: Math.abs((entradaVec[i] || 0) - (vecinoVec[i] || 0))
    }));

    contribuciones.sort((a, b) => b.diff - a.diff);
    return contribuciones.slice(0, topN);
}

export function calcularRiesgoGlucosa(params = {}) {
    const validacion = validarEntradas(params);
    if (!validacion.valido) {
        return {
            clasificacion: 'Error',
            confianza: 0,
            notas: validacion.motivo,
            explicacion: []
        };
    }

    const resultado = clasificarKNN(DATASET, params, 5);
    const explicacion = explicarResultado(params, resultado, 5);

    const mapNotas = {
        'Normal': 'Perfil glucémico dentro de parámetros normales.',
        'Prediabetes': 'Alteración en metabolismo glucémico. Requiere seguimiento.',
        'Riesgo': 'Alteración significativa. Se recomienda evaluación clínica.'
    };

    return {
        clasificacion: resultado.clasificacion,
        confianza: resultado.confianza,
        notas: mapNotas[resultado.clasificacion] || 'Resultado generado por motor KNN.',
        explicacion
    };
}

export function orquestarDiagnostico(entradas) {
    // Fase 2: pipeline de agentes (Ingestión → Validación → KNN → Explicabilidad → Reporte).
    return calcularRiesgoGlucosa(entradas);
}

export default { calcularRiesgoGlucosa };
