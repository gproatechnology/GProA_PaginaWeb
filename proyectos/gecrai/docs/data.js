const DOC_CONTENT = [
  {
    id: 'introduccion',
    title: 'Introducción',
    html: `
      <p>GECRAI 1.1 es una <strong>herramienta interna de ingeniería</strong> que genera <strong>memorias de cálculo de conductores</strong> para instalaciones eléctricas, conforme a la <strong>NOM-001-SEDE-2012</strong>. Su objetivo es ayudarte a dimensionar conductores, protecciones y caídas de tensión de forma rápida y trazable.</p>
      <div class="grid grid-3">
        <div class="card"><h4>¿Qué es</h4><p>Asistente de cálculo eléctrico con validación normativa automática.</p></div>
        <div class="card"><h4>Para qué sirve</h4><p>Dimensionar el calibre del conductor, la puesta a tierra y el interruptor de un motor.</p></div>
        <div class="card"><h4>Cómo funciona</h4><p>Introducís los datos del circuito y GECRAI aplica las tablas NOM y te entrega la memoria.</p></div>
      </div>
      <div class="note">Esta es una <strong>demo funcional</strong>: los cálculos son reales, pero el inicio de sesión y el guardado son simulados (no requieren servidor).</div>`
  },
  {
    id: 'alcance',
    title: 'Alcance',
    html: `
      <p>En su versión actual, GECRAI cubre el dimensionamiento de conductores para motores según el número de fases:</p>
      <ul>
        <li><strong>Monofásico (1F)</strong> — Tabla 430-248 NOM-001.</li>
        <li><strong>Bifásico 4 hilos (2F)</strong> — Tabla 430-249 NOM-001.</li>
        <li><strong>Trifásico (3F)</strong> — Tabla 430-250 NOM-001.</li>
      </ul>
      <div class="note">El cálculo de corriente a plena carga (Ipc) se toma directamente de las tablas oficiales. Solo si la combinación no está tabulada se usa la fórmula de respaldo.</div>`
  },
  {
    id: 'acceso',
    title: 'Acceso (inicio de sesión)',
    html: `
      <ol class="steps">
        <li>Abrí la demo de GECRAI (botón "Abrir demo" en este manual o desde la tarjeta del proyecto).</li>
        <li>En la pantalla de acceso, escribí <strong>cualquier usuario y contraseña</strong>: es una demo, no valida credenciales reales.</li>
        <li>Pulsá <strong>Entrar</strong> para acceder al panel principal (dashboard).</li>
      </ol>
      <div class="note">Como es una herramienta interna de validación, el login solo sirve para mostrar el flujo completo de la aplicación.</div>`
  },
  {
    id: 'dashboard',
    title: 'Panel principal (dashboard)',
    html: `
      <p>Después de entrar verás el resumen de actividad. Sus tarjetas principales son:</p>
      <div class="grid grid-3">
        <div class="card"><h4>Métricas</h4><p>Consultas realizadas, memorias generadas y normativa más usada.</p></div>
        <div class="card"><h4>Actividad reciente</h4><p>Historial de las últimas memorias calculadas en este navegador.</p></div>
        <div class="card"><h4>Gráficas</h4><p>Distribución de uso por normativa (donut/barras).</p></div>
      </div>
      <p>Para calcular una memoria nueva, entrá a la sección <strong>Consulta</strong> y abrí el <strong>Asistente de cálculo</strong>.</p>`
  },
  {
    id: 'asistente',
    title: 'Asistente de cálculo (wizard)',
    html: `
      <p>El asistente guía el dimensionamiento en <strong>6 pasos</strong>. Completá el paso 1 (Antecedentes) y los resultados se calculan y muestran en vivo:</p>
      <ol class="steps">
        <li><strong>Antecedentes:</strong> proyecto, TAG, tensión de alimentación, número de fases, longitud del circuito (km), carga (HP), temperatura ambiente, FP y factor de utilización.</li>
        <li><strong>Ampacidad:</strong> muestra Ipc, Im (125%·Ipc), factores de ajuste y el calibre por ampacidad.</li>
        <li><strong>Caída de tensión:</strong> voltaje y porcentaje de caída en el conductor.</li>
        <li><strong>Puesta a tierra:</strong> calibre del conductor de tierra sugerido.</li>
        <li><strong>Interruptor:</strong> amperaje y cantidad de polos (1F/2F/3F).</li>
        <li><strong>Resumen:</strong> memoria completa lista para revisar y guardar.</li>
      </ol>
      <div class="note">Los campos <strong>Tensión</strong> y <strong>Carga (HP)</strong> se eligen en listas que cambian según el número de fases, para garantizar combinaciones válidas en tabla.</div>`
  },
  {
    id: 'fases',
    title: 'Monofásico, bifásico y trifásico',
    html: `
      <p>El número de fases define qué tabla NOM-001 se usa para la corriente a plena carga:</p>
      <div class="grid grid-3">
        <div class="card"><h4>1F (Monofásico)</h4><p>Tabla 430-248. Tensiones 115, 200, 208 y 230 V.</p></div>
        <div class="card"><h4>2F (Bifásico 4 hilos)</h4><p>Tabla 430-249. Tensiones 115, 230, 460, 575 y 2300 V.</p></div>
        <div class="card"><h4>3F (Trifásico)</h4><p>Tabla 430-250. Tensiones 115, 200, 208, 230, 460, 575 y 2300 V.</p></div>
      </div>
      <p>Al seleccionar las fases, la lista de <strong>tensiones</strong> y de <strong>HP</strong> se actualiza automáticamente con los valores válidos para esa configuración.</p>
      <div class="note">Ejemplo: para 3F a 440 V se usa la columna 460 V de la Tabla 430-250 (rango 440-480 V).</div>`
  },
  {
    id: 'validacion',
    title: 'Validación en tiempo real',
    html: `
      <p>Mientras llenás el formulario, GECRAI valida cada dato al instante y bloquea el cálculo si algo está mal:</p>
      <ul>
        <li><strong>Factor de potencia (cos φ):</strong> debe estar entre 0 y 1.</li>
        <li><strong>Temperatura ambiente:</strong> entre -20 °C y 120 °C.</li>
        <li><strong>Longitud del circuito:</strong> mayor a 0 km.</li>
        <li><strong>Resistencia (R) y reactancia (XL):</strong> R &gt; 0, XL ≥ 0.</li>
        <li><strong>Combinación fases/tensión/HP:</strong> debe estar en la tabla NOM correspondiente.</li>
      </ul>
      <div class="note">Si un dato es incorrecto verás un mensaje en rojo y el cálculo no se genera hasta corregirlo. Esto evita memorias con valores imposibles.</div>`
  },
  {
    id: 'ejemplo',
    title: 'Ejemplo real paso a paso',
    html: `
      <p>Calculemos un motor <strong>trifásico de 20 HP, 440 V, FP 0.95, a 70 m de distancia</strong>:</p>
      <ol class="steps">
        <li>Seleccionás <strong>3F</strong>, tensión <strong>460 V</strong> (rango 440-480) y <strong>20 HP</strong>.</li>
        <li>Ipc (Tabla 430-250) = <strong>27 A</strong>.</li>
        <li>Im = 125% · Ipc = <strong>33.75 A</strong>.</li>
        <li>Con factores 1.0, Id = <strong>33.75 A</strong> → calibre por ampacidad <strong>8 AWG</strong>.</li>
        <li>Caída de tensión ≈ <strong>8.14 V (1.85 %)</strong> — dentro del 3 % deseado.</li>
        <li>Interruptor = <strong>40 A (3F 3P)</strong>; calibre a tierra <strong>10 AWG</strong>.</li>
      </ol>
      <div class="note">Resultado: calibre sugerido <strong>8 AWG</strong>, memoria <strong>aprobada</strong>.</div>`
  },
  {
    id: 'comparar',
    title: 'Comparar calibres',
    html: `
      <p>La herramienta permite comparar dos calibres (por ejemplo 8 AWG vs 6 AWG) para el mismo circuito:</p>
      <ul>
        <li>Calcula la <strong>ampacidad</strong> de cada uno según la tabla.</li>
        <li>Recalcula la <strong>caída de tensión</strong> real de cada calibre.</li>
        <li>Marca cuál <strong>aprueba</strong> el porcentaje de caída deseado.</li>
      </ul>
      <div class="note">Usá "Comparar calibres" cuando dudes entre dos tamaños y quieras ver el impacto en la caída de tensión.</div>`
  },
  {
    id: 'normativas',
    title: 'Normativas soportadas',
    html: `
      <ul>
        <li><strong>NOM-001-SEDE-2012</strong> (instalaciones eléctricas).</li>
        <li>Tablas de corriente a plena carga: 430-248 (1F), 430-249 (2F), 430-250 (3F).</li>
      </ul>
      <div class="note">Los valores de Ipc provienen de las tablas oficiales; el dimensionamiento sigue los factores de ajuste por cantidad de conductores y por temperatura ambiente.</div>`
  },
  {
    id: 'qa',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: '¿La demo reemplaza el producto real?',
        answer: 'No. Es una guía funcional para validar cálculos; la versión productiva puede conectarse a un backend real (ver contrato de API).'
      },
      {
        question: '¿Dónde se guardan las memorias?',
        answer: 'En esta demo se guardan localmente en el navegador (modo mock). En producción se almacenan en el repositorio seguro de la empresa.'
      },
      {
        question: '¿Puedo calcular motores muy grandes?',
        answer: 'La tabla de ampacidad llega hasta 4/0 AWG (195 A). Por encima de ese rango el calibre se marca como "No encontrado" y conviene ampliar la tabla.'
      },
      {
        question: '¿Por qué el voltaje 440 V se muestra como 460 V?',
        answer: 'Porque 440 V cae en el rango 440-480 V de la columna 460 de la Tabla 430-250. El valor de Ipc es el mismo.'
      }
    ]
  },
  {
    id: 'soporte',
    title: 'Soporte',
    html: '<p>Para soporte técnico, contactá a <strong>admin@gproatechnology.com</strong> o llamá al <strong>+52 1 419 129 6200</strong>.</p>'
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
