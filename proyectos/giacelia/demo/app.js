/* GIACELIA Demo — app.js (Sprint 2: visor de planos eléctricos) */

const PLANO_EJEMPLO_URL = './data/plano-ejemplo.json';

let componentesActuales = [];
let svgPlano = null;

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-tab');
    const modules = document.querySelectorAll('.demo-module');

    // Navegación por pestañas
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

    svgPlano = document.getElementById('svgPlano');

    // Cargar plano de ejemplo
    const btnEjemplo = document.getElementById('btnCargarEjemplo');
    if (btnEjemplo) {
        btnEjemplo.addEventListener('click', () => {
            cargarPlano(PLANO_EJEMPLO_URL);
        });
    }

    // Carga de archivo desde input oculto
    const fileInput = document.getElementById('filePlano');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    cargarPlanoData(data, file.name);
                } catch (err) {
                    alert('Error al leer el archivo JSON: ' + err.message);
                }
            };
            reader.readAsText(file);
        });

        // Abrir selector de archivo al hacer clic en drop zone (opcional)
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput.click());
        }
    }

    // Filtros de componentes
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarComponentes(btn.dataset.tipo);
        });
    });

    // Botón validar (placeholder para Sprint 5)
    const btnValidar = document.getElementById('btnValidar');
    if (btnValidar) {
        btnValidar.addEventListener('click', () => {
            const alertas = document.getElementById('alertasValidacion');
            if (alertas) alertas.style.display = 'block';
        });
    }
});

/**
 * Carga un plano desde URL
 */
async function cargarPlano(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('No se pudo cargar el plano');
        const data = await respuesta.json();
        cargarPlanoData(data, url.split('/').pop());
    } catch (err) {
        console.error('Error cargando plano:', err);
        alert('Error al cargar el plano de ejemplo.');
    }
}

/**
 * Procesa y renderiza los datos del plano
 */
function cargarPlanoData(data, nombreArchivo) {
    componentesActuales = data.componentes || [];

    // Mostrar información del plano
    const infoEl = document.getElementById('planoInfo');
    if (infoEl && data.proyecto) {
        infoEl.innerHTML = `
            <strong>Proyecto:</strong> ${data.proyecto.nombre}<br>
            <strong>Plano:</strong> ${data.proyecto.plano} &nbsp;|&nbsp; <strong>Versión:</strong> ${data.proyecto.version}<br>
            <strong>Archivo:</strong> ${nombreArchivo} &nbsp;|&nbsp; <strong>Fecha:</strong> ${data.proyecto.fecha}<br>
            <strong>Componentes detectados:</strong> ${componentesActuales.length}
        `;
    }

    // Mostrar secciones ocultas
    const preview = document.getElementById('planoPreview');
    const componentes = document.getElementById('componentesDetected');
    if (preview) preview.style.display = 'block';
    if (componentes) componentes.style.display = 'block';

    // Habilitar botón de validación
    const btnValidar = document.getElementById('btnValidar');
    if (btnValidar) btnValidar.disabled = false;

    // Renderizar SVG
    renderizarSVG(componentesActuales);

    // Poblar tabla
    renderizarTabla(componentesActuales);
}

/**
 * Renderiza los componentes como elementos SVG en el plano
 */
