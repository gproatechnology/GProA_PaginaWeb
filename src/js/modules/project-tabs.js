/**
 * Project Tabs Module
 * Loads project data from JSON and renders cards dynamically
 */

import proyectos from '../../data/proyectos.js';

export async function initProjectTabs() {
    const tabs = document.querySelectorAll('.proyecto-tab');
    const container = document.getElementById('proyectosContainer');

    if (!tabs.length || !container) return;

    const projects = proyectos;

    container.innerHTML = '';

    projects.forEach((proyecto, index) => {
        const article = document.createElement('article');
        article.className = `proyecto-card ${index === 0 ? 'active' : ''}`;
        article.id = `proyecto-${proyecto.id}`;
        article.setAttribute('data-proyecto', proyecto.id);

        const featuresHtml = proyecto.features
            .map(f => `<li><i class="fas fa-check"></i> ${f}</li>`)
            .join('');

        article.innerHTML = `
            <div class="proyecto-info">
                <h3>${proyecto.title}</h3>
                <p class="proyecto-desc">${proyecto.description}</p>
                <p>${proyecto.longDescription}</p>
                <ul class="proyecto-features">
                    ${featuresHtml}
                </ul>
                <div class="proyecto-links">
                    <button type="button" class="btn btn-primary" aria-disabled="true" aria-label="Demo no disponible aún">Ver Demo</button>
                    <button type="button" class="btn btn-outline" aria-disabled="true" aria-label="PDF no disponible aún">Descargar PDF</button>
                </div>
            </div>
            <div class="proyecto-image">
                <div class="proyecto-placeholder">
                    <i class="fas ${proyecto.icon}"></i>
                    <span>${proyecto.acronym}</span>
                </div>
            </div>
        `;

        container.appendChild(article);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const proyectoId = tab.dataset.proyecto;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.proyecto-card').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`proyecto-${proyectoId}`);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}
