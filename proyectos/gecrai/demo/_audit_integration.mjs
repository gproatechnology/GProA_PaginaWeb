import { readFileSync } from 'fs';
const src = readFileSync(new URL('./calculo.js', import.meta.url), 'utf8');
const mod = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
const { compararCalibres, validarCombinacion, obtenerIpcTabla } = mod;
let pass=0, fail=0;
const ck=(n,c,d='')=>{console.log(`${c?'OK ':'FAIL'} | ${n}${d?' | '+d:''}`);c?pass++:fail++;};

const base = { hp:20, voltaje:440, fases:3, fp:0.95, longitud:0.07, temperaturaAmbiente:30, r:2.56, xl:0.171, eficiencia:0.9 };
const c3 = compararCalibres(base,'8 AWG','6 AWG');
ck('comparar 3F sin error', !!c3.a && !!c3.b, `a=${c3.a.calibre} b=${c3.b.calibre}`);
ck('comparar 3F caida A < B (mas grueso => menos caida)', c3.a.porcentaje <= c3.b.porcentaje, `A=${c3.a.porcentaje}% B=${c3.b.porcentaje}%`);
ck('comparar 3F A aprobado', c3.a.aprobado===true);

const c2 = compararCalibres({...base, fases:2, voltaje:460},'8 AWG','6 AWG');
ck('comparar 2F sin error', !!c2.a && !!c2.b, `ipc base=${c2.base.ipc}`);
ck('comparar 2F ipc=23', c2.base.ipc===23);

const c1 = compararCalibres({...base, fases:1, voltaje:230, hp:5},'10 AWG','8 AWG');
ck('comparar 1F sin error', !!c1.a && !!c1.b, `ipc base=${c1.base.ipc}`);
ck('comparar 1F ipc=15.2', c1.base.ipc===15.2);

ck('validar 2F/230/2 valido', validarCombinacion(2,230,2).valido===true);
ck('validar 2F/230/1.5 invalido (no tabulado)', validarCombinacion(2,230,1.5).valido===false);
ck('validar 1F/115/1 valido', validarCombinacion(1,115,1).valido===true);
ck('validar 3F/2300/500 valido', validarCombinacion(3,2300,500).valido===true);
ck('validar 3F/2300/0.5 invalido', validarCombinacion(3,2300,0.5).valido===false);
ck('obtenerIpcTabla 3F/2300/500=118', obtenerIpcTabla(500,2300,3)===118);

console.log(`\nRESULTADO: ${pass} OK, ${fail} FAIL`);
process.exit(fail?1:0);
