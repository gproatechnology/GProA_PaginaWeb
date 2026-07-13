import { readFileSync } from 'fs';

const src = readFileSync(new URL('./calculo.js', import.meta.url), 'utf8');
const mod = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));

const {
    obtenerIpcTabla, calcularIpc, calcularMemoriaCompleta, voltajesDisponibles,
    hpDisponibles, validarCombinacion
} = mod;

let pass = 0, fail = 0;
function check(name, actual, expected) {
    const ok = actual === expected;
    console.log(`${ok ? 'OK ' : 'FAIL'} | ${name} | got=${actual} expected=${expected}`);
    ok ? pass++ : fail++;
}

console.log('--- Ipc tabulado por fases (Tablas NOM-001) ---');
check('3F 20HP@440V (->460) Ipc', obtenerIpcTabla(20, 440, 3), 27);
check('3F 20HP@460V Ipc', obtenerIpcTabla(20, 460, 3), 27);
check('1F 20HP@230V Ipc (430-248)', obtenerIpcTabla(20, 230, 1), 54);
check('1F 5HP@230V Ipc (430-248)', obtenerIpcTabla(5, 230, 1), 15.2);
check('1F 1HP@115V Ipc (430-248)', obtenerIpcTabla(1, 115, 1), 8.4);
check('2F 20HP@460V Ipc (430-249)', obtenerIpcTabla(20, 460, 2), 23);
check('2F 20HP@230V Ipc (430-249)', obtenerIpcTabla(20, 230, 2), 47);
check('2F 2HP@115V Ipc (430-249)', obtenerIpcTabla(2, 115, 2), 4);

console.log('\n--- calcularIpc (elige tabla por fases) ---');
check('calcularIpc 3F', calcularIpc({ hp: 20, voltaje: 440, fases: 3, fp: 0.95 }), 27);
check('calcularIpc 1F', calcularIpc({ hp: 20, voltaje: 230, fases: 1, fp: 0.95 }), 54);
check('calcularIpc 2F', calcularIpc({ hp: 20, voltaje: 460, fases: 2, fp: 0.95 }), 23);

console.log('\n--- Helpers UI / filtros ---');
check('voltajesDisponibles(2)', JSON.stringify(voltajesDisponibles(2)), JSON.stringify([115, 230, 460, 575, 2300]));
check('hpDisponibles(2,460) incluye 20', hpDisponibles(2, 460).includes(20), true);
check('hpDisponibles(2,460) NO incluye 1', hpDisponibles(2, 460).includes(1), false);
check('validar 3F/440/20', validarCombinacion(3, 440, 20).valido, true);
check('validar 1F/460/20 (460 no existe 1F)', validarCombinacion(1, 460, 20).valido, false);
check('validar 2F/230/1.5 (no tabulado 2F)', validarCombinacion(2, 230, 1.5).valido, false);

console.log('\n--- Memoria completa 2F vs 3F (misma carga) ---');
const m3 = calcularMemoriaCompleta({ hp: 20, voltaje: 440, fases: 3, fp: 0.95, longitud: 0.07, temperaturaAmbiente: 30, r: 2.56, xl: 0.171 });
const m2 = calcularMemoriaCompleta({ hp: 20, voltaje: 460, fases: 2, fp: 0.95, longitud: 0.07, temperaturaAmbiente: 30, r: 2.56, xl: 0.171 });
check('memoria 3F Ipc=27', m3.ipc, 27);
check('memoria 2F Ipc=23', m2.ipc, 23);
check('memoria 3F Im=33.75', m3.im, 33.75);
check('memoria 2F Im=28.75', m2.im, 28.75);

console.log(`\nRESULTADO: ${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
