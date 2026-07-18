const DOC_CONTENT = [
  {
    id: 'introduccion',
    title: 'Introducción',
    html: `
      <p>GlucAI 1.5 es una <strong>demo enterprise de diagnóstico glucémico</strong> que estima el perfil de glucosa en sangre a partir de <strong>33 elementos de química sanguínea</strong>, usando un motor de clasificación <strong>KNN (k-vecinos más cercanos)</strong> y una arquitectura de <strong>agentes autónomos</strong> 2026. Su objetivo es mostrar, de forma trazable y explicable, cómo clasificar un perfil como <strong>Normal</strong>, <strong>Prediabetes</strong> o <strong>Riesgo glucosa</strong>.</p>
      <div class="grid grid-3">
        <div class="card"><h4>¿Qué es</h4><p>Asistente de diagnóstico glucémico con pipeline de agentes y explicabilidad local.</p></div>
        <div class="card"><h4>Para qué sirve</h4><p>Clasificar el perfil glucémico y resaltar qué biomarcadores más pesaron en el resultado.</p></div>
        <div class="card"><h4>Cómo funciona</h4><p>Introducís 33 analitos, GlucAI los normaliza, los clasifica con KNN y te entrega la memoria.</p></div>
      </div>
      <div class="note">Esta es una <strong>demo funcional con datos sintéticos</strong>: el motor KNN es real, pero el entrenamiento con datos clínicos reales y los agentes LLM en servidor requieren infraestructura/producto aparte. <strong>No es un dispositivo médico.</strong></div>`
  },
  {
    id: 'alcance',
    title: 'Alcance',
    html: `
      <p>En su versión actual, GlucAI cubre el diagnóstico de perfil glucémico a partir de 33 biomarcadores de química sanguínea:</p>
      <ul>
        <li><strong>Glucosa / HbA1c / Insulina</strong> — núcleo del metabolismo glucémico.</li>
        <li><strong>Perfil renal</strong> — creatinina, eGFR, BUN, ácido úrico.</li>
        <li><strong>Perfil hepático</strong> — ALT, AST, ALP, bilirrubina, GGT, amilasa, lipasa.</li>
        <li><strong>Lípidos y inflamación</strong> — colesterol, triglicéridos, HDL, LDL, PCR, ferritina.</li>
        <li><strong>Electrolitos y tiroides</strong> — Na, K, Cl, Ca, Mg, P, TSH, T4, LDH, CPK, homocisteína.</li>
      </ul>
      <div class="note">La clasificación usa <strong>normalización z-score</strong> sobre el dataset sintético. Las escalas de los 33 elementos difieren mucho, por eso la normalización es obligatoria.</div>`
  },
  {
    id: 'acceso',
    title: 'Acceso (inicio de sesión)',
    html: `
      <ol class="steps">
        <li>Abrí la demo de GlucAI (botón "Abrir demo" en este manual o desde la tarjeta del proyecto).</li>
        <li>En la pantalla de acceso, escribí <strong>cualquier usuario y contraseña</strong>: es una demo, no valida credenciales reales.</li>
        <li>Pulsá <strong>Entrar</strong> para acceder al panel principal (dashboard).</li>
      </ol>
      <div class="note">Como es una herramienta de demostración, el login solo sirve para mostrar el flujo completo de la aplicación.</div>`
  },
  {
    id: 'dashboard',
    title: 'Panel principal (dashboard)',
    html: `
      <p>Después de entrar verás el resumen de actividad del asistente. Sus tarjetas principales son:</p>
      <div class="grid grid-3">
        <div class="card"><h4>Métricas</h4><p>Exámenes analizados, diagnósticos generados y perfil más frecuente.</p></div>
        <div class="card"><h4>Actividad reciente</h4><p>Historial de los últimos perfiles diagnosticados en este navegador.</p></div>
        <div class="card"><h4>Gráficas</h4><p>Distribución de uso por perfil (donut/barras).</p></div>
      </div>
      <p>Para diagnosticar un perfil nuevo, entrá a la sección <strong>Asistente</strong> y abrí el <strong>diagnóstico de 6 pasos</strong>.</p>`
  },
  {
    id: 'asistente',
    title: 'Asistente de diagnóstico (wizard)',
    html: `
      <p>El asistente guía el diagnóstico en <strong>6 pasos</strong>. Completá el paso 1 (Antecedentes) y los resultados se calculan y muestran en vivo:</p>
      <ol class="steps">
        <li><strong>Antecedentes:</strong> paciente, edad, sexo y notas clínicas.</li>
        <li><strong>Química (33 elem.):</strong> los 33 biomarcadores de laboratorio.</li>
        <li><strong>Normalización:</strong> muestra el z-score de cada elemento respecto al dataset.</li>
        <li><strong>Clasificación KNN:</strong> clase predicha, confianza y vecinos más cercanos.</li>
        <li><strong>Explicabilidad:</strong> los elementos que más pesaron en la decisión (estilo SHAP local).</li>
        <li><strong>Modelo + Memoria:</strong> modelo anatómico SVG iluminado y memoria lista para imprimir.</li>
      </ol>
      <div class="note">Los pasos representan el <strong>pipeline de agentes</strong> (Ingestión → Validación → Clasificador KNN → Explicabilidad → Reporte) orquestado por <code>orquestarDiagnostico()</code>.</div>`
  },
  {
    id: 'motor',
    title: 'Motor KNN y normalización',
    html: `
      <p>El diagnóstico se calcula con funciones puras y testeables:</p>
      <div class="grid grid-2">
        <div class="card"><h4>normalizar()</h4><p>z-score de cada biomarcador con la media/desvío del dataset.</p></div>
        <div class="card"><h4>distanciaPonderada()</h4><p>distancia euclídea (o ponderada) entre la muestra y cada vecino.</p></div>
        <div class="card"><h4>clasificarKNN()</h4><p>vota la clase mayoritaria entre los k=5 vecinos más cercanos.</p></div>
        <div class="card"><h4>explicarResultado()</h4><p>contribución por elemento del vecino más cercano.</p></div>
      </div>
      <p>El orquestador <code>calcularRiesgoGlucosa()</code> valida las entradas, clasifica y arma la memoria legible.</p>
      <div class="note">Dataset sintético etiquetado (90 muestras, 30 por clase) con semilla fija para que las pruebas sean deterministas.</div>`
  },
  {
    id: 'validacion',
    title: 'Validación en tiempo real',
    html: `
      <p>Mientras llenás el formulario, GlucAI valida cada dato al instante y bloquea el cálculo si algo está mal:</p>
      <ul>
        <li><strong>Valores numéricos:</strong> cada biomarcador debe ser un número finito.</li>
        <li><strong>Rangos clínicos:</strong> glucosa 20-600 mg/dL, HbA1c 2-15 %, insulina 0-100 uIU/mL, etc.</li>
        <li><strong>Combinación completa:</strong> los 33 elementos deben estar presentes.</li>
      </ul>
      <div class="note">Si un dato está fuera de rango verás un mensaje en rojo y el cálculo no se genera hasta corregirlo.</div>`
  },
  {
    id: 'anatomico',
    title: 'Modelo anatómico',
    html: `
      <p>El último paso ilumina un <strong>SVG de cuerpo humano</strong> según el diagnóstico, sin dependencias externas:</p>
      <div class="grid grid-3">
        <div class="card"><h4>Páncreas</h4><p>relacionado con glucosa, HbA1c e insulina.</p></div>
        <div class="card"><h4>Riñones</h4><p>relacionado con creatinina, eGFR y ácido úrico.</p></div>
        <div class="card"><h4>Hígado</h4><p>relacionado con ALT, AST, ALP, bilirrubina.</p></div>
        <div class="card"><h4>Corazón</h4><p>riesgo cardiovascular asociado a lípidos y PCR.</p></div>
        <div class="card"><h4>Vasos</h4><p>sistema circulatorio (colesterol, triglicéridos).</p></div>
      </div>
      <p>Al pasar el cursor sobre un órgano se resaltan los biomarcadores que lo activaron.</p>
      <div class="note">El modelo 3D (Three.js + .glb) es una fase opcional; el SVG se eligió por peso ligero y coherencia con el estilo de la web.</div>`
  },
  {
    id: 'comparar',
    title: 'Comparar perfiles',
    html: `
      <p>La herramienta permite comparar dos perfiles (por ejemplo Normal vs Prediabetes) para el mismo conjunto de analitos:</p>
      <ul>
        <li>Muestra la <strong>clasificación</strong> de cada perfil.</li>
        <li>Resalta las <strong>diferencias</strong> en los biomarcadores más relevantes.</li>
        <li>Ayuda a entender el límite entre clases.</li>
      </ul>
      <div class="note">Usá "Comparar" cuando quieras ver qué separa un perfil Normal de uno en Riesgo.</div>`
  },
  {
    id: 'disclaimer',
    title: 'Aviso importante (no médico)',
    html: `
      <p>GlucAI es una <strong>demo funcional con datos sintéticos</strong>. No debe usarse para decisiones clínicas.</p>
      <ul>
        <li>El entrenamiento con <strong>datos clínicos reales</strong> requiere un producto/infraestructura aparte.</li>
        <li>Los <strong>agentes LLM en servidor</strong> y el model serving no están incluidos en la demo.</li>
        <li>Un producto real debe cumplir con <strong>COFEPRIS / FDA</strong> (es dispositivo médico).</li>
      </ul>
      <div class="note">El backend está listo para cablear vía <code>api.js</code> (modo stub, <code>USE_API=false</code>).</div>`
  },
  {
    id: 'qa',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: '¿La demo reemplaza un producto real?',
        answer: 'No. Es una guía funcional para validar el motor KNN y la experiencia agentic; la versión productiva puede conectarse a un backend real (ver api.js).'
      },
      {
        question: '¿De dónde salen los datos?',
        answer: 'En esta demo se generan con un dataset sintético etiquetado y semilla fija. No son datos de pacientes reales.'
      },
      {
        question: '¿Por qué la normalización es obligatoria?',
        answer: 'Porque las escalas de los 33 elementos difieren mucho (glucosa en mg/dL vs TSH en mIU/L). El z-score las lleva a una escala comparable.'
      },
      {
        question: '¿Dónde se guardan las memorias?',
        answer: 'En esta demo se guardan localmente en el navegador (modo mock). En producción se almacenan en el repositorio seguro de la empresa.'
      }
    ]
  },
  {
    id: 'soporte',
    title: 'Soporte',
    html: '<p>Para soporte técnico, contactá a <strong>admin@gproatechnology.com</strong> o llamá al <strong>+52 1 468 120 8570</strong>.</p>'
  }
];

