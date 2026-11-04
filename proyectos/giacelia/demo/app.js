/* GIACELIA Demo — app.js (Sprint 3: módulo de migración) */

const PLANO_EJEMPLO_URL = './data/plano-ejemplo.json';
const PLANO_VERSION_B_URL = './data/plano-version-b.json';

let componentesActuales = [];
let svgPlano = null;
let dataCables = [];

// Datos de migración
let versionA = null;
let versionB = null;

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

    // Cargar plano de ejemplo (módulo carga)
    const btnEjemplo = document.getElementById('btnCargarEjemplo');
    if (btnEjemplo) {
        btnEjemplo.addEventListener('click', () => {
            cargarPlano(PLANO_EJEMPLO_URL);
        });
    }

    // Carga de archivo desde input oculto (módulo carga)
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

        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput.click());
        }
    }

    // --- Migración: cargar versión A ---
    const inputA = document.getElementById('fileVersionA');
    const infoA = document.getElementById('infoVersionA');
    if (inputA && infoA) {
        inputA.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    versionA = JSON.parse(evt.target.result);
                    infoA.textContent = `${file.name} — v${versionA.proyecto.version} (${versionA.componentes.length} componentes)`;
                    infoA.className = 'version-info cargada';
                    actualizarEstadoComparar();
                } catch (err) {
                    alert('Error al leer versión A: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // --- Migración: cargar versión B ---
    const inputB = document.getElementById('fileVersionB');
    const infoB = document.getElementById('infoVersionB');
    if (inputB && infoB) {
        inputB.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    versionB = JSON.parse(evt.target.result);
                    infoB.textContent = `${file.name} — v${versionB.proyecto.version} (${versionB.componentes.length} componentes)`;
                    infoB.className = 'version-info cargada';
                    actualizarEstadoComparar();
                } catch (err) {
                    alert('Error al leer versión B: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // --- Migración: botón comparar ---
    const btnComparar = document.getElementById('btnComparar');
    if (btnComparar) {
        btnComparar.addEventListener('click', () => {
            if (!versionA || !versionB) return;
            const resultado = compararVersiones(versionA, versionB);
            renderizarResultadoMigracion(resultado);
        });
    }

    // Filtros de componentes (módulo carga)
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarComponentes(btn.dataset.tipo);
        });
    });

    // Botón validar (placeholder Sprint 5)
    const btnValidar = document.getElementById('btnValidar');
    if (btnValidar) {
        btnValidar.addEventListener('click', () => {
            const alertas = document.getElementById('alertasValidacion');
            if (alertas) alertas.style.display = 'block';
        });
    }

    // Botones de carga rápida para migración (ejemplos)
    const btnCargarA = document.getElementById('btnCargarVersionA');
    const btnCargarB = document.getElementById('btnCargarVersionB');
    if (btnCargarA) {
        btnCargarA.addEventListener('click', () => cargarPlanoDataMigracion(PLANO_EJEMPLO_URL, 'A'));
    }
    if (btnCargarB) {
        btnCargarB.addEventListener('click', () => cargarPlanoDataMigracion(PLANO_VERSION_B_URL, 'B'));
    }
});

/**
 * Carga un plano desde URL y lo asigna como versión A o B para migración
 */
async function cargarPlanoDataMigracion(url, version) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('No se pudo cargar el plano');
        const data = await respuesta.json();

        if (version === 'A') {
            versionA = data;
            const infoA = document.getElementById('infoVersionA');
            if (infoA) {
                infoA.textContent = `${data.proyecto.plano} — v${data.proyecto.version} (${data.componentes.length} componentes)`;
                infoA.className = 'version-info cargada';
            }
        } else {
            versionB = data;
            const infoB = document.getElementById('infoVersionB');
            if (infoB) {
                infoB.textContent = `${data.proyecto.plano} — v${data.proyecto.version} (${data.componentes.length} componentes)`;
                infoB.className = 'version-info cargada';
            }
        }
        actualizarEstadoComparar();
    } catch (err) {
        console.error('Error cargando versión:', err);
        alert('Error al cargar la versión ' + version);
    }
}

/**
 * Carga un plano desde URL (módulo carga de planos)
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
 * Procesa y renderiza los datos del plano (módulo carga)
 */
