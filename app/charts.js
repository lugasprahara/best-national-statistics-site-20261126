// Hand-built SVG charts for NusaData. No chart library: each chart is a
// string of SVG assembled from [year, value] pairs. Three shapes — a full
// line chart with axes for detail pages, a compact sparkline for cards,
// and horizontal bars for the province ranking — plus the shared number
// formatting used by every view.

export function fmt(value, places) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

// How much an indicator moved across its whole series, in words.
export function changeText(ind) {
  const first = ind.points[0];
  const last = ind.points[ind.points.length - 1];
  const diff = last[1] - first[1];
  const sign = diff > 0 ? '+' : '';
  return `${sign}${fmt(diff, ind.places)} since ${first[0]}`;
}

// Pick a display range for a set of series: pad a little, pull the bottom
// to zero when the series comes close to it, and always include zero when
// a series crosses it (real GDP growth went negative in 2020).
function displayRange(allPoints) {
  let lo = Infinity;
  let hi = -Infinity;
  for (const pts of allPoints) {
    for (const [, v] of pts) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (lo > 0 && lo - (hi - lo) * 0.25 < 0) lo = 0;
  if (hi < 0) hi = 0;
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo;
  const padTop = span * 0.12;
  const padBottom = lo < 0 ? padTop : (lo > 0 ? span * 0.05 : 0);
  return { lo: lo - padBottom, hi: hi + padTop };
}

function gridTicks(lo, hi, count) {
  const out = [];
  for (let i = 0; i <= count; i++) out.push(lo + ((hi - lo) * i) / count);
  return out;
}

// A full line chart. `series` is [{ points, color, label }]. Draws
// gridlines with value labels, first/last year labels, a zero line when the
// range crosses it, dots with hover titles, and — for a single series — a
// soft area fill and the final value printed beside the last point.
export function lineChart(series, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const places = opts.places ?? 1;
  const left = 56;
  const right = series.length > 1 ? 16 : 64;
  const top = 14;
  const bottom = 26;
  const plotW = w - left - right;
  const plotH = h - top - bottom;
  const { lo, hi } = displayRange(series.map((s) => s.points));
  const years = series[0].points.map((p) => p[0]);
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  const xFor = (yr) => left + ((yr - firstYear) / Math.max(1, lastYear - firstYear)) * plotW;
  const yFor = (v) => top + (1 - (v - lo) / (hi - lo)) * plotH;

  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${opts.aria || 'line chart'}">`;
  for (const t of gridTicks(lo, hi, 4)) {
    const y = yFor(t);
    svg += `<line x1="${left}" y1="${y.toFixed(1)}" x2="${w - right}" y2="${y.toFixed(1)}" class="grid"/>`;
    svg += `<text x="${left - 8}" y="${(y + 4).toFixed(1)}" class="tick" text-anchor="end">${fmt(t, places)}</text>`;
  }
  if (lo < 0 && hi > 0) {
    svg += `<line x1="${left}" y1="${yFor(0).toFixed(1)}" x2="${w - right}" y2="${yFor(0).toFixed(1)}" class="zero"/>`;
  }
  svg += `<text x="${left}" y="${h - 6}" class="tick">${firstYear}</text>`;
  svg += `<text x="${w - right}" y="${h - 6}" class="tick" text-anchor="end">${lastYear}</text>`;

  for (const s of series) {
    const pts = s.points.map(([yr, v]) => `${xFor(yr).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ');
    if (series.length === 1) {
      const base = yFor(Math.max(0, lo));
      const last = s.points[s.points.length - 1];
      svg += `<polygon points="${left},${base.toFixed(1)} ${pts} ${xFor(last[0]).toFixed(1)},${base.toFixed(1)}" class="area" fill="${s.color}"/>`;
    }
    svg += `<polyline points="${pts}" class="line" stroke="${s.color}"/>`;
    for (const [yr, v] of s.points) {
      svg += `<circle cx="${xFor(yr).toFixed(1)}" cy="${yFor(v).toFixed(1)}" r="3" class="dot" fill="${s.color}"><title>${yr}: ${fmt(v, places)}</title></circle>`;
    }
    const last = s.points[s.points.length - 1];
    if (series.length === 1) {
      svg += `<text x="${(xFor(last[0]) + 8).toFixed(1)}" y="${(yFor(last[1]) + 4).toFixed(1)}" class="endlabel" fill="${s.color}">${fmt(last[1], places)}</text>`;
    }
    // Multi-series charts get no end labels: the names are too long to fit
    // beside the last point, and the view prints a colour legend instead.
  }
  svg += '</svg>';
  return svg;
}

// A small sparkline for indicator cards: a bare line with a dot on the end.
export function sparkline(points, color) {
  const w = 120;
  const h = 36;
  const { lo, hi } = displayRange([points]);
  const firstYear = points[0][0];
  const lastYear = points[points.length - 1][0];
  const xFor = (yr) => 2 + ((yr - firstYear) / Math.max(1, lastYear - firstYear)) * (w - 6);
  const yFor = (v) => 3 + (1 - (v - lo) / (hi - lo)) * (h - 8);
  const pts = points.map(([yr, v]) => `${xFor(yr).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  return `<svg viewBox="0 0 ${w} ${h}" class="spark" aria-hidden="true"><polyline points="${pts}" class="sparkline" stroke="${color}"/><circle cx="${xFor(last[0]).toFixed(1)}" cy="${yFor(last[1]).toFixed(1)}" r="3" fill="${color}"/></svg>`;
}

// Horizontal bars for the province ranking. Rows are { name, value, note }.
// Labels are kept large because the chart is drawn at desktop width and
// scaled down on a phone, where small text would disappear.
export function barChart(rows, opts = {}) {
  const w = opts.width || 720;
  const rowH = 36;
  const h = rows.length * rowH + 8;
  const labelW = 205;
  const max = Math.max(...rows.map((r) => r.value));
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${opts.aria || 'bar chart'}">`;
  rows.forEach((r, i) => {
    const y = 6 + i * rowH;
    const barW = Math.max(2, (r.value / max) * (w - labelW - 76));
    svg += `<text x="${labelW - 10}" y="${y + 19}" class="barlabel" text-anchor="end">${r.name}</text>`;
    svg += `<rect x="${labelW}" y="${y + 5}" width="${barW.toFixed(1)}" height="20" class="bar" fill="${opts.color || '#0f5e6b'}"/>`;
    svg += `<text x="${(labelW + barW + 8).toFixed(1)}" y="${y + 19}" class="barvalue">${r.note}</text>`;
  });
  svg += '</svg>';
  return svg;
}

export const THEME_COLORS = ['#0f5e6b', '#c0392b', '#b8860b', '#3d6e35', '#5b4a9e'];
