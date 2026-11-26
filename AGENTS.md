# AGENTS.md — handoff for coding agents

Read this first, then `PRD.md` for the product side. Last updated 2026-11-26 (commit `1617285`).

## Owner and how to work with him

- The owner is Goran. He writes in **Serbian (Latin script)**, so answer in Serbian. Code, comments, commit
  messages and these docs stay in English.
- His usual loop: he points at something on the live site (often with a screenshot or a selected element),
  you fix it **locally**, verify it, and ask whether to publish. He replies **"Push it live"**, and only then
  do you commit, push and check the live site. Do not push without that.
- He expects everything to be responsive. Check phone, tablet and desktop before saying a change is done
  (see "QA" below).

## Hard rules (do not break)

1. **Keep the concept framing.** The yellow "Concept redesign — not the official Eleven Green website" bar
   (injected by `js/site.js`) and `noindex` (meta tag on every page and the `X-Robots-Tag` header in
   `vercel.json`) stay unless the owner shows that Eleven Green has approved an official launch.
2. **Accounts stay a demo.** `js/account.js` keeps data only in `localStorage`, with no passwords and no
   network calls. Do not add real sign-up or credential collection on this site without Eleven Green's
   permission and a real backend.
3. **Do not commit raw stock photos.** `assets/source/` and the root `*.webp/*.png/*.jpg` are ignored on
   purpose, because stock licences (Freepik, etc.) do not allow redistributing the raw files. Only the
   processed cut-outs in `assets/ingredients/` are committed.
4. **TRON is not deployed.** `tron/` is kept for reference. `.vercelignore` excludes it and `/tron` redirects
   home.
5. **Git identity.** This repo uses the GitHub no-reply address in its local git config
   (`261804783+goransantic92-hue@users.noreply.github.com`), so the owner's personal email stays out of
   public commits. Keep it that way, and don't change the global git config.
