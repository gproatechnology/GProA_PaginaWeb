/**
 * GProA Technology - Cliente Access Page
 * Gyproc - Saint-Gobain
 * Validación de código NDA y visualización de dossier
 */

const ACCESS_CODE = 'SG-NDA-2026';

function initAccess() {
    const form = document.getElementById('accessForm');
    const input = document.getElementById('accessCode');
    const errorEl = document.getElementById('accessError');
    const accessBody = document.getElementById('accessBody');
    const dossier = document.getElementById('accessDossier');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = input.value.trim();

        if (code === ACCESS_CODE) {
            errorEl.textContent = '';
            accessBody.style.display = 'none';
            dossier.style.display = 'block';
            input.value = '';
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

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            dossier.style.display = 'none';
            accessBody.style.display = 'block';
            input.value = '';
            errorEl.textContent = '';
            input.focus();
        });
    }
}

document.addEventListener('DOMContentLoaded', initAccess);