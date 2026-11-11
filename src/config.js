// Site-wide settings. Change values here, not inside the feature modules.

// Your own visitor counter (Cloudflare Worker in /counter). Paste the
// workers.dev URL here after `npx wrangler deploy`, e.g.
// 'https://juliahahah-counter.<your-subdomain>.workers.dev'.
// While empty, the public Abacus counter is used instead.
export const COUNTER_URL = '';

export const FALLBACK_COUNTER_URL = 'https://abacus.jasoncameron.dev/hit/juliahahah-github-io/visits';

export const WATERMARK_TEXT = 'juliahahah.github.io';

// Denominator for "12 / 195 countries visited" on the travel globe (UN members + 2 observers).
export const TOTAL_COUNTRIES = 195;
