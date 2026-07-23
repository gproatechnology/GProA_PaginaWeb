import mascota from './mascota.js';
import { createMascotaBar, updateMascotaUI } from './mascota-ui.js';
import voz from './voz.js';
import { escapeHtml, clampText, isSafeText } from '../utils/sanitize.js';
import { allowAction } from '../utils/rate-limiter.js';
import { api } from './api.js';

export function showChatbot({ app, setView }) {
  const section = document.createElement('section');
  section.className = 'screen screen--chatbot';
  section.innerHTML = `
    <header>
      <h1>Asistente</h1>
      <div class="mascota-bar"></div>
      <button id="backBtn" type="button">Volver</button>
      <button id="micBtn" type="button" aria-label="Micrófono">🎤</button>
    </header>
    <div class="chat" id="chat"></div>
    <div class="chat-input">
      <input id="chatInput" type="text" placeholder="Escribe o usá el micrófono" autocomplete="off" />
      <button id="sendBtn" type="button" aria-label="Enviar">Enviar</button>
    </div>
  `;

  const chat = section.querySelector('#chat');
  const addMsg = (text, who = 'bot') => { const d = document.createElement('div'); d.className = `chat-msg chat-msg--${who}`; d.textContent = text; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; };

  const mascotaUI = {};
  const existing = section.querySelector('.mascota-bar');
  const header = section.querySelector('header');
  const bar = createMascotaBar(header);
  Object.assign(mascotaUI, bar);
  if (existing) existing.remove();
  updateMascotaUI(mascota, mascotaUI);
  mascotaUI.muteBtn.addEventListener('click', () => updateMascotaUI(mascota, mascotaUI));

  addMsg('Hola, soy Orion. Podés escribir, hablar o usar los comandos: ayuda, jugar, padres, salir.');
  mascota.setExpression('happy');
  updateMascotaUI(mascota, mascotaUI);
  mascota.say('Hola, soy Orion. Podés escribir o hablar.');

  const input = section.querySelector('#chatInput');
  const sendBtn = section.querySelector('#sendBtn');
  const backBtn = section.querySelector('#backBtn');
  const micBtn = section.querySelector('#micBtn');

  function handleInput(text) {
    if (!isSafeText(text)) {
      addMsg('Mensaje no permitido.', 'bot');
      return;
    }
    if (!allowAction('chatbot-send', 10, 60000)) {
      addMsg('Estás enviando mensajes muy rápido. Esperá un momento.', 'bot');
      return;
    }
    const safe = escapeHtml(clampText(text, 180));
    addMsg(safe, 'user');
    input.value = '';

    api.sendMessage(text, (window.dataMock?.childProfiles?.[0]?.id) || 'child_001').then(({ reply }) => {
      addMsg(reply, 'bot');
      mascota.setExpression('neutral');
      updateMascotaUI(mascota, mascotaUI);
      mascota.say(reply);
    }).catch(() => {
      addMsg('No pude conectarme con el asistente. Probá de nuevo.', 'bot');
    });
  }

  sendBtn.addEventListener('click', () => handleInput(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleInput(input.value);
  });
  backBtn.addEventListener('click', () => { voz.stop(); mascota.stop(); setView('menu'); });

  const hasVoice = voz.init();
  if (hasVoice) {
    micBtn.addEventListener('click', () => {
      if (voz.listening) {
        voz.stop();
        micBtn.textContent = '🎤';
        micBtn.style.background = '';
        return;
      }
      micBtn.textContent = '🔴';
      micBtn.style.background = '#ef476f';
      voz.start(
        (text) => handleInput(text),
        () => {
          micBtn.textContent = '🎤';
          micBtn.style.background = '';
        }
      );
    });
  } else {
    micBtn.disabled = true;
    micBtn.title = 'Voz no disponible en este navegador';
  }

  input.focus();
  app.appendChild(section);
}
