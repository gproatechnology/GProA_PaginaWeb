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

    // --- Ingeniería de detalle: generar cálculos ---
    const btnGenerarDetalle = document.getElementById('btnGenerarDetalle');
    if (btnGenerarDetalle) {
        btnGenerarDetalle.addEventListener('click', () => {
            const hp = parseFloat(document.getElementById('hpMotor').value) || 0;
            const voltaje = parseFloat(document.getElementById('voltajeMotor').value) || 0;
            const fases = parseInt(document.getElementById('fasesMotor').value) || 3;
            if (hp <= 0 || voltaje <= 0) {
                alert('Ingresa valores válidos de potencia y voltaje.');
                return;
            }
            const detalle = calcularIngenieríaDetalle(hp, voltaje, fases);
            renderizarResultadoDetalle(detalle);
        });
    }
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

/* ============================================================
   Sprint 4: Ingeniería de Detalle
   ============================================================ */

const FP_DEFAULT = 0.85;
const EFICIENCIA_DEFAULT = 0.90;

/**
 * Calcula ingeniería de detalle a partir de HP, voltaje y fases.
 */
function calcularIngenieríaDetalle(hp, voltaje, fases) {
    const potenciaW = hp * 746;
    const raiz3 = Math.sqrt(3);

    // Corriente nominal del motor
    let denominador;
    if (fases === 3) {
        denominador = raiz3 * voltaje * FP_DEFAULT * EFICIENCIA_DEFAULT;
    } else {
        denominador = voltaje * FP_DEFAULT * EFICIENCIA_DEFAULT;
    }
    const corrienteNominal = potenciaW / denominador;

    // Corriente de arranque (aprox 6x nominal)
    const corrienteArranque = corrienteNominal * 6;

    // Corriente de diseño (125% del nominal para protecciones)
    const corrienteDiseno = corrienteNominal * 1.25;

    // Selección de sección de cable (mm²) simplificada por ampacidad
    const seccionCable = seleccionarSeccionCable(corrienteDiseno);

    // Selección de disyuntor (calibre comercial estándar)
    const disyuntor = seleccionarDisyuntor(corrienteDiseno);

    // Selección de relé térmico (rango cercano al nominal)
    const releTermico = seleccionarReleTermico(corrienteNominal);

    // Selección de contactor (corriente AC-3 aproximada)
    const contactor = seleccionarContactor(corrienteNominal);

    // Sección de cable de control
    const seccionControl = '1.5mm²';

    // BOM (Lista de materiales)
    const bom = [
        { item: 1, descripcion: 'Disyuntor principal 3P', referencia: disyuntor.referencia, cantidad: 1, unidad: 'pza', notas: `${disyuntor.calibre}A, ${voltaje}V` },
        { item: 2, descripcion: 'Contactor principal 3P', referencia: contactor.referencia, cantidad: 1, unidad: 'pza', notas: `${contactor.calibre}A, bobina ${voltaje}V` },
        { item: 3, descripcion: 'Relé térmico de sobrecarga', referencia: releTermico.referencia, cantidad: 1, unidad: 'pza', notas: `Rango ${releTermico.rango}A` },
        { item: 4, descripcion: 'Relé de control', referencia: 'K2', cantidad: 1, unidad: 'pza', notas: `220V, 2NA+2NC` },
        { item: 5, descripcion: 'Botón arranque (Start)', referencia: 'SB1', cantidad: 1, unidad: 'pza', notas: 'NA, verde' },
        { item: 6, descripcion: 'Botón parada (Stop)', referencia: 'SB2', cantidad: 1, unidad: 'pza', notas: 'NC, rojo' },
        { item: 7, descripcion: 'Luz indicadora marcha', referencia: 'PL1', cantidad: 1, unidad: 'pza', notas: 'Verde, 220V' },
        { item: 8, descripcion: 'Luz indicadora paro', referencia: 'PL2', cantidad: 1, unidad: 'pza', notas: 'Rojo, 220V' },
        { item: 9, descripcion: `Cable potencia ${seccionCable}`, referencia: 'CABLE-POT', cantidad: Math.ceil(hp * 1.5), unidad: 'm', notas: `Sección ${seccionCable}, color negro` },
        { item: 10, descripcion: `Cable control ${seccionControl}`, referencia: 'CABLE-CTL', cantidad: Math.ceil(hp * 1.0), unidad: 'm', notas: `Sección ${seccionControl}, colores varios` },
        { item: 11, descripcion: 'Bornes de conexión 2.5mm²', referencia: 'X1-Xn', cantidad: 6, unidad: 'pza', notas: 'Pasantes, gris' },
        { item: 12, descripcion: 'Motor trifásico', referencia: 'M1', cantidad: 1, unidad: 'pza', notas: `${hp}HP, ${voltaje}V, ${fases === 3 ? '3F' : '1F'}` }
    ];

    // Tabla de cableado (potencia)
    const cableadoPotencia = [
        { origen: 'Q1 (L1)', destino: 'F1', seccion: seccionCable, color: 'Negro', borne: 'L1' },
        { origen: 'Q1 (L2)', destino: 'F1', seccion: seccionCable, color: 'Negro', borne: 'L2' },
        { origen: 'Q1 (L3)', destino: 'F1', seccion: seccionCable, color: 'Negro', borne: 'L3' },
        { origen: 'F1', destino: 'K1(A1)', seccion: seccionCable, color: 'Rojo', borne: '13-14' },
        { origen: 'K1(T1)', destino: 'FR1(L1)', seccion: seccionCable, color: 'Negro', borne: 'T1' },
        { origen: 'K1(T2)', destino: 'FR1(L2)', seccion: seccionCable, color: 'Negro', borne: 'T2' },
        { origen: 'K1(T3)', destino: 'FR1(L3)', seccion: seccionCable, color: 'Negro', borne: 'T3' },
        { origen: 'FR1(T1)', destino: 'M1(U)', seccion: seccionCable, color: 'Negro', borne: 'T1' },
        { origen: 'FR1(T2)', destino: 'M1(V)', seccion: seccionCable, color: 'Negro', borne: 'T2' },
        { origen: 'FR1(T3)', destino: 'M1(W)', seccion: seccionCable, color: 'Negro', borne: 'T3' }
    ];

    // Tabla de cableado (control)
    const cableadoControl = [
        { origen: 'K1(A2)', destino: 'SB2', seccion: seccionControl, color: 'Azul', borne: 'A2' },
        { origen: 'SB2', destino: 'SB1', seccion: seccionControl, color: 'Azul', borne: '1-2' },
        { origen: 'SB1', destino: 'K1(A1)', seccion: seccionControl, color: 'Azul', borne: '3-4' },
        { origen: 'K1(NO aux)', destino: 'PL1', seccion: seccionControl, color: 'Rojo', borne: '13-14' },
        { origen: 'FR1(NC)', destino: 'PL2', seccion: seccionControl, color: 'Amarillo', borne: '95-96' }
    ];

    return {
        hp,
        voltaje,
        fases: fases === 3 ? 'Trifásico (3F)' : 'Monofásico (1F)',
        potenciaW: Math.round(potenciaW),
        corrienteNominal: Math.round(corrienteNominal * 100) / 100,
        corrienteArranque: Math.round(corrienteArranque * 100) / 100,
        corrienteDiseno: Math.round(corrienteDiseno * 100) / 100,
        seccionCable,
        seccionControl,
        disyuntor,
        contactor,
        releTermico,
        bom,
        cableadoPotencia,
        cableadoControl,
        fecha: new Date().toISOString().split('T')[0]
    };
}

