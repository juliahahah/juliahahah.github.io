// Home hero animations:
//  1. the dashed flight path draws itself while the plane flies along it,
//     then the plane keeps gliding the route slowly;
//  2. the trip polaroids flip through on their own; click one to open its album.
// Both stay still when the visitor has asked their system for reduced motion.
import { navigate } from './nav.js';
import { switchEpTab } from './travels.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const INTRO_MS = 3200; // first flight, drawing the path
const LOOP_MS = 14000; // each later flight
const FADE = 0.06; // fraction of a flight spent fading in / out
const NOSE_ANGLE = -24; // the plane drawing points up-right by this much

function initFlight() {
  const path = document.getElementById('flightPath');
  const maskPath = document.getElementById('flightMaskPath');
  const plane = document.getElementById('flightPlane');
  if (!path || !plane) return;

  const length = path.getTotalLength();
  maskPath.style.strokeDasharray = `${length}`;

  const place = (t) => {
    const d = Math.min(length, Math.max(0, t * length));
    const p = path.getPointAtLength(d);
    const q = path.getPointAtLength(Math.min(length, d + 1));
    const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI - NOSE_ANGLE;
    plane.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
  };

  if (reducedMotion) {
    maskPath.style.strokeDashoffset = '0';
    place(0.02);
    return;
  }

  const ease = (x) => 1 - (1 - x) ** 3;
  const start = performance.now();
  let loopStart = null;

  const frame = (now) => {
    const intro = (now - start) / INTRO_MS;
    if (intro < 1) {
      const t = ease(intro);
      maskPath.style.strokeDashoffset = `${length * (1 - t)}`;
      place(t);
      plane.style.opacity = '1';
    } else {
      maskPath.style.strokeDashoffset = '0';
      if (loopStart === null) loopStart = now + 1500; // short rest after landing
      const t = (now - loopStart) / LOOP_MS;
      if (t < 0) {
        place(1);
        plane.style.opacity = String(Math.max(0, 1 + t * 3));
      } else {
        const u = t % 1;
        place(u);
        plane.style.opacity = String(Math.min(1, u / FADE, (1 - u) / FADE));
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function initPhotoStack() {
  const stack = document.getElementById('heroStack');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('.hero-card')];
  if (!cards.length) return;

  let top = 0;
  const STATES = ['is-top', 'is-next', 'is-back'];
  const layout = () => {
    cards.forEach((card, i) => {
      card.classList.remove(...STATES);
      const rank = (i - top + cards.length) % cards.length;
      if (rank < STATES.length) card.classList.add(STATES[rank]);
    });
  };

  const advance = () => {
    const leaving = cards[top];
    leaving.classList.add('is-leaving');
    top = (top + 1) % cards.length;
    layout();
    setTimeout(() => leaving.classList.remove('is-leaving'), 800);
  };

  const open = (card) => {
    navigate('episodes');
    switchEpTab(card.dataset.ep);
  };
  cards.forEach((card) => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  layout();
  if (reducedMotion) return;

  let paused = false;
  stack.addEventListener('pointerenter', () => { paused = true; });
  stack.addEventListener('pointerleave', () => { paused = false; });
  stack.addEventListener('focusin', () => { paused = true; });
  stack.addEventListener('focusout', () => { paused = false; });
  setInterval(() => {
    const visible = stack.offsetParent !== null && !document.hidden;
    if (!paused && visible) advance();
  }, 4500);
}

export function initHero() {
  initFlight();
  initPhotoStack();
}
