/**
 * GECRAI - Motor de cálculos NOM-001-SEDE-2012 (Demo)
 * Funciones puras de cálculo de memoria de conductores de baja tensión.
 */

// Tabla de ampacidad AWG (A). Fuente única para todo el módulo.
export const TABLA_AMPACIDAD = {
    '14 AWG': 15,
    '12 AWG': 20,
    '10 AWG': 30,
    '8 AWG': 43,
    '6 AWG': 55,
    '4 AWG': 70,
    '2 AWG': 95,
    '1/0 AWG': 125,
    '2/0 AWG': 145,
    '3/0 AWG': 165,
    '4/0 AWG': 195
};

/**
 * Tabla 430-250 NOM-001-SEDE-2012
 * Corriente a plena carga (A) de motores trifásicos de inducción
 * (jaula de ardilla y rotor devanado).
 * Columnas = tensión nominal del motor. Según la nota de la tabla, cada
 * columna aplica a intervalos: 115V (110-120), 230V (220-240),
 * 460V (440-480), 575V (550-600).
 */
export const TABLA_430_250 = {
    0.5:  { 115: 4.4,  200: 2.5,  208: 2.4,  230: 2.2,  460: 1.1,  575: 0.9 },
    0.75: { 115: 6.4,  200: 3.7,  208: 3.5,  230: 3.2,  460: 1.6,  575: 1.3 },
    1:    { 115: 8.4,  200: 4.8,  208: 4.6,  230: 4.2,  460: 2.1,  575: 1.7 },
    1.5:  { 115: 12,   200: 6.9,  208: 6.6,  230: 6,    460: 3,    575: 2.4 },
    2:    { 115: 13.6, 200: 7.8,  208: 7.5,  230: 6.8,  460: 3.4,  575: 2.7 },
    3:    {            200: 11,   208: 10.6, 230: 9.6,  460: 4.8,  575: 3.9 },
    5:    {            200: 17.5, 208: 16.7, 230: 15.2, 460: 7.6,  575: 6.1 },
    7.5:  {            200: 25.3, 208: 24.2, 230: 22,   460: 11,   575: 9 },
    10:   {            200: 32.2, 208: 30.8, 230: 28,   460: 14,   575: 11 },
    15:   {            200: 48.3, 208: 46.2, 230: 42,   460: 21,   575: 17 },
    20:   {            200: 62.1, 208: 59.4, 230: 54,   460: 27,   575: 22 },
    25:   {            200: 78.2, 208: 74.8, 230: 68,   460: 34,   575: 27 },
    30:   {            200: 92,   208: 88,   230: 80,   460: 40,   575: 32 },
    40:   {            200: 120,  208: 114,  230: 104,  460: 52,   575: 41 },
    50:   {            200: 150,  208: 143,  230: 130,  460: 65,   575: 52 },
    60:   {            200: 177,  208: 169,  230: 154,  460: 77,   575: 62,  2300: 16 },
    75:   {            200: 221,  208: 211,  230: 192,  460: 96,   575: 77,  2300: 20 },
    100:  {            200: 285,  208: 273,  230: 248,  460: 124,  575: 99,  2300: 26 },
    125:  {            200: 359,  208: 343,  230: 312,  460: 156,  575: 125, 2300: 31 },
    150:  {            200: 414,  208: 396,  230: 360,  460: 180,  575: 144, 2300: 37 },
    200:  {            200: 552,  208: 528,  230: 480,  460: 240,  575: 192, 2300: 49 },
    250:  {            460: 302,  575: 242,  2300: 60 },
    300:  {            460: 361,  575: 289,  2300: 72 },
    350:  {            460: 414,  575: 336,  2300: 83 },
    400:  {            460: 477,  575: 382,  2300: 95 },
    450:  {            460: 515,  575: 412,  2300: 103 },
    500:  {            460: 590,  575: 472,  2300: 118 }
};

/** Mapea una tensión de sistema a la columna nominal de la Tabla 430-250. */
export function columnaTension430250(voltaje) {
    const v = Number.parseFloat(voltaje) || 0;
    if (v <= 120) return 115;
    if (v <= 200) return 200;
    if (v <= 208) return 208;
    if (v <= 240) return 230;
    if (v <= 480) return 460;
    if (v <= 600) return 575;
    return 2300;
}

/**
 * Tabla 430-248 NOM-001-SEDE-2012
 * Corriente a plena carga (A) de motores monofásicos de inducción.
 * Columnas = tensión nominal del motor (intervalos: 115V = 110-120,
 * 230V = 220-240; 200V y 208V columnas directas).
 */
