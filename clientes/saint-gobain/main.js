/**
 * GProA Technology - Cliente Access Page
 * Gyproc - Saint-Gobain
 * Enterprise HUD Sci-Fi SPA
 */

const ACCESS_CODE = 'SG-NDA-2026';

let appData = null;
let chartsInitialized = false;

async function loadData() {
    try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('No data.json');
        appData = await res.json();
        renderAll();
        renderRank();
        renderTimeline();
        renderMetricsTable();
        renderAlerts();
    } catch (e) {
        console.warn('No se pudo cargar data.json, usando placeholders.', e);
        appData = null;
        renderAll();
        renderRank();
        renderTimeline();
        renderMetricsTable();
        renderAlerts();
    }
}

function initBoot() {
    const overlay = document.getElementById('bootOverlay');
    if (!overlay) return;

    const hide = () => overlay.classList.add('hidden');
    overlay.addEventListener('click', hide);
    setTimeout(hide, 2200);
}

function initClock() {
    const clockEl = document.getElementById('hudClock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}`;
    }

    update();
    setInterval(update, 1000);
}

function initAccess() {
    const form = document.getElementById('accessForm');
    const input = document.getElementById('accessCode');
    const errorEl = document.getElementById('accessError');
    const accessContainer = document.getElementById('accessContainer');
    const appLayout = document.getElementById('appLayout');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = input.value.trim();

        if (code === ACCESS_CODE) {
            errorEl.textContent = '';
            accessContainer.style.display = 'none';
            appLayout.style.display = 'flex';
            input.value = '';

            const overlay = document.getElementById('bootOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }

            initClock();
            loadData();
        } else {
            errorEl.textContent = 'Código de acceso inválido. Verifica tu NDA.';
            input.classList.add('invalid');
            input.focus();
        }
    });

    input.addEventListener('input', () => {
        errorEl.textContent = '';
        input.classList.remove('invalid');
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.hud-nav-item[data-view]');
    const sections = {
        dashboard: document.getElementById('viewDashboard'),
        dossier: document.getElementById('viewDossier'),
        documents: document.getElementById('viewDocuments'),
        legal: document.getElementById('viewLegal')
    };
    const titles = {
        dashboard: 'Mission Control',
        dossier: 'Intel Files',
        documents: 'Armory',
        legal: 'Protocol'
    };

    function activateView(name) {
        Object.values(sections).forEach(el => el && el.classList.remove('active'));
        const target = sections[name];
        if (target) target.classList.add('active');

        document.querySelectorAll('.hud-nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.view === name);
            el.setAttribute('aria-selected', el.dataset.view === name ? 'true' : 'false');
        });

        if (name === 'dashboard') {
            if (!chartsInitialized) {
                setTimeout(() => {
                    initCharts();
                    renderKpis();
                    renderTimeline();
                    renderMetricsTable();
                    renderAlerts();
                }, 50);
                chartsInitialized = true;
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) activateView(view);
        });

        item.addEventListener('keydown', (e) => {
            const view = item.dataset.view;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (view) activateView(view);
            }
        });
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const content = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
            if (content) {
                content.classList.add('active');
                content.classList.add('scan-flash');
                setTimeout(() => content.classList.remove('scan-flash'), 600);
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const appLayout = document.getElementById('appLayout');
            const accessContainer = document.getElementById('accessContainer');
            const accessCode = document.getElementById('accessCode');
            const accessError = document.getElementById('accessError');

            appLayout.style.display = 'none';
            accessContainer.style.display = 'flex';
            accessCode.value = '';
            accessError.textContent = '';
            chartsInitialized = false;

            document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
            const dashboard = document.getElementById('viewDashboard');
            if (dashboard) dashboard.classList.add('active');
        });
    }
}

function renderAll() {
    renderDossier();
    renderDocuments();
    renderLegal();
    renderKpis();
    renderTimeline();
    renderMetricsTable();
    renderAlerts();
}

