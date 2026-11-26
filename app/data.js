// NusaData — Indonesia in Numbers.
// Every figure on this site lives in this one file, as plain data, with the
// publisher and reference period named beside it. Nothing is fetched: the
// numbers below were transcribed from the published releases of Badan Pusat
// Statistik (BPS) and the World Bank's World Development Indicators (WDI),
// and the About page lists each series' latest value, period and source so a
// reader can check any figure against the original release.

export const SITE = {
  name: 'NusaData',
  tagline: 'Indonesia in Numbers',
  country: 'Republic of Indonesia',
  updated: 'November 2026',
  blurb:
    'An independent, read-only mirror of Indonesia\u2019s headline official statistics: ' +
    'the people, the economy, prices, jobs and provinces, drawn from BPS and World Bank ' +
    'releases and presented with the source and year of every figure.',
};

// Each indicator: id, name, category, unit, decimals used when formatting,
// the latest published value and its period, the publisher, a one-line
// definition, a methodology note, and the annual series as [year, value].
export const INDICATORS = [
  {
    id: 'population',
    name: 'Population',
    category: 'People',
    unit: 'million people',
    decimals: 1,
    latest: 284.4,
    latestPeriod: 'mid-2025 estimate',
    source: 'BPS',
    definition: 'All residents usually living in Indonesia, mid-year.',
    method:
      'Intercensal estimates benchmarked to the 2020 Population Census (270.20 million, ' +
      'September 2020) and the official BPS population projection.',
    series: [
      [2015, 255.5], [2016, 258.7], [2017, 261.9], [2018, 265.0], [2019, 268.1],
      [2020, 270.2], [2021, 272.7], [2022, 275.8], [2023, 278.7], [2024, 281.6],
      [2025, 284.4],
    ],
  },
  {
    id: 'gdp',
    name: 'Gross Domestic Product',
    category: 'Economy',
    unit: 'US$ billion, current prices',
    decimals: 0,
    latest: 1396,
    latestPeriod: '2024',
    source: 'World Bank (WDI)',
    definition: 'Total value added of the economy, converted at market exchange rates.',
    method:
      'World Bank World Development Indicators, series NY.GDP.MKTP.CD, built from BPS ' +
      'national accounts in rupiah and the annual average exchange rate.',
    series: [
      [2015, 861], [2016, 932], [2017, 1016], [2018, 1042], [2019, 1119],
      [2020, 1059], [2021, 1186], [2022, 1319], [2023, 1371], [2024, 1396],
    ],
  },
  {
    id: 'gdp-growth',
    name: 'Economic Growth (real GDP)',
    category: 'Economy',
    unit: '% per year',
    decimals: 2,
    latest: 5.03,
    latestPeriod: '2024 (Q3 2025: 5.04% year on year)',
    source: 'BPS',
    definition: 'Annual change in real GDP at constant 2010 prices.',
    method:
      'BPS national accounts, expenditure and production approaches reconciled quarterly; ' +
      'the annual figure is the sum of the four quarters.',
    series: [
      [2015, 4.88], [2016, 5.03], [2017, 5.07], [2018, 5.17], [2019, 5.02],
      [2020, -2.07], [2021, 3.70], [2022, 5.31], [2023, 5.05], [2024, 5.03],
    ],
  },
  {
    id: 'gdp-per-capita',
    name: 'GDP per Capita',
    category: 'Economy',
    unit: 'US$, current prices',
    decimals: 0,
    latest: 4920,
    latestPeriod: '2024',
    source: 'World Bank (WDI); BPS: Rp78.6 million in 2024',
    definition: 'GDP divided by the mid-year population.',
    method:
      'World Bank WDI series NY.GDP.PCAP.CD. BPS publishes the same concept in rupiah: ' +
      'Rp78.6 million per person in 2024 (US$4,919.7 at the average rate it cites).',
    series: [
      [2015, 3367], [2016, 3603], [2017, 3885], [2018, 3932], [2019, 4175],
      [2020, 3919], [2021, 4349], [2022, 4798], [2023, 4784], [2024, 4920],
    ],
  },
  {
    id: 'inflation',
    name: 'Inflation (consumer prices)',
    category: 'Prices & Jobs',
    unit: '% year on year, December',
    decimals: 2,
    latest: 1.57,
    latestPeriod: 'December 2024 (October 2025: 2.86% year on year)',
    source: 'BPS',
    definition: 'Change in the consumer price index over twelve months.',
    method:
      'BPS CPI from price collection in 150 cities, basket of the 2022 Cost of Living ' +
      'Survey; the series here is the December year-on-year rate of each year.',
    series: [
      [2015, 3.35], [2016, 3.02], [2017, 3.61], [2018, 3.13], [2019, 2.72],
      [2020, 1.68], [2021, 1.87], [2022, 5.51], [2023, 2.61], [2024, 1.57],
    ],
  },
  {
    id: 'unemployment',
    name: 'Open Unemployment Rate',
    category: 'Prices & Jobs',
    unit: '% of the labour force, August',
    decimals: 2,
    latest: 4.85,
    latestPeriod: 'August 2025',
    source: 'BPS (Sakernas)',
    definition: 'Share of the labour force without work but available for and seeking it.',
    method:
      'National Labour Force Survey (Sakernas), August round each year; BPS reported ' +
      '4.91% for August 2024 and 4.85% for August 2025.',
    series: [
      [2015, 6.18], [2016, 5.61], [2017, 5.50], [2018, 5.34], [2019, 5.23],
      [2020, 7.07], [2021, 6.49], [2022, 5.86], [2023, 5.32], [2024, 4.91],
      [2025, 4.85],
    ],
  },
  {
    id: 'poverty',
    name: 'Poverty Rate',
    category: 'People',
    unit: '% of population, March',
    decimals: 2,
    latest: 8.47,
    latestPeriod: 'March 2025 (23.85 million people)',
    source: 'BPS (Susenas)',
    definition: 'Share of people with monthly spending per person below the poverty line.',
    method:
      'National Socio-Economic Survey (Susenas), March round; the poverty line covers a ' +
      '2,100 kcal food basket plus essential non-food needs, priced per province.',
    series: [
      [2015, 11.13], [2016, 10.86], [2017, 10.12], [2018, 9.82], [2019, 9.41],
      [2020, 9.78], [2021, 10.14], [2022, 9.54], [2023, 9.36], [2024, 9.03],
      [2025, 8.47],
    ],
  },
  {
    id: 'life-expectancy',
    name: 'Life Expectancy at Birth',
    category: 'People',
    unit: 'years',
    decimals: 1,
    latest: 71.2,
    latestPeriod: '2023',
    source: 'World Bank (WDI)',
    definition: 'Years a newborn would live at today\u2019s age-specific mortality rates.',
    method:
      'World Bank WDI series SP.DYN.LE00.IN, from UN population estimates and national ' +
      'life tables; the dip in 2021 is the pandemic\u2019s excess mortality.',
    series: [
      [2015, 69.2], [2016, 69.5], [2017, 69.7], [2018, 69.9], [2019, 70.2],
      [2020, 70.0], [2021, 68.9], [2022, 70.3], [2023, 71.2],
    ],
  },
  {
    id: 'gini',
    name: 'Gini Ratio of Expenditure',
    category: 'People',
    unit: 'index 0\u20131, March',
    decimals: 3,
    latest: 0.379,
    latestPeriod: 'March 2024',
    source: 'BPS (Susenas)',
    definition: 'Inequality of household spending per person: 0 is perfect equality.',
    method:
      'Computed by BPS from Susenas consumption expenditure, March round; expenditure, ' +
      'not income, so it reads lower than income-based Gini figures.',
    series: [
      [2015, 0.408], [2016, 0.397], [2017, 0.393], [2018, 0.389], [2019, 0.380],
      [2020, 0.381], [2021, 0.384], [2022, 0.381], [2023, 0.388], [2024, 0.379],
    ],
  },
  {
    id: 'internet',
    name: 'Internet Use',
    category: 'Society & Access',
    unit: '% of population using the internet',
    decimals: 1,
    latest: 69.2,
    latestPeriod: '2023',
    source: 'World Bank (WDI) / ITU',
    definition: 'People who used the internet from any device in the last three months.',
    method:
      'ITU estimates compiled in the World Bank WDI, series IT.NET.USER.ZS, based on ' +
      'national surveys and operator data.',
    series: [
      [2015, 22.0], [2016, 25.4], [2017, 32.3], [2018, 39.9], [2019, 47.7],
      [2020, 53.7], [2021, 62.1], [2022, 66.5], [2023, 69.2],
    ],
  },
  {
    id: 'exports',
    name: 'Exports of Goods',
    category: 'Trade & Tourism',
    unit: 'US$ billion, fob',
    decimals: 1,
    latest: 264.7,
    latestPeriod: '2024',
    source: 'BPS (customs records)',
    definition: 'Merchandise exports, free on board, oil and gas included.',
    method:
      'Compiled by BPS from customs declarations (PEB); the 2022 peak is the coal and ' +
      'palm-oil price boom, the 2023 fall its unwind.',
    series: [
      [2015, 150.3], [2016, 145.2], [2017, 168.8], [2018, 180.0], [2019, 167.5],
      [2020, 163.2], [2021, 231.6], [2022, 291.9], [2023, 258.8], [2024, 264.7],
    ],
  },
  {
    id: 'tourism',
    name: 'International Visitor Arrivals',
    category: 'Trade & Tourism',
    unit: 'million arrivals',
    decimals: 1,
    latest: 13.9,
    latestPeriod: '2024',
    source: 'BPS (immigration records)',
    definition: 'Foreign visitors entering Indonesia through all gates, all purposes.',
    method:
      'BPS count of immigration entry records; 2020\u20132021 is the pandemic border ' +
      'closure, and 2024 (13.90 million) is still below the 2019 record of 16.11 million.',
    series: [
      [2015, 10.4], [2016, 11.5], [2017, 14.0], [2018, 15.8], [2019, 16.1],
      [2020, 4.1], [2021, 1.6], [2022, 5.5], [2023, 11.7], [2024, 13.9],
    ],
  },
];

