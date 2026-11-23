# TRON fast food

Static burger-bar sites with an interactive "build your own burger" hero: tap layers from a tray,
watch them stack with real cut-out photos, track height and price on a receipt, then crown it.

| path | what it is |
| --- | --- |
| `/` | **TRON** — the burger builder (`index.html`, `style.css`, `app.js`) |
| `/eleven-green/` | **Eleven Green concept redesign** — 8 pages in the same style (unofficial, not affiliated with Eleven Green) |

No build step: plain HTML, CSS and JavaScript.

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173 (TRON) or http://localhost:5173/eleven-green/ (Eleven Green).

## Deploy

Connected to Vercel as a static site; every push to `main` deploys.

## Images

Ingredient photos in `assets/ingredients/` (and the copy in `eleven-green/assets/ingredients/`) were cut out
from stock photos. See [`assets/CREDITS.md`](assets/CREDITS.md) and fill in each source and licence;
some images need an attribution line (for example Freepik's free licence).

## Eleven Green notice

`/eleven-green/` is a design concept that reuses Eleven Green's public menu, branch and story content.
Every page shows a "Concept redesign — not the official Eleven Green website" bar and is marked `noindex`.
The official site is https://www.eleven-green.com/.
