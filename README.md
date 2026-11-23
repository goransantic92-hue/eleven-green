# Eleven Green — concept redesign

Static burger-bar sites with an interactive "build your own burger" hero: tap layers from a tray,
watch them stack with real cut-out photos, track height and price on a receipt, then crown it.

Live: https://eleven-green-concept.vercel.app/ (Eleven Green concept).
TRON is kept in `tron/` for reference but is **not deployed** (`.vercelignore`, and `/tron` redirects home).

| path | what it is |
| --- | --- |
| `/` | **Eleven Green concept redesign**: 8 pages (`index`, `menu`, `about`, `branches`, `catering`, `franchise`, `news`, `contacts`), unofficial and not affiliated with Eleven Green |
| `tron/` | **TRON**: the original burger builder, local only, not deployed |
| `assets/ingredients/` | cut-out ingredient photos shared by both sites |

No build step: plain HTML, CSS and JavaScript.

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173 (Eleven Green) or http://localhost:5173/tron/ (TRON).

## Deploy

Connected to Vercel as a static site; every push to `main` deploys. Old `/eleven-green/...` links
redirect to the root (see `vercel.json`).

## Images

Ingredient photos in `assets/ingredients/` were cut out from stock photos. See
[`assets/CREDITS.md`](assets/CREDITS.md) and fill in each source and licence; some images need an
attribution line (for example Freepik's free licence).

## Eleven Green notice

The root site is a design concept that reuses Eleven Green's public menu, branch and story content.
Every page shows a "Concept redesign — not the official Eleven Green website" bar and is marked `noindex`.
The official site is https://www.eleven-green.com/.
