const DOC_CONTENT = [
  {
    id: 'introduccion',
    title: 'Introducción',
    html: '<p>GECRAI 1.1 es un asistente inteligente para consulta regulatoria, generación de memorias de cálculo y validaciones industriales.</p>'
  },
  {
    id: 'alcance',
    title: 'Alcance',
    html: '<ul><li>Consultas normativas automatizadas</li><li>Generación de memorias de cálculo</li><li>Integración con flujos de ingeniería</li></ul>'
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura',
    html: `
      <div class="grid grid-3">
        <div class="card"><h4>Frontend</h4><p>Interfaz web responsiva y dashboards operativos.</p></div>
        <div class="card"><h4>Backend</h4><p>Lógica de negocio, validaciones y orquestación de servicios.</p></div>
        <div class="card"><h4>IA</h4><p>Motor de consulta, normalización y generación de documentos.</p></div>
      </div>`
  },
  {
    id: 'modulos',
    title: 'Módulos principales',
    html: `
      <div class="grid grid-2">
        <div class="card"><h4>Consulta</h4><p>Búsqueda por normativa, sector, alcance y versión.</p></div>
        <div class="card"><h4>Memorias</h4><p>Generación automática desde parámetros eléctricos.</p></div>
        <div class="card"><h4>Validación</h4><p>NOM-001-SEDE-2012, arc flash y verificación de parámetros.</p></div>
        <div class="card"><h4>Reportes</h4><p>Exportación y seguimiento por proyecto.</p></div>
      </div>`
  },
  {
    id: 'instalacion',
    title: 'Instalación',
    html: `
      <ol class="steps">
        <li>Descargar el paquete de instalación correspondiente.</li>
        <li>Ejecutar el instalador y aceptar términos.</li>
        <li>Configurar usuario, dominio y conectividad.</li>
        <li>Verificar acceso al servicio de normativas.</li>
      </ol>
      <div class="note">Recomendación: usar credenciales provisionales en entornos de prueba.</div>`
  },
  {
    id: 'uso',
    title: 'Uso paso a paso',
    html: `
      <h3>1. Inicio de sesión</h3>
      <p>Ingresá con tu usuario y contraseña institucional.</p>
      <h3>2. Nueva consulta</h3>
      <p>Seleccioná la normativa y parámetros del sistema eléctrico.</p>
      <h3>3. Generar memoria</h3>
      <p>El sistema devuelve el documento estructurado para revisión y exportación.</p>
      <h3>4. Guardar y compartir</h3>
      <p>Podés guardar la memoria en el historial y compartir el enlace.</p>`
  },
  {
    id: 'normativas',
    title: 'Normativas soportadas',
    html: '<ul><li>NOM-001-SEDE-2012</li><li>NOM-002-SEDE-2010</li><li>NOM-003-SEDE-2005</li><li>IEEE 1584</li></ul>'
  },
  {
    id: 'qa',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: '¿La demo reemplaza el producto real?',
        answer: 'No. La demo es una guía funcional; la versión productiva puede variar.'
      },
      {
        question: '¿Dónde se almacenan las memorias?',
        answer: 'En esta demo se guardan localmente en el navegador. En producción se almacenan en tu repositorio seguro.'
      },
      {
        question: '¿Puedo importar datos de otras herramientas?',
        answer: 'Sí, se admiten exportaciones compatibles con AutoCAD/Revit en la versión completa.'
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
