// Hand-drawn SVG charts for NusaData: no library, just strings of SVG built
// from a series of [year, value] pairs. Three shapes are offered — a full
// line chart with axes for detail pages, a sparkline for cards, and a
// horizontal bar chart for the province ranking — plus the number
// formatting every view shares.

export function formatValue(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDelta(ind) {
  const first = ind.series[0];
  const last = ind.series[ind.series.length - 1];
  const diff = last[1] - first[1];
  const sign = diff > 0 ? '+' : '';
  return `${sign}${formatValue(diff, ind.decimals)} since ${first[0]}`;
}

// Round a data range outward to at most four gridlines, always including
// zero when a series crosses or touches it (growth, in 2020, goes negative).
function scale(seriesList) {
  let min = Infinity;
  let max = -Infinity;
  for (const s of seriesList) {
    for (const [, v] of s) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (min > 0 && min - (max - min) * 0.25 < 0) min = 0;
  if (max < 0) max = 0;
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  return { min: min - (min < 0 ? pad : 0) - (min > 0 ? (max - min) * 0.05 : 0), max: max + pad };
}

function ticks(min, max, count) {
  const out = [];
  for (let i = 0; i <= count; i++) out.push(min + ((max - min) * i) / count);
  return out;
}

// A full line chart. seriesList is an array of {points, color, label};
// draws gridlines, y tick labels, first/last x labels, end dots and, for a
// single series, an area fill and a label on the last point.
export function lineChart(seriesList, opts = {}) {
  const width = opts.width || 720;
  const height = opts.height || 300;
  const decimals = opts.decimals ?? 1;
  const left = 56;
  const right = seriesList.length > 1 ? 16 : 64;
  const top = 14;
  const bottom = 26;
  const iw = width - left - right;
  const ih = height - top - bottom;
  const { min, max } = scale(seriesList.map((s) => s.points));
  const years = seriesList[0].points.map((p) => p[0]);
  const x0 = Math.min(...years);
  const x1 = Math.max(...years);
  const X = (yr) => left + ((yr - x0) / Math.max(1, x1 - x0)) * iw;
  const Y = (v) => top + (1 - (v - min) / (max - min)) * ih;

  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" class="chart" aria-label="${opts.aria || 'line chart'}">`;
  for (const t of ticks(min, max, 4)) {
    const y = Y(t);
    svg += `<line x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}" class="grid"/>`;
    svg += `<text x="${left - 8}" y="${(y + 4).toFixed(1)}" class="tick" text-anchor="end">${formatValue(t, decimals)}</text>`;
  }
  if (min < 0 && max > 0) {
    svg += `<line x1="${left}" y1="${Y(0).toFixed(1)}" x2="${width - right}" y2="${Y(0).toFixed(1)}" class="zero"/>`;
  }
  svg += `<text x="${left}" y="${height - 6}" class="tick">${x0}</text>`;
  svg += `<text x="${width - right}" y="${height - 6}" class="tick" text-anchor="end">${x1}</text>`;

  for (const s of seriesList) {
    const pts = s.points.map(([yr, v]) => `${X(yr).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    if (seriesList.length === 1) {
      const first = s.points[0];
      const last = s.points[s.points.length - 1];
      svg += `<polygon points="${left},${Y(Math.max(0, min)).toFixed(1)} ${pts} ${X(last[0]).toFixed(1)},${Y(Math.max(0, min)).toFixed(1)}" class="area" fill="${s.color}"/>`;
    }
    svg += `<polyline points="${pts}" class="line" stroke="${s.color}"/>`;
    for (const [yr, v] of s.points) {
      svg += `<circle cx="${X(yr).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" class="dot" fill="${s.color}"><title>${yr}: ${formatValue(v, decimals)}</title></circle>`;
    }
    const last = s.points[s.points.length - 1];
    if (seriesList.length === 1) {
      svg += `<text x="${(X(last[0]) + 8).toFixed(1)}" y="${(Y(last[1]) + 4).toFixed(1)}" class="endlabel" fill="${s.color}">${formatValue(last[1], decimals)}</text>`;
    }
    // Multi-series charts carry no end labels: names are too long to fit
    // beside the last point, and the view prints a colour legend instead.
  }
  svg += '</svg>';
  return svg;
}

// A small sparkline for indicator cards: line only, with a dot on the end.
export function sparkline(points, color) {
  const width = 120;
  const height = 36;
  const { min, max } = scale([points]);
  const x0 = points[0][0];
  const x1 = points[points.length - 1][0];
  const X = (yr) => 2 + ((yr - x0) / Math.max(1, x1 - x0)) * (width - 6);
  const Y = (v) => 3 + (1 - (v - min) / (max - min)) * (height - 8);
  const pts = points.map(([yr, v]) => `${X(yr).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  return `<svg viewBox="0 0 ${width} ${height}" class="spark" aria-hidden="true"><polyline points="${pts}" class="sparkline" stroke="${color}"/><circle cx="${X(last[0]).toFixed(1)}" cy="${Y(last[1]).toFixed(1)}" r="3" fill="${color}"/></svg>`;
}

// Horizontal bars for the province ranking: rows of {name, value, note}.
// Rows are tall and labels large, because the chart is drawn at desktop
// width and scaled down on a phone — small text would vanish there.
export function barChart(rows, opts = {}) {
  const width = opts.width || 720;
  const rowH = 36;
  const height = rows.length * rowH + 8;
  const labelW = 205;
  const max = Math.max(...rows.map((r) => r.value));
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" class="chart" aria-label="${opts.aria || 'bar chart'}">`;
  rows.forEach((r, i) => {
    const y = 6 + i * rowH;
    const w = Math.max(2, (r.value / max) * (width - labelW - 76));
    svg += `<text x="${labelW - 10}" y="${y + 19}" class="barlabel" text-anchor="end">${r.name}</text>`;
    svg += `<rect x="${labelW}" y="${y + 5}" width="${w.toFixed(1)}" height="20" class="bar" fill="${opts.color || '#0f5e6b'}"/>`;
    svg += `<text x="${(labelW + w + 8).toFixed(1)}" y="${y + 19}" class="barvalue">${r.note}</text>`;
  });
  svg += '</svg>';
  return svg;
}

export const PALETTE = ['#0f5e6b', '#c0392b', '#b8860b', '#3d6e35', '#5b4a9e'];
