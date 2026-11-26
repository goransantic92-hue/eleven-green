# PRD — Eleven Green concept redesign

Status: **live concept**, last updated 2026-11-26.
Live: https://eleven-green-concept.vercel.app · Repo: https://github.com/goransantic92-hue/eleven-green

## 1. What this is

An unofficial **concept redesign** of the website of Eleven Green, a burger bistro with branches in the UAE
and Qatar (official site: https://www.eleven-green.com). It reuses Eleven Green's public content (menu,
prices, branches, opening hours, story, press) in a new visual style. The style was first built for a
fictional brand called **TRON** (an interactive "build your own burger" page) and then applied to the whole
Eleven Green site.

It is a design showcase and a pitch, **not** Eleven Green's production website.

## 2. Goals

1. Show a distinctive, modern look for Eleven Green: dark green, cream "receipt" paper, yellow and red accents,
   with an interactive burger builder as the home-page hero.
2. Cover everything the original site offers: menu, branches, about, catering, franchising, news, contacts,
   customer accounts.
3. Work well on every screen, from 360px phones to 1920px desktops, with nothing cut off or hidden.
4. Stay honest: every page says it is a concept and is not indexed by search engines.

## 3. Non-goals (for now)

- Real ordering or payment. "Order now" links to Eleven Green's own ordering at https://www.eleven-green.com/order.
- Real customer accounts. Accounts are a **browser-only demo** (see 5.9).
- Sending form data anywhere. Catering, franchise, contact and newsletter forms only show a thank-you.
- A CMS or an admin panel.
- Arabic / multilingual content.

## 4. Users

- **The site owner** (Goran) uses it as a portfolio piece and pitch.
- **Eleven Green's team** as possible clients reviewing the concept.
- **Visitors** trying the burger builder and browsing the menu, mostly on phones.

## 5. Features (all shipped)

### 5.1 Global
- A yellow **concept bar** on top of every page: "Concept redesign — not the official Eleven Green website",
  with a link to the official site.
- A sticky header with the wordmark, 7 nav links, an account link ("Sign in" / "Hi, Name") and an "Order now"
  button. Below 1180px wide, the links move into a ☰ dropdown.
- A footer with a newsletter form (front-end only), quick links, email and socials, a large outline wordmark,
  and privacy/terms links to the official site.
- `noindex, nofollow` as a meta tag on every page and as an `X-Robots-Tag` header.

### 5.2 Home (`index.html`)
1. **Burger builder hero** (fills the first screen on desktop):
   - **Start from** row: "Build your own" plus 9 menu burgers rebuilt from layers (Bull Burger, El Reno,
     AA Cheeseburger, The Unoriginal, 11G Cheeseburger, Royale with Cheese, 11G Patty Melt, Classic Chicken,
     Angry Chicken). Each is priced at its real menu price, and extra layers are charged per layer.
   - **Ingredient tray**: 10 layers (wagyu patty, crispy chicken, American cheese, beef bacon, iceberg, tomato,
     red onion, pickles, fried egg, 11G sauce) and 2 sides (regular fries, vanilla milkshake), with prices in AED.
   - Tap to drop a layer, tap the stack to remove one. A live height ruler in cm and a receipt with "−"
     buttons and an animated total.
   - **Pick-up at** a branch selector, which shows each branch as open or closed right now.
   - **Crown it** drops the top bun with a flag and opens a confirmation ("It's on the grill.") with the
     branch and ready time (about 15 min).
2. Greeting card ("Hello Stranger!" / "Hello, Name!" with the last order and "Order again").
3. **Full menu** in tabs (7 categories, 29 items), with "Build it ↑" on burgers that the builder can make.
4. Awards band, then **11 keys to the perfect burger** (both on a mint #E6F3E6 background).
5. **Branches**: 6 cards with live open/closed status, collapsible hours, "Order" and "Directions".
6. **News**: 4 press cards linking to the official blog posts (mint background).

### 5.3 Menu (`menu.html`)
All categories as receipt-style cards in two columns, with sticky category chips.

### 5.4 About (`about.html`)
Origin story, 6 values, mission, the 11 keys, a three-chapter story (2019, 2022, 2023) and a milestones timeline.

### 5.5 Branches (`branches.html`)
All 6 branches with address, full weekly hours, live status in the branch's own time zone (Asia/Dubai or
Asia/Qatar), and links for directions and ordering.

### 5.6 Catering (`catering.html`)
"The Truck" and "11G at Home", and a booking form. The event date must be at least 7 days ahead.

### 5.7 Franchising (`franchise.html`)
Pitch, what partners carry forward, who Eleven Green looks for, and an application form in three fieldsets.

### 5.8 News (`news.html`) and Contacts (`contacts.html`)
Press cards. Contacts has email, socials, a privacy note, a message form with a department picker, and the branch cards.

### 5.9 Customer accounts — demo (`account.html`)
- Create account (first and last name, email, optional favourite branch, a "this is a demo" checkbox, and an
  optional newsletter box), sign in by email, sign out, edit details, delete the demo account.
- The **order history** is filled from the builder: every crowned burger while signed in is saved. "Order again"
  rebuilds the same burger, sides and branch (link `index.html#again=<orderId>`).
- The favourite branch is preselected for pick-up.
- **Storage:** the visitor's own `localStorage` (key `eg-demo-accounts-v1`). No passwords, no server, and
  nothing is shared between devices. This is stated on the page.

## 6. Content and data

- All Eleven Green content lives in `js/data.js` (menu, prices in AED, branches with hours and time zones,
  the 11 keys, values, story, milestones, press). It was taken from eleven-green.com in November 2026 and
  may go out of date.
- Builder layer prices are **our estimates**. Eleven Green has no build-your-own option.
- Images: only cut-out ingredient photos (`assets/ingredients/*.webp`). No photos or logo from eleven-green.com
  are used. The wordmark is set as text.

## 7. Quality bar

- Responsive from 360px to 1920px. No page scrolls sideways, and no element sits outside the screen.
- On desktop (1024 to 1920px wide, 720px tall and up) the whole hero fits the first screen: all 10 "Start from"
  chips, all 12 tray cards and the hint line.
- The headline is never covered by the stage circle.
- The receipt never shows a half-cut line at the top.
- No console errors on any page.
- `prefers-reduced-motion` turns animations off.

## 8. Tech

Plain HTML, CSS and JavaScript with no framework and no build step. Google Fonts (Bricolage Grotesque,
Instrument Serif, DM Mono). Hosted as a static site on Vercel and auto-deployed from GitHub `main`.
See `AGENTS.md` for the code map and workflow.

## 9. Open items / next steps

| # | item | owner / notes |
| --- | --- | --- |
| 1 | Fill in image sources and licences in `assets/CREDITS.md`. Fries and shake look like Freepik and probably need an attribution line in the footer. | owner has the original download links |
| 2 | Remove the old domain `tron-fast-food.vercel.app` in Vercel → project → Settings → Domains. It already redirects here. | owner (the CLI was not allowed to delete it) |
| 3 | Real form handling (Resend, Formspree or a serverless function) | only with Eleven Green's approval |
| 4 | Real accounts (for example Supabase Auth + Postgres) to replace `js/account.js` | only with Eleven Green's approval, plus a privacy policy |
| 5 | Real ordering and payment (Stripe Checkout; check payment providers for Qatar) | likely better to integrate with their existing ordering |
| 6 | Optional migration to Astro + Tailwind (discussed, not started) | keeps the site fast, shares one layout across pages |
| 7 | Arabic version, RTL | not started |
| 8 | Refresh `js/data.js` if Eleven Green changes their menu, prices or hours | manual |
