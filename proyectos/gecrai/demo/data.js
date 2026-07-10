const MOCK_MEMORIES = [];

function getRecentActivity() {
    return [
        { label: 'NOM-001-SEDE-2012', value: 4 },
        { label: 'NOM-002-SEDE-2010', value: 7 },
        { label: 'NOM-003-SEDE-2005', value: 5 },
        { label: 'NOM-019-SCFI-2011', value: 9 }
    ];
}

function getUsageByNorm() {
    return [
        { label: 'NOM-001', value: 12 },
        { label: 'NOM-002', value: 8 },
        { label: 'NOM-003', value: 5 },
        { label: 'NOM-019', value: 4 }
    ];
}

function generateMemory({ normativa, voltaje, corriente }) {
    const potencia = Number.parseFloat(voltaje || 0) * Number.parseFloat(corriente || 0);
    const memory = {
        id: Date.now(),
        normativa: normativa || '',
        voltaje: Number.parseFloat(voltaje || 0),
        corriente: Number.parseFloat(corriente || 0),
        potencia: potencia,
        fecha: new Date().toISOString()
    };
    MOCK_MEMORIES.push(memory);
    return memory;
}

function getMemories() {
    return MOCK_MEMORIES.slice().reverse();
}

function getDashboardMetrics() {
    return {
        dashConsultas: new Set(MOCK_MEMORIES.map((x) => x.normativa).filter(Boolean)).size || 0,
        dashMemorias: MOCK_MEMORIES.length
    };
}

// Reemplazar estas funciones por llamado real al backend cuando esté disponible.
export { getRecentActivity, getUsageByNorm, generateMemory, getMemories, getDashboardMetrics };