export const TABLA_430_248 = {
    0.5:  { 115: 4.4,  200: 2.5,  208: 2.4,  230: 2.2 },
    0.75: { 115: 6.4,  200: 3.7,  208: 3.5,  230: 3.2 },
    1:    { 115: 8.4,  200: 4.8,  208: 4.6,  230: 4.2 },
    1.5:  { 115: 12,   200: 6.9,  208: 6.6,  230: 6 },
    2:    { 115: 13.6, 200: 7.8,  208: 7.5,  230: 6.8 },
    3:    {            200: 11,   208: 10.6, 230: 9.6 },
    5:    {            200: 17.5, 208: 16.7, 230: 15.2 },
    7.5:  {            200: 25.3, 208: 24.2, 230: 22 },
    10:   {            200: 32.2, 208: 30.8, 230: 28 },
    15:   {            200: 48.3, 208: 46.2, 230: 42 },
    20:   {            200: 62.1, 208: 59.4, 230: 54 },
    25:   {            200: 78.2, 208: 74.8, 230: 68 },
    30:   {            200: 92,   208: 88,   230: 80 },
    40:   {            200: 120,  208: 114,  230: 104 },
    50:   {            200: 150,  208: 143,  230: 130 },
    60:   {            200: 177,  208: 169,  230: 154 },
    75:   {            200: 221,  208: 211,  230: 192 },
    100:  {            200: 285,  208: 273,  230: 248 },
    125:  {            200: 359,  208: 343,  230: 312 },
    150:  {            200: 414,  208: 396,  230: 360 },
    200:  {            200: 552,  208: 528,  230: 480 }
};

/** Mapea una tensión de sistema a la columna nominal de la Tabla 430-248. */
export function columnaTension430248(voltaje) {
    const v = Number.parseFloat(voltaje) || 0;
    if (v <= 120) return 115;
    if (v <= 200) return 200;
    if (v <= 208) return 208;
    if (v <= 240) return 230;
    return null;
}

/**
 * Tabla 430-249 NOM-001-SEDE-2012
 * Corriente a plena carga (A) de motores de dos fases (4 hilos) de inducción.
 * Columnas = tensión nominal del motor (intervalos: 115V = 110-120,
 * 230V = 220-240, 460V = 440-480, 575V = 550-600; 2300V directa).
 */
export const TABLA_430_249 = {
    2:    { 115: 4,    230: 2,    460: 1,    575: 0.8,  2300: null },
    3:    { 115: 6.4,  230: 3.2,  460: 1.6,  575: 1.3,  2300: null },
    5:    { 115: null, 230: 13.2, 460: 6.6,  575: 5.3,  2300: null },
    7.5:  { 115: null, 230: 19,   460: 9,    575: null, 2300: null },
    10:   { 115: null, 230: 24,   460: 12,   575: null, 2300: null },
    15:   { 115: null, 230: 36,   460: 18,   575: 14,   2300: null },
    20:   { 115: null, 230: 47,   460: 23,   575: 19,   2300: null },
    25:   { 115: null, 230: 59,   460: 29,   575: 24,   2300: null },
    30:   { 115: null, 230: 69,   460: 35,   575: 28,   2300: null },
    40:   { 115: null, 230: 90,   460: 45,   575: 36,   2300: null },
    50:   { 115: null, 230: 113,  460: 56,   575: 45,   2300: null },
    60:   { 115: null, 230: 133,  460: 67,   575: 53,   2300: 14 },
    75:   { 115: null, 230: 166,  460: 83,   575: 66,   2300: 18 },
    100:  { 115: null, 230: 218,  460: 109,  575: 87,   2300: 23 },
    125:  { 115: null, 230: 270,  460: 135,  575: 108,  2300: 28 },
    150:  { 115: null, 230: 312,  460: 156,  575: 125,  2300: 32 },
    200:  { 115: null, 230: 416,  460: 208,  575: 167,  2300: 43 },
    250:  { 2300: 49 },
    300:  { 2300: 60 },
    350:  { 2300: 72 },
    400:  { 2300: 83 },
    450:  { 2300: 95 },
    500:  { 2300: 118 }
};

/** Mapea una tensión de sistema a la columna nominal de la Tabla 430-249. */
export function columnaTension430249(voltaje) {
    const v = Number.parseFloat(voltaje) || 0;
    if (v <= 120) return 115;
    if (v <= 240) return 230;
    if (v <= 480) return 460;
    if (v <= 600) return 575;
    return 2300;
}

