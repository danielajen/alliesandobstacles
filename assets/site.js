// Progressive enhancement only — every page works fully without JavaScript.
(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ── Mobile menu ────────────────────────────────────────────────────────────
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });

  // ── Display settings ───────────────────────────────────────────────────────
  const KEYS = ['size', 'contrast', 'theme', 'motion'];
  const displayToggle = $('#display-toggle');
  const panel = $('#display-panel');
  let prefs = {};
  try { prefs = JSON.parse(localStorage.getItem('ao-display') || '{}'); } catch { /* ignore */ }
  const save = () => { try { localStorage.setItem('ao-display', JSON.stringify(prefs)); } catch { /* private mode */ } };
  const apply = () => KEYS.forEach((k) => (prefs[k] ? root.setAttribute(`data-${k}`, prefs[k]) : root.removeAttribute(`data-${k}`)));
  const sync = () => KEYS.forEach((k) => $$(`input[name="${k}"]`, panel).forEach((i) => (i.checked = i.value === (prefs[k] || ''))));
  if (panel) {
    sync();
    panel.addEventListener('change', (e) => {
      if (!KEYS.includes(e.target.name)) return;
      prefs[e.target.name] = e.target.value;
      apply(); save();
    });
    $('[data-display-reset]', panel)?.addEventListener('click', () => { prefs = {}; apply(); save(); sync(); });
  }
  const setPanel = (open) => {
    displayToggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) $('input:checked', panel)?.focus();
  };
  displayToggle?.addEventListener('click', () => setPanel(panel.hidden));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (panel && !panel.hidden) { setPanel(false); displayToggle.focus(); }
    else if (navToggle?.getAttribute('aria-expanded') === 'true') { navToggle.click(); navToggle.focus(); }
  });

  // ── Tabs ───────────────────────────────────────────────────────────────────
  $$('[data-tabs]').forEach((tabs) => {
    const list = $('[role="tablist"]', tabs);
    const buttons = $$('[role="tab"]', list);
    const panels = buttons.map((b) => document.getElementById(b.getAttribute('aria-controls')));
    const useHash = tabs.hasAttribute('data-tabs-hash');
    list.hidden = false;
    tabs.classList.add('is-enhanced');

    const select = (idx, focus = false, fromUser = false) => {
      buttons.forEach((b, i) => {
        const on = i === idx;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) buttons[idx].focus();
      if (useHash && fromUser) history.replaceState(null, '', `#${buttons[idx].id.replace('tab-', '')}`);
    };

    let start = 0;
    if (useHash) {
      const fromHash = buttons.findIndex((b) => b.id === `tab-${location.hash.slice(1)}`);
      if (fromHash >= 0) start = fromHash;
      else if (tabs.hasAttribute('data-tabs-guess')) {
        const ua = navigator.userAgent;
        const guess = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iphone'
          : /Android/.test(ua) ? 'android' : /Macintosh/.test(ua) ? 'mac' : /Windows/.test(ua) ? 'windows' : null;
        const g = buttons.findIndex((b) => b.id === `tab-${guess}`);
        if (g >= 0) start = g;
      }
    }
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => select(i, false, true));
      b.addEventListener('keydown', (e) => {
        const n = buttons.length;
        const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select((next + n) % n, true, true);
      });
    });
    select(start);
  });

  // ── Filters (media list, timeline) ─────────────────────────────────────────
  $$('[data-filters]').forEach((form) => {
    const items = $$(form.dataset.filterList);
    const count = $('[data-count]', form);
    const empty = $('[data-empty]');
    const groups = [...new Set($$('input[type="radio"]', form).map((i) => i.name))];
    form.hidden = false;
    const update = () => {
      let shown = 0;
      items.forEach((li) => {
        const ok = groups.every((g) => { const v = form.elements[g].value; return !v || li.dataset[g] === v; });
        li.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = `Showing ${shown} of ${items.length}`;
      if (empty) empty.hidden = shown > 0;
    };
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => e.preventDefault());
    update();
  });

  // ── Copy citation ──────────────────────────────────────────────────────────
  if (navigator.clipboard) {
    $$('[data-copy]').forEach((btn) => {
      btn.hidden = false;
      const label = $('[data-copy-label]', btn);
      const original = label.textContent;
      btn.addEventListener('click', async () => {
        const text = $('[data-copy-source]', btn.parentElement).textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add('is-done');
          label.textContent = 'Copied';
          setTimeout(() => { btn.classList.remove('is-done'); label.textContent = original; }, 2000);
        } catch { /* clipboard blocked */ }
      });
    });
  }

  // ── Chapter guide: expand all, and open a chapter linked by #hash ──────────
  const expandBtn = $('[data-expand-all]');
  if (expandBtn) {
    const details = $$('.ch__d');
    expandBtn.hidden = false;
    const label = () => (expandBtn.textContent = details.every((d) => d.open) ? 'Collapse all' : 'Expand all');
    expandBtn.addEventListener('click', () => {
      const open = !details.every((d) => d.open);
      details.forEach((d) => (d.open = open));
      label();
    });
    details.forEach((d) => d.addEventListener('toggle', label));
    const openFromHash = () => {
      const target = location.hash && document.getElementById(location.hash.slice(1));
      const d = target?.querySelector?.('.ch__d');
      if (d) { d.open = true; label(); requestAnimationFrame(() => target.scrollIntoView({ block: 'start' })); }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  // ── Sub-navigation: highlight the section in view ──────────────────────────
  const subLinks = $$('.subnav a');
  if (subLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(subLinks.map((a) => [document.getElementById(a.hash.slice(1))?.closest('section') || document.getElementById(a.hash.slice(1)), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        subLinks.forEach((a) => a.classList.remove('is-active'));
        const a = map.get(en.target);
        if (a) { a.classList.add('is-active'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, sec) => sec && io.observe(sec));
  }

  // ── Reveal on scroll ───────────────────────────────────────────────────────
  const reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    // Anything already on screen shows at once; the rest fades in as it arrives.
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
      else io.observe(el);
    });
    root.classList.add('reveal-ready');
  }
})();
