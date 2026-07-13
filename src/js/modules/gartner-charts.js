/**
 * Gartner Charts Module
 * Handles Chart.js visualizations for metrics section
 */

import { GARTNER_DATA } from '../../data/gartner.js';

function showGartnerView(type) {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');
    const title = document.getElementById('gartnerTitle');

    document.querySelectorAll('.gartner-view').forEach(v => v.style.display = 'none');

    initialView.style.display = 'none';
    detailedView.style.display = 'block';

    title.textContent = GARTNER_DATA[type]?.title || 'Métricas';

    const view = document.getElementById(`${type}View`);
    if (view) {
        view.style.display = 'block';
    }

    renderKpis(type);

    setTimeout(() => initGartnerChart(type), 100);
}

function showGartnerInitial() {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');

    initialView.style.display = 'block';
    detailedView.style.display = 'none';
}

// Calcula y muestra un resumen de KPIs derivado de los datos de cada gráfica.
function renderKpis(type) {
    const view = document.getElementById(`${type}View`);
    const d = GARTNER_DATA[type];
    if (!view || !d) return;

    const cagr = (arr) => ((Math.pow(arr[arr.length - 1] / arr[0], 1 / (arr.length - 1)) - 1) * 100);
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    let kpis = [];
    if (type === 'quadrant') {
        const g = d.datasets[0].data[0];
        const pos = g.x >= 0.5 && g.y >= 0.5 ? 'Líder'
            : g.x >= 0.5 && g.y < 0.5 ? 'Visionario'
            : g.x < 0.5 && g.y >= 0.5 ? 'Challenger' : 'Nicho';
        kpis = [
            { label: 'Posición', value: pos },
            { label: 'Capacidad ejecución', value: g.x.toFixed(2) },
            { label: 'Completitud visión', value: g.y.toFixed(2) }
        ];
    } else if (type === 'evolution') {
        const ds = d.datasets[0].data;
        const last = d.labels[d.labels.length - 1];
        kpis = [
            { label: 'CAGR', value: `${cagr(ds).toFixed(0)}%` },
            { label: last, value: ds[ds.length - 1] },
            { label: 'Periodo', value: `${d.labels[0]}–${last}` }
        ];
    } else if (type === 'solutions') {
        const g = avg(d.datasets[0].data);
        const c = avg(d.datasets[1].data);
        kpis = [
            { label: 'GProA (prom.)', value: g.toFixed(1) },
            { label: 'Competidores (prom.)', value: c.toFixed(1) },
            { label: 'Ventaja', value: `+${(g - c).toFixed(1)} pts` }
        ];
    } else if (type === 'market') {
        const ds = d.datasets[0].data;
        const last = d.labels[d.labels.length - 1];
        kpis = [
            { label: 'CAGR', value: `${cagr(ds).toFixed(0)}%` },
            { label: last, value: `${ds[ds.length - 1]} B USD` },
            { label: 'Periodo', value: `${d.labels[0]}–${last}` }
        ];
    }

    let strip = view.querySelector('.kpi-strip');
    if (!strip) {
        strip = document.createElement('div');
        strip.className = 'kpi-strip';
        view.insertBefore(strip, view.firstChild);
    }
    strip.innerHTML = kpis.map(k =>
        `<div class="kpi"><span class="kpi-value">${k.value}</span><span class="kpi-label">${k.label}</span></div>`
    ).join('');
}