export const CATEGORIES = ['People', 'Economy', 'Prices & Jobs', 'Society & Access', 'Trade & Tourism'];

// All 38 provinces: capital, and mid-2024 population in millions (BPS mid-year
// estimates, rounded to one decimal). Shares are computed by the site.
export const PROVINCES = [
  { name: 'Aceh', capital: 'Banda Aceh', pop: 5.6 },
  { name: 'Sumatera Utara', capital: 'Medan', pop: 15.6 },
  { name: 'Sumatera Barat', capital: 'Padang', pop: 5.9 },
  { name: 'Riau', capital: 'Pekanbaru', pop: 6.7 },
  { name: 'Jambi', capital: 'Jambi', pop: 3.7 },
  { name: 'Sumatera Selatan', capital: 'Palembang', pop: 8.8 },
  { name: 'Bengkulu', capital: 'Bengkulu', pop: 2.1 },
  { name: 'Lampung', capital: 'Bandar Lampung', pop: 9.4 },
  { name: 'Kepulauan Bangka Belitung', capital: 'Pangkal Pinang', pop: 1.5 },
  { name: 'Kepulauan Riau', capital: 'Tanjung Pinang', pop: 2.2 },
  { name: 'DKI Jakarta', capital: 'Jakarta', pop: 10.6 },
  { name: 'Jawa Barat', capital: 'Bandung', pop: 50.0 },
  { name: 'Jawa Tengah', capital: 'Semarang', pop: 38.3 },
  { name: 'DI Yogyakarta', capital: 'Yogyakarta', pop: 3.8 },
  { name: 'Jawa Timur', capital: 'Surabaya', pop: 41.8 },
  { name: 'Banten', capital: 'Serang', pop: 12.4 },
  { name: 'Bali', capital: 'Denpasar', pop: 4.4 },
  { name: 'Nusa Tenggara Barat', capital: 'Mataram', pop: 5.6 },
  { name: 'Nusa Tenggara Timur', capital: 'Kupang', pop: 5.7 },
  { name: 'Kalimantan Barat', capital: 'Pontianak', pop: 5.8 },
  { name: 'Kalimantan Tengah', capital: 'Palangka Raya', pop: 2.8 },
  { name: 'Kalimantan Selatan', capital: 'Banjarmasin', pop: 4.3 },
  { name: 'Kalimantan Timur', capital: 'Samarinda', pop: 3.9 },
  { name: 'Kalimantan Utara', capital: 'Tanjung Selor', pop: 0.7 },
  { name: 'Sulawesi Utara', capital: 'Manado', pop: 2.7 },
  { name: 'Sulawesi Tengah', capital: 'Palu', pop: 3.2 },
  { name: 'Sulawesi Selatan', capital: 'Makassar', pop: 9.5 },
  { name: 'Sulawesi Tenggara', capital: 'Kendari', pop: 2.8 },
  { name: 'Gorontalo', capital: 'Gorontalo', pop: 1.3 },
  { name: 'Sulawesi Barat', capital: 'Mamuju', pop: 1.5 },
  { name: 'Maluku', capital: 'Ambon', pop: 2.0 },
  { name: 'Maluku Utara', capital: 'Sofifi', pop: 1.4 },
  { name: 'Papua Barat', capital: 'Manokwari', pop: 0.6 },
  { name: 'Papua Barat Daya', capital: 'Sorong', pop: 0.6 },
  { name: 'Papua', capital: 'Jayapura', pop: 1.1 },
  { name: 'Papua Selatan', capital: 'Merauke', pop: 0.5 },
  { name: 'Papua Tengah', capital: 'Nabire', pop: 1.4 },
  { name: 'Papua Pegunungan', capital: 'Wamena', pop: 1.4 },
];

// The publishers behind the figures, for the About page's source list.
export const PUBLISHERS = [
  {
    name: 'Badan Pusat Statistik (BPS)',
    role: 'Indonesia\u2019s national statistics office. Publishes the census, national accounts, CPI, labour force (Sakernas) and household (Susenas) surveys behind most series here.',
  },
  {
    name: 'World Bank — World Development Indicators',
    role: 'The WDI database republishes national series in comparable form (GDP in US dollars, life expectancy, internet use) from national sources and the ITU/UN.',
  },
];
