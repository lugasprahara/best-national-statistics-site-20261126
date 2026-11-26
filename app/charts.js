// Hand-built SVG charts. No library: a chart is a string of SVG the views
// drop into the page, so it costs no extra request and prints crisply at
// any size. Three shapes are needed: a full line chart with axes for the
// detail page, a small sparkline for cards, and horizontal bars for the
// province ranking.

const INK = '#17352e';
const FAINT = '#8aa39b';
const ACCENT = '#d95d28';
const GRID = '#ddd5c3';

function niceCeil(value) {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const unit = value / pow;
  const step = unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10;
  return step * pow;
}

function niceFloor(value) {
  return -niceCeil(-value);
}

// Full line chart. Points are [year, value] pairs; options may set a
// height, the number formatting decimals, and whether the y axis is
// allowed to start away from zero (right for ratios and life expectancy,
// wrong for counts of money or people).
export function lineChart(points, options = {}) {
  const width = 720;
  const height = options.height || 300;
  const decimals = options.decimals ?? 1;
  const padL = 58;
  const padR = 16;
  const padT = 14;
  const padB = 30;
  const values = points.map((p) => p[1]);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (options.zeroBase !== false && lo >= 0) lo = 0;
  if (lo === hi) { hi = lo + 1; }
  const span = hi - lo;
  lo -= span * 0.06;
  hi += span * 0.1;
  lo = niceFloor(lo);
  hi = niceCeil(hi);
  const x = (i) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (height - padT - padB);

  const ticks = [];
  for (let t = 0; t <= 4; t++) {
    const v = lo + ((hi - lo) * t) / 4;
    ticks.push(
      `<line x1="${padL}" y1="${y(v)}" x2="${width - padR}" y2="${y(v)}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="${FAINT}">${v.toFixed(decimals)}</text>`,
    );
  }
  const zeroLine = lo < 0 && hi > 0
    ? `<line x1="${padL}" y1="${y(0)}" x2="${width - padR}" y2="${y(0)}" stroke="${INK}" stroke-width="1.2"/>`
    : '';
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(Math.max(lo, 0)).toFixed(1)} L${x(0).toFixed(1)},${y(Math.max(lo, 0)).toFixed(1)} Z`;
  const dots = points.map((p, i) =>
    `<circle cx="${x(i)}" cy="${y(p[1])}" r="3.4" fill="${ACCENT}"><title>${p[0]}: ${p[1]}</title></circle>`,
  ).join('');
  const yearLabels = points.map((p, i) =>
    i % Math.ceil(points.length / 6) === 0 || i === points.length - 1
      ? `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${FAINT}">${p[0]}</text>`
      : '',
  ).join('');
  const first = points[0];
  const last = points[points.length - 1];

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart from ${first[0]} to ${last[0]}" class="chart">` +
    ticks.join('') + zeroLine +
    `<path d="${area}" fill="${ACCENT}" opacity="0.10"/>` +
    `<path d="${path}" fill="none" stroke="${ACCENT}" stroke-width="2.4" stroke-linejoin="round"/>` +
    dots + yearLabels + `</svg>`;
}

// Tiny trend line for a card: no axes, just the shape and the end point.
export function sparkline(points) {
  const width = 120;
  const height = 34;
  const values = points.map((p) => p[1]);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (lo === hi) { hi = lo + 1; }
  const x = (i) => 3 + (i / (points.length - 1)) * (width - 8);
  const y = (v) => 4 + (1 - (v - lo) / (hi - lo)) * (height - 9);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" class="spark">` +
    `<path d="${path}" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linejoin="round"/>` +
    `<circle cx="${x(points.length - 1)}" cy="${y(last[1])}" r="3" fill="${ACCENT}"/></svg>`;
}

// Horizontal bars for the province ranking: name, bar, value.
export function barChart(rows, options = {}) {
  const width = 720;
  const rowH = 30;
  const height = rows.length * rowH + 8;
  const labelW = 168;
  const valueW = 92;
  const max = Math.max(...rows.map((r) => r.value));
  const barW = (v) => Math.max(2, (v / max) * (width - labelW - valueW));
  const fmt = options.format || ((v) => v);
  const bars = rows.map((r, i) => {
    const top = 6 + i * rowH;
    return `<text x="0" y="${top + 17}" font-size="13" fill="${INK}">${r.name}</text>` +
      `<rect x="${labelW}" y="${top + 3}" width="${barW(r.value).toFixed(1)}" height="17" rx="3" fill="${ACCENT}" opacity="${(1 - i * 0.055).toFixed(2)}"/>` +
      `<text x="${labelW + barW(r.value) + 8}" y="${top + 17}" font-size="13" fill="${INK}">${fmt(r.value)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart" class="chart">${bars}</svg>`;
}
