// Interactive travel globe (orthographic projection drawn on a canvas).
// Visited countries come straight from travels.json, so adding a country there
// marks it on the globe automatically. Loaded on demand from travels.js.
import { geoOrthographic, geoPath, geoGraticule10, geoContains, geoCentroid, geoDistance, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import countries from '../data/travels.json';
import { TOTAL_COUNTRIES } from '../config.js';

const COLORS = {
  ocean: '#f7f6f3',
  graticule: '#ebe8e2',
  land: '#dedad3',
  border: '#ffffff',
  visited: '#5a5a5a',
  hover: '#262626',
  selected: '#000000',
  rim: '#d6d2ca',
};
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const PIN_RADIUS = 4.5;

const land = feature(world, world.objects.countries).features;
const visitedByIso = new Map(countries.map((c) => [c.iso, c]));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mountGlobe({ stage, canvas, tip, countEl, zoomButtons, onSelect }) {
  const ctx = canvas.getContext('2d');
  const projection = geoOrthographic().clipAngle(90).precision(0.4);
  const path = geoPath(projection, ctx);
  const graticule = geoGraticule10();

  let size = 0;
  let zoom = 1;
  let rotation = [-120, -20]; // start over East Asia
  let hovered = null; // travels.json entry or a plain feature name
  let selectedIso = null;
  let dragging = false;
  let interacting = false;
  let animation = null;
  const pointers = new Map();

  countEl.textContent = `${countries.length} / ${TOTAL_COUNTRIES} countries visited`;

  // ---------- geometry helpers ----------
  const center = () => [-rotation[0], -rotation[1]];
  const onFront = (lonLat) => geoDistance(lonLat, center()) < Math.PI / 2 - 0.02;
  const anchorOf = (c) => c.pin || geoCentroid(land.find((f) => f.id === c.iso));

  function resize() {
    const w = stage.clientWidth;
    size = Math.max(220, Math.min(w, 520));
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = canvas.style.height = `${size}px`;
    canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function applyProjection() {
    projection.translate([size / 2, size / 2]).scale((size / 2 - 6) * zoom).rotate(rotation);
  }

  // ---------- drawing ----------
  function fill(geo, color) {
    ctx.beginPath();
    path(geo);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function draw() {
    if (!size) return;
    applyProjection();
    ctx.clearRect(0, 0, size, size);

    fill({ type: 'Sphere' }, COLORS.ocean);
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = COLORS.graticule;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    for (const f of land) {
      const c = visitedByIso.get(f.id);
      let color = COLORS.land;
      if (c) color = c.iso === selectedIso ? COLORS.selected : hovered === c ? COLORS.hover : COLORS.visited;
      fill(f, color);
    }
    ctx.beginPath();
    path({ type: 'GeometryCollection', geometries: land.map((f) => f.geometry) });
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // small countries (not in the 110m map) are drawn as pins
    for (const c of countries) {
      if (!c.pin || !onFront(c.pin)) continue;
      const [x, y] = projection(c.pin);
      ctx.beginPath();
      ctx.arc(x, y, PIN_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = c.iso === selectedIso ? COLORS.selected : hovered === c ? COLORS.hover : COLORS.visited;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = COLORS.border;
      ctx.stroke();
    }

    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.strokeStyle = COLORS.rim;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ---------- hit testing ----------
  function localPoint(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function hitTest(pt) {
    for (const c of countries) {
      if (!c.pin || !onFront(c.pin)) continue;
      const [x, y] = projection(c.pin);
      if (Math.hypot(x - pt[0], y - pt[1]) <= PIN_RADIUS + 5) return { visited: c };
    }
    const lonLat = projection.invert(pt);
    if (!lonLat || !onFront(lonLat)) return null;
    const f = land.find((g) => geoContains(g, lonLat));
    if (!f) return null;
    return visitedByIso.has(f.id) ? { visited: visitedByIso.get(f.id) } : { name: f.properties.name };
  }

  function showTip(hit, pt) {
    if (!hit) { tip.hidden = true; return; }
    if (hit.visited) {
      const c = hit.visited;
      const when = /\d/.test(c.date) ? ` · ${c.date}` : '';
      tip.innerHTML = `<strong>${c.label}</strong><span>${c.photos.length} photos${when}</span>`;
    } else {
      tip.innerHTML = `<strong>${hit.name}</strong><span>not visited yet</span>`;
    }
    tip.hidden = false;
    tip.style.left = `${pt[0]}px`;
    tip.style.top = `${pt[1]}px`;
  }

  // ---------- motion ----------
  function rotateTo(lonLat) {
    const from = rotation.slice();
    const to = [-lonLat[0], Math.max(-60, Math.min(60, -lonLat[1]))];
    // shortest way round in longitude
    while (to[0] - from[0] > 180) to[0] -= 360;
    while (to[0] - from[0] < -180) to[0] += 360;
    const lerp = geoInterpolate([from[0], from[1]], [to[0], to[1]]);
    const start = performance.now();
    const duration = reducedMotion ? 0 : 700;
    animation = (now) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      const p = lerp(e);
      rotation = [p[0], p[1]];
      if (t >= 1) { rotation = to; animation = null; }
    };
  }

  function setZoom(z) {
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
    draw();
  }

  function frame(now) {
    if (canvas.isConnected && canvas.offsetParent !== null) {
      if (animation) animation(now);
      else if (!interacting && !dragging && !reducedMotion && !selectedIso) rotation[0] += 0.06;
      draw();
    }
    requestAnimationFrame(frame);
  }

  // ---------- input ----------
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, localPoint(e));
    downAt = localPoint(e);
    dragging = false;
    animation = null;
  });

  canvas.addEventListener('pointermove', (e) => {
    const pt = localPoint(e);
    if (pointers.has(e.pointerId)) {
      const prev = pointers.get(e.pointerId);
      if (pointers.size === 2) {
        // pinch zoom
        const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)[1];
        const before = Math.hypot(prev[0] - other[0], prev[1] - other[1]);
        const after = Math.hypot(pt[0] - other[0], pt[1] - other[1]);
        if (before > 0) setZoom(zoom * (after / before));
      } else {
        if (Math.hypot(pt[0] - downAt[0], pt[1] - downAt[1]) > 4) dragging = true;
        if (dragging) {
          const k = 0.35 / zoom;
          rotation[0] += (pt[0] - prev[0]) * k;
          rotation[1] = Math.max(-80, Math.min(80, rotation[1] - (pt[1] - prev[1]) * k));
        }
      }
      pointers.set(e.pointerId, pt);
      tip.hidden = true;
      return;
    }
    const hit = hitTest(pt);
    hovered = hit && hit.visited ? hit.visited : null;
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
    showTip(hit, pt);
  });

  function release(e) {
    const wasDrag = dragging;
    pointers.delete(e.pointerId);
    if (pointers.size === 0) dragging = false;
    if (wasDrag || e.type === 'pointercancel') return;
    const hit = hitTest(localPoint(e));
    if (hit && hit.visited) {
      selectedIso = hit.visited.iso;
      rotateTo(anchorOf(hit.visited));
      onSelect(hit.visited.id);
    }
  }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerenter', () => { interacting = true; });
  canvas.addEventListener('pointerleave', () => { interacting = false; hovered = null; tip.hidden = true; });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    setZoom(zoom * Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  zoomButtons.forEach((b) => b.addEventListener('click', () => setZoom(zoom * (b.dataset.zoom === 'in' ? 1.4 : 1 / 1.4))));

  // keep the globe in sync when a country is chosen from the tabs or cover cards
  document.addEventListener('travels:select', (e) => {
    const c = countries.find((x) => x.id === e.detail);
    selectedIso = c ? c.iso : null;
    if (c) rotateTo(anchorOf(c));
  });

  new ResizeObserver(resize).observe(stage);
  resize();
  requestAnimationFrame(frame);
}
