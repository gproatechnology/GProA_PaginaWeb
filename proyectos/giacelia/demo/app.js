/* GIACELIA Demo — app.js (Sprint 1: esqueleto) */

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-tab');
    const modules = document.querySelectorAll('.demo-module');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const module = tab.dataset.module;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            modules.forEach(m => m.classList.remove('active'));
            const target = document.getElementById(`modulo-${module}`);
            if (target) target.classList.add('active');
        });
    });

    // Placeholder: cargar ejemplo
    const btnEjemplo = document.getElementById('btnCargarEjemplo');
    if (btnEjemplo) {
        btnEjemplo.addEventListener('click', () => {
            const preview = document.getElementById('planoPreview');
            const componentes = document.getElementById('componentesDetected');
            if (preview) preview.style.display = 'block';
            if (componentes) componentes.style.display = 'block';
            const btnValidar = document.getElementById('btnValidar');
            if (btnValidar) btnValidar.disabled = false;
        });
    }

    // Placeholder: validación
    const btnValidar = document.getElementById('btnValidar');
    if (btnValidar) {
        btnValidar.addEventListener('click', () => {
            const alertas = document.getElementById('alertasValidacion');
            if (alertas) alertas.style.display = 'block';
        });
    }
});
