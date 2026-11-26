// NusaData router and page controls. Hash routes keep the whole site in a
// single page that works from any static server (and straight off disk):
// #/ overview, #/indicators with search and theme filters,
// #/indicator/<id> detail pages, #/trends the two-series explorer,
// #/provinces the sortable province table, #/about sources and methods.
// After each render the controls of that view are wired here; nothing on a
// page is decorative — every button, filter and heading does what it says.

import { PROVINCES } from './data.js';
import {
  overviewPage,
  indicatorsPage,
  indicatorPage,
  trendsPage,
  provincesPage,
  provinceRows,
  aboutPage,
} from './views.js';

const mount = document.getElementById('app');
const trendState = { a: 'internet', b: 'poverty', from: 2015 };
let provinceState = { key: 'pop', dir: -1, query: '' };

function show() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  const page = parts[0] || '';
  document.querySelectorAll('nav a').forEach((a) => {
    const target = a.getAttribute('href');
    a.classList.toggle('on', target === `#/${page}` || (page === '' && target === '#/'));
  });
  if (page === '') mount.innerHTML = overviewPage();
  else if (page === 'indicators') { mount.innerHTML = indicatorsPage(); bindIndicators(); }
  else if (page === 'indicator') mount.innerHTML = indicatorPage(parts[1]);
  else if (page === 'trends') { mount.innerHTML = trendsPage(trendState); bindTrends(); }
  else if (page === 'provinces') { mount.innerHTML = provincesPage(); bindProvinces(); }
  else if (page === 'about') mount.innerHTML = aboutPage();
  else mount.innerHTML = overviewPage();
  window.scrollTo(0, 0);
}

function bindIndicators() {
  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('#cards .card')];
  const none = document.getElementById('noresult');
  let theme = 'All';
  const apply = () => {
    const needle = q.value.trim().toLowerCase();
    let shown = 0;
    for (const c of cards) {
      const matchesText = c.dataset.name.includes(needle);
      const matchesTheme = theme === 'All' || c.dataset.cat === theme;
      c.hidden = !(matchesText && matchesTheme);
      if (!c.hidden) shown++;
    }
    none.hidden = shown > 0;
  };
  q.addEventListener('input', apply);
  document.querySelectorAll('[data-chip]').forEach((b) =>
    b.addEventListener('click', () => {
      theme = b.dataset.chip;
      document.querySelectorAll('[data-chip]').forEach((x) => x.classList.toggle('on', x === b));
      apply();
    }),
  );
}

function bindTrends() {
  document.getElementById('sel-a').addEventListener('change', (e) => { trendState.a = e.target.value; show(); });
  document.getElementById('sel-b').addEventListener('change', (e) => { trendState.b = e.target.value; show(); });
  document.querySelectorAll('[data-range]').forEach((b) =>
    b.addEventListener('click', () => { trendState.from = Number(b.dataset.range); show(); }),
  );
}

function paintProvinces() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const key = provinceState.key;
  const valueOf = (p) => (key === 'share' ? p.pop / total : p[key]);
  const list = PROVINCES.filter((p) => p.name.toLowerCase().includes(provinceState.query));
  list.sort((x, y) => {
    const xv = valueOf(x);
    const yv = valueOf(y);
    return (typeof xv === 'string' ? xv.localeCompare(yv) : xv - yv) * provinceState.dir;
  });
  document.querySelector('#ptable tbody').innerHTML = provinceRows(list, total);
}

function bindProvinces() {
  paintProvinces();
  document.getElementById('pq').addEventListener('input', (e) => {
    provinceState.query = e.target.value.trim().toLowerCase();
    paintProvinces();
  });
  document.querySelectorAll('#ptable th').forEach((th) =>
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (provinceState.key === key) provinceState.dir *= -1;
      else provinceState = { ...provinceState, key, dir: key === 'pop' || key === 'share' ? -1 : 1 };
      paintProvinces();
    }),
  );
}

window.addEventListener('hashchange', show);
show();