function renderizarSVG(componentes) {
    if (!svgPlano) return;

    // Limpiar SVG
    svgPlano.innerHTML = '';

    // Definiciones de símbolos
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#00e0ff" />
        </marker>
        <style>
            .comp-disyuntor { fill: #e74c3c; stroke: #c0392b; stroke-width: 2; }
            .comp-contactor { fill: #3498db; stroke: #2980b9; stroke-width: 2; }
            .comp-rele_termico { fill: #f39c12; stroke: #e67e22; stroke-width: 2; }
            .comp-rele_control { fill: #9b59b6; stroke: #8e44ad; stroke-width: 2; }
            .comp-boton { fill: #2ecc71; stroke: #27ae60; stroke-width: 2; }
            .comp-luz_indicadora { fill: #e74c3c; stroke: #c0392b; stroke-width: 2; }
            .comp-borne { fill: #95a5a6; stroke: #7f8c8d; stroke-width: 2; }
            .comp-motor { fill: #1abc9c; stroke: #16a085; stroke-width: 2; }
            .comp-contacto_auxiliar { fill: #34495e; stroke: #2c3e50; stroke-width: 2; }
            .comp-fusible { fill: #e67e22; stroke: #d35400; stroke-width: 2; }
            .label-comp { font-family: 'Exo 2', sans-serif; font-size: 11px; fill: #fff; text-anchor: middle; pointer-events: none; }
            .label-ref { font-family: 'Exo 2', sans-serif; font-size: 10px; fill: #00e0ff; text-anchor: middle; font-weight: bold; pointer-events: none; }
            .cable { stroke: #bdc3c7; stroke-width: 2; fill: none; opacity: 0.6; }
        </style>
    `;
    svgPlano.appendChild(defs);

    // Dibujar cables primero (fondo)
    const cables = dataCables || [];
    cables.forEach((cable, i) => {
        // Simular trazo entre componentes aproximados (usando posiciones aleatorias cercanas)
        const x1 = 100 + (i * 60);
        const y1 = 100;
        const x2 = 100 + (i * 60);
        const y2 = 300;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'cable');
        line.setAttribute('marker-end', 'url(#arrow)');
        svgPlano.appendChild(line);
    });

    // Dibujar componentes
    componentes.forEach(comp => {
        const { x, y } = comp.coordenadas || { x: 100, y: 100 };
        const clase = `comp-${comp.tipo}`;
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute('class', 'componente-grupo');
        grupo.setAttribute('data-id', comp.id);
        grupo.setAttribute('data-tipo', comp.tipo);
        grupo.setAttribute('transform', `translate(${x},${y})`);
        grupo.style.cursor = 'pointer';

        // Círculo base
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', 22);
        circle.setAttribute('class', clase);
        grupo.appendChild(circle);

        // Símbolo del componente
        const textoSimbolo = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textoSimbolo.setAttribute('class', 'label-comp');
        textoSimbolo.setAttribute('y', '4');
        textoSimbolo.textContent = comp.simbolo;
        grupo.appendChild(textoSimbolo);

        // Referencia
        const textoRef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textoRef.setAttribute('class', 'label-ref');
        textoRef.setAttribute('y', '32');
        textoRef.textContent = comp.referencia;
        grupo.appendChild(textoRef);

        // Evento click para destacar
        grupo.addEventListener('click', () => {
            document.querySelectorAll('.componente-grupo').forEach(g => {
                g.querySelector('circle').setAttribute('stroke-width', '2');
                g.querySelector('circle').setAttribute('filter', 'none');
            });
            circle.setAttribute('stroke-width', '4');
            circle.setAttribute('filter', 'drop-shadow(0 0 8px #00e0ff)');
            scrollToTabla(comp.id);
        });

        svgPlano.appendChild(grupo);
    });
}

/**
 * Renderiza la tabla de componentes detectados
 */
function renderizarTabla(componentes) {
    const tbody = document.getElementById('tbodyComponentes');
    if (!tbody) return;

    tbody.innerHTML = '';
    componentes.forEach(comp => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', comp.id);
        tr.setAttribute('data-tipo', comp.tipo);
        tr.innerHTML = `
            <td>${comp.descripcion}</td>
            <td><span class="badge-tipo">${comp.tipo}</span></td>
            <td><strong>${comp.referencia}</strong></td>
            <td>${comp.ubicacion}</td>
            <td><code>${comp.simbolo}</code></td>
        `;
        tr.addEventListener('click', () => destacarComponente(comp.id));
        tbody.appendChild(tr);
    });
}

/**
 * Filtra componentes por tipo
 */
function filtrarComponentes(tipo) {
    const filas = document.querySelectorAll('#tbodyComponentes tr');
    const svgGrupos = document.querySelectorAll('.componente-grupo');

    filas.forEach(fila => {
        const match = tipo === 'todos' || fila.dataset.tipo === tipo;
        fila.style.display = match ? '' : 'none';
    });

    svgGrupos.forEach(grupo => {
        const match = tipo === 'todos' || grupo.dataset.tipo === tipo;
        grupo.style.opacity = match ? '1' : '0.3';
    });
}

/**
 * Destaca un componente desde la tabla
 */
function destacarComponente(id) {
    // Scroll y destacar en tabla
    const fila = document.querySelector(`#tbodyComponentes tr[data-id="${id}"]`);
    if (fila) {
        fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fila.classList.add('highlight');
        setTimeout(() => fila.classList.remove('highlight'), 1000);
    }

    // Destacar en SVG
    const grupo = document.querySelector(`.componente-grupo[data-id="${id}"]`);
    if (grupo) {
        const circle = grupo.querySelector('circle');
        if (circle) {
            circle.setAttribute('stroke-width', '4');
            circle.setAttribute('filter', 'drop-shadow(0 0 8px #00e0ff)');
        }
        // Mover vista del SVG (simulado)
        const punto = svgPlano.createSVGPoint();
        const rect = grupo.getBoundingClientRect();
        // No movemos la vista automáticamente para no desorientar, solo destacamos
    }
}

/**
 * Scroll a una fila de la tabla
 */
function scrollToTabla(id) {
    const fila = document.querySelector(`#tbodyComponentes tr[data-id="${id}"]`);
    if (fila) fila.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Datos de cableado (se inyectan al cargar el plano)
 */
let dataCables = [];

// Sobrescribimos cargarPlanoData para también guardar los cables
const _cargarPlanoDataOriginal = cargarPlanoData;
cargarPlanoData = function(data, nombreArchivo) {
    dataCables = data.cableado || [];
    _cargarPlanoDataOriginal.call(this, data, nombreArchivo);
};