/** Tabla de plena carga activa según número de fases. */
export const TABLA_IPC_POR_FASES = {
    1: TABLA_430_248,
    2: TABLA_430_249,
    3: TABLA_430_250
};

/** Tensiones nominales (columnas) disponibles por número de fases. */
export const VOLTAJES_POR_FASES = {
    1: [115, 200, 208, 230],
    2: [115, 230, 460, 575, 2300],
    3: [115, 200, 208, 230, 460, 575, 2300]
};

/**
 * Devuelve la corriente a plena carga tabulada (A) para un motor según
 * número de fases, HP y tensión, o null si no está en la tabla.
 */
export function obtenerIpcTabla(hp, voltaje, fases) {
    const numFases = Number.parseInt(fases) || 3;
    const tabla = TABLA_IPC_POR_FASES[numFases];
    if (!tabla) return null;

    const fila = tabla[Number.parseFloat(hp)];
    if (!fila) return null;

    let col;
    if (numFases === 1) col = columnaTension430248(voltaje);
    else if (numFases === 2) col = columnaTension430249(voltaje);
    else col = columnaTension430250(voltaje);

    const valor = fila[col];
    return (valor === undefined || valor === null) ? null : valor;
}

/** Lista de tensiones nominales válidas para el número de fases dado. */
export function voltajesDisponibles(fases) {
    const numFases = Number.parseInt(fases) || 3;
    return VOLTAJES_POR_FASES[numFases] || [];
}

/** Lista de HP válidos para el número de fases y tensión dados. */
export function hpDisponibles(fases, voltaje) {
    const numFases = Number.parseInt(fases) || 3;
    const tabla = TABLA_IPC_POR_FASES[numFases];
    if (!tabla) return [];
    let col;
    if (numFases === 1) col = columnaTension430248(voltaje);
    else if (numFases === 2) col = columnaTension430249(voltaje);
    else col = columnaTension430250(voltaje);

    return Object.keys(tabla)
        .map(Number)
        .filter(hp => {
            const fila = tabla[hp];
            const valor = fila && fila[col];
            return valor !== undefined && valor !== null;
        })
        .sort((a, b) => a - b);
}

/**
 * Valida que una combinación (fases, voltaje, hp) tenga Ipc tabulado.
 * Devuelve { valido, ipc, motivo }.
 */
export function validarCombinacion(fases, voltaje, hp) {
    const numFases = Number.parseInt(fases) || 3;
    const hpNum = Number.parseFloat(hp);
    const voltajeNum = Number.parseFloat(voltaje);

    if (numFases !== 1 && numFases !== 2 && numFases !== 3) {
        return { valido: false, ipc: null, motivo: 'Número de fases no válido.' };
    }

    let col;
    if (numFases === 1) col = columnaTension430248(voltajeNum);
    else if (numFases === 2) col = columnaTension430249(voltajeNum);
    else col = columnaTension430250(voltajeNum);

    if (col == null || !voltajesDisponibles(numFases).includes(col)) {
        return { valido: false, ipc: null, motivo: 'Tensión fuera del rango NOM-001 para ' + numFases + 'F.' };
    }
    const ipc = obtenerIpcTabla(hpNum, voltajeNum, numFases);
    if (ipc === null) {
        return { valido: false, ipc: null, motivo: 'HP ' + hpNum + ' no tabulado para ' + numFases + 'F a ' + voltajeNum + ' V.' };
    }
    return { valido: true, ipc, motivo: '' };
}

export function calcularIpc({ hp, voltaje, fases, fp, eficiencia = 0.9 }) {
    const numFases = Number.parseInt(fases) || 3;

    // 1) Preferir el valor tabulado de las Tablas NOM-001 (430-248
    //    monofásico, 430-249 dos fases, 430-250 trifásico), igual que la
    //    memoria de cálculo de referencia.
    const ipcTabla = obtenerIpcTabla(hp, voltaje, numFases);
    if (ipcTabla !== null) return ipcTabla;

    // 2) Fallback por fórmula. Ipc es la corriente a plena carga y NO
    //    incluye el factor de utilización (ese se aplica al calcular Im).
    const hpNum = Number.parseFloat(hp) || 0;
    const v = Number.parseFloat(voltaje) || 0;
    const fpNum = Number.parseFloat(fp) || 0;
    const eff = Number.parseFloat(eficiencia) || 0.9;

    if (!hpNum || !v || !fpNum) return 0;

    const potencia = hpNum * 746;
    let ipc;

    if (numFases === 3) {
        ipc = potencia / (1.732 * v * fpNum * eff);
    } else {
        // Monofásico / dos fases (4 hilos): corriente por fase.
        ipc = potencia / (v * fpNum * eff);
    }

    return Number.parseFloat(ipc.toFixed(2));
}

