/**
 * Tecnologías Module
 * Handles tech cards opening a modal
 */

import { trapFocus } from '../utils/focus-trap.js';

export function initTecnologias() {
    const techCards = document.querySelectorAll('.tech-card');
    const modal = document.getElementById('techModal');
    const modalBody = document.getElementById('techModalBody');
    const modalTitle = document.getElementById('techModalTitle');
    const modalClose = document.getElementById('techModalClose');
    const modalBackdrop = document.getElementById('techModalBackdrop');

    if (!techCards.length || !modal || !modalBody || !modalClose || !modalBackdrop) return;

    let cleanup = null;

    function openTechModal(card) {
        const iconEl = card.querySelector('i');
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');
        const listEl = card.querySelector('.tech-list');
        const tagsEl = card.querySelector('.tech-tags');

        if (!titleEl || !descEl) return;

        const iconClass = iconEl ? iconEl.className : '';
        const titleText = titleEl.innerHTML;
        const descText = descEl.textContent || '';

        modalTitle.innerHTML = `
            <span class="tech-modal-icon"><i class="${iconClass}"></i></span>
            <span>${titleText}</span>
        `;

        let bodyHtml = `<p>${descText}</p>`;

        if (listEl) {
            bodyHtml += listEl.outerHTML;
        }

        if (tagsEl) {
            bodyHtml += tagsEl.outerHTML;
        }

        modalBody.innerHTML = bodyHtml;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        cleanup = trapFocus({
            modal,
            onClose: closeModal,
            restoreSelector: '.tech-card'
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

    techCards.forEach(card => {
        card.addEventListener('click', () => openTechModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTechModal(card);
            }
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);
}
