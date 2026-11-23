'use strict';

/* ------------------------------------------------------------------
   TRON fast food — burger builder
   Settings you may want to change:
------------------------------------------------------------------ */
const PX_PER_CM = 27.6;    // image pixels (at 240px width) per centimetre of real burger
const MAX_LAYERS = 12;
const READY_MIN = 12;
const DEFAULT_LAYERS = ['patty', 'cheddar'];

const BUN = { name: 'Brioche bun', price: 3 };

/* Photo layers. h = height when drawn 240px wide; t/b = top and bottom edge
   of the ingredient in that box (measured from the cut-out images). */
const ING = {
  patty:   { name: 'Beef patty',     price: 4.5, desc: 'Smashed hard on the flat-top, pink in the middle.', img: 'patty',   h: 84.5, t: 1.5, b: 82 },
  chicken: { name: 'Crispy chicken', price: 4.5, desc: 'Buttermilk thigh with a loud crunch.',              img: 'chicken', h: 73.5, t: 7.5, b: 71 },
  cheddar: { name: 'Cheddar',        price: 1,   desc: 'Aged and melted right over the edges.',             img: 'cheddar', h: 90.5, t: 1.5, b: 59 },
  bacon:   { name: 'Bacon',          price: 2,   desc: 'Two smoky strips, fried until they snap.',          img: 'bacon',   h: 49,   t: 5.8, b: 47 },
  lettuce: { name: 'Lettuce',        price: 0.5, desc: 'Cold, crisp and fresh from the walk-in.',           img: 'lettuce', h: 58,   t: 8.5, b: 52 },
  tomato:  { name: 'Tomato',         price: 0.5, desc: 'Thick slices with a pinch of sea salt.',            img: 'tomato',  h: 64,   t: 1.5, b: 61 },
  onion:   { name: 'Red onion',      price: 0.5, desc: 'Thin rings with just enough bite.',                 img: 'onion',   h: 46.5, t: 6.5, b: 45 },
  pickles: { name: 'Pickles',        price: 0.5, desc: 'Sour, crunchy, made in house.',                     img: 'pickles', h: 40.5, t: 2.5, b: 38.5 },
  egg:     { name: 'Fried egg',      price: 1.5, desc: 'Runny yolk, crispy brown edges.',                   img: 'egg',     h: 53,   t: 2.5, b: 51 },
  sauce:   { name: 'House sauce',    price: 0.5, desc: 'Our recipe: smoked paprika and a little heat.',     img: 'sauce',   h: 65,   t: 2,   b: 49 },
};
const SIDES = {
  fries: { name: 'Fries',         price: 3.5, desc: 'Fried twice, salted the second they leave the oil.', img: 'fries', dh: 120 },
  shake: { name: 'Vanilla shake', price: 5,   desc: 'Thick and cold, with a tall swirl of whipped cream.', img: 'shake', dh: 132 },
};
const BUN_PARTS = {
  bunBottom: { img: 'bun-bottom', h: 132.5, t: 2.5, b: 130 },
  bunTop:    { img: 'bun-top',    h: 125,   t: 2.5, b: 122 },
};

// Where the next layer rests on this one, and how far this one sinks into the one below.
const REST = 0.34, SINK = 0.2;
for (const g of [...Object.values(ING), ...Object.values(BUN_PARTS)]) {
  const th = g.b - g.t;
  g.top = g.t + th * REST;   // from the top of its box
  g.base = g.b - th * SINK;  // from the top of its box
}
BUN_PARTS.bunTop.base = BUN_PARTS.bunTop.b - 10;  // the crown sits on top, it does not swallow the last layer

const IMG_DIR = '../assets/ingredients/';
function art(key, cls = '') {
  const g = ING[key] || BUN_PARTS[key];
  if (g) return `<img class="${cls}" src="${IMG_DIR}${g.img}.webp" width="240" height="${g.h}" alt="" draggable="false" decoding="async">`;
  const s = SIDES[key];
  return `<img class="${cls}" src="${IMG_DIR}${s.img}.webp" height="${s.dh}" alt="" draggable="false" decoding="async">`;
}

/* ------------------------------------------------------------------
   State
------------------------------------------------------------------ */
const $ = (id) => document.getElementById(id);
const el = {
  stage: $('stage'), stack: $('stack'), tray: $('tray'), lines: $('lines'),
  total: $('totalVal'), height: $('heightVal'), ruler: $('rulerMark'),
  note: $('note'), noteTitle: $('noteTitle'), noteText: $('noteText'),
  crown: $('crownBtn'), reset: $('resetBtn'), meta: $('orderMeta'),
  done: $('doneModal'), doneNo: $('doneNo'), doneText: $('doneText'),
};

