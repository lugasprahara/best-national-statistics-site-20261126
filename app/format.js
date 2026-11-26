// Number and change formatting, shared by every view.

export function formatValue(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function latestOf(indicator) {
  const last = indicator.series[indicator.series.length - 1];
  return { year: last[0], value: last[1] };
}

export function previousOf(indicator) {
  const prev = indicator.series[indicator.series.length - 2];
  return { year: prev[0], value: prev[1] };
}

// Human sentence for the move from one point to the latest, e.g.
// "up 0.56 points since 2023" for rates, "up 2.9% since 2023" for levels.
export function describeChange(indicator) {
  const last = latestOf(indicator);
  const prev = previousOf(indicator);
  const diff = last.value - prev.value;
  const word = diff > 0 ? 'up' : diff < 0 ? 'down' : 'unchanged';
  if (diff === 0) return `unchanged since ${prev.year}`;
  const isRate = indicator.unit.includes('%') || indicator.unit.includes('ratio');
  if (isRate) {
    return `${word} ${formatValue(Math.abs(diff), indicator.decimals)} points since ${prev.year}`;
  }
  const pct = Math.abs((diff / prev.value) * 100);
  return `${word} ${pct.toFixed(1)}% since ${prev.year}`;
}

export function changeArrow(indicator) {
  const diff = latestOf(indicator).value - previousOf(indicator).value;
  if (diff > 0) return '▲';
  if (diff < 0) return '▼';
  return '■';
}

export function shareOf(part, whole, decimals = 1) {
  return formatValue((part / whole) * 100, decimals);
}
