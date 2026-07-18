/**
 * Real API client for GlucAI demo.
 * Replace the placeholder fetch calls with real backend URLs when available.
 */

const BASE_URL = '/api';

async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text || response.statusText}`);
    }

    return response.json();
}

export async function getRecentActivity() {
    // TODO: replace with real endpoint
    // return request('/metrics/activity');
    throw new Error('Backend not connected');
}

export async function getUsageByNorm() {
    // TODO: replace with real endpoint
    // return request('/metrics/usage');
    throw new Error('Backend not connected');
}

export async function generateMemory({ paciente, perfil, resultado = null }) {
    // TODO: replace with real endpoint
    // return request('/memorias', {
    //   method: 'POST',
    //   body: JSON.stringify({ paciente, perfil, resultado })
    // });
    throw new Error('Backend not connected');
}

export async function getMemories() {
    // TODO: replace with real endpoint
    // return request('/memorias');
    throw new Error('Backend not connected');
}

export async function getDashboardMetrics() {
    // TODO: replace with real endpoint
    // return request('/metrics/dashboard');
    throw new Error('Backend not connected');
}