function renderDossier() {
    const data = appData || {};
    const client = data.client || {};
    const project = data.project || {};
    const products = data.products || [];
    const technologies = data.technologies || [];

    const clientEl = document.getElementById('tabClient');
    if (clientEl) {
        clientEl.innerHTML = `
            <div class="dossier-section">
                <h3><i class="fas fa-building"></i> Cliente</h3>
                <p><strong>${client.name || 'Saint-Gobain México'}</strong>${client.brand ? ' — Marca ' + client.brand : ''}</p>
                <p>Contacto de planta: <strong>${client.contact || 'Eleazar'}</strong></p>
                <p>Industria: ${client.industry || 'Construcción ligera, paneles de yeso y materiales de construcción.'}</p>
            </div>
        `;
    }

    const projectEl = document.getElementById('tabProject');
    if (projectEl) {
        projectEl.innerHTML = `
            <div class="dossier-section">
                <h3><i class="fas fa-lightbulb"></i> Proyecto</h3>
                <p>${project.description || 'Desarrollo de soluciones de inteligencia artificial y automatización industrial aplicadas a procesos de manufactura.'}</p>
                <p class="dossier-meta">${project.approach || 'GProA Technology se acercará por medio del contacto de planta Eleazar.'}</p>
            </div>
        `;
    }

    const productsEl = document.getElementById('tabProducts');
    if (productsEl) {
        const list = products.map(p => `
            <li>
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>${p.name}</strong>${p.desc ? ' — ' + p.desc : ''}
                </div>
            </li>
        `).join('');
        productsEl.innerHTML = `
            <div class="dossier-section">
                <h3><i class="fas fa-cubes"></i> Líneas de producto</h3>
                <ul class="dossier-list dossier-products">${list || '<li>Sin datos</li>'}</ul>
            </div>
        `;
    }

    const techEl = document.getElementById('tabTechnologies');
    if (techEl) {
        const list = technologies.map(t => `<li><i class="fas fa-check"></i> ${t}</li>`).join('');
        techEl.innerHTML = `
            <div class="dossier-section">
                <h3><i class="fas fa-cogs"></i> Tecnologías GProA aplicadas</h3>
                <ul class="dossier-list">${list || '<li>Sin datos</li>'}</ul>
            </div>
        `;
    }
}

function renderDocuments() {
    const docs = (appData && appData.documents) || [];
    const docsList = document.getElementById('docsList');
    const countEl = document.getElementById('docCount');
    if (!docsList) return;

    if (countEl) {
        countEl.textContent = String(docs.length).padStart(2, '0');
    }

    if (!docs.length) {
        docsList.innerHTML = `
            <div class="dossier-section">
                <p>No hay documentos disponibles por el momento.</p>
            </div>
        `;
        return;
    }

    docsList.innerHTML = docs.map((doc, idx) => `
        <div class="doc-item" data-index="${idx}">
            <div class="doc-info">
                <div class="doc-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div>
                    <div class="doc-title">${doc.name}</div>
                    <div class="doc-meta">PDF // DOC-${String(idx + 1).padStart(3, '0')}</div>
                </div>
            </div>
            <a class="doc-action" href="${doc.file}" target="_blank" rel="noopener">
                <i class="fas fa-crosshairs"></i> Abrir
            </a>
        </div>
    `).join('');

    docsList.querySelectorAll('.doc-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = item.querySelector('.doc-action');
            if (e.target.closest('.doc-action')) return;

            docsList.querySelectorAll('.doc-item').forEach(i => i.classList.remove('equipped'));
            item.classList.toggle('equipped');
        });
    });
}

function renderLegal() {
    const legal = (appData && appData.legal) || {};
    const esEl = document.getElementById('legalEs');
    const enEl = document.getElementById('legalEn');
    if (esEl) esEl.textContent = legal.es || '';
    if (enEl) enEl.textContent = legal.en || '';
}

