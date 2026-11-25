'use strict';
/* Eleven Green — shared header/footer, page renderers, branch status, forms. */

const NAV = [
  ['menu.html', 'Menu'], ['about.html', 'About'], ['branches.html', 'Branches'],
  ['catering.html', 'Catering'], ['franchise.html', 'Franchising'], ['news.html', 'News'], ['contacts.html', 'Contacts'],
];
const here = location.pathname.split('/').pop() || 'index.html';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const aed = (v) => `AED ${v}`;

/* ---------- header & footer ---------- */
function renderChrome() {
  // This is an unofficial concept redesign: say so on every page, above everything else.
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="concept-bar" role="note">
      <strong>Concept redesign</strong> — not the official Eleven Green website.
      <a href="https://www.eleven-green.com/" target="_blank" rel="noopener">Visit eleven-green.com</a>
    </div>`);

  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="Eleven Green, home">ELEVEN GREEN<small>11G</small></a>
        <nav class="nav" id="nav" aria-label="Main">
          ${NAV.map(([href, label]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
          <a class="btn btn-red nav-cta" href="${EG.orderUrl}" target="_blank" rel="noopener">Order now</a>
        </nav>
        <a class="acct-link" id="acctLink" href="account.html"${here === 'account.html' ? ' aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 19.4c1.4-3.2 4-4.8 7.2-4.8s5.8 1.6 7.2 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <span class="acct-label" id="acctLabel">Sign in</span>
        </a>
        <a class="btn btn-red head-cta" href="${EG.orderUrl}" target="_blank" rel="noopener">Order now</a>
        <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu">
          <span></span><span></span>
        </button>
      </div>`;
    // account link: "Sign in" or "Hi, Name" (demo accounts, js/account.js)
    const paintAccount = (u) => {
      const label = document.getElementById('acctLabel'), link = document.getElementById('acctLink');
      label.textContent = u ? `Hi, ${u.first}` : 'Sign in';
      link.setAttribute('aria-label', u ? `Your account, signed in as ${u.first}` : 'Sign in or create an account');
      link.classList.toggle('is-in', !!u);
    };
    if (window.EG_ACCOUNT) { paintAccount(EG_ACCOUNT.user()); EG_ACCOUNT.onChange(paintAccount); }

    const t = document.getElementById('menuToggle');
    t.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      t.setAttribute('aria-expanded', String(open));
      t.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap">
        <div class="f-top">
          <div class="f-sub">
            <p class="eyebrow"><span class="dot"></span>Stay in touch</p>
            <h2 class="h3">Now that you know us better, <em>keep in the loop.</em></h2>
            <form class="inline-form js-local-form" data-done="You’re on the list. Watch your inbox for the next limited drop.">
              <label class="sr-only" for="nl-email">Email</label>
              <input id="nl-email" type="email" name="email" placeholder="you@email.com" required autocomplete="email">
              <button class="btn btn-yellow" type="submit">Subscribe</button>
            </form>
          </div>
          <div class="f-cols">
            <div>
              <p class="f-label">Quick links</p>
              <ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>
            </div>
            <div>
              <p class="f-label">Say hi</p>
              <ul>
                <li><a href="mailto:${EG.email}">${EG.email}</a></li>
                <li><a href="${EG.social.instagram}" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="${EG.social.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
                <li><a href="${EG.social.facebook}" target="_blank" rel="noopener">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="f-word" aria-hidden="true">ELEVEN GREEN</p>
        <div class="f-bottom">
          <span>All rights reserved © ${new Date().getFullYear()}</span>
          <span><a href="${EG.legal.privacy}" target="_blank" rel="noopener">Privacy policy</a> / <a href="${EG.legal.terms}" target="_blank" rel="noopener">Terms</a></span>
        </div>
      </div>`;
  }
}

/* ---------- branch open / closed, in the branch's own time zone ---------- */
const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
function branchStatus(b, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: b.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map((p) => [p.type, p.value]));
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.weekday);
  const t = Number(parts.hour) * 60 + Number(parts.minute);
  const span = (i) => {
    const [o, c] = b.hours[(i + 7) % 7].split('-');
    let open = toMin(o), close = toMin(c);
    if (close <= open) close += 1440;
    return { open, close, closeLabel: c, openLabel: o };
  };
  const today = span(day), yest = span(day - 1);
  if (t + 1440 < yest.close) return { open: true, label: `Open · until ${yest.closeLabel}` };
  if (t >= today.open && t < today.close) return { open: true, label: `Open · until ${today.closeLabel}` };
  if (t < today.open) return { open: false, label: `Closed · opens ${today.openLabel}` };
  return { open: false, label: `Closed · opens ${span(day + 1).openLabel}` };
}
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mapsUrl = (b) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Eleven Green ' + b.address)}`;

function branchCard(b, full) {
  const s = branchStatus(b);
  return `
    <article class="branch">
      <div class="branch-top">
        <p class="b-city">${esc(b.city)}</p>
        <span class="status ${s.open ? 'is-open' : ''}" data-branch="${b.id}">${s.label}</span>
      </div>
      <h3 class="b-name">${esc(b.name)}</h3>
      <p class="b-addr">${esc(b.address)}</p>
      ${b.dineInOnly ? '<p class="b-flag">Dine-in service only</p>' : '<p class="b-flag">Pick-up ready in ~15 mins</p>'}
      ${full ? `
      <details class="hours" ${full === 'open' ? 'open' : ''}>
        <summary>Dine-in & online ordering hours</summary>
        <table>${DAYS.map((d, i) => `<tr><th>${d}</th><td>${b.hours[i].replace('-', ' – ')}</td></tr>`).join('')}</table>
      </details>` : ''}
      <div class="b-actions">
        ${b.dineInOnly ? '' : `<a class="btn btn-yellow" href="${EG.orderUrl}" target="_blank" rel="noopener">Order</a>`}
        <a class="btn btn-ghost" href="${mapsUrl(b)}" target="_blank" rel="noopener">Directions</a>
      </div>
    </article>`;
}

/* ---------- renderers (any page can use them via data-render) ---------- */
const RENDER = {
  // home: "Hello Stranger!" like the original, or a personal greeting with the last order
  hello() {
    const u = window.EG_ACCOUNT && EG_ACCOUNT.user();
    if (!u) {
      return `
        <div class="hello">
          <div><p class="hello-t">Hello <em>Stranger!</em></p>
          <p class="hello-d">Sign in to keep your orders and your favourite branch, for a personalised Elevener experience.</p></div>
          <div class="hello-a"><a class="btn btn-yellow" href="account.html">Sign in</a></div>
        </div>`;
    }
    const last = u.orders[0];
    return `
      <div class="hello is-in">
        <div><p class="hello-t">Hello, <em>${esc(u.first)}!</em></p>
        <p class="hello-d">${last
          ? `Last time: <strong>${esc(last.name)}</strong> · ${aed(last.total)}. Fancy it again?`
          : 'Build a burger above and crown it. It will be saved to your account.'}</p></div>
        <div class="hello-a">
          ${last ? `<a class="btn btn-yellow" href="#again=${encodeURIComponent(last.id)}" data-again="${esc(last.id)}">Order again</a>` : ''}
          <a class="btn btn-ghost" href="account.html">Your account</a>
        </div>
      </div>`;
  },
  signature() {
    const items = MENU.find((c) => c.id === 'specials').items;
    return items.map((it, i) => `
      <article class="sig paper tilt-${i % 3}">
        <p class="sig-tag">${it.tag ? esc(it.tag) : 'Special'}</p>
        <h3>${esc(it.name)}</h3>
        <p class="sig-desc">${esc(it.desc)}</p>
        <div class="sig-foot"><strong>${aed(it.price)}</strong><a href="${EG.orderUrl}" target="_blank" rel="noopener">Order →</a></div>
      </article>`).join('');
  },
  keys() {
    return KEYS.map((k, i) => `<li><span class="k-no">${i + 1}</span><span class="k-t">${esc(k)}</span></li>`).join('');
  },
  branches(el) { return BRANCHES.map((b) => branchCard(b, el.dataset.full || false)).join(''); },
  news() {
    return NEWS.map((n) => `
      <a class="news-card" href="${n.url}" target="_blank" rel="noopener">
        <p class="n-meta">${esc(n.date)} · ${esc(n.outlet)}</p>
        <h3>${esc(n.t)}</h3>
        <p>${esc(n.d)}</p>
        <span class="n-more">Read the story →</span>
      </a>`).join('');
  },
  values() {
    return VALUES.map((v, i) => `<article class="value"><span class="v-no">0${i + 1}</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></article>`).join('');
  },
  story() {
    return STORY.map((s) => `<article class="chapter"><p class="c-year">${s.year}</p><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></article>`).join('');
  },
  milestones() {
    return MILESTONES.map((m) => `<li><p class="m-date">${esc(m.date)}</p><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p></li>`).join('');
  },
  menuHome() {
    const burgerCats = ['specials', 'classics', 'limited'];
    return `
      <div class="mh-tabs" role="tablist" aria-label="Menu categories">
        ${MENU.map((c, i) => `<button class="chip${i === 0 ? ' is-active' : ''}" type="button" role="tab" id="mh-tab-${c.id}"
          aria-selected="${i === 0}" aria-controls="mh-${c.id}" data-cat="${c.id}">${esc(c.name)} <span class="mh-count">${c.items.length}</span></button>`).join('')}
      </div>
      ${MENU.map((c, i) => `
      <div class="mh-grid" role="tabpanel" id="mh-${c.id}" aria-labelledby="mh-tab-${c.id}"${i === 0 ? '' : ' hidden'}>
        ${c.items.map((it) => `
        <article class="mh-item paper">
          ${it.tag ? `<p class="sig-tag">${esc(it.tag)}</p>` : ''}
          <h3>${esc(it.name)}</h3>
          ${it.desc ? `<p class="mh-desc">${esc(it.desc)}</p>` : ''}
          <div class="mh-foot">
            <strong>${aed(it.price)}</strong>
            ${burgerCats.includes(c.id) ? `<button class="mh-build" type="button" data-build-name="${esc(it.name)}">Build it ↑</button>` : ''}
          </div>
        </article>`).join('')}
      </div>`).join('')}`;
  },
  menuTabs() {
    return MENU.map((c, i) => `<a class="chip${i === 0 ? ' is-active' : ''}" href="#${c.id}">${esc(c.name)}</a>`).join('');
  },
  menu() {
    return MENU.map((c, i) => `
      <section class="m-cat paper receipt tilt-${i % 3}" id="${c.id}">
        <header><p class="m-kick">ELEVEN GREEN · ${String(i + 1).padStart(2, '0')}</p><h2>${esc(c.name)}</h2></header>
        <ul>
          ${c.items.map((it) => `
          <li>
            <div class="m-row"><span class="m-name">${esc(it.name)}</span><span class="m-dots"></span><span class="m-price">${aed(it.price)}</span></div>
            ${it.desc ? `<p class="m-desc">${esc(it.desc)}</p>` : ''}
          </li>`).join('')}
        </ul>
      </section>`).join('');
  },
};

function renderAll() {
  document.querySelectorAll('[data-render]').forEach((el) => {
    const fn = RENDER[el.dataset.render];
    if (fn) el.innerHTML = fn(el);
  });
}

/* live status refresh every minute */
function tickStatus() {
  document.querySelectorAll('.status[data-branch]').forEach((s) => {
    const b = BRANCHES.find((x) => x.id === s.dataset.branch);
    const st = branchStatus(b);
    s.textContent = st.label; s.classList.toggle('is-open', st.open);
  });
}

/* ---------- forms: front-end only, show a thank-you ---------- */
function wireForms() {
  document.querySelectorAll('.js-local-form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const done = document.createElement('p');
      done.className = 'form-done';
      done.setAttribute('role', 'status');
      done.textContent = f.dataset.done || 'Thanks, we got it.';
      f.replaceWith(done);
    });
  });
  // catering: event date at least 7 days out
  const ev = document.querySelector('input[name="event_date"]');
  if (ev) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    ev.min = d.toISOString().slice(0, 10);
  }
}

