import { BIOMARCADORES, CLASES, DATASET, estadisticasDataset } from './data.js';
import { validarEntradas, normalizar, distanciaPonderada, clasificarKNN, explicarResultado, calcularRiesgoGlucosa } from './diagnostico.js';

let pasadas = 0;
let fallidas = 0;

function test(nombre, fn) {
    try {
        fn();
        pasadas++;
        console.log(`✓ ${nombre}`);
    } catch (e) {
        fallidas++;
        console.error(`✗ ${nombre}: ${e.message}`);
    }
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'Assertion failed');
}

// 1. Dataset determinista
test('Dataset tiene 90 muestras (30 por clase)', () => {
    assert(DATASET.length === 90, `Esperado 90, obtenido ${DATASET.length}`);
    for (const clase of CLASES) {
        const count = DATASET.filter(m => m.clase === clase).length;
        assert(count === 30, `Clase ${clase}: esperado 30, obtenido ${count}`);
    }
});

// 2. Estadísticas tienen 33 biomarcadores
test('Estadísticas calculan media y desvío para 33 biomarcadores', () => {
    const stats = estadisticasDataset();
    const keys = Object.keys(stats);
    assert(keys.length === 33, `Esperado 33, obtenido ${keys.length}`);
    for (const b of BIOMARCADORES) {
        assert(typeof stats[b.id].mean === 'number', `Media faltante para ${b.id}`);
        assert(typeof stats[b.id].std === 'number', `Std faltante para ${b.id}`);
        assert(stats[b.id].std > 0, `Std debe ser > 0 para ${b.id}`);
    }
});

// 3. Validar entradas
test('validarEntradas acepta valores válidos', () => {
    const stats = estadisticasDataset();
    const vals = {};
    for (const b of BIOMARCADORES) vals[b.id] = stats[b.id].mean;
    const res = validarEntradas(vals);
    assert(res.valido === true, JSON.stringify(res));
});

test('validarEntradas rechaza valor no numérico', () => {
    const vals = { glucosa: 'abc' };
    const res = validarEntradas(vals);
    assert(res.valido === false, JSON.stringify(res));
});

test('validarEntradas rechaza valor fuera de rango', () => {
    const vals = { glucosa: 9999 };
    const res = validarEntradas(vals);
    assert(res.valido === false, JSON.stringify(res));
});

// 4. Normalización
test('normalizar devuelve 0 para valor igual a la media', () => {
    const stats = estadisticasDataset();
    const vals = {};
    for (const b of BIOMARCADORES) vals[b.id] = stats[b.id].mean;
    const norm = normalizar(vals);
    assert(norm.length === 33, `Esperado 33, obtenido ${norm.length}`);
    const z = norm[0];
    assert(Math.abs(z) < 1e-9, `Esperado ~0, obtenido ${z}`);
});

// 5. Distancia ponderada
test('distanciaPonderada sin pesos es euclídea', () => {
    const d = distanciaPonderada([0, 0], [3, 4]);
    assert(Math.abs(d - 5) < 1e-9, `Esperado 5, obtenido ${d}`);
});

test('distanciaPonderada con pesos funciona', () => {
    const d = distanciaPonderada([0, 0], [1, 1], [1, 4]);
    assert(Math.abs(d - 2.236067977) < 1e-6, `Esperado ~2.236, obtenido ${d}`);
});

// 6. Clasificar KNN
test('clasificarKNN devuelve estructura correcta', () => {
    const muestra = DATASET[0];
    const res = clasificarKNN(DATASET, muestra, 5);
    assert(typeof res.clasificacion === 'string', 'clasificacion faltante');
    assert(typeof res.confianza === 'number', 'confianza faltante');
    assert(Array.isArray(res.vecinos), 'vecinos faltante');
    assert(res.vecinos.length === 5, `vecinos debería tener 5, tiene ${res.vecinos.length}`);
});

// 7. Integración: muestra Normal clasifica como Normal
test('Muestra Normal clasifica como Normal', () => {
    const muestra = DATASET.find(m => m.clase === 'Normal');
    const res = calcularRiesgoGlucosa(muestra);
    assert(res.clasificacion === 'Normal', `Esperado Normal, obtenido ${res.clasificacion}`);
    assert(res.confianza > 0, `Confianza debería ser > 0`);
});

test('Muestra Riesgo clasifica como Riesgo', () => {
    const muestra = DATASET.find(m => m.clase === 'Riesgo');
    const res = calcularRiesgoGlucosa(muestra);
    assert(res.clasificacion === 'Riesgo', `Esperado Riesgo, obtenido ${res.clasificacion}`);
    assert(res.confianza > 0, `Confianza debería ser > 0`);
});

// 8. Explicabilidad
test('explicarResultado devuelve top N contribuciones', () => {
    const muestra = DATASET.find(m => m.clase === 'Normal');
    const res = calcularRiesgoGlucosa(muestra);
    const exp = explicarResultado(muestra, res, 5);
    assert(Array.isArray(exp), 'explicacion debería ser array');
    assert(exp.length <= 5, `explicacion debería tener <= 5, tiene ${exp.length}`);
    if (exp.length > 1) {
        assert(exp[0].diff >= exp[exp.length - 1].diff, 'Debería estar ordenado por diff descendente');
    }
});

console.log(`\nResultados: ${pasadas} pasadas, ${fallidas} fallidas`);
process.exit(fallidas > 0 ? 1 : 0);
