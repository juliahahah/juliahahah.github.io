// Bottom-left badge: total visits + the visitor's location. Writes to both the
// sidebar (vb*) and the mobile drawer (vb*Mob) copies.
import { COUNTER_URL, FALLBACK_COUNTER_URL } from '../config.js';

function setBoth(id, text) {
  for (const el of [document.getElementById(id), document.getElementById(id + 'Mob')]) {
    if (el) el.textContent = text;
  }
}

function flagEmoji(code) {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

async function loadCount() {
  const url = COUNTER_URL ? `${COUNTER_URL.replace(/\/$/, '')}/hit` : FALLBACK_COUNTER_URL;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const n = Number((await r.json()).value);
    if (!Number.isFinite(n)) throw new Error('bad count');
    setBoth('vbCount', n.toLocaleString());
  } catch {
    setBoth('vbCount', '—');
  }
}

async function loadLocation() {
  try {
    const d = await (await fetch('https://ipapi.co/json/')).json();
    setBoth('vbFlag', d.country_code ? flagEmoji(d.country_code) : '🌐');
    const place = d.city ? `${d.city}, ${d.country_name || ''}` : d.country_name || '—';
    setBoth('vbLocText', place);
  } catch {
    setBoth('vbLocText', '—');
  }
}

export function initVisitorBadge() {
  loadCount();
  loadLocation();
}
