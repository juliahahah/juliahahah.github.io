// Light deterrents against copying photos: no right-click menu and no
// shortcuts for dev tools / view source / save / select all.
// (This only stops casual copying; anyone determined can still get the files.)
const BLOCKED_WITH_SHIFT = new Set(['I', 'J', 'C']);
const BLOCKED = new Set(['u', 's', 'a']);

export function initProtection() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'F12' || (mod && e.shiftKey && BLOCKED_WITH_SHIFT.has(e.key)) || (mod && BLOCKED.has(e.key))) {
      e.preventDefault();
    }
  });
}
