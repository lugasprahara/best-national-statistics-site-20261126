// NusaData router and controls. Hash routes keep the whole site in one page
// that works from any static server (and straight off disk): #/ overview,
// #/indicators with search and theme filters, #/indicator/<id> detail pages,
// #/trends the two-series explorer, #/provinces the sortable province table,
// #/about sources and methodology. After each render the controls of that
// view are wired here; nothing is decorative.

import { PROVINCES } from './data.js';
import {
  overviewView,
  indicatorsView,
  indicatorView,
  trendsView,
  provincesView,
  provinceRows,
  aboutView,
} from './views.js';

const main = document.getElementById('app');
const trendState = { a: 'internet', b: 'poverty', from: 2015 };
let provinceState = { key: 'pop', dir: -1, query: '' };

function render() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  const page = parts[0] || '';
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('on', a.getAttribute('href') === `#/${page}` || (page === '' && a.getAttribute('href') === '#/'));
  });
  if (page === '' ) main.innerHTML = overviewView();
  else if (page === 'indicators') { main.innerHTML = indicatorsView(); wireIndicators(); }
  else if (page === 'indicator') main.innerHTML = indicatorView(parts[1]);
  else if (page === 'trends') { main.innerHTML = trendsView(trendState); wireTrends(); }
  else if (page === 'provinces') { main.innerHTML = provincesView(); wireProvinces(); }
  else if (page === 'about') main.innerHTML = aboutView();
  else main.innerHTML = overviewView();
  window.scrollTo(0, 0);
}

function wireIndicators() {
  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('#cards .card')];
  const none = document.getElementById('noresult');
  let chip = 'All';
  const apply = () => {
    const needle = q.value.trim().toLowerCase();
    let shown = 0;
    for (const c of cards) {
      const okText = c.dataset.name.includes(needle);
      const okChip = chip === 'All' || c.dataset.cat === chip;
      c.hidden = !(okText && okChip);
      if (!c.hidden) shown++;
    }
    none.hidden = shown > 0;
  };
  q.addEventListener('input', apply);
  document.querySelectorAll('[data-chip]').forEach((b) =>
    b.addEventListener('click', () => {
      chip = b.dataset.chip;
      document.querySelectorAll('[data-chip]').forEach((x) => x.classList.toggle('on', x === b));
      apply();
    }),
  );
}

function wireTrends() {
  document.getElementById('sel-a').addEventListener('change', (e) => { trendState.a = e.target.value; render(); });
  document.getElementById('sel-b').addEventListener('change', (e) => { trendState.b = e.target.value; render(); });
  document.querySelectorAll('[data-range]').forEach((b) =>
    b.addEventListener('click', () => { trendState.from = Number(b.dataset.range); render(); }),
  );
}

function drawProvinces() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  let list = PROVINCES.filter((p) => p.name.toLowerCase().includes(provinceState.query));
  const key = provinceState.key;
  list = [...list].sort((x, y) => {
    const xv = key === 'share' ? x.pop / total : x[key];
    const yv = key === 'share' ? y.pop / total : y[key];
    return (typeof xv === 'string' ? xv.localeCompare(yv) : xv - yv) * provinceState.dir;
  });
  document.querySelector('#ptable tbody').innerHTML = provinceRows(list, total);
}

function wireProvinces() {
  drawProvinces();
  document.getElementById('pq').addEventListener('input', (e) => {
    provinceState.query = e.target.value.trim().toLowerCase();
    drawProvinces();
  });
  document.querySelectorAll('#ptable th').forEach((th) =>
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (provinceState.key === key) provinceState.dir *= -1;
      else provinceState = { ...provinceState, key, dir: key === 'pop' || key === 'share' ? -1 : 1 };
      drawProvinces();
    }),
  );
}

window.addEventListener('hashchange', render);
render();