export function calcularIm(ipc) {
    const corriente = Number.parseFloat(ipc) || 0;
    return Number.parseFloat((corriente * 1.25).toFixed(2));
}

export function obtenerFactorAjusteConductores(cantidadConductores) {
    const n = Number.parseFloat(cantidadConductores) || 1;
    if (n <= 3) return 1.0;
    if (n <= 6) return 0.8;
    if (n <= 9) return 0.7;
    return 0.7;
}

export function obtenerFactorTemperatura(temperaturaAmbiente, temperaturaCable = 75) {
    const ta = Number.parseFloat(temperaturaAmbiente) || 30;
    const tc = Number.parseFloat(temperaturaCable) || 75;

    if (ta <= 30) return 1.0;

    const valores = {
        35: ta <= 35 ? 0.94 : 1.0,
        40: ta <= 40 ? 0.88 : 0.94,
        45: ta <= 45 ? 0.82 : 0.88,
        50: ta <= 50 ? 0.75 : 0.82,
        55: ta <= 55 ? 0.67 : 0.75,
        60: ta <= 60 ? 0.58 : 0.67,
        65: ta <= 65 ? 0.47 : 0.58,
        70: ta <= 70 ? 0.33 : 0.47,
        75: ta <= 75 ? 0.25 : 0.33
    };

    const keys = Object.keys(valores).map(Number);
    const maxKey = Number(keys.filter(k => ta <= k).sort((a, b) => a - b)[0]);
    return Number.parseFloat(valores[maxKey].toFixed(2));
}

export function calcularId(im, factorConductores, factorTemperatura) {
    const corrienteIm = Number.parseFloat(im) || 0;
    const fc = Number.parseFloat(factorConductores) || 1;
    const ft = Number.parseFloat(factorTemperatura) || 1;

    if (fc <= 0 || ft <= 0) return corrienteIm;

    return Number.parseFloat((corrienteIm / (fc * ft)).toFixed(2));
}

export function seleccionarCalibrePorAmpacidad(id, tablaAmpacidad) {
    for (const calibre in tablaAmpacidad) {
        if (tablaAmpacidad[calibre] >= id) {
            return calibre;
        }
    }
    return 'No encontrado';
}

export function compararCalibres(params, calibreA, calibreB) {
    const resultBase = calcularMemoriaCompleta(params);
    const tablaAmpacidad = TABLA_AMPACIDAD;

    const getAmpacidad = (calibre) => tablaAmpacidad[calibre] || 0;

    const buildComparison = (calibre) => {
        const amp = getAmpacidad(calibre);
        const caida = calcularCaidaTension({
            longitud: params.longitud,
            corriente: resultBase.ipc,
            voltaje: params.voltaje,
            fp: params.fp,
            resistencia: params.r,
            reactancia: params.xl,
            fases: params.fases
        });
        const aprobado = caida.porcentaje <= (params.porcentajeVcDeseado ?? 3);
        return {
            calibre,
            ampacidad: amp,
            caidaV: caida.caidaV,
            porcentaje: caida.porcentaje,
            aprobado
        };
    };

    return {
        base: resultBase,
        a: buildComparison(calibreA),
        b: buildComparison(calibreB)
    };
}

export function calcularCaidaTension({ longitud, corriente, voltaje, fp, resistencia, reactancia, fases }) {
    const l = Number.parseFloat(longitud) || 0;
    const i = Number.parseFloat(corriente) || 0;
    const v = Number.parseFloat(voltaje) || 0;
    const fpNum = Number.parseFloat(fp) || 0.95;
    const r = Number.parseFloat(resistencia) || 0;
    const xl = Number.parseFloat(reactancia) || 0;
    const f = Number.parseFloat(fases) || 3;

    if (!l || !i || !v) return { caidaV: 0, porcentaje: 0 };

    const sinPhi = Math.sqrt(Math.max(0, 1 - fpNum * fpNum));
    const z = r * fpNum + xl * sinPhi;
    let caidaV;

    if (f === 3) {
        caidaV = 1.732 * l * z * i;
    } else {
        caidaV = 2 * l * z * i;
    }

    const porcentaje = v > 0 ? Number.parseFloat(((caidaV / v) * 100).toFixed(2)) : 0;

    return {
        caidaV: Number.parseFloat(caidaV.toFixed(2)),
        porcentaje
    };
}

