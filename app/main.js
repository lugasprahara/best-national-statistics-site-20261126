// Router and control wiring. The site is one page with hash routes:
//   #/                 overview
//   #/indicators       searchable index of the 12 series
//   #/indicator/<id>   one series: chart, table, method
//   #/provinces        the 38 provinces, sortable
//   #/about            sources and methods
// Views render HTML strings; this file swaps them into <main> and then
// wires whatever controls the new page carries.

import { INDICATORS, PROVINCES } from './data.js';
import { overviewView, indicatorsView, indicatorView, provincesView, aboutView, indicatorById, provinceRows } from './views.js';
import { lineChart } from './charts.js';

const main = document.getElementById('app');
const TOTAL_POP = PROVINCES.reduce((s, p) => s + p.pop, 0);

function setNav(route) {
  document.querySelectorAll('nav a').forEach((a) => {
    const target = a.getAttribute('href').slice(1);
    const active = target === route || (route.startsWith('/indicator') && target === '/indicators');
    a.classList.toggle('on', active);
  });
}

function wireIndicators() {
  const input = document.getElementById('q');
  const cards = [...document.querySelectorAll('#cards .card')];
  let theme = 'All';
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    for (const el of cards) {
      const ind = indicatorById(el.getAttribute('href').split('/').pop());
      const show = (!q || ind.name.toLowerCase().includes(q)) && (theme === 'All' || ind.category === theme);
      el.style.display = show ? '' : 'none';
      if (show) visible++;
    }
    document.getElementById('noresult').hidden = visible > 0;
  };
  input.addEventListener('input', apply);
  document.querySelectorAll('[data-chip]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-chip]').forEach((c) => c.classList.remove('on'));
      chip.classList.add('on');
      theme = chip.dataset.chip;
      apply();
    });
  });
}

function wireIndicator(id) {
  const ind = indicatorById(id);
  const zeroBase = ind.id !== 'gini' && ind.id !== 'life-expectancy';
  const csvBtn = document.getElementById('csv');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      const lines = [`year,value (${ind.unit})`, ...ind.series.map(([y, v]) => `${y},${v}`)];
      const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `nusadata-${ind.id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  document.querySelectorAll('[data-range]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-range]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const pts = btn.dataset.range === '5' ? ind.series.slice(-5) : ind.series;
      document.getElementById('bigchart').innerHTML =
        lineChart(pts, { decimals: ind.decimals, zeroBase, height: 320 });
    });
  });
}

function wireProvinces() {
  const input = document.getElementById('pq');
  const tbody = document.querySelector('#ptable tbody');
  let region = 'All';
  let sortKey = null;
  let sortDir = 1;
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let list = PROVINCES.filter((p) =>
      (region === 'All' || p.region === region) &&
      (!q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q)));
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))) * sortDir;
      });
    }
    tbody.innerHTML = provinceRows(list, TOTAL_POP);
  };
  input.addEventListener('input', apply);
  document.querySelectorAll('[data-region]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-region]').forEach((c) => c.classList.remove('on'));
      chip.classList.add('on');
      region = chip.dataset.region;
      apply();
    });
  });
  document.querySelectorAll('#ptable th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir = -sortDir;
      else { sortKey = key; sortDir = key === 'pop' ? -1 : 1; }
      apply();
    });
  });
}

function render() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);
  let route = '/';
  if (parts[0] === 'indicators') {
    main.innerHTML = indicatorsView();
    route = '/indicators';
    wireIndicators();
  } else if (parts[0] === 'indicator' && parts[1]) {
    main.innerHTML = indicatorView(parts[1]);
    route = `/indicator/${parts[1]}`;
    wireIndicator(parts[1]);
  } else if (parts[0] === 'provinces') {
    main.innerHTML = provincesView();
    route = '/provinces';
    wireProvinces();
  } else if (parts[0] === 'about') {
    main.innerHTML = aboutView();
    route = '/about';
  } else {
    main.innerHTML = overviewView();
  }
  setNav(route);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
