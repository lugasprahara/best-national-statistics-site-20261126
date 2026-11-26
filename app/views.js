// Page renderers for NusaData. Every function returns the HTML for one hash
// route; main.js drops it into <main> and wires that view's controls after.
// Routes: overview (headline cards plus two featured charts), the searchable
// indicator index, one detail page per indicator, the trend explorer, the
// province comparison, and the about/methodology page.

import { META, INDICATORS, THEMES, PROVINCES, PUBLISHERS } from './data.js';
import { lineChart, sparkline, barChart, fmt, changeText, THEME_COLORS } from './charts.js';

export function findIndicator(id) {
  return INDICATORS.find((i) => i.id === id) || INDICATORS[0];
}

function colorOf(ind) {
  return THEME_COLORS[THEMES.indexOf(ind.theme) % THEME_COLORS.length];
}

function shortUnit(ind) {
  return ind.unit.split(',')[0];
}

function indicatorCard(ind) {
  const last = ind.points[ind.points.length - 1];
  return `<a class="card" href="#/indicator/${ind.id}" data-name="${ind.title.toLowerCase()}" data-cat="${ind.theme}">
    <span class="card-cat">${ind.theme}</span>
    <span class="card-name">${ind.title}</span>
    <span class="card-value">${fmt(ind.latest, ind.places)}<small> ${shortUnit(ind)}</small></span>
    <span class="card-meta">${ind.period} · ${ind.source}</span>
    ${sparkline(ind.points, colorOf(ind))}
    <span class="card-delta">${changeText(ind)} · latest year ${last[0]}: ${fmt(last[1], ind.places)}</span>
  </a>`;
}

export function overviewPage() {
  const featured = ['gdp-growth', 'population'].map(findIndicator);
  const cards = INDICATORS.map(indicatorCard).join('');
  const charts = featured
    .map(
      (ind) => `<section class="panel">
        <h2>${ind.title} <span class="panel-unit">${ind.unit}</span></h2>
        ${lineChart([{ points: ind.points, color: colorOf(ind) }], { places: ind.places, aria: `${ind.title} trend chart` })}
        <p class="src">Source: ${ind.source}. ${ind.what} <a href="#/indicator/${ind.id}">Full series and method →</a></p>
      </section>`,
    )
    .join('');
  return `
  <section class="hero">
    <p class="hero-kicker">${META.country} · official statistics, one page</p>
    <h1>${META.tagline}</h1>
    <p class="hero-blurb">${META.intro}</p>
    <div class="hero-stats">
      <div><strong>284.4 million</strong><span>people, mid-2025 (BPS)</span></div>
      <div><strong>US$1.40 trillion</strong><span>GDP, 2024 (World Bank)</span></div>
      <div><strong>+5.03%</strong><span>growth, 2024 (BPS)</span></div>
      <div><strong>8.47%</strong><span>poverty, March 2025 (BPS)</span></div>
    </div>
  </section>
  <h2 class="section-title">Headline indicators</h2>
  <div class="grid">${cards}</div>
  <h2 class="section-title">Two stories of the decade</h2>
  ${charts}
  <section class="panel">
    <h2>Reading this site</h2>
    <p>Every figure names its publisher and the period it belongs to. Annual series run
    from 2015 to the latest published year; where a fresher quarterly or monthly reading
    exists — growth in Q3 2025, inflation in October 2025 — the indicator card and detail
    page say so. The <a href="#/about">About &amp; methods</a> page lists every series,
    its latest figure and its source, and explains how the numbers are compiled.</p>
  </section>`;
}

export function indicatorsPage() {
  const chips = ['All', ...THEMES]
    .map((c) => `<button class="chip${c === 'All' ? ' on' : ''}" data-chip="${c}">${c}</button>`)
    .join('');
  return `
  <h1>Indicators</h1>
  <p class="lede">${INDICATORS.length} headline series across ${THEMES.length} themes. Search by name, or filter by theme; open any card for the full series, a data table and the method behind it.</p>
  <div class="tools">
    <input id="q" type="search" placeholder="Search indicators — try “poverty” or “exports”" aria-label="Search indicators">
    <div class="chips">${chips}</div>
  </div>
  <p id="noresult" class="noresult" hidden>No indicator matches that search. Try a shorter word, or clear the theme filter.</p>
  <div class="grid" id="cards">${INDICATORS.map(indicatorCard).join('')}</div>`;
}

