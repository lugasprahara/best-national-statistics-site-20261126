// Page renderers. Each function returns the HTML for one hash route;
// main.js puts it into <main> and wires the controls afterwards.
//
// Views: the overview (headline cards and featured charts), the searchable
// indicator index, one detail page per indicator, the province comparison,
// and the about & methods page that names every figure's source.

import { SITE, INDICATORS, CATEGORIES, PROVINCES, REGIONS, PUBLISHERS } from './data.js';
import { lineChart, sparkline, barChart } from './charts.js';
import { formatValue, latestOf, describeChange, changeArrow, shareOf } from './format.js';

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id) || INDICATORS[0];
}

function card(ind) {
  const last = latestOf(ind);
  return `<a class="card" href="#/indicator/${ind.id}">
    <span class="card-cat">${ind.category}</span>
    <span class="card-name">${ind.name}</span>
    <span class="card-value">${formatValue(last.value, ind.decimals)}<small> ${ind.unit}</small></span>
    <span class="card-meta">${last.year} · ${ind.sourceShort}</span>
    ${sparkline(ind.series)}
    <span class="card-delta">${changeArrow(ind)} ${describeChange(ind)}</span>
  </a>`;
}

export function overviewView() {
  const featured = ['gdp-growth', 'tourists'].map(indicatorById);
  const charts = featured.map((ind) => `
    <section class="panel">
      <h2>${ind.name} <span class="panel-unit">${ind.unit}</span></h2>
      ${lineChart(ind.series, { decimals: ind.decimals > 2 ? 0 : ind.decimals, zeroBase: ind.id !== 'gini' })}
      <p class="src">Source: ${ind.source}. ${ind.definition} <a href="#/indicator/${ind.id}">Full series and method →</a></p>
    </section>`).join('');
  return `
  <section class="hero">
    <p class="hero-kicker">${SITE.country} · official statistics, one page</p>
    <h1>${SITE.tagline}</h1>
    <p class="hero-blurb">${SITE.blurb}</p>
    <div class="hero-stats">
      <div><strong>284.4 million</strong><span>people, mid-2025 (BPS)</span></div>
      <div><strong>US$1.40 trillion</strong><span>GDP, 2024 (World Bank)</span></div>
      <div><strong>+5.03%</strong><span>growth, 2024 (BPS)</span></div>
      <div><strong>8.47%</strong><span>poverty, March 2025 (BPS)</span></div>
    </div>
  </section>
  <h2 class="section-title">Headline indicators</h2>
  <div class="grid">${INDICATORS.map(card).join('')}</div>
  <h2 class="section-title">Two stories of the decade</h2>
  ${charts}
  <section class="panel">
    <h2>Reading this site</h2>
    <p>Every figure names its publisher and the period it belongs to. Annual series run from 2015
    to the latest published year; where a fresher quarterly or monthly reading exists — growth in
    Q3 2025, inflation in October 2025 — the indicator's own page says so. The
    <a href="#/about">About &amp; methods</a> page lists every series, its latest figure and its
    source, and explains how the numbers are compiled.</p>
  </section>`;
}

export function indicatorsView() {
  const chips = ['All', ...CATEGORIES]
    .map((c) => `<button class="chip${c === 'All' ? ' on' : ''}" data-chip="${c}">${c}</button>`).join('');
  return `
  <h1>Indicators</h1>
  <p class="lede">${INDICATORS.length} headline series across ${CATEGORIES.length} themes. Search by name,
  or filter by theme; open any card for the full series, a data table and the method behind it.</p>
  <div class="tools">
    <input id="q" type="search" placeholder="Search indicators — try “poverty” or “exports”" aria-label="Search indicators">
    <div class="chips">${chips}</div>
  </div>
  <p id="noresult" class="noresult" hidden>No indicator matches that search. Try a shorter word, or clear the theme filter.</p>
  <div class="grid" id="cards">${INDICATORS.map(card).join('')}</div>`;
}

export function indicatorView(id) {
  const ind = indicatorById(id);
  const last = latestOf(ind);
  const values = ind.series.map((p) => p[1]);
  const hi = Math.max(...values);
  const lo = Math.min(...values);
  const hiYear = ind.series[values.indexOf(hi)][0];
  const loYear = ind.series[values.indexOf(lo)][0];
  const zeroBase = ind.id !== 'gini' && ind.id !== 'life-expectancy';
  const rows = [...ind.series].reverse().map(([y, v]) =>
    `<tr><td>${y}</td><td>${formatValue(v, ind.decimals)}</td></tr>`).join('');
  const others = INDICATORS.filter((i) => i.category === ind.category && i.id !== ind.id)
    .map((i) => `<a href="#/indicator/${i.id}">${i.name}</a>`).join(' · ');
  return `
  <p class="crumb"><a href="#/indicators">← All indicators</a> · ${ind.category}</p>
  <h1>${ind.name}</h1>
  <p class="lede">${ind.definition}</p>
  <div class="stat-strip">
    <div><span>Latest</span><strong>${formatValue(last.value, ind.decimals)}</strong><span>${ind.unit}, ${last.year}</span></div>
    <div><span>Change</span><strong class="small">${describeChange(ind)}</strong><span>${ind.period}</span></div>
    <div><span>Highest in series</span><strong>${formatValue(hi, ind.decimals)}</strong><span>in ${hiYear}</span></div>
    <div><span>Lowest in series</span><strong>${formatValue(lo, ind.decimals)}</strong><span>in ${loYear}</span></div>
  </div>
  <section class="panel">
    <h2>Trend, ${ind.series[0][0]}–${last.year} <span class="panel-unit">${ind.unit}</span></h2>
    <div class="tools">
      <div class="chips" role="group" aria-label="Chart range">
        <button class="chip on" data-range="all">All years</button>
        <button class="chip" data-range="5">Last 5</button>
      </div>
    </div>
    <div id="bigchart">${lineChart(ind.series, { decimals: ind.decimals, zeroBase, height: 320 })}</div>
    <p class="src">Source: ${ind.source}. Hover a point for its exact value. ${ind.latestNote}</p>
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>The series</h2>
      <table class="data"><thead><tr><th>Year</th><th>Value (${ind.unit})</th></tr></thead><tbody>${rows}</tbody></table>
      <p><button class="chip" id="csv" type="button">Download this series as CSV</button></p>
    </section>
    <section class="panel">
      <h2>How it is compiled</h2>
      <p>${ind.method}</p>
      <h3>Period</h3>
      <p>${ind.period}. Figures are as published by ${ind.sourceShort}; annual values can be revised in
      later releases, and this page follows the release current at ${SITE.updated}.</p>
      ${others ? `<h3>More in ${ind.category}</h3><p>${others}</p>` : ''}
    </section>
  </div>`;
}

