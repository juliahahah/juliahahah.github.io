// Portraits gallery. The section is currently commented out in index.html;
// every function here is a no-op until it is restored.
const PATTERN = ['wide', 'tall', '', '', '', 'wide', '', 'tall', '', ''];

function activeCat() {
  const tab = document.querySelector('.gallery-tabs .gtab.active');
  return tab ? tab.dataset.cat : 'all';
}

export function rebuildGalleryLayout(cat = activeCat()) {
  const selector = cat === 'all'
    ? '.gallery-grid .g-slot:not(.hidden)'
    : `.gallery-grid .g-slot:not(.hidden)[data-tags*="${cat}"]`;
  const slots = [...document.querySelectorAll(selector)];
  slots.forEach((s, i) => {
    s.classList.remove('wide', 'tall');
    if (PATTERN[i % PATTERN.length]) s.classList.add(PATTERN[i % PATTERN.length]);
  });
  const empty = document.getElementById('galleryEmpty');
  if (empty) empty.classList.toggle('visible', slots.length === 0);
}

export function switchGalleryTab(cat) {
  const coverGrid = document.getElementById('galleryCoverGrid');
  const photoGrid = document.querySelector('.gallery-grid');
  if (!coverGrid || !photoGrid) return;
  document.querySelectorAll('.gallery-tabs .gtab').forEach((t) => t.classList.toggle('active', t.dataset.cat === cat));
  if (cat === 'all') {
    coverGrid.style.display = '';
    photoGrid.style.display = 'none';
    return;
  }
  coverGrid.style.display = 'none';
  photoGrid.style.display = '';
  document.querySelectorAll('.gallery-grid .g-slot').forEach((slot) => {
    slot.classList.toggle('hidden', (slot.dataset.tags || '').indexOf(cat) === -1);
  });
  const label = document.getElementById('label-campus');
  if (label) label.style.display = cat === 'campus' ? 'flex' : 'none';
  rebuildGalleryLayout(cat);
}

export function initGallery() {
  const photoGrid = document.querySelector('.gallery-grid');
  if (!photoGrid) return;
  photoGrid.style.display = 'none';

  document.querySelectorAll('.gallery-tabs .gtab').forEach((tab) => {
    tab.addEventListener('click', () => switchGalleryTab(tab.dataset.cat));
  });
  document.querySelectorAll('#galleryCoverGrid .gc-card').forEach((card) => {
    card.addEventListener('click', () => { switchGalleryTab(card.dataset.cat); window.scrollTo(0, 0); });
  });

  // hide broken images, then lay out once everything has settled
  const imgs = [...document.querySelectorAll('.gallery-grid .g-slot img')];
  const hideIfBroken = (img) => {
    if (!img.complete || img.naturalWidth === 0) img.closest('.g-slot').classList.add('hidden');
  };
  let pending = imgs.length;
  const settle = () => { if (--pending <= 0) rebuildGalleryLayout(); };
  imgs.forEach((img) => {
    img.addEventListener('error', () => { img.closest('.g-slot').classList.add('hidden'); settle(); });
    img.addEventListener('load', settle);
    if (img.complete) { hideIfBroken(img); settle(); }
  });
  setTimeout(() => { imgs.forEach(hideIfBroken); rebuildGalleryLayout(); }, 1200);
}