let uid = 0;
const state = {
  order: 40 + Math.floor(Math.random() * 60),
  layers: [],            // [{ id, key, node }]
  sides: new Set(),
  crowned: false,
  shownTotal: 0,
};

const fmt = (v) => `$${v.toFixed(2)}`;
const pad3 = (v) => String(v).padStart(3, '0');
const plural = (n, one, many) => (n === 1 ? one : many);

/* ------------------------------------------------------------------
   Stage
------------------------------------------------------------------ */
const BUN_BOTTOM_TOP = BUN_PARTS.bunBottom.h - BUN_PARTS.bunBottom.top;  // where the first layer sits
const TOP_BUN = BUN_PARTS.bunTop;
const STACK_BASE = 34;           // px from stage bottom

const bottomBun = document.createElement('div');
bottomBun.className = 'layer bun-bottom';
bottomBun.innerHTML = art('bunBottom');
bottomBun.style.bottom = '0px';

const topBun = document.createElement('div');
topBun.className = 'layer bun-top';
topBun.innerHTML = `<span class="pick" aria-hidden="true"><span class="flag">T</span></span>` + art('bunTop', 'float');

const sideNodes = {};
for (const key of Object.keys(SIDES)) {
  const n = document.createElement('div');
  n.className = `side-item side-${key}`;
  n.innerHTML = art(key);
  sideNodes[key] = n;
}
el.stack.append(bottomBun, topBun, sideNodes.fries, sideNodes.shake);

function stackGeometry() {
  let y = BUN_BOTTOM_TOP;
  const pos = state.layers.map((L) => {
    const g = ING[L.key];
    const b = y - (g.h - g.base);
    y = b + (g.h - g.top);
    return b;
  });
  const closedBottom = y - (TOP_BUN.h - TOP_BUN.base);
  const crownTop = closedBottom + (TOP_BUN.h - TOP_BUN.t);
  return { pos, y, closedBottom, crownTop };
}

function layout() {
  const g = stackGeometry();
  state.layers.forEach((L, i) => {
    L.node.style.bottom = `${g.pos[i]}px`;
    L.node.style.zIndex = String(i + 2);
  });
  const topBottom = state.crowned ? g.closedBottom : g.closedBottom + 78;
  topBun.style.bottom = `${topBottom}px`;
  topBun.style.zIndex = String(state.layers.length + 3);

  // fit the stack into the stage
  const sh = el.stage.clientHeight, sw = el.stage.clientWidth;
  const needed = topBottom + TOP_BUN.h + 40;
  const avail = sh - STACK_BASE - 24;
  const maxScale = Math.min(1.25, (sw - 24) / 340);
  const scale = Math.max(0.35, Math.min(maxScale, avail / needed));
  el.stack.style.setProperty('--s', scale.toFixed(3));

  const cm = g.crownTop / PX_PER_CM;
  el.ruler.style.bottom = `${STACK_BASE + g.crownTop * scale}px`;
  el.stage.style.setProperty('--rh', `${Math.round(g.crownTop * scale)}px`);
  el.ruler.textContent = `${cm.toFixed(1)} cm`;
  el.height.textContent = `${cm.toFixed(1)} CM`;
  return cm;
}

/* ------------------------------------------------------------------
   Tray, receipt
------------------------------------------------------------------ */
function buildTray() {
  const items = [
    ...Object.keys(ING).map((k) => ({ k, kind: 'layer', ...ING[k] })),
    { sep: true },
    ...Object.keys(SIDES).map((k) => ({ k, kind: 'side', ...SIDES[k] })),
  ];
  el.tray.innerHTML = items.map((it) => it.sep ? '<span class="tray-sep" aria-hidden="true"></span>' : `
    <button class="tray-item ${it.kind === 'side' ? 'is-side' : ''}" type="button" data-key="${it.k}" data-kind="${it.kind}"
      aria-label="${it.kind === 'side' ? 'Add or remove' : 'Add'} ${it.name}, ${fmt(it.price)}">
      <span class="thumb">${art(it.k)}</span>
      <span class="t-name">${it.name}</span>
      <span class="t-price">${fmt(it.price)}</span>
      <span class="badge" aria-hidden="true"></span>
    </button>`).join('');
}