6. End commit messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (or your own
   model's trailer, if your tool sets one).

## Run it

```bash
python -m http.server 5173
```

- Eleven Green: http://localhost:5173
- TRON (local only): http://localhost:5173/tron/
- `.claude/launch.json` defines this server as `tron-site` for the Claude desktop preview.

No install and no build. Plain HTML, CSS and JS. Fonts come from Google Fonts.

## Map of the repo

```
index.html        home: burger builder hero + greeting + menu tabs + awards + 11 keys + branches + news
menu.html about.html branches.html catering.html franchise.html news.html contacts.html account.html
css/base.css      design tokens, header/footer, sections, cards, forms, light (#E6F3E6) sections, breakpoints
css/builder.css   the burger builder (hero) only; loaded on index.html
js/data.js        ALL Eleven Green content: EG (links), MENU, BRANCHES (hours, tz), KEYS, VALUES, STORY, MILESTONES, NEWS
js/account.js     demo accounts store (window.EG_ACCOUNT); load before site.js
js/site.js        header + concept bar + footer, RENDER.* blocks, branch open/closed, forms, menu tabs, reveal
js/builder.js     burger builder: layers, presets, pricing, receipt, crown modal, pick-up branch, order again
js/account-page.js  account.html UI (register / sign in / profile / orders)
assets/ingredients/*.webp   cut-out photos (shared by Eleven Green and TRON)
assets/CREDITS.md image sources and licences (mostly still to fill in)
tron/             original TRON builder (not deployed)
tools/bump-version.py       sets ?v= on all css/js links (cache busting)
vercel.json       redirects (/tron, old /eleven-green/ links, old tron-fast-food host) + headers
.vercelignore     keeps tron/, *.md and tools/ out of the deployment
```

**Script order on every page:** `data.js` → `account.js` → `site.js` → (`builder.js` on index,
`account-page.js` on account). They are classic scripts that share globals (`esc`, `aed`, `branchStatus`,
`BRANCHES`, `MENU`…), so keep the order.

## How pages are built

- Each page has `<header id="site-header">` and `<footer id="site-footer">`, filled in by `renderChrome()`
  in `site.js` (which also inserts the concept bar at the top of `<body>`).
- Any element with `data-render="name"` is filled by `RENDER.name(el)` in `site.js`. Available renderers:
  `hello`, `signature`, `keys`, `branches` (`data-full="1"` shows the hours, `"open"` expands them), `news`,
  `values`, `story`, `milestones`, `menuHome`, `menuTabs`, `menu`.
- To change content (prices, hours, a new branch, a new burger), edit `js/data.js`. Nothing else needs to change.
- Forms with class `js-local-form` are replaced by their `data-done` message on submit. They send nothing.
- `--chrome-h` (concept bar + header height) is measured in `site.js` and used for the hero height.

## Burger builder (js/builder.js)

- `ING` = stack layers, `SIDES` = fries/shake, `BUN_PARTS` = bun halves. Each image is drawn 240px wide;
  `h` is its height at that width, and `t`/`b` are where the ingredient's top and bottom edges sit inside it.
  `REST`/`SINK` turn those into how layers overlap. If you add or replace a photo, measure `h/t/b` again
  (trim the transparent edges, scale to width 480 → halve).
- `PRESETS` = Eleven Green menu burgers as layer lists. The price comes from `MENU` in `data.js` by name.
  Layers listed in the preset are "incl."; extra ones are charged with `ING[k].price`.
- `PX_PER_CM = 27.6` is calibrated so bun + patty + cheese reads 9.4 cm.
- The stage scales the stack to fit (`layout()`); the top bun floats until "Crown it".
- `scrollLinesToEnd()` keeps the receipt from showing a half-cut first line. Keep it if you touch the receipt.
- Hooks: `window.EG_PRESETS`, `window.EG_loadPreset(id)` (used by "Build it ↑" in the menu), and
  `index.html#again=<orderId>` (rebuilds a saved order).

## Demo accounts (js/account.js)

`EG_ACCOUNT.user() / register({first,last,email,favBranch,newsletter}) / signIn(email) / signOut() /
update(fields) / deleteAccount() / recordOrder(order) / findOrder(id) / onChange(fn)`.
Storage key `eg-demo-accounts-v1`. Swapping in a real backend later should mean replacing this file and
keeping the same API.

## Styling and breakpoints

- Tokens are at the top of `css/base.css` (`--bg #063d2c`, `--yellow #f7b928`, `--red #e5432c`,
  `--paper #f6f1e3`…). Light mint sections use `class="section section-light"` (`#E6F3E6`, dark text, green accents).
- Breakpoints: **1180px** (header links → ☰ dropdown), **1100px** (builder's three columns narrow),
  **980px** (two-column grids), **860px** (builder goes to one column, tray becomes a 4-column grid),
  **640px** (phones).
- The builder also has a **short-desktop** query `(min-width: 861px) and (max-height: 820px)` that compacts
  the hero so it fits laptops 720–800px tall.
- The footer outline wordmark uses `paint-order: stroke fill` on purpose. The variable font's overlapping
  contours would otherwise show inside letters like "E".

## Deploy

- Push to `main` on GitHub `goransantic92-hue/eleven-green`. Vercel project **`eleven-green-concept`**
  (team `gorans-projects-7bb38d55`) auto-deploys in about 5 seconds.
- Production: https://eleven-green-concept.vercel.app.
- Check a deploy: `vercel ls eleven-green-concept`, then curl the changed file.
- Cache: CSS/JS/HTML are `max-age=0, must-revalidate`, images 1 day. Links carry `?v=20261126`. Bump with
  `python tools/bump-version.py <new>` if you ever lengthen caching.
- On Windows Git Bash, prefix `vercel api` calls with `MSYS_NO_PATHCONV=1`, or `/v9/...` paths get mangled.
  Deleting things through the Vercel API needs the owner's approval (and was blocked in the last session).

## QA checklist (do this before saying "done")

1. No console errors.
2. Sizes: phones 360/375/414, tablet 768/1024, desktop 1180/1280×720/1366×768/1440×900/1920×1080.
3. No page scrolls sideways at any size. Every visible element is inside the viewport.
4. Home hero on desktop: the hero fits the first screen, all 10 "Start from" chips and all 12 tray cards are
   visible, the hint line is visible, and the headline is not covered by the stage circle.
5. Builder: try a preset, add extras, check the total, crown it, check the modal text and order again.
6. After a push, re-check on the live URL (the browser may need F5).

A quick way to scan many pages and widths from one tab is to load each page into an off-screen `<iframe>`
of the target width and check `document.documentElement.scrollWidth > innerWidth`, plus element rects.
That is how the 9 pages × 9 widths check was done.

Note: when the browser preview pane is hidden, `requestAnimationFrame` is throttled. Screenshots can catch
layers mid-drop and totals mid-count. Measure with JS after a short wait instead of trusting one screenshot.

## Images

`assets/ingredients/*.webp` were cut out from the owner's stock photos (white or fake-checkerboard
backgrounds removed with Python Pillow + NumPy, trimmed, and scaled to 480px wide, or 300px tall for sides).
The raw files are only on the owner's machine (`assets/source/`, ignored). For new photos, ask the owner for
side-view images on a white or transparent background.

## Open items

See `PRD.md` §9. The most important ones: fill in `assets/CREDITS.md` (likely Freepik attribution for fries
and shake), and remove the old `tron-fast-food.vercel.app` domain in the Vercel dashboard (owner).
