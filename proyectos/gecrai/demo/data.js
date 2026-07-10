/**
 * Data layer for GECRAI demo.
 * Supports mock mode by default and real API mode when configured.
 */

import { getRecentActivity as apiGetRecentActivity, getUsageByNorm as apiGetUsageByNorm, generateMemory as apiGenerateMemory, getMemories as apiGetMemories, getDashboardMetrics as apiGetDashboardMetrics } from './api.js';

const USE_API = false;

const MOCK_MEMORIES = [];

function getRecentActivity() {
    if (USE_API) return apiGetRecentActivity();
    const memorias = MOCK_MEMORIES.slice().reverse();
    const counts = {};
    memorias.forEach(item => {
        const key = item.normativa || 'Sin normativa';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function getUsageByNorm() {
    if (USE_API) return apiGetUsageByNorm();
    const counts = {};
    MOCK_MEMORIES.forEach(item => {
        const key = item.normativa || 'Sin normativa';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function generateMemory({ normativa, voltaje, corriente, proyecto = '', tag = '', resultado = null }) {
    const potencia = Number.parseFloat(voltaje || 0) * Number.parseFloat(corriente || 0);
    const memory = {
        id: Date.now(),
        normativa: normativa || '',
        voltaje: Number.parseFloat(voltaje || 0),
        corriente: Number.parseFloat(corriente || 0),
        potencia: potencia,
        fecha: new Date().toISOString(),
        proyecto,
        tag,
        resultado
    };
    MOCK_MEMORIES.push(memory);
    return memory;
}

function getMemories() {
    if (USE_API) return apiGetMemories();
    return MOCK_MEMORIES.slice().reverse();
}

function getDashboardMetrics() {
    if (USE_API) return apiGetDashboardMetrics();
    const unique = new Set(MOCK_MEMORIES.map((x) => x.normativa).filter(Boolean));

    const usage = getUsageByNorm();
    const top = usage[0];

    return {
        dashConsultas: unique.size || 0,
        dashMemorias: MOCK_MEMORIES.length,
        dashTopNorm: top ? top.label : '--',
        dashTime: MOCK_MEMORIES.length ? new Date(MOCK_MEMORIES[0].fecha).toISOString() : null
    };
}

export { getRecentActivity, getUsageByNorm, generateMemory, getMemories, getDashboardMetrics };
