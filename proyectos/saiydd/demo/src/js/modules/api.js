import data from '../data/data.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const PROXY_URL = 'http://127.0.0.1:3000/api/chat';

async function tryProxy(message, childId) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, childId }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.reply || null;
  } catch {
    return null;
  }
}

const KB = {
  'hola': '¡Hola! Soy Orion. ¿Querés jugar?',
  'jugar': 'Podés elegir Juego o Mundo Bloques en el menú.',
  'ayuda': 'Decí “jugar” para ir a jugar, “padres” para el panel, o “salir” para volver.',
  'padres': 'Abrí “Para padres” en el menú para ver tu progreso.',
  'gracias': '¡De nada! 😊',
};
const FALLBACK = 'Estoy aprendiendo, pero cuéntame más.';

function matchCommand(text) {
  const t = (text || '').trim().toLowerCase();
  if (!t) return null;
  for (const k of Object.keys(KB)) {
    if (t.includes(k)) return k;
  }
  return null;
}

export const api = {
  async sendMessage(text, childId) {
    await delay(120);
    const cmd = matchCommand(text);
    if (cmd === 'salir') return { reply: KB['salir'] || 'Volviendo al menú...' };
    const localReply = cmd ? KB[cmd] : null;
    if (localReply) return { reply: localReply };

    const proxyReply = await tryProxy(text, childId);
    if (proxyReply) return { reply: proxyReply };

    return { reply: FALLBACK };
  },

  async getActivities() {
    await delay(120);
    return [...(data.activities || [])];
  },

  async getProfile(childId) {
    await delay(80);
    return (data.childProfiles || []).find(c => c.id === childId) || null;
  },

  async saveSession(session) {
    await delay(100);
    (data.sessions || []).push({ ...session, id: `sess_${String(Date.now()).slice(-6)}` });
    return true;
  },

  async getProgress(childId) {
    await delay(100);
    const list = (data.sessions || []).filter(s => s.childId === childId);
    const total = list.length;
    const avg = total ? Math.round(list.reduce((a, s) => a + (s.score || 0), 0) / total) : 0;
    return { total, avg, lastAt: list.at(-1)?.finishedAt || null };
  },
};
