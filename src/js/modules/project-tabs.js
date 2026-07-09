/**
 * Project Tabs Module
 * Loads project data from JSON and renders cards dynamically
 */

import proyectos from '../../data/proyectos.js';
import { trapFocus } from '../utils/focus-trap.js';

export async function initProjectTabs() {
    const tabs = document.querySelectorAll('.proyecto-tab');
    const container = document.getElementById('proyectosContainer');
    const modal = document.getElementById('proyectoModal');
    const modalBody = document.getElementById('proyectoModalBody');
    const modalTitle = document.getElementById('proyectoModalTitle');
    const modalClose = document.getElementById('proyectoModalClose');
    const modalBackdrop = document.getElementById('proyectoModalBackdrop');

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
                    ${proyecto.demoUrl ? `<button type="button" class="btn btn-primary" data-demo="${proyecto.demoUrl}" aria-label="Abrir demo de ${proyecto.title}">Ver Demo</button>` : ''}
                    ${proyecto.docsUrl ? `<a href="${proyecto.docsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" aria-label="Ver documentación de ${proyecto.title}">Ver documentación</a>` : ''}
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

    const demoButtons = container.querySelectorAll('[data-demo]');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const demoUrl = btn.dataset.demo;
            if (!demoUrl || !modal || !modalBody) return;

            modalTitle.textContent = 'Demo del Proyecto';
            modalBody.innerHTML = `<iframe src="${demoUrl}" style="width:100%;height:70vh;border:none;border-radius:8px;" allow="fullscreen"></iframe>`;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';

            trapFocus({
                modal,
                onClose: closeProyectoModal,
                restoreSelector: '.proyecto-card'
            });
        });
    });

    function closeProyectoModal() {
        if (!modal || !modalBody) return;
        modal.classList.remove('open');
        modalBody.innerHTML = '';
        document.body.style.overflow = '';

        const activeTab = document.querySelector('.proyecto-tab.active');
        if (activeTab) activeTab.focus();
    }

    modalClose?.addEventListener('click', closeProyectoModal);
    modalBackdrop?.addEventListener('click', closeProyectoModal);
}