/* ---------- menu page: highlight the category in view ---------- */
function wireMenuSpy() {
  const chips = [...document.querySelectorAll('.chip')];
  if (!chips.length) return;
  chips.forEach((c) => c.addEventListener('click', () => chips.forEach((x) => x.classList.toggle('is-active', x === c))));
  // with two receipt columns "the category in view" is ambiguous, so only follow scroll in one column
  if (!('IntersectionObserver' in window) || window.matchMedia('(min-width: 981px)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      chips.forEach((c) => c.classList.toggle('is-active', c.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('.m-cat').forEach((s) => io.observe(s));
}

/* ---------- reveal on scroll ---------- */
function wireReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  els.forEach((e) => io.observe(e));
}

/* ---------- home menu: tabs + "Build it" (hands the burger to the builder) ---------- */
function wireHomeMenu() {
  const root = document.querySelector('[data-render="menuHome"]');
  if (!root) return;
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) {
      root.querySelectorAll('[role="tab"]').forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on));
        root.querySelector(`#mh-${t.dataset.cat}`).hidden = !on;
      });
      return;
    }
    const b = e.target.closest('[data-build-name]');
    if (b) {
      const p = (window.EG_PRESETS || []).find((x) => x.menu === b.dataset.buildName);
      if (p && window.EG_loadPreset) window.EG_loadPreset(p.id);
    }
  });
  // builder.js loads after this file: hide "Build it" where we have no matching layers (e.g. the hot dog)
  document.addEventListener('DOMContentLoaded', () => {
    root.querySelectorAll('[data-build-name]').forEach((b) => {
      if (!(window.EG_PRESETS || []).some((x) => x.menu === b.dataset.buildName)) b.remove();
    });
  });
}

renderChrome();
renderAll();
wireHomeMenu();
// keep account-aware blocks (home greeting) in step with sign-in/out and new orders
if (window.EG_ACCOUNT) {
  EG_ACCOUNT.onChange(() => document.querySelectorAll('[data-render="hello"]').forEach((el) => { el.innerHTML = RENDER.hello(el); }));
}
wireForms();
wireMenuSpy();
wireReveal();
setInterval(tickStatus, 60000);