/**
 * Selecciona sección de cable (mm²) por ampacidad simplificada (75°C, cobre)
 */
function seleccionarSeccionCable(amperios) {
    const tabla = [
        { mm2: '1.5mm²', maxA: 18 },
        { mm2: '2.5mm²', maxA: 26 },
        { mm2: '4mm²', maxA: 34 },
        { mm2: '6mm²', maxA: 45 },
        { mm2: '10mm²', maxA: 62 },
        { mm2: '16mm²', maxA: 83 },
        { mm2: '25mm²', maxA: 110 }
    ];
    for (const t of tabla) {
        if (amperios <= t.maxA) return t.mm2;
    }
    return '35mm²+';
}

/**
 * Selecciona calibre de disyuntor (estándar comercial)
 */
function seleccionarDisyuntor(amperios) {
    const escalas = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
    let calibre = 10;
    for (const e of escalas) {
        if (amperios <= e) { calibre = e; break; }
        calibre = e;
    }
    if (amperios > 100) calibre = Math.ceil(amperios / 10) * 10;
    return {
        referencia: `Q1-${calibre}A`,
        calibre,
        tipo: 'Disyuntor termomagnético 3P'
    };
}

/**
 * Selecciona relé térmico (rango de ajuste)
 */
function seleccionarReleTermico(corrienteNominal) {
    const rangos = [
        { min: 0.1, max: 0.16, texto: '0.10-0.16A' },
        { min: 0.16, max: 0.25, texto: '0.16-0.25A' },
        { min: 0.25, max: 0.40, texto: '0.25-0.40A' },
        { min: 0.40, max: 0.63, texto: '0.40-0.63A' },
        { min: 0.63, max: 1.0, texto: '0.63-1.0A' },
        { min: 1.0, max: 1.6, texto: '1.0-1.6A' },
        { min: 1.6, max: 2.5, texto: '1.6-2.5A' },
        { min: 2.5, max: 4.0, texto: '2.5-4.0A' },
        { min: 4.0, max: 6.3, texto: '4.0-6.3A' },
        { min: 6.3, max: 10, texto: '6.3-10A' },
        { min: 10, max: 16, texto: '10-16A' },
        { min: 16, max: 25, texto: '16-25A' },
        { min: 25, max: 40, texto: '25-40A' }
    ];
    for (const r of rangos) {
        if (corrienteNominal >= r.min && corrienteNominal <= r.max) {
            return { referencia: `FR1-${r.texto}`, rango: r.texto };
        }
    }
    return { referencia: 'FR1->40A', rango: '>40A (consultar tabla)' };
}

