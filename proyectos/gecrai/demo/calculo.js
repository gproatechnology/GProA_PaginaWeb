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

export function calcularIpc({ hp, voltaje, fases, fp, eficiencia = 0.9, factorUtilizacion = 1.25 }) {
    const hpNum = Number.parseFloat(hp) || 0;
    const v = Number.parseFloat(voltaje) || 0;
    const fpNum = Number.parseFloat(fp) || 0;
    const fu = Number.parseFloat(factorUtilizacion) || 1;
    const eff = Number.parseFloat(eficiencia) || 0.9;

    if (!hpNum || !v || !fpNum) return 0;

    const potencia = hpNum * 746;
    let ipc;

    if (fases === 3) {
        ipc = potencia / (1.732 * v * fpNum * eff);
    } else {
        ipc = potencia / (v * fpNum * eff);
    }

    return Number.parseFloat((ipc * fu).toFixed(2));
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
        const aprobado = caida.porcentaje <= params.porcentajeVcDeseado;
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
    const it = i * fu;

    const estandares = [15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100, 125, 150];

    for (const cal of estandares) {
        if (cal >= it) {
            return {
                amperaje: cal,
                polos: Number.parseInt(fases) === 3 ? '3 x ' + cal + ' A' : '2 x ' + cal + ' A'
            };
        }
    }

    const max = estandares[estandares.length - 1];
    return {
        amperaje: max,
        polos: Number.parseInt(fases) === 3 ? '3 x ' + max + ' A' : '2 x ' + max + ' A'
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