export function indicatorPage(id) {
  const ind = findIndicator(id);
  const rows = [...ind.points]
    .reverse()
    .map(([y, v]) => `<tr><td>${y}</td><td>${fmt(v, ind.places)}</td></tr>`)
    .join('');
  const values = ind.points.map((p) => p[1]);
  const hi = Math.max(...values);
  const lo = Math.min(...values);
  const hiYear = ind.points[values.indexOf(hi)][0];
  const loYear = ind.points[values.indexOf(lo)][0];
  const siblings = INDICATORS.filter((i) => i.theme === ind.theme && i.id !== ind.id)
    .map((i) => `<a href="#/indicator/${i.id}">${i.title}</a>`)
    .join(' · ');
  return `
  <p class="crumb"><a href="#/indicators">← All indicators</a> · ${ind.theme}</p>
  <h1>${ind.title}</h1>
  <p class="lede">${ind.what}</p>
  <div class="stat-strip">
    <div><span>Latest</span><strong>${fmt(ind.latest, ind.places)}</strong><span>${ind.unit}</span></div>
    <div><span>Period</span><strong class="small">${ind.period}</strong><span>published figure</span></div>
    <div><span>Highest in series</span><strong>${fmt(hi, ind.places)}</strong><span>in ${hiYear}</span></div>
    <div><span>Lowest in series</span><strong>${fmt(lo, ind.places)}</strong><span>in ${loYear}</span></div>
  </div>
  <section class="panel">
    <h2>Trend, ${ind.points[0][0]}–${ind.points[ind.points.length - 1][0]} <span class="panel-unit">${ind.unit}</span></h2>
    ${lineChart([{ points: ind.points, color: colorOf(ind) }], { places: ind.places, height: 320, aria: `${ind.title} chart` })}
    <p class="src">Source: ${ind.source}. Hover or tap a point for its exact value.</p>
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>The series</h2>
      <table class="data"><thead><tr><th>Year</th><th>Value (${ind.unit})</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
    <section class="panel">
      <h2>How it is compiled</h2>
      <p>${ind.how}</p>
      <h3>What to watch</h3>
      <p>${changeText(ind)} over the period shown. Figures are as published by ${ind.source};
      annual values can be revised in later releases, and this page follows the release
      current at ${META.snapshot}.</p>
      ${siblings ? `<h3>More in ${ind.theme}</h3><p>${siblings}</p>` : ''}
    </section>
  </div>`;
}

export function trendsPage(state) {
  const options = (sel) =>
    INDICATORS.map((i) => `<option value="${i.id}"${i.id === sel ? ' selected' : ''}>${i.title}</option>`).join('');
  const a = findIndicator(state.a);
  const b = findIndicator(state.b);
  const inRange = (ind) => ind.points.filter(([y]) => y >= state.from);
  const indexed = (pts) => pts.map(([y, v]) => [y, (v / pts[0][1]) * 100]);
  const chart = lineChart(
    [
      { points: indexed(inRange(a)), color: THEME_COLORS[0], label: a.title },
      { points: indexed(inRange(b)), color: THEME_COLORS[1], label: b.title },
    ],
    { places: 0, height: 320, aria: 'Indexed comparison chart' },
  );
  const years = inRange(a).map((p) => p[0]);
  const rows = years
    .map((y) => {
      const av = inRange(a).find((p) => p[0] === y);
      const bv = inRange(b).find((p) => p[0] === y);
      return `<tr><td>${y}</td><td>${av ? fmt(av[1], a.places) : '—'}</td><td>${bv ? fmt(bv[1], b.places) : '—'}</td></tr>`;
    })
    .join('');
  return `
  <h1>Trend explorer</h1>
  <p class="lede">Put any two series side by side. Because their units differ, the chart
  indexes each series to 100 in the first year shown — it compares the shape and pace of
  change, not the levels. The table underneath gives the real values.</p>
  <div class="tools trend-tools">
    <label>Series A <select id="sel-a">${options(state.a)}</select></label>
    <label>Series B <select id="sel-b">${options(state.b)}</select></label>
    <div class="chips" role="group" aria-label="Year range">
      <button class="chip${state.from === 2015 ? ' on' : ''}" data-range="2015">From 2015</button>
      <button class="chip${state.from === 2020 ? ' on' : ''}" data-range="2020">From 2020</button>
    </div>
  </div>
  <section class="panel">
    <h2>${a.title} vs ${b.title} <span class="panel-unit">index, first year shown = 100</span></h2>
    ${chart}
    <p class="src"><span class="key" style="background:${THEME_COLORS[0]}"></span>${a.title} (${a.source}) &nbsp; <span class="key" style="background:${THEME_COLORS[1]}"></span>${b.title} (${b.source})</p>
  </section>
  <section class="panel">
    <h2>The values behind the chart</h2>
    <table class="data"><thead><tr><th>Year</th><th>${a.title} (${a.unit})</th><th>${b.title} (${b.unit})</th></tr></thead><tbody>${rows}</tbody></table>
  </section>`;
}

