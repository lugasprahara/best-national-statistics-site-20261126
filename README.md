# NusaData — Indonesia in Numbers

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/lugasprahara/best-national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/lugasprahara/best-national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An entry to make.fun's [best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty.

NusaData re-presents the headline statistics of the Republic of Indonesia — population, economic
growth, GDP, inflation, unemployment, poverty, inequality, life expectancy, exports, visitors and
internet use — as one fast, static site. Every figure names its publisher (BPS — Statistics
Indonesia, or the World Bank) and the period it belongs to; a provinces page compares all 38
provinces by population, and an About & methods page lists every series with its source.

## The site

Plain static files under `app/`, no build step and no network requests: open it with any static
server rooted at `app/`.

- `app/index.html` — the page shell (header, navigation, footer)
- `app/data.js` — every figure: 12 indicator series and the 38 provinces
- `app/charts.js` — hand-built SVG line charts, sparklines and bar charts
- `app/views.js` — one renderer per page (overview, indicators, detail, provinces, about)
- `app/main.js` — the hash router and the controls (search, filters, sorting, chart range)
- `app/format.js` — number and change formatting
- `app/style.css` — the almanac look: deep teal on warm paper

## Run it locally

```
node serve.ts            # serves app/ at http://localhost:8080
```

## Hand it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
with the vendored make.fun library in `vendor/makefun-frontend.ts` (kept unchanged, as the
scorer compares the dossier byte for byte).

## License

MIT — see `LICENSE`.
