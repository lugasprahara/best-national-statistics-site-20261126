// Page renderers for NusaData. Each function returns the HTML for one hash
// route; main.js puts it into <main> and wires the controls afterwards.
// Views: overview (headline cards and featured charts), the searchable
// indicator index, one detail page per indicator, the trend explorer, the
// province comparison, and the about/methodology page.

import { SITE, INDICATORS, CATEGORIES, PROVINCES, PUBLISHERS } from './data.js';
import { lineChart, sparkline, barChart, formatValue, formatDelta, PALETTE } from './charts.js';

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id) || INDICATORS[0];
}

function colorFor(ind) {
  return PALETTE[CATEGORIES.indexOf(ind.category) % PALETTE.length];
}

function card(ind) {
  const last = ind.series[ind.series.length - 1];
  return `<a class="card" href="#/indicator/${ind.id}" data-name="${ind.name.toLowerCase()}" data-cat="${ind.category}">
    <span class="card-cat">${ind.category}</span>
    <span class="card-name">${ind.name}</span>
    <span class="card-value">${formatValue(ind.latest, ind.decimals)}<small> ${ind.unit.split(',')[0]}</small></span>
    <span class="card-meta">${ind.latestPeriod} · ${ind.source}</span>
    ${sparkline(ind.series, colorFor(ind))}
    <span class="card-delta">${formatDelta(ind)} · latest year ${last[0]}: ${formatValue(last[1], ind.decimals)}</span>
  </a>`;
}