export function seleccionarInterruptor(ipc, factorUtilizacion = 1.25, fases = 3) {
    const i = Number.parseFloat(ipc) || 0;
    const fu = Number.parseFloat(factorUtilizacion) || 1;
    // El interruptor se dimensiona sobre el 125% de la corriente a plena
    // carga (equivalente a Im) y se lleva al valor comercial estándar.
    const it = i * fu;

    // Valores comerciales estándar de interruptores termomagnéticos
    // (escala usada en la memoria de cálculo de referencia).
    const estandares = [15, 20, 30, 40, 50, 60, 70, 80, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400];

    const numFases = Number.parseInt(fases) || 3;
    const descripcionPolos = numFases === 1 ? '1F (2P)'
        : numFases === 2 ? '2F (2P)'
        : '3F (3P)';

    for (const cal of estandares) {
        if (cal >= it) {
            return {
                amperaje: cal,
                polos: descripcionPolos + ' - ' + cal + ' A'
            };
        }
    }

    const max = estandares[estandares.length - 1];
    return {
        amperaje: max,
        polos: descripcionPolos + ' - ' + max + ' A'
    };
}

export function seleccionarCalibreTierra(amperajeInterruptor) {
    const it = Number.parseFloat(amperajeInterruptor) || 0;

    if (it <= 20) return '12 AWG';
    if (it <= 60) return '10 AWG';
    if (it <= 100) return '8 AWG';
    if (it <= 200) return '6 AWG';
    return '4 AWG';
}

export function seleccionarCalibreSugerido(calibreAmpacidad, calibreCaida, calibreInterruptor) {
    const orden = ['14 AWG', '12 AWG', '10 AWG', '8 AWG', '6 AWG', '4 AWG', '2 AWG', '1/0 AWG', '2/0 AWG', '3/0 AWG', '4/0 AWG'];

    const idxA = orden.indexOf(calibreAmpacidad);
    const idxC = orden.indexOf(calibreCaida);
    const idxI = orden.indexOf(calibreInterruptor);

    const maxIdx = Math.max(idxA, idxC, idxI);
    return maxIdx >= 0 ? orden[maxIdx] : calibreAmpacidad;
}

export function calcularMemoriaCompleta(params) {
    const {
        hp,
        voltaje,
        fases,
        fp,
        longitud,
        temperaturaAmbiente,
        temperaturaCable = 75,
        factorUtilizacion = 1.25,
        tipoConductor = 'MULTI',
        hilosPorFase = 1,
        canalizacion = 'CHAROLA',
        cantidadConductores = 3,
        porcentajeVcDeseado = 3,
        eficiencia = 0.9,
        r = 2.56,
        xl = 0.171
    } = params;

    const ipc = calcularIpc({ hp, voltaje, fases, fp, eficiencia, factorUtilizacion });
    const im = calcularIm(ipc);
    const factorConductores = obtenerFactorAjusteConductores(cantidadConductores);
    const factorTemperatura = obtenerFactorTemperatura(temperaturaAmbiente, temperaturaCable);
    const id = calcularId(im, factorConductores, factorTemperatura);

    const tablaAmpacidad = TABLA_AMPACIDAD;

    const calibreAmpacidad = seleccionarCalibrePorAmpacidad(id, tablaAmpacidad);
    const { caidaV, porcentaje } = calcularCaidaTension({
        longitud,
        corriente: ipc,
        voltaje,
        fp,
        resistencia: r,
        reactancia: xl,
        fases
    });

    const calibreCaida = porcentaje <= porcentajeVcDeseado ? calibreAmpacidad : seleccionarCalibrePorAmpacidad(id * 1.1, tablaAmpacidad);
    const interruptor = seleccionarInterruptor(ipc, factorUtilizacion, fases);
    const calibreInterruptor = calibreAmpacidad;
    const calibreSugerido = seleccionarCalibreSugerido(calibreAmpacidad, calibreCaida, calibreInterruptor);
    const calibreTierra = seleccionarCalibreTierra(interruptor.amperaje);

    return {
        ipc,
        im,
        factorConductores,
        factorTemperatura,
        id,
        calibreAmpacidad,
        caidaV,
        porcentaje,
        calibreCaida,
        interruptor,
        calibreInterruptor,
        calibreSugerido,
        calibreTierra,
        aprobado: porcentaje <= porcentajeVcDeseado
    };
}
