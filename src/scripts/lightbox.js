// Full-screen photo viewer shared by the travel grids.
let overlay, img, counter;
let images = [];
let index = 0;

function show() {
  img.src = images[index].src;
  counter.textContent = `${index + 1} / ${images.length}`;
}

function step(delta) {
  index = (index + delta + images.length) % images.length;
  show();
}

function close() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  img.src = '';
}

export function openLightbox(imgs, startIndex) {
  images = imgs;
  index = startIndex;
  show();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function initLightbox() {
  overlay = document.getElementById('lightbox');
  img = document.getElementById('lbImg');
  counter = document.getElementById('lbCounter');

  document.getElementById('lbClose').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === img) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Escape') close();
  });
}