function counts() {
  const m = new Map();
  for (const L of state.layers) m.set(L.key, (m.get(L.key) || 0) + 1);
  return m;
}

function total() {
  let t = BUN.price;
  for (const L of state.layers) t += ING[L.key].price;
  for (const s of state.sides) t += SIDES[s].price;
  return t;
}

// Scroll the receipt so the newest line is visible, but never leave the top line cut in half:
// the list always starts exactly at the top of a line.
function scrollLinesToEnd() {
  const ul = el.lines;
  const items = [...ul.children];
  ul.style.paddingBottom = '0px';
  if (!items.length) return;
  const last = items[items.length - 1];
  const end = last.offsetTop + last.offsetHeight;
  const first = items.find((li) => end - li.offsetTop <= ul.clientHeight) || last;
  // the browser can only scroll a line to the very top if there is room below the last one
  const room = first.offsetTop + ul.clientHeight - ul.scrollHeight;
  if (room > 0) ul.style.paddingBottom = `${room}px`;
  ul.scrollTop = first.offsetTop;
}

function renderReceipt() {
  const c = counts();
  const dis = state.crowned ? 'disabled' : '';
  let html = `<li><span class="l-name">${BUN.name}</span><span class="l-price">${fmt(BUN.price)}</span></li>`;
  for (const [k, n] of c) {
    html += `<li><span class="l-name">${ING[k].name}${n > 1 ? ` <em>×${n}</em>` : ''}</span>
      <button class="minus" type="button" data-remove="${k}" aria-label="Remove one ${ING[k].name}" ${dis}>−</button>
      <span class="l-price">${fmt(ING[k].price * n)}</span></li>`;
  }
  for (const s of state.sides) {
    html += `<li><span class="l-name">${SIDES[s].name}</span>
      <button class="minus" type="button" data-side="${s}" aria-label="Remove ${SIDES[s].name}" ${dis}>−</button>
      <span class="l-price">${fmt(SIDES[s].price)}</span></li>`;
  }
  el.lines.innerHTML = html;
  scrollLinesToEnd();

  // tray badges
  el.tray.querySelectorAll('.tray-item').forEach((b) => {
    const k = b.dataset.key;
    const isSide = b.dataset.kind === 'side';
    const n = isSide ? (state.sides.has(k) ? 1 : 0) : (c.get(k) || 0);
    const badge = b.querySelector('.badge');
    badge.textContent = isSide ? '✓' : String(n);
    b.classList.toggle('has', n > 0);
    b.setAttribute('aria-pressed', isSide ? String(n > 0) : 'false');
    b.disabled = state.crowned;
  });

  animateTotal(total());
}

