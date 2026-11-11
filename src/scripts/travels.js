// Travels: tabs, cover cards and photo grids are all built from travels.json.
// To add a country: put photos in public/photos/episodes/<id>/ and add an entry to the JSON.
import countries from '../data/travels.json';
import { openLightbox } from './lightbox.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function tabHtml(c) {
  return `<button class="gtab" data-ep="${c.id}">${esc(c.name)}</button>`;
}

function coverHtml(c) {
  return `
      <div class="ep-country" data-country="${c.id}">
        <div class="ep-cover">
          <img width="${c.cover.w}" height="${c.cover.h}" src="${c.cover.src}">
          <div class="ep-overlay"></div>
          <div class="ep-cover-info">
            <span class="ep-cover-name">${esc(c.label)}</span>
            <span class="ep-cover-date">${esc(c.date)}</span>
          </div>
        </div>
      </div>`;
}

function gridHtml(c) {
  const slots = c.photos
    .map((p) => `<div class="ep-slot"><img width="${p.w}" height="${p.h}" src="${p.src}" alt="${esc(c.name)}" loading="lazy"></div>`)
    .join('\n      ');
  return `
    <div class="ep-photo-grid" data-ep="${c.id}">
      ${slots}
    </div>`;
}

export function renderTravels() {
  document.getElementById('travelsCount').textContent = `${countries.length} countries`;
  document.getElementById('epTabs').innerHTML =
    '<button class="gtab active" data-ep="all">All</button>' + countries.map(tabHtml).join('');
  const coverGrid = document.getElementById('epCoverGrid');
  coverGrid.innerHTML = countries.map(coverHtml).join('\n');
  coverGrid.insertAdjacentHTML('afterend', countries.map(gridHtml).join('\n'));
}

export function switchEpTab(ep) {
  document.querySelectorAll('.ep-travels-tabs .gtab').forEach((t) => t.classList.toggle('active', t.dataset.ep === ep));
  document.dispatchEvent(new CustomEvent('travels:select', { detail: ep }));
  const coverGrid = document.getElementById('epCoverGrid');
  document.querySelectorAll('.ep-photo-grid').forEach((g) => g.classList.remove('active'));
  if (ep === 'all') {
    coverGrid.style.display = '';
    return;
  }
  coverGrid.style.display = 'none';
  const grid = document.querySelector(`.ep-photo-grid[data-ep="${ep}"]`);
  // show on the next frame so the column layout is computed fresh
  if (grid) requestAnimationFrame(() => grid.classList.add('active'));
}

// Start downloading a country's photos as soon as the pointer reaches its tab or cover.
function warm(ep) {
  const g = document.querySelector(`.ep-photo-grid[data-ep="${ep}"]`);
  if (!g || g.dataset.warm) return;
  g.dataset.warm = '1';
  g.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
}

// The globe is open by default on Travels. Its code (and the world map data)
// is only downloaded the first time the Travels section is shown.
let globeMounted = false;

export async function ensureGlobe() {
  const panel = document.getElementById('globePanel');
  if (globeMounted || panel.hidden) return;
  globeMounted = true;
  const { mountGlobe } = await import('./globe.js');
  mountGlobe({
    stage: panel.querySelector('.globe-stage'),
    canvas: document.getElementById('globeCanvas'),
    tip: document.getElementById('globeTip'),
    countEl: document.getElementById('globeCount'),
    zoomButtons: panel.querySelectorAll('[data-zoom]'),
    onSelect: (id) => {
      switchEpTab(id);
      document.getElementById('epTabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });
}

function initGlobeToggle() {
  const toggle = document.getElementById('globeToggle');
  const panel = document.getElementById('globePanel');
  const label = toggle.querySelector('.globe-toggle-label');
  document.getElementById('globeBadgeNum').textContent = countries.length;
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('open', open);
    label.textContent = open ? 'Hide the globe' : 'Explore on the globe';
    if (open) ensureGlobe();
  });
}

export function initTravels() {
  initGlobeToggle();
  document.querySelectorAll('.ep-travels-tabs .gtab').forEach((tab) => {
    tab.addEventListener('click', () => switchEpTab(tab.dataset.ep));
    tab.addEventListener('pointerenter', () => warm(tab.dataset.ep));
  });
  document.querySelectorAll('#epCoverGrid .ep-country').forEach((card) => {
    card.addEventListener('click', () => { switchEpTab(card.dataset.country); window.scrollTo(0, 0); });
    card.addEventListener('pointerenter', () => warm(card.dataset.country));
  });

  // fade each photo in once loaded; hide cells whose image is missing
  document.querySelectorAll('.ep-slot img').forEach((img) => {
    const done = () => img.classList.add('is-loaded');
    const hide = () => { img.closest('.ep-slot').style.display = 'none'; };
    if (img.complete && img.naturalWidth > 0) done();
    else img.addEventListener('load', done);
    img.addEventListener('error', hide);
  });
  document.querySelectorAll('.ep-cover img').forEach((img) => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // open the lightbox from any grid photo
  document.querySelectorAll('.ep-photo-grid').forEach((grid) => {
    const slots = [...grid.querySelectorAll('.ep-slot')];
    slots.forEach((slot, i) => {
      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(slots.map((s) => s.querySelector('img')), i);
      });
    });
  });
}
