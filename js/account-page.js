'use strict';
/* Eleven Green concept — account page (demo accounts from account.js). */

(() => {
  const root = document.getElementById('acctRoot');
  const title = document.getElementById('acctTitle');
  const lede = document.getElementById('acctLede');
  const kicker = document.getElementById('acctKicker');
  if (!root) return;

  const branchOptions = (selected) =>
    `<option value="">No favourite yet</option>` +
    BRANCHES.map((b) => `<option value="${b.id}"${b.id === selected ? ' selected' : ''}>${esc(b.name)}, ${esc(b.city)}</option>`).join('');
  const branchName = (id) => { const b = BRANCHES.find((x) => x.id === id); return b ? `${b.name}, ${b.city}` : ''; };
  const fmtDate = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  function signedOut() {
    kicker.textContent = 'Your account';
    title.innerHTML = 'Welcome, <em>Elevener.</em>';
    lede.textContent = 'Create an account to keep your orders, your favourite branch and a quicker way to order again.';
    root.innerHTML = `
      <div class="acct-grid">
        <div class="paper form-card acct-card">
          <p class="m-kicker">NEW HERE</p>
          <h2>Create <em style="color:var(--red)">account.</em></h2>
          <p class="f-intro">Join in seconds. Your orders from the burger builder will show up here.</p>
          <form id="regForm" novalidate>
            <div class="form-grid">
              <label class="field">First name<input name="first" required autocomplete="given-name"></label>
              <label class="field">Last name<input name="last" required autocomplete="family-name"></label>
              <label class="field full">Email address<input type="email" name="email" required autocomplete="email"></label>
              <label class="field full">Favourite branch <small>(optional, preselected for pick-up)</small>
                <select name="favBranch">${branchOptions('')}</select>
              </label>
              <label class="check full"><input type="checkbox" name="demo" required>
                <span>I understand this is a demo account stored only in this browser.</span></label>
              <label class="check full"><input type="checkbox" name="newsletter">
                <span>Keep me posted on limited drops <small>(demo, no emails are sent)</small></span></label>
            </div>
            <p class="form-error" role="alert" hidden></p>
            <div class="form-actions"><button class="btn btn-red" type="submit">Create account</button></div>
          </form>
        </div>
        <div class="paper form-card acct-card">
          <p class="m-kicker">WELCOME BACK</p>
          <h2>Sign <em style="color:var(--red)">in.</em></h2>
          <p class="f-intro">Use the email of a demo account you created on this device.</p>
          <form id="signForm" novalidate>
            <div class="form-grid">
              <label class="field full">Email address<input type="email" name="email" required autocomplete="email"></label>
            </div>
            <p class="form-error" role="alert" hidden></p>
            <div class="form-actions"><button class="btn btn-yellow" type="submit">Sign in</button></div>
          </form>
        </div>
      </div>`;

    const showErr = (form, msg) => { const p = form.querySelector('.form-error'); p.textContent = msg; p.hidden = !msg; };
    const reg = document.getElementById('regForm');
    reg.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!reg.reportValidity()) return;
      const f = reg.elements;
      const r = EG_ACCOUNT.register({
        first: f.first.value, last: f.last.value, email: f.email.value,
        favBranch: f.favBranch.value, newsletter: f.newsletter.checked,
      });
      if (!r.ok) showErr(reg, r.error);
    });
    const sign = document.getElementById('signForm');
    sign.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!sign.reportValidity()) return;
      const r = EG_ACCOUNT.signIn(sign.elements.email.value);
      if (!r.ok) showErr(sign, r.error);
    });
  }

  function orderCard(o) {
    return `
      <article class="paper receipt acct-order">
        <p class="m-kicker">ORDER N° ${esc(o.no)} · ${esc(fmtDate(o.at))}</p>
        <h3>${esc(o.name)}</h3>
        <p class="ao-lines">${esc(o.lines.join(' · '))}</p>
        ${o.sides && o.sides.length ? `<p class="ao-lines">+ ${esc(o.sideNames.join(' · '))}</p>` : ''}
        <div class="ao-foot">
          <span class="ao-branch">${esc(branchName(o.branch))}${o.cm ? ` · ${esc(o.cm)} cm` : ''}</span>
          <strong>${aed(o.total)}</strong>
        </div>
        <a class="btn btn-yellow ao-again" href="index.html#again=${encodeURIComponent(o.id)}">Order again</a>
      </article>`;
  }

  function signedIn(u) {
    kicker.textContent = 'Signed in · demo';
    title.innerHTML = `Hello, <em>${esc(u.first)}.</em>`;
    const n = u.orders.length;
    lede.textContent = n
      ? `You have ${n} ${n === 1 ? 'order' : 'orders'} saved. Order one again in a tap, or build something new.`
      : 'No orders yet. Build a burger on the home page and crown it to save your first order here.';
    root.innerHTML = `
      <div class="acct-dash">
        <section>
          <div class="section-head" style="margin-bottom:24px">
            <h2 class="h3">Your <em>orders.</em></h2>
            <a class="link-arrow" href="index.html">Build a burger →</a>
          </div>
          ${n ? `<div class="acct-orders">${u.orders.map(orderCard).join('')}</div>`
              : `<div class="acct-empty"><p>Nothing here yet.</p><a class="btn btn-yellow" href="index.html">Build your first burger</a></div>`}
        </section>
        <aside class="paper form-card acct-card acct-side">
          <p class="m-kicker">YOUR DETAILS</p>
          <form id="profForm">
            <div class="form-grid">
              <label class="field">First name<input name="first" required value="${esc(u.first)}" autocomplete="given-name"></label>
              <label class="field">Last name<input name="last" required value="${esc(u.last)}" autocomplete="family-name"></label>
              <label class="field full">Email address<input type="email" name="email" value="${esc(u.email)}" readonly></label>
              <label class="field full">Favourite branch<select name="favBranch">${branchOptions(u.favBranch)}</select></label>
              <label class="check full"><input type="checkbox" name="newsletter"${u.newsletter ? ' checked' : ''}>
                <span>Limited-drop updates <small>(demo)</small></span></label>
            </div>
            <p class="form-saved" role="status" hidden>Saved.</p>
            <div class="form-actions">
              <button class="btn btn-red" type="submit">Save details</button>
              <button class="btn btn-ghost-dark" type="button" id="signOutBtn">Sign out</button>
            </div>
          </form>
          <button class="link-danger" type="button" id="deleteBtn">Delete this demo account</button>
        </aside>
      </div>`;

    const prof = document.getElementById('profForm');
    prof.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!prof.reportValidity()) return;
      const f = prof.elements;
      EG_ACCOUNT.update({ first: f.first.value.trim(), last: f.last.value.trim(), favBranch: f.favBranch.value, newsletter: f.newsletter.checked });
      const s = document.querySelector('.form-saved');
      if (s) { s.hidden = false; setTimeout(() => { s.hidden = true; }, 1800); }
    });
    document.getElementById('signOutBtn').addEventListener('click', () => EG_ACCOUNT.signOut());
    document.getElementById('deleteBtn').addEventListener('click', () => {
      if (confirm('Delete this demo account and its saved orders from this browser? This cannot be undone.')) EG_ACCOUNT.deleteAccount();
    });
  }

  function render() {
    const u = EG_ACCOUNT.user();
    if (u) signedIn(u); else signedOut();
  }
  // re-render on sign-in/out, but not on every profile save (keeps the form and its "Saved" note)
  let lastEmail = EG_ACCOUNT.user()?.email || null;
  let lastOrders = EG_ACCOUNT.user()?.orders.length || 0;
  EG_ACCOUNT.onChange((u) => {
    const email = u ? u.email : null, orders = u ? u.orders.length : 0;
    if (email !== lastEmail || orders !== lastOrders) { lastEmail = email; lastOrders = orders; render(); window.scrollTo({ top: 0 }); }
    else if (u) title.innerHTML = `Hello, <em>${esc(u.first)}.</em>`;
  });
  render();
})();
