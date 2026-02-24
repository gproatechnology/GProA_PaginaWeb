/**
 * Org Modal Module
 * Handles organization chart modal for team section
 */

// Make functions globally available for onclick handlers
window.showOrgModal = showOrgModal;
window.closeOrgModal = closeOrgModal;

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

    const info = orgData[type];
    if (info) {
        title.textContent = info.title;
        body.innerHTML = info.content;
    }

    modal.classList.add('show');

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrgModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrgModal();
        }
    });
}

function closeOrgModal() {
    const modal = document.getElementById('orgModal');
    modal.classList.remove('show');
}

export { showOrgModal, closeOrgModal };
