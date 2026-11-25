'use strict';
/* Eleven Green concept — DEMO customer accounts.
   Everything lives in this browser's localStorage. There are no passwords, nothing is sent
   anywhere, and clearing site data removes it. Load after data.js and before site.js. */

const EG_ACCOUNT = (() => {
  const KEY = 'eg-demo-accounts-v1';
  const MAX_ORDERS = 30;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const d = raw ? JSON.parse(raw) : null;
      if (d && typeof d === 'object' && d.accounts) return d;
    } catch (e) { /* private mode or blocked storage: run without persistence */ }
    return { accounts: {}, current: null };
  }
  let db = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { return false; }
  }
  const norm = (email) => String(email || '').trim().toLowerCase();
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => { try { fn(api.user()); } catch (e) { /* ignore */ } });

  const api = {
    /** the signed-in demo user, or null */
    user() { return db.current ? db.accounts[db.current] || null : null; },

    register({ first, last, email, favBranch = '', newsletter = false }) {
      const key = norm(email);
      if (!key) return { ok: false, error: 'Please enter an email address.' };
      if (db.accounts[key]) return { ok: false, error: 'A demo account with this email already exists on this device. Sign in instead.' };
      db.accounts[key] = {
        first: String(first).trim(), last: String(last).trim(), email: key,
        favBranch, newsletter: !!newsletter, createdAt: new Date().toISOString(), orders: [],
      };
      db.current = key;
      save(); emit();
      return { ok: true };
    },

    signIn(email) {
      const key = norm(email);
      if (!db.accounts[key]) return { ok: false, error: 'No demo account with this email on this device. Create one first.' };
      db.current = key; save(); emit();
      return { ok: true };
    },

    signOut() { db.current = null; save(); emit(); },

    update(fields) {
      const u = api.user(); if (!u) return { ok: false };
      for (const k of ['first', 'last', 'favBranch', 'newsletter']) if (k in fields) u[k] = fields[k];
      save(); emit();
      return { ok: true };
    },

    /** deletes the signed-in demo account and its order history from this browser */
    deleteAccount() {
      if (!db.current) return;
      delete db.accounts[db.current];
      db.current = null; save(); emit();
    },

    recordOrder(order) {
      const u = api.user(); if (!u) return null;
      const entry = { id: `o${Date.now().toString(36)}`, at: new Date().toISOString(), ...order };
      u.orders.unshift(entry);
      u.orders.length = Math.min(u.orders.length, MAX_ORDERS);
      save(); emit();
      return entry;
    },

    findOrder(id) {
      const u = api.user();
      return u ? u.orders.find((o) => o.id === id) || null : null;
    },

    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };

  // keep several open tabs in sync
  window.addEventListener('storage', (e) => { if (e.key === KEY) { db = load(); emit(); } });
  return api;
})();
window.EG_ACCOUNT = EG_ACCOUNT;