function renderKpis() {
    const metrics = (appData && appData.metrics) || {};
    const kpis = metrics.kpi || [];
    const grid = document.getElementById('kpiGrid');
    if (!grid) return;

    if (!kpis.length) {
        grid.innerHTML = '<p class="muted">Sin métricas disponibles.</p>';
        return;
    }

    grid.innerHTML = kpis.map((kpi, index) => {
        const pct = Math.min(100, Math.max(0, kpi.value || 0));
        const target = kpi.target || 100;
        const statusClass = pct >= 80 ? 'status-ok' : pct >= 50 ? 'status-warn' : 'status-crit';
        const icon = kpi.icon || 'fa-chart-line';
        const unit = kpi.unit || '%';

        return `
            <div class="kpi-card ${statusClass}">
                <div class="kpi-header">
                    <div class="kpi-icon"><i class="fas ${icon}"></i></div>
                    <span class="kpi-badge">KPI ${String(index + 1).padStart(2, '0')}</span>
                </div>
                <div class="kpi-value">${pct}<span class="kpi-unit">${unit}</span></div>
                <div class="kpi-label">${kpi.label || 'Métrica'}</div>
                <div class="kpi-footer">
                    <div class="kpi-bar" data-width="${pct}%"></div>
                </div>
                <div class="kpi-target">OBJ: ${target}${unit}</div>
            </div>
        `;
    }).join('');

    requestAnimationFrame(() => {
        grid.querySelectorAll('.kpi-bar').forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width !== null) bar.style.width = width;
        });
    });
}

function renderRank() {
    const rankEl = document.querySelector('.rank-value');
    if (!rankEl) return;
    const rank = (appData && appData.metrics && appData.metrics.rank) || 'Operativo';
    rankEl.textContent = rank;
}

function initCharts() {
    if (chartsInitialized) return;
    chartsInitialized = true;

    const metrics = (appData && appData.metrics) || {};
    const kpi = metrics.kpi || [];
    const timeline = metrics.timeline || [];

    const kpiCtx = document.getElementById('kpiChart');
    if (kpiCtx && typeof Chart !== 'undefined') {
        new Chart(kpiCtx, {
            type: 'bar',
            data: {
                labels: kpi.map(k => k.label),
                datasets: [
                    {
                        label: 'Actual',
                        data: kpi.map(k => k.value),
                        backgroundColor: 'rgba(0, 224, 255, 0.7)',
                        borderColor: 'rgba(0, 224, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Objetivo',
                        data: kpi.map(k => k.target),
                        backgroundColor: 'rgba(138, 43, 226, 0.5)',
                        borderColor: 'rgba(138, 43, 226, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#e8ecf1' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#b8c5d6' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#b8c5d6' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });
    }

    const trendCtx = document.getElementById('trendChart');
    if (trendCtx && typeof Chart !== 'undefined') {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: timeline.map(t => t.month),
                datasets: [
                    {
                        label: 'Avance',
                        data: timeline.map(t => t.value),
                        borderColor: '#00e0ff',
                        backgroundColor: 'rgba(0, 224, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#e8ecf1' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#b8c5d6' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#b8c5d6' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });
    }

    const radarCtx = document.getElementById('radarChart');
    const radarData = (metrics && metrics.radar) || {};
    if (radarCtx && typeof Chart !== 'undefined' && radarData.labels) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: radarData.labels,
                datasets: [
                    {
                        label: 'Actual',
                        data: radarData.current,
                        borderColor: '#00e0ff',
                        backgroundColor: 'rgba(0, 224, 255, 0.15)',
                        pointBackgroundColor: '#00e0ff'
                    },
                    {
                        label: 'Objetivo',
                        data: radarData.target,
                        borderColor: '#8a2be2',
                        backgroundColor: 'rgba(138, 43, 226, 0.1)',
                        pointBackgroundColor: '#8a2be2'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#e8ecf1' }
                    }
                },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.08)' },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        pointLabels: { color: '#b8c5d6' },
                        ticks: { display: false }
                    }
                }
            }
        });
    }

    const doughnutCtx = document.getElementById('doughnutChart');
    const dist = (metrics && metrics.distribution) || {};
    if (doughnutCtx && typeof Chart !== 'undefined' && dist.labels && dist.values) {
        new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: dist.labels,
                datasets: [
                    {
                        data: dist.values,
                        backgroundColor: [
                            'rgba(0, 224, 255, 0.7)',
                            'rgba(138, 43, 226, 0.7)',
                            'rgba(255, 0, 255, 0.7)',
                            'rgba(255, 187, 0, 0.7)'
                        ],
                        borderColor: 'rgba(10, 10, 10, 0.8)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#e8ecf1' }
                    }
                }
            }
        });
    }
}

