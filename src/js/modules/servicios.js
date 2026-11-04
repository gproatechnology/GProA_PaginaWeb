/**
 * Servicios Module
 * Handles service cards opening a modal with inline content and 3D model
 */

import { trapFocus } from '../utils/focus-trap.js';

// Configuración de modelos 3D por servicio
const MODELOS_3D = {
    automatizacion: {
        titulo: 'Automatización Cognitiva',
        descripcion: 'Brazo robótico con engranaje industrial representando automatización cognitiva'
    },
    'ia-generativa': {
        titulo: 'IA Generativa Aplicada',
        descripcion: 'Red neuronal con nodos conectados representando IA generativa'
    },
    'sistemas-autonomos': {
        titulo: 'Sistemas Autónomos Inteligentes',
        descripcion: 'Sistema autónomo con órbita representando plataformas multiagente'
    }
};

let mixer = null;
let animationFrameId = null;
let scene3d = null;
let camera3d = null;
let renderer3d = null;
let container3d = null;

export function initServicios() {
    const servicioCards = document.querySelectorAll('.servicio-card');
    const modal = document.getElementById('servicioModal');
    const modalBody = document.getElementById('servicioModalBody');
    const modalTitle = document.getElementById('servicioModalTitle');
    const modalClose = document.getElementById('servicioModalClose');
    const modalBackdrop = document.getElementById('servicioModalBackdrop');
    container3d = document.getElementById('modelo3dContenedor');

    if (!servicioCards.length || !modal || !modalBody || !modalTitle || !modalClose || !modalBackdrop || !container3d) return;

    let cleanup = null;

    function init3DModelo(servicioKey) {
        // Limpiar escena anterior
        limpiar3D();

        const config = MODELOS_3D[servicioKey] || MODELOS_3D.automatizacion;

        // Crear escena
        scene3d = new THREE.Scene();
        scene3d.background = new THREE.Color(0x0a0f1c);

        // Crear cámara
        camera3d = new THREE.PerspectiveCamera(45, container3d.clientWidth / container3d.clientHeight, 0.1, 1000);
        camera3d.position.set(0, 0, 5);

        // Crear renderizador
        renderer3d = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
        renderer3d.setPixelRatio(window.devicePixelRatio);
        container3d.appendChild(renderer3d.domElement);

        // Luz ambiental
        const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.4);
        scene3d.add(luzAmbiental);

        // Luz puntual
        const luzPuntual = new THREE.PointLight(0x00e0ff, 1, 100);
        luzPuntual.position.set(5, 5, 5);
        scene3d.add(luzPuntual);

        // Luz puntual secundaria
        const luzPuntual2 = new THREE.PointLight(0x8a2be2, 1, 100);
        luzPuntual2.position.set(-5, -5, 5);
        scene3d.add(luzPuntual2);

        // Construir modelo según servicio
        if (servicioKey === 'automatizacion') {
            construirBrazoRobotico();
        } else if (servicioKey === 'ia-generativa') {
            construirRedNeuronal();
        } else if (servicioKey === 'sistemas-autonomos') {
            construirSistemaAutonomo();
        }

        // Loop de animación
        function animar() {
            animationFrameId = requestAnimationFrame(animar);

            // Rotación suave del modelo
            scene3d.traverse((objeto) => {
                if (objeto.isMesh && objeto.userData.rotar) {
                    objeto.rotation.y += 0.01;
                    objeto.rotation.x += 0.005;
                }
            });

            // Animar luces
            const tiempo = Date.now() * 0.001;
            luzPuntual.position.x = Math.sin(tiempo) * 5;
            luzPuntual.position.z = Math.cos(tiempo) * 5;

            renderer3d.render(scene3d, camera3d);
        }

        animar();
    }

    function construirBrazoRobotico() {
        // Base del brazo
        const baseGeometria = new THREE.CylinderGeometry(1, 1, 0.5, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x00e0ff, metalness: 0.7, roughness: 0.2 });
        const base = new THREE.Mesh(baseGeometria, baseMaterial);
        base.position.y = -1.5;
        base.userData.rotar = true;
        scene3d.add(base);

        // Brazo superior
        const brazoSupGeometria = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const brazoSup = new THREE.Mesh(brazoSupGeometria, baseMaterial);
        brazoSup.position.y = -0.75;
        brazoSup.userData.rotar = true;
        scene3d.add(brazoSup);

        // Brazo inferior
        const brazoInfGeometria = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const brazoInf = new THREE.Mesh(brazoInfGeometria, baseMaterial);
        brazoInf.position.y = -2.25;
        brazoInf.rotation.z = 0.3;
        brazoInf.userData.rotar = true;
        scene3d.add(brazoInf);

        // Engranaje en la base
        const engranajeGeometria = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 12);
        const engranaje = new THREE.Mesh(engranajeGeometria, new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.1 }));
        engranaje.position.y = -1.6;
        engranaje.rotation.x = Math.PI / 2;
        engranaje.userData.rotar = true;
        scene3d.add(engranaje);

        // Nodo final
        const nodoGeometria = new THREE.SphereGeometry(0.2, 16, 16);
        const nodo = new THREE.Mesh(nodoGeometria, new THREE.MeshStandardMaterial({ color: 0x00e0ff, emissive: 0x00e0ff, emissiveIntensity: 0.5 }));
        nodo.position.set(0.3, -3, 0);
        nodo.userData.rotar = true;
        scene3d.add(nodo);
    }

    function construirRedNeuronal() {
        const nodos = [];
        const conexiones = [];

        // Crear nodos en 3 capas
        const capas = [[-1.5, 0, 1.5], [0, 0, 0], [1.5, 0, -1.5]];
        const nodosPorCapa = 4;

        capas.forEach((capa, i) => {
            for (let j = 0; j < nodosPorCapa; j++) {
                const angulo = (j / nodosPorCapa) * Math.PI * 2;
                const x = capa[0] + Math.cos(angulo) * 0.8;
                const y = capa[1] + Math.sin(angulo) * 0.8;
                const z = capa[2] + (j - nodosPorCapa / 2) * 0.3;

                const nodoGeometria = new THREE.SphereGeometry(0.08, 12, 12);
                const nodoMaterial = new THREE.MeshStandardMaterial({ color: 0x00e0ff, emissive: 0x00e0ff, emissiveIntensity: 0.8 });
                const nodo = new THREE.Mesh(nodoGeometria, nodoMaterial);
                nodo.position.set(x, y, z);
                nodo.userData.rotar = true;
                scene3d.add(nodo);
                nodos.push(nodo);
            }
        });

        // Crear conexiones entre capas
        const lineaMaterial = new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.3 });
        for (let i = 0; i < nodosPorCapa; i++) {
            for (let j = 0; j < nodosPorCapa; j++) {
                const nodo1 = nodos[i];
                const nodo2 = nodos[nodosPorCapa + j];
                const nodo3 = nodos[nodosPorCapa * 2 + j];

                const linea1 = crearLineaEntreNodos(nodo1, nodo2, lineaMaterial);
                const linea2 = crearLineaEntreNodos(nodo2, nodo3, lineaMaterial);
                scene3d.add(linea1);
                scene3d.add(linea2);
                conexiones.push(linea1, linea2);
            }
        }
    }

    function crearLineaEntreNodos(nodo1, nodo2, material) {
        const puntos = [nodo1.position.clone(), nodo2.position.clone()];
        const geometria = new THREE.BufferGeometry().setFromPoints(puntos);
        return new THREE.Line(geometria, material);
    }

    function construirSistemaAutonomo() {
        // Plataforma base
        const baseGeometria = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
        const base = new THREE.Mesh(baseGeometria, new THREE.MeshStandardMaterial({ color: 0x00e0ff, metalness: 0.7 }));
        base.position.y = -1;
        base.userData.rotar = true;
        scene3d.add(base);

        // Cuerpo central
        const cuerpoGeometria = new THREE.ConeGeometry(0.5, 1.5, 8);
        const cuerpo = new THREE.Mesh(cuerpoGeometria, new THREE.MeshStandardMaterial({ color: 0x8a2be2, metalness: 0.8, roughness: 0.1 }));
        cuerpo.position.y = -0.25;
        cuerpo.userData.rotar = true;
        scene3d.add(cuerpo);

        // Antena
        const antenaGeometria = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        const antena = new THREE.Mesh(antenaGeometria, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        antena.position.y = 0.5;
        antena.userData.rotar = true;
        scene3d.add(antena);

        // Esfera de señal
        const señalGeometria = new THREE.SphereGeometry(0.1, 16, 16);
        const señal = new THREE.Mesh(señalGeometria, new THREE.MeshStandardMaterial({ color: 0x00e0ff, emissive: 0x00e0ff, emissiveIntensity: 1 }));
        señal.position.set(0, 1, 0);
        señal.userData.rotar = true;
        scene3d.add(señal);

        // Anillos de órbita
        const anilloGeometria = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
        const anillo = new THREE.Mesh(anilloGeometria, new THREE.MeshBasicMaterial({ color: 0x00e0ff, transparent: true, opacity: 0.3 }));
        anillo.rotation.x = Math.PI / 2;
        anillo.userData.rotar = true;
        scene3d.add(anillo);
    }

    function limpiar3D() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        if (renderer3d && container3d) {
            container3d.innerHTML = '';
            renderer3d.dispose();
            renderer3d = null;
        }

        scene3d = null;
        camera3d = null;
        mixer = null;
    }

    function openServicioModal(card) {
        const servicioKey = card.dataset.servicio || 'automatizacion';
        const config = MODELOS_3D[servicioKey] || MODELOS_3D.automatizacion;

        const titleEl = card.querySelector('.servicio-title h3');
        const contentEl = card.querySelector('.servicio-content');
        const iconEl = card.querySelector('.servicio-icon i');
        const descEl = card.querySelector('.servicio-title p');

        if (!contentEl) return;

        const iconClass = iconEl ? iconEl.className : '';
        const titleText = titleEl ? titleEl.innerHTML : '';

        modalTitle.innerHTML = `
            <span class="servicio-modal-icon"><i class="${iconClass}"></i></span>
            <span>${titleText}</span>
        `;

        const clone = contentEl.cloneNode(true);
        modalBody.innerHTML = '';
        modalBody.appendChild(clone);

        // Inicializar modelo 3D
        init3DModelo(servicioKey);

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

        // Limpiar escena 3D
        limpiar3D();

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

    // Manejar resize del contenedor 3D
    window.addEventListener('resize', () => {
        if (camera3d && renderer3d && container3d) {
            camera3d.aspect = container3d.clientWidth / container3d.clientHeight;
            camera3d.updateProjectionMatrix();
            renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
        }
    });
}
