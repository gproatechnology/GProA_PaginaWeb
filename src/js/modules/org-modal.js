/**
 * Org Modal Module
 * Handles organization chart modal for team section
 * Includes focus trap for accessibility (WCAG 2.2.2)
 */

import { trapFocus } from '../utils/focus-trap.js';

const orgData = {
    'CEO': {
        title: 'Chief Executive Officer',
        content: `
            <p><strong>Juan Abdel Lugo Trejo</strong> es el fundador y CEO de GProA Technology. Líder visionario con amplia experiencia en desarrollo de software y automatización industrial.</p>
            
            <h3>Responsabilidades</h3>
            <ul>
                <li>Definir la visión estratégica de la empresa</li>
                <li>Liderar el desarrollo de productos tecnológicos</li>
                <li>Dirigir la dirección técnica y desarrollo</li>
                <li>Gestionar relaciones con clientes estratégicos</li>
            </ul>
            
            <h3>Contacto</h3>
            <p>📧 trejulu@gproatechnology.com</p>
            <p>📞 +52 1 468 120 8570</p>
        `
    },
    'COO': {
        title: 'Chief Operating Officer',
        content: `
            <p><strong>Israel Aldair Reséndiz Gálvez</strong> es el COO de GProA Technology. Responsable de la operación diaria y la estructura administrativa de la empresa.</p>
            
            <h3>Responsabilidades</h3>
            <ul>
                <li>Supervisar las operaciones diarias</li>
                <li>Gestionar la administración general</li>
                <li>Coordinar asuntos legales y cumplimiento normativo</li>
                <li>Administrar finanzas y contabilidad</li>
            </ul>
            
            <h3>Contacto</h3>
            <p>📧 admin@gproatechnology.com</p>
            <p>📞 +52 1 419 129 6200</p>
        `
    }
};

let orgCleanup = null;

function showOrgModal(type) {
    const modal = document.getElementById('orgModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    const info = orgData[type];
    if (info) {
        title.textContent = info.title;
        body.innerHTML = info.content;
    }

    modal.classList.add('show');

    orgCleanup = trapFocus({
        modal,
        onClose: closeOrgModal,
        restoreSelector: '.executive-btn'
    });
}

function closeOrgModal() {
    const modal = document.getElementById('orgModal');
    if (orgCleanup) {
        orgCleanup();
        orgCleanup = null;
    }
    modal.classList.remove('show');
}

export { showOrgModal, closeOrgModal };

export function initOrgModal() {
    document.querySelectorAll('.executive-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (type) showOrgModal(type);
        });
    });

    const modal = document.getElementById('orgModal');
    const closeBtn = modal?.querySelector('.modal-close');

    closeBtn?.addEventListener('click', closeOrgModal);
}
