/**
 * Data layer for GlucAI demo.
 * Supports mock mode by default and real API mode when configured.
 */

import { getRecentActivity as apiGetRecentActivity, getUsageByNorm as apiGetUsageByNorm, generateMemory as apiGenerateMemory, getMemories as apiGetMemories, getDashboardMetrics as apiGetDashboardMetrics } from './api.js';

const USE_API = false;

const MOCK_MEMORIAS = [];

function getRecentActivity() {
    if (USE_API) return apiGetRecentActivity();
    const memorias = MOCK_MEMORIAS.slice().reverse();
    const counts = {};
    memorias.forEach(item => {
        const key = item.perfil || 'Sin perfil';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function getUsageByNorm() {
    if (USE_API) return apiGetUsageByNorm();
    const counts = {};
    MOCK_MEMORIAS.forEach(item => {
        const key = item.perfil || 'Sin perfil';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function generateMemory({ perfil, paciente = '', resultado = null }) {
    const memory = {
        id: Date.now(),
        paciente,
        perfil,
        fecha: new Date().toISOString(),
        resultado
    };
    MOCK_MEMORIAS.push(memory);
    return memory;
}

function getMemories() {
    if (USE_API) return apiGetMemories();
    return MOCK_MEMORIAS.slice().reverse();
}

function getDashboardMetrics() {
    if (USE_API) return apiGetDashboardMetrics();
    const unique = new Set(MOCK_MEMORIAS.map((x) => x.perfil).filter(Boolean));
    const usage = getUsageByNorm();
    const top = usage[0];

    return {
        dashExamenes: MOCK_MEMORIAS.length,
        dashDiagnosticos: unique.size || 0,
        dashTopPerfil: top ? top.label : '--',
        dashTime: MOCK_MEMORIAS.length ? new Date(MOCK_MEMORIAS[0].fecha).toISOString() : null
    };
}

// --- Fase 1: Dataset sintético (33 elementos) ---
export const CLASES = ['Normal', 'Prediabetes', 'Riesgo'];

export const BIOMARCADORES = [
  { id: 'glucosa', nombre: 'Glucosa', unidad: 'mg/dL' },
  { id: 'hba1c', nombre: 'HbA1c', unidad: '%' },
  { id: 'insulina', nombre: 'Insulina', unidad: 'uIU/mL' },
  { id: 'sodio', nombre: 'Sodio (Na)', unidad: 'mEq/L' },
  { id: 'potasio', nombre: 'Potasio (K)', unidad: 'mEq/L' },
  { id: 'cloro', nombre: 'Cloro (Cl)', unidad: 'mEq/L' },
  { id: 'calcio', nombre: 'Calcio (Ca)', unidad: 'mg/dL' },
  { id: 'magnesio', nombre: 'Magnesio (Mg)', unidad: 'mg/dL' },
  { id: 'fosforo', nombre: 'Fósforo (P)', unidad: 'mg/dL' },
  { id: 'bun', nombre: 'BUN', unidad: 'mg/dL' },
  { id: 'creatinina', nombre: 'Creatinina', unidad: 'mg/dL' },
  { id: 'egfr', nombre: 'eGFR', unidad: 'mL/min' },
  { id: 'alt', nombre: 'ALT', unidad: 'U/L' },
  { id: 'ast', nombre: 'AST', unidad: 'U/L' },
  { id: 'alp', nombre: 'ALP', unidad: 'U/L' },
  { id: 'bilirrubina', nombre: 'Bilirrubina', unidad: 'mg/dL' },
  { id: 'proteina_total', nombre: 'Proteína total', unidad: 'g/dL' },
  { id: 'albumina', nombre: 'Albúmina', unidad: 'g/dL' },
  { id: 'colesterol', nombre: 'Colesterol total', unidad: 'mg/dL' },
  { id: 'trigliceridos', nombre: 'Triglicéridos', unidad: 'mg/dL' },
  { id: 'hdl', nombre: 'HDL', unidad: 'mg/dL' },
  { id: 'ldl', nombre: 'LDL', unidad: 'mg/dL' },
  { id: 'pcr', nombre: 'PCR', unidad: 'mg/L' },
  { id: 'ferritina', nombre: 'Ferritina', unidad: 'ng/mL' },
  { id: 'tsh', nombre: 'TSH', unidad: 'mIU/L' },
  { id: 't4', nombre: 'T4', unidad: 'µg/dL' },
  { id: 'acido_urico', nombre: 'Ácido úrico', unidad: 'mg/dL' },
  { id: 'ldh', nombre: 'LDH', unidad: 'U/L' },
  { id: 'cpk', nombre: 'CPK', unidad: 'U/L' },
  { id: 'amilasa', nombre: 'Amilasa', unidad: 'U/L' },
  { id: 'lipasa', nombre: 'Lipasa', unidad: 'U/L' },
  { id: 'ggt', nombre: 'GGT', unidad: 'U/L' },
  { id: 'homocisteina', nombre: 'Homocisteína', unidad: 'µmol/L' }
];

function generarDataset() {
  let seed = 12345;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const randn = (mean, std) => {
    const u1 = random() || 1e-10;
    const u2 = random();
    return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const CONFIG = {
    glucosa: [85, 8, 115, 10, 155, 15],
    hba1c: [5.2, 0.3, 5.9, 0.4, 7.2, 0.6],
    insulina: [10, 3, 18, 5, 6, 3],
    sodio: [140, 3, 139, 3, 141, 4],
    potasio: [4.0, 0.3, 4.1, 0.3, 4.3, 0.4],
    cloro: [102, 3, 101, 3, 100, 4],
    calcio: [9.2, 0.4, 9.1, 0.4, 9.0, 0.5],
    magnesio: [2.0, 0.2, 1.9, 0.2, 1.8, 0.3],
    fosforo: [3.5, 0.4, 3.4, 0.4, 3.2, 0.5],
    bun: [15, 4, 16, 4, 20, 6],
    creatinina: [0.9, 0.2, 1.0, 0.2, 1.3, 0.4],
    egfr: [95, 10, 90, 10, 75, 15],
    alt: [25, 8, 30, 10, 40, 15],
    ast: [22, 7, 26, 8, 35, 12],
    alp: [70, 20, 75, 20, 85, 25],
    bilirrubina: [0.7, 0.2, 0.8, 0.2, 1.0, 0.3],
    proteina_total: [7.0, 0.4, 6.9, 0.4, 6.7, 0.5],
    albumina: [4.2, 0.3, 4.1, 0.3, 3.9, 0.4],
    colesterol: [180, 25, 200, 30, 220, 35],
    trigliceridos: [120, 30, 160, 40, 220, 50],
    hdl: [55, 10, 45, 10, 38, 8],
    ldl: [100, 20, 120, 25, 140, 30],
    pcr: [2.0, 1.0, 3.5, 1.5, 5.0, 2.0],
    ferritina: [100, 40, 110, 45, 130, 50],
    tsh: [2.0, 1.0, 2.5, 1.2, 3.0, 1.5],
    t4: [8.0, 1.5, 7.5, 1.5, 7.0, 1.5],
    acido_urico: [5.5, 1.2, 6.0, 1.3, 7.0, 1.5],
    ldh: [160, 40, 170, 45, 190, 50],
    cpk: [100, 30, 110, 35, 130, 40],
    amilasa: [50, 15, 55, 18, 60, 20],
    lipasa: [40, 12, 45, 15, 50, 18],
    ggt: [30, 10, 35, 12, 45, 15],
    homocisteina: [10, 3, 12, 4, 15, 5]
  };

  const dataset = [];
  for (const clase of CLASES) {
    for (let i = 0; i < 30; i++) {
      const muestra = { id: `${clase}_${i}`, clase };
      for (const b of BIOMARCADORES) {
        const [nm, ns, pm, ps, rm, rs] = CONFIG[b.id];
        const mean = clase === 'Normal' ? nm : clase === 'Prediabetes' ? pm : rm;
        const std = clase === 'Normal' ? ns : clase === 'Prediabetes' ? ps : rs;
        muestra[b.id] = Math.round(randn(mean, std) * 100) / 100;
      }
      dataset.push(muestra);
    }
  }
  return dataset;
}

export const DATASET = generarDataset();

export function estadisticasDataset() {
  const stats = {};
  for (const b of BIOMARCADORES) {
    const valores = DATASET.map(m => m[b.id]);
    const mean = valores.reduce((a, v) => a + v, 0) / valores.length;
    const std = Math.sqrt(valores.reduce((a, v) => a + (v - mean) ** 2, 0) / valores.length);
    stats[b.id] = { mean: Math.round(mean * 100) / 100, std: Math.round(std * 100) / 100 };
  }
  return stats;
}

export { getRecentActivity, getUsageByNorm, generateMemory, getMemories, getDashboardMetrics };
