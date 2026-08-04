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
    } catch (e) {
        console.warn('No se pudo cargar data.json, usando placeholders.', e);
        appData = null;
        renderAll();
        renderRank();
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

        if (name === 'dashboard' && !chartsInitialized) {
            setTimeout(initCharts, 50);
            renderKpis();
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
}

function initChartJs() {
    if (typeof Chart !== 'undefined') return;
    const script = document.createElement('script');
    const isDev = import.meta.env?.DEV;
    script.src = isDev ? 'https://cdn.jsdelivr.net/npm/chart.js' : './assets/chartjs/chart.umd.min.js';
    script.onload = () => {
        const dashboard = document.getElementById('viewDashboard');
        if (dashboard && dashboard.classList.contains('active')) {
            initCharts();
        }
    };
    script.onerror = () => {
        console.warn('Chart.js no se pudo cargar.');
    };
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    initBoot();
    initAccess();
    initNavigation();
    initTabs();
    initLogout();
    initChartJs();
});
