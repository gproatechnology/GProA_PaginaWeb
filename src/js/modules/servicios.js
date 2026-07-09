/**
 * Servicios Module
 * Handles service cards opening a modal instead of inline expand
 */

import { trapFocus } from '../utils/focus-trap.js';

export function initServicios() {
    const servicioCards = document.querySelectorAll('.servicio-card');
    const modal = document.getElementById('servicioModal');
    const modalBody = document.getElementById('servicioModalBody');
    const modalTitle = document.getElementById('servicioModalTitle');
    const modalClose = document.getElementById('servicioModalClose');
    const modalBackdrop = document.getElementById('servicioModalBackdrop');

    if (!servicioCards.length || !modal || !modalBody || !modalClose || !modalBackdrop) return;

    let cleanup = null;

    function openServicioModal(card) {
        const titleEl = card.querySelector('.servicio-title h3');
        const contentEl = card.querySelector('.servicio-content');
        const iconEl = card.querySelector('.servicio-icon i');
        const descEl = card.querySelector('.servicio-title p');

        if (!contentEl) return;

        const iconClass = iconEl ? iconEl.className : '';
        const titleText = titleEl ? titleEl.innerHTML : '';
        const descText = descEl ? descEl.textContent : '';

        modalTitle.innerHTML = `
            <span class="servicio-modal-icon"><i class="${iconClass}"></i></span>
            <span>${titleText}</span>
        `;

        const clone = contentEl.cloneNode(true);
        modalBody.innerHTML = '';
        modalBody.appendChild(clone);

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        cleanup = trapFocus({
            modal,
            onClose: closeModal,
            restoreSelector: '.servicio-card'
        });
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';

        if (cleanup) {
            cleanup();
            cleanup = null;
        }
    }

    servicioCards.forEach(card => {
        const header = card.querySelector('.servicio-header');
        const toggle = card.querySelector('.servicio-toggle');

        const openCard = () => openServicioModal(card);

        if (header) {
            header.addEventListener('click', openCard);
        }

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                openCard();
            });
        }

        header?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCard();
            }
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);
}