function cargarPlanoData(data, nombreArchivo) {
    componentesActuales = data.componentes || [];
    dataCables = data.cableado || [];

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
 * Habilita/deshabilita el botón comparar según versiones cargadas
 */
function actualizarEstadoComparar() {
    const btnComparar = document.getElementById('btnComparar');
    if (btnComparar) {
        btnComparar.disabled = !(versionA && versionB);
    }
}

/**
 * Compara dos versiones de un plano y detecta diferencias
 */
function compararVersiones(vA, vB) {
    const compA = vA.componentes || [];
    const compB = vB.componentes || [];

    const mapaA = {};
    compA.forEach(c => { mapaA[c.id] = c; });

    const mapaB = {};
    compB.forEach(c => { mapaB[c.id] = c; });

    const resultado = {
        proyecto: vB.proyecto,
        versionA: vA.proyecto.version,
        versionB: vB.proyecto.version,
        añadidos: [],
        eliminados: [],
        modificados: [],
        sinCambios: 0,
        resumen: {}
    };

    // Detectar añadidos y modificados
    compB.forEach(compB => {
        const compA = mapaA[compB.id];
        if (!compA) {
            resultado.añadidos.push({ ...compB, cambio: 'añadido' });
        } else {
            const diff = detectarDiferencias(compA, compB);
            if (diff.cambios.length > 0) {
                resultado.modificados.push({
                    ...compB,
                    anterior: compA,
                    cambios: diff.cambios
                });
            } else {
                resultado.sinCambios++;
            }
        }
    });

    // Detectar eliminados
    compA.forEach(compA => {
        if (!mapaB[compA.id]) {
            resultado.eliminados.push({ ...compA, cambio: 'eliminado' });
        }
    });

    // Resumen
    resultado.resumen = {
        totalA: compA.length,
        totalB: compB.length,
        añadidos: resultado.añadidos.length,
        eliminados: resultado.eliminados.length,
        modificados: resultado.modificados.length,
        sinCambios: resultado.sinCambios
    };

    return resultado;
}

/**
 * Detecta diferencias entre dos componentes mismos (por id)
 */
function detectarDiferencias(a, b) {
    const cambios = [];
    const campos = ['tipo', 'referencia', 'descripcion', 'ubicacion', 'simbolo', 'propiedades'];

    campos.forEach(campo => {
        const valA = JSON.stringify(a[campo]);
        const valB = JSON.stringify(b[campo]);
        if (valA !== valB) {
            cambios.push({
                campo,
                anterior: a[campo],
                actual: b[campo]
            });
        }
    });

    return { cambios };
}

/**
 * Renderiza el resultado de la migración en el DOM
 */
function renderizarResultadoMigracion(resultado) {
    const contenedor = document.getElementById('resultadoComparacion');
    if (!contenedor) return;

    contenedor.style.display = 'block';

    const claseAñadido = 'cambio-añadido';
    const claseEliminado = 'cambio-eliminado';
    const claseModificado = 'cambio-modificado';

    let html = `
        <div class="migracion-resumen">
            <div class="resumen-tarjeta">
                <h4>Versión A → Versión B</h4>
                <p><strong>${resultado.versionA}</strong> → <strong>${resultado.versionB}</strong></p>
                <p><strong>${resultado.proyecto.plano}</strong> — ${resultado.proyecto.nombre}</p>
            </div>
            <div class="resumen-contadores">
                <div class="contador sin-cambios">
                    <span class="numero">${resultado.sinCambios}</span>
                    <span class="etiqueta">Sin cambios</span>
                </div>
                <div class="contador añadido">
                    <span class="numero">${resultado.resumen.añadidos}</span>
                    <span class="etiqueta">Añadidos</span>
                </div>
                <div class="contador eliminado">
                    <span class="numero">${resultado.resumen.eliminados}</span>
                    <span class="etiqueta">Eliminados</span>
                </div>
                <div class="contador modificado">
                    <span class="numero">${resultado.resumen.modificados}</span>
                    <span class="etiqueta">Modificados</span>
                </div>
            </div>
        </div>
    `;

    // Añadidos
    if (resultado.añadidos.length > 0) {
        html += `<h3 style="color:#2ecc71; margin-top: 25px;"><i class="fas fa-plus-circle"></i> Componentes Añadidos (${resultado.añadidos.length})</h3>`;
        html += `<table class="tabla-componentes tabla-migracion"><thead><tr><th>Componente</th><th>Tipo</th><th>Referencia</th><th>Ubicación</th><th>Cambio</th></tr></thead><tbody>`;
        resultado.añadidos.forEach(c => {
            html += `
                <tr class="fila-añadido">
                    <td>${c.descripcion}</td>
                    <td><span class="badge-tipo">${c.tipo}</span></td>
                    <td><strong>${c.referencia}</strong></td>
                    <td>${c.ubicacion}</td>
                    <td><span class="badge-cambio añadido">+ Añadido</span></td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
    }

    // Eliminados
    if (resultado.eliminados.length > 0) {
        html += `<h3 style="color:#e74c3c; margin-top: 25px;"><i class="fas fa-minus-circle"></i> Componentes Eliminados (${resultado.eliminados.length})</h3>`;
        html += `<table class="tabla-componentes tabla-migracion"><thead><tr><th>Componente</th><th>Tipo</th><th>Referencia</th><th>Ubicación</th><th>Cambio</th></tr></thead><tbody>`;
        resultado.eliminados.forEach(c => {
            html += `
                <tr class="fila-eliminado">
                    <td>${c.descripcion}</td>
                    <td><span class="badge-tipo">${c.tipo}</span></td>
                    <td><strong>${c.referencia}</strong></td>
                    <td>${c.ubicacion}</td>
                    <td><span class="badge-cambio eliminado">- Eliminado</span></td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
    }

    // Modificados
    if (resultado.modificados.length > 0) {
        html += `<h3 style="color:#f39c12; margin-top: 25px;"><i class="fas fa-edit"></i> Componentes Modificados (${resultado.modificados.length})</h3>`;
        html += `<table class="tabla-componentes tabla-migracion"><thead><tr><th>Componente</th><th>Referencia</th><th>Campo Modificado</th><th>Valor Anterior</th><th>Valor Actual</th></tr></thead><tbody>`;
        resultado.modificados.forEach(c => {
            c.cambios.forEach(cambio => {
                html += `
                    <tr class="fila-modificado">
                        <td>${c.descripcion}</td>
                        <td><strong>${c.referencia}</strong></td>
                        <td><code>${cambio.campo}</code></td>
                        <td>${formatearValor(cambio.anterior)}</td>
                        <td>${formatearValor(cambio.actual)}</td>
                    </tr>
                `;
            });
        });
        html += `</tbody></table>`;
    }

    if (resultado.añadidos.length === 0 && resultado.eliminados.length === 0 && resultado.modificados.length === 0) {
        html += `<div class="sin-cambios-msg"><p><i class="fas fa-check-circle"></i> No se detectaron diferencias entre las versiones.</p></div>`;
    }

    contenedor.innerHTML = html;
}

/**
 * Formatea un valor para mostrar en la tabla de modificados
 */
function formatearValor(val) {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

/**
 * Renderiza los componentes como elementos SVG en el plano
 */
function renderizarSVG(componentes) {
    if (!svgPlano) return;

    svgPlano.innerHTML = '';

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

    const cables = dataCables || [];
    cables.forEach((cable, i) => {
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

    componentes.forEach(comp => {
        const { x, y } = comp.coordenadas || { x: 100, y: 100 };
        const clase = `comp-${comp.tipo}`;
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute('class', 'componente-grupo');
        grupo.setAttribute('data-id', comp.id);
        grupo.setAttribute('data-tipo', comp.tipo);
        grupo.setAttribute('transform', `translate(${x},${y})`);
        grupo.style.cursor = 'pointer';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', 22);
        circle.setAttribute('class', clase);
        grupo.appendChild(circle);

        const textoSimbolo = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textoSimbolo.setAttribute('class', 'label-comp');
        textoSimbolo.setAttribute('y', '4');
        textoSimbolo.textContent = comp.simbolo;
        grupo.appendChild(textoSimbolo);

        const textoRef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textoRef.setAttribute('class', 'label-ref');
        textoRef.setAttribute('y', '32');
        textoRef.textContent = comp.referencia;
        grupo.appendChild(textoRef);

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
    const fila = document.querySelector(`#tbodyComponentes tr[data-id="${id}"]`);
    if (fila) {
        fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fila.classList.add('highlight');
        setTimeout(() => fila.classList.remove('highlight'), 1000);
    }

    const grupo = document.querySelector(`.componente-grupo[data-id="${id}"]`);
    if (grupo) {
        const circle = grupo.querySelector('circle');
        if (circle) {
            circle.setAttribute('stroke-width', '4');
            circle.setAttribute('filter', 'drop-shadow(0 0 8px #00e0ff)');
        }
    }
}

/**
 * Scroll a una fila de la tabla
 */
function scrollToTabla(id) {
    const fila = document.querySelector(`#tbodyComponentes tr[data-id="${id}"]`);
    if (fila) fila.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