export function provincesView() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const chips = ['All', ...REGIONS]
    .map((r) => `<button class="chip${r === 'All' ? ' on' : ''}" data-region="${r}">${r}</button>`).join('');
  return `
  <h1>Provinces compared</h1>
  <p class="lede">Indonesia has 38 provinces. Three of them — West Java, East Java and Central Java —
  hold about 45% of the national population between them, while the six Papuan provinces together
  hold under 2%. Populations are BPS mid-2024 estimates.</p>
  <section class="panel">
    <h2>The ten most populous provinces <span class="panel-unit">million people, mid-2024</span></h2>
    ${barChart(top.map((p) => ({ name: p.name, value: p.pop })), { format: (v) => `${formatValue(v, 2)} m` })}
    <p class="src">Source: BPS mid-year population estimates, 2024. The 38 rounded figures sum to
    ${formatValue(total, 1)} million, matching the national mid-2024 estimate of 281.6 million up to rounding.</p>
  </section>
  <div class="tools">
    <input id="pq" type="search" placeholder="Filter provinces — try “Kalimantan”" aria-label="Filter provinces">
    <div class="chips">${chips}</div>
  </div>
  <section class="panel">
    <h2>All 38 provinces</h2>
    <p class="hint">Select a column heading to sort the table by it; select again to reverse.</p>
    <table class="data sortable" id="ptable">
      <thead><tr>
        <th data-sort="name">Province</th><th data-sort="capital">Capital</th>
        <th data-sort="region">Region</th><th data-sort="pop" class="num">Population (m)</th>
        <th class="num">Share (%)</th>
      </tr></thead>
      <tbody>${provinceRows(PROVINCES, total)}</tbody>
    </table>
    <p class="src">Source: BPS. Capitals are the seats of provincial government; Samarinda is listed
    for East Kalimantan while the new national capital, Nusantara, is being built in the same province.</p>
  </section>`;
}

export function provinceRows(list, total) {
  return list.map((p) => `<tr>
    <td>${p.name}</td><td>${p.capital}</td><td>${p.region}</td>
    <td class="num">${formatValue(p.pop, 2)}</td><td class="num">${shareOf(p.pop, total)}</td>
  </tr>`).join('');
}

export function aboutView() {
  const sourceRows = INDICATORS.map((i) => {
    const last = latestOf(i);
    return `<tr><td><a href="#/indicator/${i.id}">${i.name}</a></td>
      <td>${formatValue(last.value, i.decimals)} ${i.unit}</td><td>${last.year}</td><td>${i.source}</td></tr>`;
  }).join('');
  const publishers = PUBLISHERS.map((p) => `<h3>${p.name}</h3><p>${p.role}</p>`).join('');
  return `
  <h1>About &amp; methods</h1>
  <p class="lede">${SITE.name} is an independent reading site for Indonesia's official statistics.
  It is not BPS and it does not publish new statistics: it re-presents the headline series a citizen,
  student or investor most often looks up, with the publisher and period of every figure kept
  attached to it.</p>
  <section class="panel">
    <h2>Methodology note</h2>
    <p><strong>One source per series.</strong> Each indicator follows a single publisher's series end
    to end, so a chart never mixes two methodologies. Where two publishers cover the same concept —
    GDP per capita, for instance — the chart follows one and the detail page quotes the other.</p>
    <p><strong>Reference periods differ.</strong> Growth is annual (with the latest quarter noted),
    inflation is the December year-on-year rate (latest month noted), unemployment is the August
    Sakernas round, and poverty and the Gini ratio are the March Susenas round. The period is
    printed beside every figure rather than buried in a footnote.</p>
    <p><strong>Revisions.</strong> Official figures are revised. Values here are those in the releases
    current at ${SITE.updated}; a later BPS or World Bank release may restate a recent year by a
    small amount.</p>
    <p><strong>Rounding.</strong> Province populations are rounded to two decimals of a million, so
    their shares are approximate and their sum differs slightly from the national estimate. All
    other figures are shown at the precision of the source release.</p>
  </section>
  <section class="panel">
    <h2>Every figure on this site, with its source</h2>
    <table class="data"><thead><tr><th>Indicator</th><th>Latest figure</th><th>Year</th><th>Source</th></tr></thead>
    <tbody>${sourceRows}</tbody></table>
  </section>
  <section class="panel">
    <h2>The publishers</h2>
    ${publishers}
    <p>For the underlying releases, tables and microdata, consult the publishers directly: BPS
    publishes through its web API and statistical releases (Berita Resmi Statistik), and the World
    Bank through the World Development Indicators databank.</p>
  </section>`;
}
