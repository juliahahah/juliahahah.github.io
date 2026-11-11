// Section switching (sidebar + mobile drawer) and the mobile drawer itself.
import { switchGalleryTab, rebuildGalleryLayout } from './gallery.js';
import { switchEpTab, ensureGlobe } from './travels.js';

export function navigate(id) {
  document.querySelectorAll('section').forEach((s) => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('active', a.dataset.section === id));
  window.scrollTo(0, 0);

  if (id === 'gallery') {
    const tab = document.querySelector('.gallery-tabs .gtab.active');
    if (tab) switchGalleryTab(tab.dataset.cat);
    else rebuildGalleryLayout();
  }
  if (id === 'episodes') {
    const tab = document.querySelector('.ep-travels-tabs .gtab.active');
    if (tab) switchEpTab(tab.dataset.ep);
    ensureGlobe();
  }
}

function initDrawer() {
  const hamburger = document.getElementById('mobHamburger');
  const drawer = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');

  const setOpen = (open) => {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : ''; // stop the page scrolling behind the drawer
  };

  hamburger.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
  document.getElementById('mobDrawerClose').addEventListener('click', () => setOpen(false));
  overlay.addEventListener('click', () => setOpen(false));
  document.getElementById('mobNav').addEventListener('click', (e) => {
    if (e.target.closest('[data-section]')) setOpen(false);
  });
}

export function initNav() {
  document.addEventListener('click', (e) => {
    const sec = e.target.closest('[data-section]');
    if (sec) { e.preventDefault(); navigate(sec.dataset.section); return; }
    const go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); navigate(go.dataset.go); return; }
    const mail = e.target.closest('[data-mail]');
    if (mail) { e.preventDefault(); window.location.href = 'mai' + 'lto:juliaangle61@gmai' + 'l.com'; }
  });
  initDrawer();
}
