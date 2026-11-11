# juliahahah.github.io

Julia Liu's personal site — about, travels (with an interactive globe), projects and community.
Plain HTML / CSS / JavaScript, bundled with [Vite](https://vite.dev), deployed to GitHub Pages by GitHub Actions.

## Structure

```
.
├── index.html                 page markup (about, projects, community, sidebar, lightbox)
├── src/
│   ├── main.js                entry: imports the styles, starts each feature
│   ├── config.js              site settings (counter URL, watermark text, …)
│   ├── data/
│   │   └── travels.json       every travel country: name, date, map code, cover, photos
│   ├── scripts/               one file per feature
│   │   ├── travels.js         builds the Travels tabs / covers / grids from travels.json
│   │   ├── globe.js           interactive 3D globe (loaded only when opened)
│   │   ├── nav.js             section switching + mobile drawer
│   │   ├── lightbox.js        full-screen photo viewer
│   │   ├── gallery.js         Portraits gallery (section currently hidden)
│   │   ├── visitor-badge.js   visit count + visitor location in the sidebar
│   │   ├── about.js · projects.js · watermark.js · protection.js
│   └── styles/                one file per area, imported in this order by main.js
│       └── base · layout · about · projects · community · gallery · travels · lightbox · responsive
├── public/photos/             served as-is at /photos/…
│   ├── episodes/<country>/    travel photos
│   ├── community/             event photos
│   └── gallery/<series>/      portrait series (Portraits section is hidden for now)
├── counter/                   visitor counter: Cloudflare Worker + D1 (see counter/README.md)
├── .github/workflows/deploy.yml   build + deploy on every push to main
└── vite.config.js             build settings + Content Security Policy
```

## Run it locally

Needs Node 20.

```bash
npm install
```

```bash
npm run dev
```

Opens http://localhost:5173 and reloads on save. `npm run build` writes the production site to `dist/`, and `npm run preview` serves that build.

## Common edits

**Add a travel country** — put the photos in `public/photos/episodes/<id>/` (resize to ≤1600 px first), then add an entry to `src/data/travels.json`:

```json
{
  "id": "spain", "name": "Spain", "label": "Spain", "date": "2027.03",
  "iso": "724",
  "cover":  { "src": "photos/episodes/spain/spain_01.jpg", "w": 1600, "h": 1200 },
  "photos": [ { "src": "photos/episodes/spain/spain_01.jpg", "w": 1600, "h": 1200 } ]
}
```

The tab, cover card, photo grid, country count and the globe highlight all update from that one entry.
`iso` is the ISO 3166 numeric code (Spain 724, Germany 276, UK 826…). For a country too small for the
world map (like Singapore), also add `"pin": [longitude, latitude]` so it shows as a dot.
`w` / `h` are the image's pixel size; they let the page reserve space so the grid doesn't jump while loading.

Still listed in About → "12 countries": update the number and flag list in `index.html` by hand.

**Edit projects, community or about text** — it's ordinary HTML in `index.html`; styles are in the matching file in `src/styles/`.

**Visitor counter** — see `counter/README.md`. Until `COUNTER_URL` in `src/config.js` is set, the free public Abacus counter is used.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.
(Repository → Settings → Pages → Source must be **GitHub Actions**.)

## Hidden sections

Portraits (`#gallery`) and Journal (`#thoughts`) are commented out in `index.html`, and their nav links too. Uncomment both to bring them back; their scripts and styles are still in place.

Portrait series: GreenPath (`gallery/green-path-nycu`), Blue Hour (`blue-hour`), Amber (`amber`), Spark (`spark`), Off Stage (`stage-dance`), Renaissance (`stage-performance`), Clearing (`clearing`).