function renderTimeline() {
    const metrics = (appData && appData.metrics) || {};
    const milestones = metrics.milestones || [];
    const container = document.getElementById('milestoneTimeline');
    if (!container) return;

    if (!milestones.length) {
        container.innerHTML = '<p class="muted">Sin hitos registrados.</p>';
        return;
    }

    container.innerHTML = milestones.map(m => `
        <div class="timeline-item ${m.status || 'pendiente'}">
            <div class="timeline-dot">
                <i class="fas ${m.status === 'completado' ? 'fa-check' : m.status === 'en-progreso' ? 'fa-spinner' : 'fa-clock'}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-title">${m.title}</div>
                <div class="timeline-date">${m.date}</div>
                <span class="timeline-status">${m.status || 'pendiente'}</span>
            </div>
        </div>
    `).join('');
}

function renderMetricsTable() {
    const metrics = (appData && appData.metrics) || {};
    const kpis = metrics.kpi || [];
    const tbody = document.querySelector('#metricsTable tbody');
    if (!tbody) return;

    if (!kpis.length) {
        tbody.innerHTML = '<tr><td colspan="4">Sin métricas.</td></tr>';
        return;
    }

    tbody.innerHTML = kpis.map(k => {
        const pct = Math.min(100, Math.max(0, k.value || 0));
        const target = k.target || 100;
        const unit = k.unit || '%';
        return `
            <tr>
                <td>${k.label || 'Métrica'}</td>
                <td>${pct}${unit}</td>
                <td>${target}${unit}</td>
                <td class="progress-cell">
                    <div class="kpi-footer">
                        <div class="kpi-bar" style="width:${pct}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAlerts() {
    const metrics = (appData && appData.metrics) || {};
    const alerts = metrics.alerts || [];
    const container = document.getElementById('alertsList');
    if (!container) return;

    if (!alerts.length) {
        container.innerHTML = '<p class="muted">Sin alertas por el momento.</p>';
        return;
    }

    container.innerHTML = alerts.map(a => `
        <div class="alert-item ${a.level || 'info'}">
            <div class="alert-icon">
                <i class="fas ${a.level === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            </div>
            <div class="alert-body">
                <div class="alert-title">${a.level === 'warning' ? 'Advertencia' : 'Información'}</div>
                <div class="alert-msg">${a.msg}</div>
            </div>
        </div>
    `).join('');
}

function initChartJs() {
    if (typeof Chart !== 'undefined') return;
    const script = document.createElement('script');
    script.src = './assets/chartjs/chart.umd.min.js';
    script.onload = () => {
        const dashboard = document.getElementById('viewDashboard');
        if (dashboard && dashboard.classList.contains('active')) {
            initCharts();
        }
    };
    script.onerror = () => {
        console.warn('Chart.js no se pudo cargar desde assets locales.');
    };
    document.head.appendChild(script);
}

function initMagicCards() {
    const overlay = document.getElementById('magicCardOverlay');
    const card = document.getElementById('magicCard');
    const closeBtn = document.getElementById('magicCardClose');
    if (!overlay || !card) return;

    const iconEl = document.getElementById('magicCardIcon');
    const titleEl = document.getElementById('magicCardTitle');
    const tagEl = document.getElementById('magicCardTag');
    const bodyEl = document.getElementById('magicCardBody');
    const metaEl = document.getElementById('magicCardMeta');

    const magicData = {
        'kpis': {
            title: 'Resumen de KPIs',
            tag: 'KPI',
            icon: 'fa-chart-line',
            getBody: () => {
                const metrics = (appData && appData.metrics) || {};
                const kpis = metrics.kpi || [];
                const list = kpis.map(k => {
                    const pct = Math.min(100, Math.max(0, k.value || 0));
                    return `<li><strong>${k.label || 'Métrica'}:</strong> ${pct}% (objetivo ${k.target || 100}%)</li>`;
                }).join('');
                return `<p>Indicadores clave del proyecto:</p><ul>${list || '<li>Sin datos</li>'}</ul>`;
            },
            getMeta: () => 'Fuente: sistema de medición interno'
        },
        'kpi-chart': {
            title: 'Progreso vs Objetivo',
            tag: 'KPI',
            icon: 'fa-chart-bar',
            getBody: () => '<p>Comparativa del avance actual contra las metas establecidas para el periodo en curso.</p>',
            getMeta: () => 'Actualización: tiempo real'
        },
        'radar-chart': {
            title: 'Análisis Radar',
            tag: 'RADAR',
            icon: 'fa-spider',
            getBody: () => '<p>Vista multidimensional de capacidades y desempeño por eje estratégico.</p>',
            getMeta: () => 'Dataset: Q3 2026'
        },
        'distribution-chart': {
            title: 'Distribución',
            tag: 'MIX',
            icon: 'fa-chart-pie',
            getBody: () => '<p>Distribución de esfuerzo y recursos por línea de producto o etapa del proyecto.</p>',
            getMeta: () => 'Periodo: último trimestre'
        },
        'trend-chart': {
            title: 'Tendencia',
            tag: 'TREND',
            icon: 'fa-chart-area',
            getBody: () => '<p>Evolución temporal de los indicadores principales y su proyección.</p>',
            getMeta: () => 'Rango: últimos 12 meses'
        },
        'milestones': {
            title: 'Hitos del Proyecto',
            tag: 'MILESTONES',
            icon: 'fa-flag',
            getBody: () => {
                const metrics = (appData && appData.metrics) || {};
                const milestones = metrics.milestones || [];
                const list = milestones.map(m => `<li><strong>${m.title}</strong> — ${m.date} (${m.status || 'pendiente'})</li>`).join('');
                return `<p>Hitos clave registrados:</p><ul>${list || '<li>Sin hitos</li>'}</ul>`;
            },
            getMeta: () => 'Seguimiento: PMO'
        },
        'alerts': {
            title: 'Alertas',
            tag: 'ALERTS',
            icon: 'fa-bell',
            getBody: () => {
                const metrics = (appData && appData.metrics) || {};
                const alerts = metrics.alerts || [];
                const list = alerts.map(a => `<li>[${a.level || 'info'}] ${a.msg}</li>`).join('');
                return `<p>Alertas activas:</p><ul>${list || '<li>Sin alertas</li>'}</ul>`;
            },
            getMeta: () => 'Monitoreo: automático'
        },
        'metrics-table': {
            title: 'Métricas Detalladas',
            tag: 'DATA',
            icon: 'fa-table',
            getBody: () => '<p>Tabla completa de métricas con valores actuales, objetivos y avance porcentual.</p>',
            getMeta: () => 'Dataset: métricas institucionales'
        }
    };

    function openMagicCard(key) {
        const data = magicData[key];
        if (!data) return;

        if (iconEl) iconEl.innerHTML = `<i class="fas ${data.icon}"></i>`;
        if (titleEl) titleEl.textContent = data.title;
        if (tagEl) tagEl.textContent = data.tag;
        if (bodyEl) bodyEl.innerHTML = data.getBody();
        if (metaEl) metaEl.textContent = data.getMeta();

        overlay.classList.add('visible');
    }

    function closeMagicCard() {
        overlay.classList.remove('visible');
    }

    document.querySelectorAll('[data-magic]').forEach(el => {
        el.addEventListener('click', () => {
            openMagicCard(el.dataset.magic);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMagicCard(el.dataset.magic);
            }
        });
    });

    closeBtn.addEventListener('click', closeMagicCard);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMagicCard();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMagicCard();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initBoot();
    initAccess();
    initNavigation();
    initTabs();
    initLogout();
    initChartJs();
    initMagicCards();
});
