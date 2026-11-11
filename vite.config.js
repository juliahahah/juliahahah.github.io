import { defineConfig } from 'vite';

// Content Security Policy for the published site. Added only to the production
// build, because Vite's dev server needs a websocket the policy would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data:",
  'connect-src https://abacus.jasoncameron.dev https://ipapi.co https://*.workers.dev',
].join('; ');

export default defineConfig({
  plugins: [
    {
      name: 'inject-csp',
      apply: 'build',
      transformIndexHtml: () => [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head' },
      ],
    },
  ],
});