export function provincesPage() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const top = [...PROVINCES].sort((x, y) => y.pop - x.pop).slice(0, 10);
  const bars = barChart(
    top.map((p) => ({ name: p.name, value: p.pop, note: `${fmt(p.pop, 1)} m` })),
    { aria: 'Ten most populous provinces' },
  );
  return `
  <h1>Provinces compared</h1>
  <p class="lede">Indonesia has 38 provinces. Three of them — West Java, East Java and
  Central Java — hold about 45% of the national population between them, while the six
  Papuan provinces together hold under 2%. Populations are BPS mid-2024 estimates,
  rounded to one decimal; shares are computed from those rounded figures.</p>
  <section class="panel">
    <h2>The ten most populous provinces <span class="panel-unit">million people, mid-2024</span></h2>
    ${bars}
    <p class="src">Source: BPS mid-year population estimates, 2024. The 38 rounded figures sum to ${fmt(total, 1)} million, matching the national mid-2024 estimate of 281.6 million up to rounding.</p>
  </section>
  <div class="tools">
    <input id="pq" type="search" placeholder="Filter provinces — try “Kalimantan”" aria-label="Filter provinces">
  </div>
  <section class="panel">
    <h2>All 38 provinces</h2>
    <p class="hint">Select a column heading to sort the table by it; select again to reverse.</p>
    <table class="data sortable" id="ptable">
      <thead><tr>
        <th data-sort="name">Province</th><th data-sort="capital">Capital</th>
        <th data-sort="pop" class="num">Population (m)</th><th data-sort="share" class="num">Share (%)</th>
      </tr></thead>
      <tbody></tbody>
    </table>
    <p class="src">Source: BPS. Capitals are the seats of provincial government; Samarinda is listed for East Kalimantan while the new national capital, Nusantara, is being built in the same province.</p>
  </section>`;
}

export function provinceRows(list, total) {
  return list
    .map(
      (p) => `<tr><td>${p.name}</td><td>${p.capital}</td><td class="num">${fmt(p.pop, 1)}</td><td class="num">${fmt((p.pop / total) * 100, 1)}</td></tr>`,
    )
    .join('');
}

export function aboutPage() {
  const sourceRows = INDICATORS.map(
    (i) => `<tr><td>${i.title}</td><td>${fmt(i.latest, i.places)} ${shortUnit(i)}</td><td>${i.period}</td><td>${i.source}</td></tr>`,
  ).join('');
  const publishers = PUBLISHERS.map((p) => `<h3>${p.name}</h3><p>${p.role}</p>`).join('');
  return `
  <h1>About &amp; methods</h1>
  <p class="lede">${META.siteName} is an independent reading site for Indonesia\u2019s official
  statistics. It is not BPS and it does not publish new statistics: it re-presents the
  headline series a citizen, student or investor most often looks up, with the publisher
  and period of every figure kept attached to it.</p>
  <section class="panel">
    <h2>Methodology note</h2>
    <p><strong>One source per series.</strong> Each indicator follows a single publisher\u2019s
    series end to end, so a chart never mixes two methodologies. Where two publishers
    cover the same concept — GDP per capita, for instance — the chart follows one and the
    detail page quotes the other.</p>
    <p><strong>Reference periods differ.</strong> Growth is annual (with the latest quarter
    noted), inflation is the December year-on-year rate (latest month noted), unemployment
    is the August Sakernas round, and poverty and the Gini ratio are the March Susenas
    round. The period is printed beside every figure rather than buried in a footnote.</p>
    <p><strong>Revisions.</strong> Official figures are revised. Values here are those in
    the releases current at ${META.snapshot}; a later BPS or World Bank release may restate
    a recent year by a small amount.</p>
    <p><strong>Rounding.</strong> Province populations are rounded to one decimal of a
    million, so their shares are approximate and their sum differs slightly from the
    national estimate. All other figures are shown at the precision of the source release.</p>
  </section>
  <section class="panel">
    <h2>Every figure on this site, with its source</h2>
    <table class="data"><thead><tr><th>Indicator</th><th>Latest figure</th><th>Period</th><th>Source</th></tr></thead><tbody>${sourceRows}</tbody></table>
  </section>
  <section class="panel">
    <h2>The publishers</h2>
    ${publishers}
    <p>For the underlying releases, tables and microdata, consult the publishers directly:
    BPS publishes through its web API and statistical releases (Berita Resmi Statistik),
    and the World Bank through the World Development Indicators databank.</p>
  </section>`;
}