function initGartnerChart(type) {
    if (typeof Chart === 'undefined') {
        const view = document.getElementById(`${type}View`);
        if (view) {
            view.insertAdjacentHTML('beforeend',
                '<p style="color:#94a3b8;margin-top:12px;">Gráficas no disponibles (Chart.js no cargó).</p>');
        }
        return;
    }

    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#e0f2fe' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            }
        }
    };

    const d = GARTNER_DATA[type];
    if (!d) return;

    const canvasId = {
        quadrant: 'quadrantChart',
        evolution: 'evolutionChart',
        solutions: 'solutionsChart',
        market: 'marketChart'
    }[type];

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const prev = Chart.getChart(ctx);
    if (prev) prev.destroy();

    const unit = d.unit || '';

    // Tooltip informativo compartido por todas las gráficas.
    const tooltip = {
        callbacks: {
            label: (c) => {
                const t = c.chart.config.type;
                if (t === 'scatter' || t === 'bubble') {
                    const { x, y, name } = c.raw;
                    return name ? `${name}: (${x}, ${y})` : `${c.dataset.label}: (${x}, ${y})`;
                }
                const v = c.parsed.y ?? c.parsed;
                return unit
                    ? `${c.dataset.label} — ${c.label}: ${v} ${unit}`
                    : `${c.dataset.label} — ${c.label}: ${v}`;
            }
        }
    };

    const basePlugins = { ...chartConfig.plugins, tooltip };

    // Plugin del Cuadrante Mágico: zonas + etiquetas de puntos (sin dependencias).
    const quadrantPlugin = {
        id: 'quadrantExtras',
        beforeDraw(chart) {
            const x = chart.scales.x;
            const y = chart.scales.y;
            if (!x || !y) return;
            const c = chart.ctx;
            const left = x.getPixelForValue(0);
            const right = x.getPixelForValue(1);
            const top = y.getPixelForValue(1);
            const bottom = y.getPixelForValue(0);
            const midX = x.getPixelForValue(0.5);
            const midY = y.getPixelForValue(0.5);
            const w = right - left;
            const h = bottom - top;

            c.save();
            const zones = [
                { x: left, y: top, fill: 'rgba(156, 163, 175, 0.05)' },
                { x: midX, y: top, fill: 'rgba(16, 185, 129, 0.06)' },
                { x: left, y: midY, fill: 'rgba(156, 163, 175, 0.04)' },
                { x: midX, y: midY, fill: 'rgba(245, 158, 11, 0.05)' }
            ];
            zones.forEach((z) => {
                c.fillStyle = z.fill;
                c.fillRect(z.x, z.y, w / 2, h / 2);
            });

            c.strokeStyle = 'rgba(148, 163, 184, 0.25)';
            c.lineWidth = 1;
            c.setLineDash([4, 4]);
            c.beginPath();
            c.moveTo(midX, top); c.lineTo(midX, bottom);
            c.moveTo(left, midY); c.lineTo(right, midY);
            c.stroke();
            c.setLineDash([]);

            c.fillStyle = 'rgba(148, 163, 184, 0.6)';
            c.font = '600 11px "Exo 2", sans-serif';
            c.textAlign = 'left';
            c.fillText('Challengers', left + 8, top + 18);
            c.textAlign = 'right';
            c.fillText('Líderes', right - 8, top + 18);
            c.textAlign = 'left';
            c.fillText('Nicho', left + 8, bottom - 10);
            c.textAlign = 'right';
            c.fillText('Visionarios', right - 8, bottom - 10);
            c.restore();
        },
        afterDatasetsDraw(chart) {
            const c = chart.ctx;
            chart.data.datasets.forEach((ds, di) => {
                const meta = chart.getDatasetMeta(di);
                meta.data.forEach((pt, i) => {
                    const p = ds.data[i];
                    if (!p || !p.name) return;
                    const r = p.r || 6;
                    c.save();
                    c.fillStyle = ds.label === 'GProA Technology' ? '#00e0ff' : '#cbd5e1';
                    c.font = '600 11px "Exo 2", sans-serif';
                    c.textAlign = 'center';
                    c.fillText(p.name, pt.x, pt.y - r - 6);
                    c.restore();
                });
            });
        }
    };

    // Plugin sin dependencias: dibuja el valor encima de cada barra.
    const barValueLabels = {
        id: 'barValueLabels',
        afterDatasetsDraw(chart) {
            const c = chart.ctx;
            chart.data.datasets.forEach((ds, i) => {
                const meta = chart.getDatasetMeta(i);
                if (meta.type !== 'bar') return;
                meta.data.forEach((bar, idx) => {
                    const val = ds.data[idx];
                    c.save();
                    c.fillStyle = '#e0f2fe';
                    c.font = '600 12px "JetBrains Mono", monospace';
                    c.textAlign = 'center';
                    c.fillText(val, bar.x, bar.y - 8);
                    c.restore();
                });
            });
        }
    };

    if (type === 'quadrant') {
        new Chart(ctx, {
            type: 'bubble',
            data: { datasets: d.datasets },
            options: {
                ...chartConfig,
                plugins: basePlugins,
                scales: {
                    ...chartConfig.scales,
                    x: {
                        ...chartConfig.scales.x,
                        title: { display: true, text: 'Capacidad de Ejecución', color: '#93c5fd' },
                        min: 0, max: 1
                    },
                    y: {
                        ...chartConfig.scales.y,
                        title: { display: true, text: 'Completitud de Visión', color: '#93c5fd' },
                        min: 0, max: 1
                    }
                }
            },
            plugins: [quadrantPlugin]
        });
    }
    else if (type === 'evolution') {
        new Chart(ctx, {
            type: 'line',
            data: { labels: d.labels, datasets: d.datasets },
            options: {
                ...chartConfig,
                plugins: basePlugins,
                scales: {
                    ...chartConfig.scales,
                    x: { ...chartConfig.scales.x, title: { display: true, text: 'Año', color: '#93c5fd' } },
                    y: { ...chartConfig.scales.y, title: { display: true, text: d.unit, color: '#93c5fd' } }
                }
            }
        });
    }
    else if (type === 'solutions') {
        new Chart(ctx, {
            type: 'radar',
            data: { labels: d.labels, datasets: d.datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#e0f2fe' } },
                    tooltip
                },
                scales: {
                    r: {
                        ticks: { color: '#94a3b8', backdropColor: 'transparent' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                        pointLabels: { color: '#93c5fd' }
                    }
                }
            }
        });
    }
    else if (type === 'market') {
        new Chart(ctx, {
            type: 'bar',
            data: { labels: d.labels, datasets: d.datasets },
            options: {
                ...chartConfig,
                plugins: basePlugins,
                scales: {
                    ...chartConfig.scales,
                    x: { ...chartConfig.scales.x, title: { display: true, text: 'Año', color: '#93c5fd' } },
                    y: { ...chartConfig.scales.y, title: { display: true, text: d.unit, color: '#93c5fd' } }
                }
            },
            plugins: [barValueLabels]
        });
    }
}

export function initGartnerCharts() {
    document.querySelectorAll('.metric-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.view;
            if (type) showGartnerView(type);
        });
    });

    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', showGartnerInitial);
    }
}
