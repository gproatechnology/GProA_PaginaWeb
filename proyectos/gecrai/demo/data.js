const MOCK_MEMORIES = [];

function getRecentActivity() {
    const memorias = MOCK_MEMORIES.slice().reverse();
    const counts = {};
    memorias.forEach(item => {
        const key = item.normativa || 'Sin normativa';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function getUsageByNorm() {
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
    return MOCK_MEMORIES.slice().reverse();
}

function getDashboardMetrics() {
    const unique = new Set(MOCK_MEMORIES.map((x) => x.normativa).filter(Boolean));
    return {
        dashConsultas: unique.size || 0,
        dashMemorias: MOCK_MEMORIES.length
    };
}

// Reemplazar estas funciones por llamado real al backend cuando esté disponible.
export { getRecentActivity, getUsageByNorm, generateMemory, getMemories, getDashboardMetrics };