/**
 * Selecciona contactor (corriente AC-3)
 */
function seleccionarContactor(corrienteNominal) {
    const escalas = [9, 12, 18, 25, 32, 40, 50, 65, 80, 95];
    let calibre = 9;
    for (const e of escalas) {
        if (corrienteNominal <= e) { calibre = e; break; }
        calibre = e;
    }
    if (corrienteNominal > 95) calibre = Math.ceil(corrienteNominal / 5) * 5;
    return {
        referencia: `K1-${calibre}A`,
        calibre,
        tipo: 'Contactor 3P, bobina 220V'
    };
}

/**
 * Renderiza el resultado de ingeniería de detalle en el DOM
 */
function renderizarResultadoDetalle(d) {
    const contenedor = document.getElementById('resultadoDetalle');
    if (!contenedor) return;
    contenedor.style.display = 'block';

    let html = `
        <div class="detalle-resumen">
            <div class="detalle-tarjeta">
                <h4>Parámetros de diseño</h4>
                <p><strong>Motor:</strong> ${d.hp} HP</p>
                <p><strong>Voltaje:</strong> ${d.voltaje} V</p>
                <p><strong>Fases:</strong> ${d.fases}</p>
                <p><strong>Potencia:</strong> ${d.potenciaW} W</p>
            </div>
            <div class="detalle-tarjeta">
                <h4>Corrientes calculadas</h4>
                <p><strong>Nominal:</strong> ${d.corrienteNominal} A</p>
                <p><strong>Arranque (≈6×):</strong> ${d.corrienteArranque} A</p>
                <p><strong>Diseño (1.25×):</strong> ${d.corrienteDiseno} A</p>
            </div>
            <div class="detalle-tarjeta">
                <h4>Selección de componentes</h4>
                <p><strong>Cable potencia:</strong> ${d.seccionCable}</p>
                <p><strong>Cable control:</strong> ${d.seccionControl}</p>
                <p><strong>Disyuntor:</strong> ${d.disyuntor.referencia}</p>
                <p><strong>Contactor:</strong> ${d.contactor.referencia}</p>
                <p><strong>Relé térmico:</strong> ${d.releTermico.referencia}</p>
            </div>
        </div>
    `;

    // BOM
    html += `
        <h3 style="color:#00e0ff; margin-top: 25px;"><i class="fas fa-list"></i> Lista de Materiales (BOM)</h3>
        <table class="tabla-componentes tabla-detalle">
            <thead>
                <tr><th>Ítem</th><th>Descripción</th><th>Referencia</th><th>Cant.</th><th>Unidad</th><th>Notas</th></tr>
            </thead>
            <tbody>
    `;
    d.bom.forEach(item => {
        html += `
            <tr>
                <td>${item.item}</td>
                <td>${item.descripcion}</td>
                <td><strong>${item.referencia}</strong></td>
                <td>${item.cantidad}</td>
                <td>${item.unidad}</td>
                <td>${item.notas}</td>
            </tr>
        `;
    });
    html += `</tbody></table>`;

    // Cableado potencia
    html += `
        <h3 style="color:#3498db; margin-top: 25px;"><i class="fas fa-stream"></i> Cableado de Potencia</h3>
        <table class="tabla-componentes tabla-detalle">
            <thead>
                <tr><th>Origen</th><th>Destino</th><th>Sección</th><th>Color</th><th>Borne</th></tr>
            </thead>
            <tbody>
    `;
    d.cableadoPotencia.forEach(c => {
        html += `
            <tr>
                <td>${c.origen}</td>
                <td>${c.destino}</td>
                <td>${c.seccion}</td>
                <td>${c.color}</td>
                <td>${c.borne}</td>
            </tr>
        `;
    });
    html += `</tbody></table>`;

    // Cableado control
    html += `
        <h3 style="color:#e67e22; margin-top: 25px;"><i class="fas fa-project-diagram"></i> Cableado de Control</h3>
        <table class="tabla-componentes tabla-detalle">
            <thead>
                <tr><th>Origen</th><th>Destino</th><th>Sección</th><th>Color</th><th>Borne</th></tr>
            </thead>
            <tbody>
    `;
    d.cableadoControl.forEach(c => {
        html += `
            <tr>
                <td>${c.origen}</td>
                <td>${c.destino}</td>
                <td>${c.seccion}</td>
                <td>${c.color}</td>
                <td>${c.borne}</td>
            </tr>
        `;
    });
    html += `</tbody></table>`;

    // Botón exportar CSV
    html += `
        <div style="margin-top: 25px;">
            <button class="btn-primary" id="btnExportarBOM">
                <i class="fas fa-download"></i> Exportar BOM a CSV
            </button>
            <button class="btn-primary" id="btnExportarCableado">
                <i class="fas fa-download"></i> Exportar Cableado a CSV
            </button>
        </div>
    `;

    contenedor.innerHTML = html;

    // Conectar botones de exportación
    const btnBOM = document.getElementById('btnExportarBOM');
    const btnCableado = document.getElementById('btnExportarCableado');
    if (btnBOM) {
        btnBOM.addEventListener('click', () => exportarCSV(d.bom, `BOM_${d.hp}HP_${d.voltaje}V.csv`));
    }
    if (btnCableado) {
        btnCableado.addEventListener('click', () => {
            const todo = [...d.cableadoPotencia, ...d.cableadoControl];
            exportarCSV(todo, `Cableado_${d.hp}HP_${d.voltaje}V.csv`);
        });
    }
}

/**
 * Exporta un array de objetos a CSV
 */
function exportarCSV(data, filename) {
    if (!data || data.length === 0) return;
    const keys = Object.keys(data[0]);
    const csv = [
        keys.join(','),
        ...data.map(row => keys.map(k => {
            const cell = row[k] !== undefined ? row[k] : '';
            return `"${String(cell).replace(/"/g, '""')}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

