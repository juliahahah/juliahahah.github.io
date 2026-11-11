// Adds the small site-name label on top of every photo.
import { WATERMARK_TEXT } from '../config.js';

export function initWatermark() {
  document.querySelectorAll('.g-slot, .ep-cover, .ep-slot').forEach((el) => {
    const label = document.createElement('span');
    label.className = 'wm-label';
    label.textContent = WATERMARK_TEXT;
    el.appendChild(label);
  });
}
