/**
 * Gartner Charts Module
 * Handles Chart.js visualizations for metrics section
 */

// Make functions globally available for onclick handlers
window.showGartnerView = showGartnerView;
window.showGartnerInitial = showGartnerInitial;

function showGartnerView(type) {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');
    const title = document.getElementById('gartnerTitle');

    // Hide all views
    document.querySelectorAll('.gartner-view').forEach(v => v.style.display = 'none');

    // Show detailed view
    initialView.style.display = 'none';
    detailedView.style.display = 'block';

    // Set title
    const titles = {
        'quadrant': 'Cuadrante Mágico',
        'evolution': 'Evolución de Capacidades',
        'solutions': 'Comparativa de Soluciones',
        'market': 'Proyección de Mercado'
    };
    title.textContent = titles[type] || 'Métricas';

    // Show selected view
    const view = document.getElementById(`${type}View`);
    if (view) {
        view.style.display = 'block';
    }

    // Initialize chart
    setTimeout(() => initGartnerChart(type), 100);
}

function showGartnerInitial() {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');

    initialView.style.display = 'block';
    detailedView.style.display = 'none';
}

function initGartnerChart(type) {
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

    if (type === 'quadrant') {
        const ctx = document.getElementById('quadrantChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'GProA Technology',
                    data: [{ x: 0.85, y: 0.75 }],
                    backgroundColor: '#00e0ff',
                    borderColor: '#00e0ff',
                    borderWidth: 3,
                    pointRadius: 10,
                    pointHoverRadius: 14
                }, {
                    label: 'Competidores',
                    data: [
                        { x: 0.6, y: 0.8 }, { x: 0.7, y: 0.6 }, { x: 0.5, y: 0.7 },
                        { x: 0.8, y: 0.5 }, { x: 0.4, y: 0.6 }, { x: 0.65, y: 0.55 }
                    ],
                    backgroundColor: 'rgba(156, 163, 175, 0.6)',
                    pointRadius: 6
                }]
            },
            options: {
                ...chartConfig,
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
            }
        });
    }
    else if (type === 'evolution') {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Crecimiento IA',
                    data: [20, 45, 75, 120, 160],
                    borderColor: '#00e0ff',
                    backgroundColor: 'rgba(0, 224, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Automatización',
                    data: [15, 35, 65, 95, 125],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartConfig
        });
    }
    else if (type === 'solutions') {
        const ctx = document.getElementById('solutionsChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Innovación', 'Especialización', 'Escalabilidad', 'Integración', 'Soporte'],
                datasets: [{
                    label: 'GProA Technology',
                    data: [92, 88, 85, 90, 87],
                    borderColor: '#00e0ff',
                    backgroundColor: 'rgba(0, 224, 255, 0.2)',
                    pointBackgroundColor: '#00e0ff'
                }, {
                    label: 'Promedio Competidores',
                    data: [75, 70, 78, 72, 80],
                    borderColor: 'rgba(156, 163, 175, 0.8)',
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    pointBackgroundColor: 'rgba(156, 163, 175, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#e0f2fe' } }
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
        const ctx = document.getElementById('marketChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2025', '2026', '2027', '2028', '2029'],
                datasets: [{
                    label: 'Mercado IA Industrial (Miles de millones USD)',
                    data: [47.2, 58.5, 72.1, 89.2, 110.3],
                    backgroundColor: 'rgba(0, 224, 255, 0.6)',
                    borderColor: '#00e0ff',
                    borderWidth: 2
                }]
            },
            options: chartConfig
        });
    }
}

export { showGartnerView, showGartnerInitial };
