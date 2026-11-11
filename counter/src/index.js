// Visitor counter for juliahahah.github.io — Cloudflare Worker + D1 (SQLite).
//   GET /hit     -> adds one visit, returns {"value": <total>}
//   GET /health  -> {"ok": true}
// Only origins listed in ALLOWED_ORIGINS may count a visit; anything else is
// refused (and logged), so a missing setting fails closed instead of open.

const json = (body, status, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

const log = (event, fields) => console.log(JSON.stringify({ event, time: new Date().toISOString(), ...fields }));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = allowed.includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (url.pathname === '/health') return json({ ok: true }, 200, cors);
    if (url.pathname !== '/hit' || request.method !== 'GET') return json({ error: 'not found' }, 404, cors);

    if (!cors['Access-Control-Allow-Origin']) {
      log('hit_refused', { origin: origin || '(none)', path: url.pathname });
      return json({ error: 'origin not allowed' }, 403);
    }

    try {
      const row = await env.DB.prepare(
        "INSERT INTO counters (name, value) VALUES ('visits', 1) " +
          'ON CONFLICT(name) DO UPDATE SET value = value + 1 RETURNING value',
      ).first();
      return json({ value: row.value }, 200, cors);
    } catch (err) {
      log('hit_failed', { message: String(err) });
      return json({ error: 'counter unavailable' }, 503, cors);
    }
  },
};
