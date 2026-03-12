/**
 * Org Modal Module
 * Handles organization chart modal for team section
 * Includes focus trap for accessibility (WCAG 2.2.2)
 */

// Make functions globally available for onclick handlers
window.showOrgModal = showOrgModal;
window.closeOrgModal = closeOrgModal;

// Store previously focused element for focus restoration
let previouslyFocused = null;

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

function showOrgModal(type) {
    const modal = document.getElementById('orgModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    // Save currently focused element
    previouslyFocused = document.activeElement;

    const info = orgData[type];
    if (info) {
        title.textContent = info.title;
        body.innerHTML = info.content;
    }

    modal.classList.add('show');

    // Focus first focusable element in modal
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrgModal();
        }
    });

    // Handle keyboard navigation (focus trap)
    modal.addEventListener('keydown', handleFocusTrap);
}

function handleFocusTrap(e) {
    const modal = document.getElementById('orgModal');
    if (!modal.classList.contains('show')) return;

    // Get all focusable elements in modal
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Handle Tab key
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Close on Escape key
    if (e.key === 'Escape') {
        closeOrgModal();
    }
}

function closeOrgModal() {
    const modal = document.getElementById('orgModal');
    modal.classList.remove('show');

    // Remove focus trap listener
    modal.removeEventListener('keydown', handleFocusTrap);

    // Restore focus to previously focused element
    if (previouslyFocused) {
        previouslyFocused.focus();
        previouslyFocused = null;
    }
}

export { showOrgModal, closeOrgModal };