export function overviewView() {
  const featured = ['gdp-growth', 'population'].map(indicatorById);
  const cards = INDICATORS.map(card).join('');
  const charts = featured
    .map(
      (ind) => `<section class="panel">
        <h2>${ind.name} <span class="panel-unit">${ind.unit}</span></h2>
        ${lineChart([{ points: ind.series, color: colorFor(ind) }], { decimals: ind.decimals, aria: `${ind.name} trend chart` })}
        <p class="src">Source: ${ind.source}. ${ind.definition} <a href="#/indicator/${ind.id}">Full series and method →</a></p>
      </section>`,
    )
    .join('');
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

export function indicatorsView() {
  const chips = ['All', ...CATEGORIES]
    .map((c) => `<button class="chip${c === 'All' ? ' on' : ''}" data-chip="${c}">${c}</button>`)
    .join('');
  return `
  <h1>Indicators</h1>
  <p class="lede">${INDICATORS.length} headline series across ${CATEGORIES.length} themes. Search by name, or filter by theme; open any card for the full series, a data table and the method behind it.</p>
  <div class="tools">
    <input id="q" type="search" placeholder="Search indicators — try “poverty” or “exports”" aria-label="Search indicators">
    <div class="chips">${chips}</div>
  </div>
  <p id="noresult" class="noresult" hidden>No indicator matches that search. Try a shorter word, or clear the theme filter.</p>
  <div class="grid" id="cards">${INDICATORS.map(card).join('')}</div>`;
}

export function indicatorView(id) {
  const ind = indicatorById(id);
  const rows = [...ind.series]
    .reverse()
    .map(([y, v]) => `<tr><td>${y}</td><td>${formatValue(v, ind.decimals)}</td></tr>`)
    .join('');
  const values = ind.series.map((p) => p[1]);
  const hi = Math.max(...values);
  const lo = Math.min(...values);
  const hiYear = ind.series[values.indexOf(hi)][0];
  const loYear = ind.series[values.indexOf(lo)][0];
  const others = INDICATORS.filter((i) => i.category === ind.category && i.id !== ind.id)
    .map((i) => `<a href="#/indicator/${i.id}">${i.name}</a>`)
    .join(' · ');
  return `
  <p class="crumb"><a href="#/indicators">← All indicators</a> · ${ind.category}</p>
  <h1>${ind.name}</h1>
  <p class="lede">${ind.definition}</p>
  <div class="stat-strip">
    <div><span>Latest</span><strong>${formatValue(ind.latest, ind.decimals)}</strong><span>${ind.unit}</span></div>
    <div><span>Period</span><strong class="small">${ind.latestPeriod}</strong><span>published figure</span></div>
    <div><span>Highest in series</span><strong>${formatValue(hi, ind.decimals)}</strong><span>in ${hiYear}</span></div>
    <div><span>Lowest in series</span><strong>${formatValue(lo, ind.decimals)}</strong><span>in ${loYear}</span></div>
  </div>
  <section class="panel">
    <h2>Trend, ${ind.series[0][0]}–${ind.series[ind.series.length - 1][0]} <span class="panel-unit">${ind.unit}</span></h2>
    ${lineChart([{ points: ind.series, color: colorFor(ind) }], { decimals: ind.decimals, height: 320, aria: `${ind.name} chart` })}
    <p class="src">Source: ${ind.source}. Hover or tap a point for its exact value.</p>
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>The series</h2>
      <table class="data"><thead><tr><th>Year</th><th>Value (${ind.unit})</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
    <section class="panel">
      <h2>How it is compiled</h2>
      <p>${ind.method}</p>
      <h3>What to watch</h3>
      <p>${formatDelta(ind)} over the period shown. Figures are as published by ${ind.source};
      annual values can be revised in later releases, and this page follows the release
      current at ${SITE.updated}.</p>
      ${others ? `<h3>More in ${ind.category}</h3><p>${others}</p>` : ''}
    </section>
  </div>`;
}

export function trendsView(state) {
  const options = (sel) =>
    INDICATORS.map((i) => `<option value="${i.id}"${i.id === sel ? ' selected' : ''}>${i.name}</option>`).join('');
  const a = indicatorById(state.a);
  const b = indicatorById(state.b);
  const inRange = (ind) => ind.series.filter(([y]) => y >= state.from);
  const index = (pts) => pts.map(([y, v]) => [y, (v / pts[0][1]) * 100]);
  const chart = lineChart(
    [
      { points: index(inRange(a)), color: PALETTE[0], label: a.name },
      { points: index(inRange(b)), color: PALETTE[1], label: b.name },
    ],
    { decimals: 0, height: 320, aria: 'Indexed comparison chart' },
  );
  const years = inRange(a).map((p) => p[0]);
  const rows = years
    .map((y) => {
      const av = inRange(a).find((p) => p[0] === y);
      const bv = inRange(b).find((p) => p[0] === y);
      return `<tr><td>${y}</td><td>${av ? formatValue(av[1], a.decimals) : '—'}</td><td>${bv ? formatValue(bv[1], b.decimals) : '—'}</td></tr>`;
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
    <h2>${a.name} vs ${b.name} <span class="panel-unit">index, first year shown = 100</span></h2>
    ${chart}
    <p class="src"><span class="key" style="background:${PALETTE[0]}"></span>${a.name} (${a.source}) &nbsp; <span class="key" style="background:${PALETTE[1]}"></span>${b.name} (${b.source})</p>
  </section>
  <section class="panel">
    <h2>The values behind the chart</h2>
    <table class="data"><thead><tr><th>Year</th><th>${a.name} (${a.unit})</th><th>${b.name} (${b.unit})</th></tr></thead><tbody>${rows}</tbody></table>
  </section>`;
}

export function provincesView() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const top = [...PROVINCES].sort((x, y) => y.pop - x.pop).slice(0, 10);
  const bars = barChart(
    top.map((p) => ({ name: p.name, value: p.pop, note: `${formatValue(p.pop, 1)} m` })),
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
    <p class="src">Source: BPS mid-year population estimates, 2024. The 38 rounded figures sum to ${formatValue(total, 1)} million, matching the national mid-2024 estimate of 281.6 million up to rounding.</p>
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
      (p) => `<tr><td>${p.name}</td><td>${p.capital}</td><td class="num">${formatValue(p.pop, 1)}</td><td class="num">${formatValue((p.pop / total) * 100, 1)}</td></tr>`,
    )
    .join('');
}

export function aboutView() {
  const sourceRows = INDICATORS.map(
    (i) => `<tr><td>${i.name}</td><td>${formatValue(i.latest, i.decimals)} ${i.unit.split(',')[0]}</td><td>${i.latestPeriod}</td><td>${i.source}</td></tr>`,
  ).join('');
  const publishers = PUBLISHERS.map((p) => `<h3>${p.name}</h3><p>${p.role}</p>`).join('');
  return `
  <h1>About &amp; methods</h1>
  <p class="lede">${SITE.name} is an independent reading site for Indonesia\u2019s official
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
    the releases current at ${SITE.updated}; a later BPS or World Bank release may restate
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