function stripTags(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || '';
}

export function buildToc() {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const title = toc.querySelector('h4');
  toc.innerHTML = '';
  if (title) toc.appendChild(title);

  DOC_CONTENT.forEach((section) => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = section.title;
    link.dataset.target = section.id;
    toc.appendChild(link);
  });
}

export function buildDocSections() {
  const container = document.getElementById('inicio');
  if (!container) return;

  container.innerHTML = '';
  document.getElementById('docLoader')?.remove();

  DOC_CONTENT.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'doc-section';
    sectionEl.id = section.id;

    let searchText = `${section.title} ${stripTags(section.html)}`;
    if (section.items) {
      section.items.forEach((item) => {
        searchText += ` ${item.question} ${item.answer}`;
      });
    }
    sectionEl.dataset.search = searchText.toLowerCase();

    const h2 = document.createElement('h2');
    h2.textContent = section.title;
    sectionEl.appendChild(h2);

    if (section.html) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = section.html;
      sectionEl.appendChild(wrapper);
    }

    if (section.items) {
      section.items.forEach((item) => {
        const details = document.createElement('details');
        details.innerHTML = `
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        `;
        sectionEl.appendChild(details);
      });
    }

    container.appendChild(sectionEl);
  });
}

export { DOC_CONTENT };
