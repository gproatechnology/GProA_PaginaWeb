import { readFileSync } from 'fs';
const src = readFileSync(new URL('./calculo.js', import.meta.url), 'utf8');
const mod = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
const { calcularMemoriaCompleta, calcularCaidaTension } = mod;

let pass = 0, fail = 0;
const approx = (a, b, tol = 0.05) => Math.abs(a - b) <= tol;
function check(name, cond, detail = '') {
    console.log(`${cond ? 'OK ' : 'FAIL'} | ${name}${detail ? ' | ' + detail : ''}`);
    cond ? pass++ : fail++;
}

console.log('=== CASO REFERENCIA: 20 HP / 440 V / 3F / L=0.07 / FP=0.95 (Memoria Rev 8) ===');
const r = calcularMemoriaCompleta({ hp: 20, voltaje: 440, fases: 3, fp: 0.95, longitud: 0.07, temperaturaAmbiente: 30, r: 2.56, xl: 0.171 });
check('Ipc = 27 A', r.ipc === 27, `got ${r.ipc}`);
check('Im = 33.75 A', r.im === 33.75, `got ${r.im}`);
check('Id = 33.75 A', r.id === 33.75, `got ${r.id}`);
check('Calibre ampacidad = 8 AWG', r.calibreAmpacidad === '8 AWG', r.calibreAmpacidad);
check('CaidaV ~ 8.13 V', approx(r.caidaV, 8.13, 0.1), `got ${r.caidaV}`);
check('Porcentaje ~ 1.85 %', approx(r.porcentaje, 1.85, 0.05), `got ${r.porcentaje}`);
check('Interruptor = 40 A (3F)', r.interruptor.amperaje === 40, `got ${r.interruptor.amperaje}`);
check('Interruptor polos 3F', r.interruptor.polos === '3F (3P) - 40 A', r.interruptor.polos);
check('Calibre tierra = 10 AWG', r.calibreTierra === '10 AWG', r.calibreTierra);
check('Calibre sugerido = 8 AWG', r.calibreSugerido === '8 AWG', r.calibreSugerido);
check('Aprobado = true', r.aprobado === true);

console.log('\n=== 1F: 5 HP / 230 V / L=0.07 / FP=0.95 ===');
const m1 = calcularMemoriaCompleta({ hp: 5, voltaje: 230, fases: 1, fp: 0.95, longitud: 0.07, temperaturaAmbiente: 30, r: 2.56, xl: 0.171 });
check('1F Ipc = 15.2 A (430-248)', m1.ipc === 15.2, `got ${m1.ipc}`);
check('1F Im = 19.0 A', m1.im === 19.0, `got ${m1.im}`);
const c1 = calcularCaidaTension({ longitud: 0.07, corriente: 15.2, voltaje: 230, fp: 0.95, resistencia: 2.56, reactancia: 0.171, fases: 1 });
check('1F caida factor 2 (caidaV ~ 5.29)', approx(c1.caidaV, 2 * 0.07 * (2.56 * 0.95 + 0.171 * Math.sqrt(1 - 0.95 * 0.95)) * 15.2, 0.05), `got ${c1.caidaV}`);
check('1F polos etiqueta 1F (2P)', m1.interruptor.polos === '1F (2P) - 20 A', m1.interruptor.polos);

console.log('\n=== 2F: 20 HP / 460 V / L=0.07 / FP=0.95 ===');
const m2 = calcularMemoriaCompleta({ hp: 20, voltaje: 460, fases: 2, fp: 0.95, longitud: 0.07, temperaturaAmbiente: 30, r: 2.56, xl: 0.171 });
check('2F Ipc = 23 A (430-249)', m2.ipc === 23, `got ${m2.ipc}`);
check('2F Im = 28.75 A', m2.im === 28.75, `got ${m2.im}`);
const c2 = calcularCaidaTension({ longitud: 0.07, corriente: 23, voltaje: 460, fp: 0.95, resistencia: 2.56, reactancia: 0.171, fases: 2 });
check('2F caida factor 2 (caidaV ~ 8.01)', approx(c2.caidaV, 2 * 0.07 * (2.56 * 0.95 + 0.171 * Math.sqrt(1 - 0.95 * 0.95)) * 23, 0.05), `got ${c2.caidaV}`);

console.log('\n=== Factores NOM ===');
const { obtenerFactorAjusteConductores, obtenerFactorTemperatura, calcularId } = mod;
check('Factor ajuste 3 cond = 1.0', obtenerFactorAjusteConductores(3) === 1.0);
check('Factor ajuste 6 cond = 0.8', obtenerFactorAjusteConductores(6) === 0.8);
check('Factor ajuste 9 cond = 0.7', obtenerFactorAjusteConductores(9) === 0.7);
check('Factor temp <=30 = 1.0', obtenerFactorTemperatura(30) === 1.0);
check('Factor temp 40 = 0.88', obtenerFactorTemperatura(40) === 0.88);
check('Id = Im/(fc*ft) 33.75/0.8/0.88', approx(calcularId(33.75, 0.8, 0.88), 33.75 / (0.8 * 0.88)), `got ${calcularId(33.75, 0.8, 0.88)}`);

console.log(`\nRESULTADO: ${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
