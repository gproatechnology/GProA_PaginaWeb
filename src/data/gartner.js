/**
 * Datos de las gráficas de la sección "Métricas Gartner".
 * Centralizados para facilitar mantenimiento y alimentar con métricas reales.
 *
 * Nota: "Gartner" y "Magic Quadrant" son marcas registradas de Gartner.
 * Estos valores son ilustrativos (análisis interno); no representan un
 * posicionamiento oficial de Gartner.
 */

export const GARTNER_DATA = {
    quadrant: {
        title: 'Cuadrante Mágico',
        // x = Capacidad de Ejecución, y = Completitud de Visión (rango 0–1)
        // r = tamaño relativo (ilustrativo). Nombres de competidores ilustrativos.
        datasets: [
            {
                label: 'GProA Technology',
                data: [
                    { x: 0.85, y: 0.75, r: 20, name: 'GProA Technology' }
                ],
                backgroundColor: '#00e0ff',
                borderColor: '#00e0ff',
                borderWidth: 3
            },
            {
                label: 'Competidores',
                data: [
                    { x: 0.6, y: 0.8, r: 12, name: 'Aurora' },
                    { x: 0.7, y: 0.6, r: 10, name: 'Borealis' },
                    { x: 0.5, y: 0.7, r: 11, name: 'Cygnus' },
                    { x: 0.8, y: 0.5, r: 9, name: 'Delta' },
                    { x: 0.4, y: 0.6, r: 8, name: 'Helix' },
                    { x: 0.65, y: 0.55, r: 10, name: 'Quasar' }
                ],
                backgroundColor: 'rgba(156, 163, 175, 0.6)',
                borderColor: 'rgba(156, 163, 175, 0.9)',
                borderWidth: 1
            }
        ]
    },

    evolution: {
        title: 'Evolución de Capacidades',
        unit: 'Índice de adopción',
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'Crecimiento IA',
                data: [20, 45, 75, 120, 160],
                borderColor: '#00e0ff',
                backgroundColor: 'rgba(0, 224, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Automatización',
                data: [15, 35, 65, 95, 125],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    },

    solutions: {
        title: 'Comparativa de Soluciones',
        labels: ['Innovación', 'Especialización', 'Escalabilidad', 'Integración', 'Soporte'],
        datasets: [
            {
                label: 'GProA Technology',
                data: [92, 88, 85, 90, 87],
                borderColor: '#00e0ff',
                backgroundColor: 'rgba(0, 224, 255, 0.2)',
                pointBackgroundColor: '#00e0ff'
            },
            {
                label: 'Promedio Competidores',
                data: [75, 70, 78, 72, 80],
                borderColor: 'rgba(156, 163, 175, 0.8)',
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                pointBackgroundColor: 'rgba(156, 163, 175, 0.8)'
            }
        ]
    },

    market: {
        title: 'Proyección de Mercado',
        unit: 'Miles de millones USD',
        labels: ['2025', '2026', '2027', '2028', '2029'],
        datasets: [
            {
                label: 'Mercado IA Industrial',
                data: [47.2, 58.5, 72.1, 89.2, 110.3],
                backgroundColor: 'rgba(0, 224, 255, 0.6)',
                borderColor: '#00e0ff',
                borderWidth: 2
            }
        ]
    }
};

export default GARTNER_DATA;
