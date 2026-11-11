// Entry point: styles in cascade order, then each feature module.
import './styles/base.css';
import './styles/layout.css';
import './styles/about.css';
import './styles/projects.css';
import './styles/community.css';
import './styles/gallery.css';
import './styles/travels.css';
import './styles/lightbox.css';
import './styles/decor.css';
import './styles/hero.css';
import './styles/responsive.css';

import { renderTravels, initTravels } from './scripts/travels.js';
import { initGallery } from './scripts/gallery.js';
import { initNav } from './scripts/nav.js';
import { initLightbox } from './scripts/lightbox.js';
import { initWatermark } from './scripts/watermark.js';
import { initAbout } from './scripts/about.js';
import { initProjects } from './scripts/projects.js';
import { initVisitorBadge } from './scripts/visitor-badge.js';
import { initProtection } from './scripts/protection.js';
import { initHero } from './scripts/hero.js';

renderTravels(); // must run before anything that looks for travel elements
initLightbox();
initGallery();
initTravels();
initNav();
initHero();
initWatermark();
initAbout();
initProjects();
initVisitorBadge();
initProtection();