let rafId = 0;
function animateTotal(target) {
  cancelAnimationFrame(rafId);
  const from = state.shownTotal, t0 = performance.now(), dur = 420;
  const step = (now) => {
    const p = Math.max(0, Math.min(1, (now - t0) / dur));  // rAF time can be slightly before t0
    const v = Math.round((from + (target - from) * (1 - (1 - p) ** 3)) * 100) / 100;
    el.total.textContent = fmt(v);
    state.shownTotal = v;
    if (p < 1) rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}

function setNote(title, text, flash = true) {
  el.noteTitle.textContent = title;
  el.noteText.textContent = text;
  if (flash) { el.note.classList.remove('flash'); void el.note.offsetWidth; el.note.classList.add('flash'); }
}

function renderButtons() {
  el.crown.textContent = state.crowned ? 'Build another' : 'Crown it ↓';
  el.crown.disabled = !state.crowned && state.layers.length === 0;
  el.meta.textContent = `ORDER N° ${pad3(state.order)} · PICK-UP`;
  document.body.classList.toggle('is-crowned', state.crowned);
}

function refresh() { layout(); renderReceipt(); renderButtons(); }

/* ------------------------------------------------------------------
   Actions
------------------------------------------------------------------ */
function addLayer(key, animate = true) {
  if (state.crowned) return;
  if (state.layers.length >= MAX_LAYERS) {
    setNote('THAT IS ENOUGH', `${MAX_LAYERS} layers max. It still has to fit in a mouth.`);
    return;
  }
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'layer stack-layer' + (animate ? ' drop' : '');
  node.setAttribute('aria-label', `Remove ${ING[key].name}`);
  node.innerHTML = art(key);
  const L = { id: ++uid, key, node };
  node.addEventListener('click', () => removeLayer(L.id));
  state.layers.push(L);
  layout();                  // set its final position before it enters the DOM
  el.stack.appendChild(node);
  if (animate) setNote(`JUST ADDED · ${ING[key].name.toUpperCase()}`, ING[key].desc);
  refresh();
}

function removeLayer(id) {
  if (state.crowned) return;
  const i = state.layers.findIndex((L) => L.id === id);
  if (i < 0) return;
  const [L] = state.layers.splice(i, 1);
  L.node.classList.add('pop');
  L.node.disabled = true;
  setTimeout(() => L.node.remove(), 240);
  setNote(`TAKEN OFF · ${ING[L.key].name.toUpperCase()}`, 'Changed your mind? No problem.');
  refresh();
}

function removeLastOf(key) {
  for (let i = state.layers.length - 1; i >= 0; i--) {
    if (state.layers[i].key === key) return removeLayer(state.layers[i].id);
  }
}

function toggleSide(key, force) {
  if (state.crowned) return;
  const on = force ?? !state.sides.has(key);
  if (on) { state.sides.add(key); setNote(`JUST ADDED · ${SIDES[key].name.toUpperCase()}`, SIDES[key].desc); }
  else { state.sides.delete(key); setNote(`TAKEN OFF · ${SIDES[key].name.toUpperCase()}`, 'Maybe next time.'); }
  sideNodes[key].classList.toggle('on', on);
  refresh();
}

function clearAll() {
  for (const L of state.layers) L.node.remove();
  state.layers = [];
  state.sides.clear();
  Object.values(sideNodes).forEach((n) => n.classList.remove('on'));
  state.crowned = false;
}

function startOver() {
  clearAll();
  setNote('EMPTY BUN', 'Fresh start. Tap a layer below.');
  refresh();
}

function buildAnother() {
  clearAll();
  state.order += 1;
  DEFAULT_LAYERS.forEach((k) => addLayer(k, false));
  setNote('HOW IT WORKS', 'Tap a layer below to drop it on. Tap anything in the stack to pull it off.');
  refresh();
}

function crown() {
  if (state.crowned) return buildAnother();
  if (!state.layers.length) return;
  state.crowned = true;
  const cm = layout();
  renderReceipt(); renderButtons();
  const kinds = counts().size;
  
  el.doneNo.textContent = `ORDER N° ${pad3(state.order)}`;
  el.doneText.textContent =
    `${kinds} ${plural(kinds, 'kind', 'kinds')} of layer, ` +
    `${cm.toFixed(1)} cm tall, ${fmt(total())}. Ready for pick-up in about ${READY_MIN} minutes.`;
  setTimeout(() => el.done.showModal(), 650);
}

/* ------------------------------------------------------------------
   Wiring
------------------------------------------------------------------ */
buildTray();
el.tray.addEventListener('click', (e) => {
  const b = e.target.closest('.tray-item');
  if (!b) return;
  if (b.dataset.kind === 'side') toggleSide(b.dataset.key);
  else addLayer(b.dataset.key);
});
el.lines.addEventListener('click', (e) => {
  const b = e.target.closest('.minus');
  if (!b) return;
  if (b.dataset.remove) removeLastOf(b.dataset.remove);
  if (b.dataset.side) toggleSide(b.dataset.side, false);
});
el.crown.addEventListener('click', crown);
el.reset.addEventListener('click', () => (state.crowned ? buildAnother() : startOver()));
$('againBtn').addEventListener('click', () => { el.done.close(); buildAnother(); });
$('closeBtn').addEventListener('click', () => el.done.close());
for (const d of document.querySelectorAll('dialog')) {
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
}

// reservation
const tm = $('tableModal'), tf = $('tableForm'), td = $('tableDone');
$('tableBtn').addEventListener('click', () => {
  tf.hidden = false; td.hidden = true;
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  tf.date.min = today.toISOString().slice(0, 10);
  if (!tf.date.value) tf.date.value = tf.date.min;
  tm.showModal();
});
$('tableCancel').addEventListener('click', () => tm.close());
$('tableOk').addEventListener('click', () => tm.close());
tf.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new Date(tf.date.value + 'T00:00');
  const day = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  $('tableName').textContent = `${tf.name.value.trim()}.`;
  $('tableText').textContent = `Table for ${tf.guests.value}, ${day} at ${tf.time.value}. We will confirm shortly.`;
  tf.hidden = true; td.hidden = false;
});

let resizeT;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(layout, 60); });

DEFAULT_LAYERS.forEach((k) => addLayer(k, false));
refresh();
