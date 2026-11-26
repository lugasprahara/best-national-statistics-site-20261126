// NusaData content: every figure the site shows lives in this file.
//
// Two publishers are used, and each series names its own:
//   BPS  — Statistics Indonesia (Badan Pusat Statistik), the national
//          statistical office. Its mid-year population estimates, national
//          accounts, labour force survey (Sakernas), household survey
//          (Susenas) and foreign trade statistics.
//   WB   — the World Bank's World Development Indicators, which republish
//          national series in US dollars and in comparable form.
//
// A "series" is a list of [year, value] pairs in the indicator's own unit.
// "latestNote" records the freshest published reading where it is newer
// than the last annual point (a quarter or a month), so the detail page
// can show it without bending the annual series out of shape.

export const SITE = {
  name: 'NusaData',
  country: 'Indonesia',
  tagline: 'Indonesia in Numbers',
  blurb:
    'The headline statistics of the Republic of Indonesia — people, economy, prices, work and wellbeing — ' +
    'each figure with the publisher and period it belongs to, drawn from BPS (Statistics Indonesia) and ' +
    'the World Bank.',
  updated: 'November 2026',
};

export const CATEGORIES = ['People', 'Economy', 'Prices & work', 'Wellbeing', 'Trade & travel', 'Digital'];

export const INDICATORS = [
  {
    id: 'population',
    name: 'Population',
    category: 'People',
    unit: 'million people',
    decimals: 1,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'Mid-year estimate',
    definition:
      'Everyone usually resident in Indonesia on 1 July of the year shown. BPS builds the mid-year ' +
      'estimates from the population censuses (the 2020 census counted 270.2 million people in ' +
      'September 2020) and the intercensal surveys between them.',
    method:
      'Census counts are carried forward with registered births, deaths and migration, and checked ' +
      'against the intercensal population survey (SUPAS). Figures are revised when a new census lands.',
    series: [
      [2015, 255.2], [2016, 258.7], [2017, 261.9], [2018, 265.0], [2019, 266.9],
      [2020, 270.2], [2021, 272.7], [2022, 275.8], [2023, 278.7], [2024, 281.6],
    ],
    latestNote: 'Mid-2025 estimate: 284.4 million (BPS projection series).',
  },
  {
    id: 'gdp-growth',
    name: 'Economic growth (GDP)',
    category: 'Economy',
    unit: '% per year',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'Annual, constant prices',
    definition:
      'The yearly change in gross domestic product at constant 2010 prices: how much more the economy ' +
      'produced than the year before, with price changes stripped out. The pandemic contraction of 2020 ' +
      '(-2.07%) is the only negative year in this series.',
    method:
      'BPS compiles GDP from the production side (17 industries) and the expenditure side (household ' +
      'consumption, investment, government, exports and imports) and reconciles the two each quarter.',
    series: [
      [2015, 4.88], [2016, 5.03], [2017, 5.07], [2018, 5.17], [2019, 5.02],
      [2020, -2.07], [2021, 3.70], [2022, 5.31], [2023, 5.05], [2024, 5.03],
    ],
    latestNote: 'Growth in the third quarter of 2025 was 5.04% year on year (BPS).',
  },
  {
    id: 'gdp-total',
    name: 'GDP, total',
    category: 'Economy',
    unit: 'US$ billion',
    decimals: 1,
    source: 'World Bank — World Development Indicators',
    sourceShort: 'World Bank',
    period: 'Annual, current US$',
    definition:
      'The size of the whole economy in current US dollars: Indonesia is the largest economy in ' +
      'Southeast Asia and a member of the trillion-dollar club since 2017. Dollar values move with the ' +
      'rupiah exchange rate as well as with real growth.',
    method:
      'The World Bank converts BPS national accounts from rupiah at the period-average official ' +
      'exchange rate. Use the growth series, not this one, to judge how fast the economy itself expanded.',
    series: [
      [2015, 860.9], [2016, 931.9], [2017, 1015.6], [2018, 1042.3], [2019, 1119.1],
      [2020, 1059.3], [2021, 1186.5], [2022, 1319.1], [2023, 1371.2], [2024, 1396.3],
    ],
    latestNote: 'BPS puts 2024 GDP at Rp 22,139 trillion at current prices.',
  },
  {
    id: 'gdp-per-capita',
    name: 'GDP per capita',
    category: 'Economy',
    unit: 'US$ per person',
    decimals: 0,
    source: 'World Bank — World Development Indicators',
    sourceShort: 'World Bank',
    period: 'Annual, current US$',
    definition:
      'Total GDP divided by the mid-year population — the average economic output behind each ' +
      'Indonesian. Indonesia sits in the World Bank\'s upper-middle-income group; the average hides a ' +
      'wide spread between Jakarta and the eastern provinces.',
    method:
      'Computed by the World Bank from its GDP and population series. BPS publishes the same concept ' +
      'in rupiah: Rp 78.6 million per person in 2024.',
    series: [
      [2015, 3368], [2016, 3605], [2017, 3885], [2018, 3927], [2019, 4151],
      [2020, 3896], [2021, 4334], [2022, 4783], [2023, 4919], [2024, 4981],
    ],
    latestNote: 'Upper-middle-income threshold (World Bank, FY2026): US$ 4,496 — Indonesia is above it.',
  },
  {
    id: 'inflation',
    name: 'Inflation (CPI)',
    category: 'Prices & work',
    unit: '% year on year',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'December, year on year',
    definition:
      'How much more a fixed basket of consumer goods and services cost in December than a year ' +
      'earlier. Bank Indonesia targets 2.5% ± 1%; the 2022 spike to 5.51% followed the subsidised fuel ' +
      'price rise of September that year.',
    method:
      'BPS price collectors record some 400 items monthly in 150 cities. The basket weights come from ' +
      'the cost-of-living survey and are refreshed with each rebasing of the index.',
    series: [
      [2015, 3.35], [2016, 3.02], [2017, 3.61], [2018, 3.13], [2019, 2.72],
      [2020, 1.68], [2021, 1.87], [2022, 5.51], [2023, 2.61], [2024, 1.57],
    ],
    latestNote: 'October 2025 inflation was 2.86% year on year (BPS).',
  },
  {
    id: 'unemployment',
    name: 'Unemployment rate',
    category: 'Prices & work',
    unit: '% of labour force',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'August round',
    definition:
      'The share of the labour force without work but available for and seeking it, measured each ' +
      'August. The rate spiked to 7.07% in the pandemic August of 2020 and fell to a record low of ' +
      '4.91% in August 2024 — about 7.5 million people.',
    method:
      'From Sakernas, the National Labour Force Survey, which interviews roughly 300,000 households ' +
      'each August. BPS also runs a smaller February round; this series follows August throughout.',
    series: [
      [2015, 6.18], [2016, 5.61], [2017, 5.50], [2018, 5.34], [2019, 5.23],
      [2020, 7.07], [2021, 6.49], [2022, 5.86], [2023, 5.32], [2024, 4.91],
    ],
    latestNote: 'The August 2025 round is the next reading in this series.',
  },
  {
    id: 'poverty',
    name: 'Poverty rate',
    category: 'Wellbeing',
    unit: '% of population',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'March round',
    definition:
      'The share of Indonesians whose monthly spending falls below the poverty line — the cost of a ' +
      'basic food basket of 2,100 kcal a day plus essential non-food needs. In March 2025 the rate ' +
      'reached 8.47%, the lowest BPS has recorded, about 24 million people.',
    method:
      'From Susenas, the National Socioeconomic Survey, each March. The poverty line is priced ' +
      'separately for urban and rural areas of every province, so the headcount follows local prices.',
    series: [
      [2015, 11.22], [2016, 10.86], [2017, 10.64], [2018, 9.82], [2019, 9.41],
      [2020, 9.78], [2021, 10.14], [2022, 9.54], [2023, 9.36], [2024, 9.03], [2025, 8.47],
    ],
    latestNote: 'March 2025: 8.47% — the first reading below 9% in this series.',
  },
  {
    id: 'gini',
    name: 'Gini ratio',
    category: 'Wellbeing',
    unit: 'ratio, 0–1',
    decimals: 3,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'March round',
    definition:
      'A summary of how unevenly spending is shared: 0 would mean everyone spends the same, 1 that ' +
      'one household spends everything. Indonesia\'s ratio has drifted down from 0.408 in 2015 to ' +
      '0.379 in March 2024 — inequality is narrowing slowly, and is higher in cities than in villages.',
    method:
      'Computed by BPS from the distribution of per-capita household expenditure in Susenas. ' +
      'Expenditure, not income, is used because households report it more reliably.',
    series: [
      [2015, 0.408], [2016, 0.397], [2017, 0.393], [2018, 0.389], [2019, 0.380],
      [2020, 0.381], [2021, 0.384], [2022, 0.381], [2023, 0.388], [2024, 0.379],
    ],
    latestNote: 'Urban Gini in March 2024: 0.399; rural: 0.297 (BPS).',
  },
  {
    id: 'life-expectancy',
    name: 'Life expectancy',
    category: 'Wellbeing',
    unit: 'years',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'Annual estimate',
    definition:
      'How long a newborn Indonesian would live if today\'s mortality pattern held for their whole ' +
      'life. The figure has risen by about a year and a half over this series, to 72.39 years in 2024; ' +
      'women outlive men by roughly four years.',
    method:
      'BPS builds life tables from census and survey mortality data, smoothed across ages. The ' +
      'estimate is one of the three components of Indonesia\'s Human Development Index (IPM).',
    series: [
      [2015, 70.78], [2016, 70.90], [2017, 71.06], [2018, 71.20], [2019, 71.34],
      [2020, 71.47], [2021, 71.57], [2022, 71.85], [2023, 72.13], [2024, 72.39],
    ],
    latestNote: 'BPS Human Development Index (IPM) 2024: 75.02 of 100.',
  },
  {
    id: 'exports',
    name: 'Exports of goods',
    category: 'Trade & travel',
    unit: 'US$ billion',
    decimals: 1,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'Annual, customs basis',
    definition:
      'Everything Indonesia sold abroad, from coal, palm oil and nickel products to electronics and ' +
      'footwear. Exports peaked at US$ 291.9 billion in the commodity boom of 2022 and settled at ' +
      'US$ 264.7 billion in 2024; China, the United States and India are the biggest buyers.',
    method:
      'Compiled by BPS from customs declarations (exports free on board). Oil and gas are included; ' +
      'services such as tourism are counted in the balance of payments instead.',
    series: [
      [2015, 150.4], [2016, 145.2], [2017, 168.8], [2018, 180.2], [2019, 167.7],
      [2020, 163.2], [2021, 231.5], [2022, 291.9], [2023, 258.8], [2024, 264.7],
    ],
    latestNote: 'Indonesia has run a monthly trade surplus every month since May 2020.',
  },
  {
    id: 'tourists',
    name: 'International visitors',
    category: 'Trade & travel',
    unit: 'million visits',
    decimals: 2,
    source: 'BPS — Statistics Indonesia',
    sourceShort: 'BPS',
    period: 'Annual arrivals',
    definition:
      'Foreign visitors arriving through Indonesia\'s entry points — Bali\'s Ngurah Rai airport first ' +
      'among them. Arrivals collapsed from 16.11 million in 2019 to 1.56 million in 2021 under border ' +
      'closures, and had recovered to 13.90 million by 2024.',
    method:
      'Counted from immigration records at airports, seaports and land borders, and published by BPS ' +
      'with the tourism satellite statistics. Same-day and border-crossing visits follow the ' +
      'international visitor definition.',
    series: [
      [2015, 10.41], [2016, 11.52], [2017, 14.04], [2018, 15.81], [2019, 16.11],
      [2020, 4.05], [2021, 1.56], [2022, 5.47], [2023, 11.68], [2024, 13.90],
    ],
    latestNote: 'Bali alone received about 6.3 million of the 2024 arrivals.',
  },
  {
    id: 'internet-users',
    name: 'Internet users',
    category: 'Digital',
    unit: '% of population',
    decimals: 1,
    source: 'World Bank — World Development Indicators',
    sourceShort: 'World Bank',
    period: 'Annual estimate',
    definition:
      'The share of Indonesians who used the internet in the last three months, from any device. ' +
      'Seven in ten people were online by 2023, up from barely two in ten in 2015 — almost all of ' +
      'them on a phone, which is why this site is built to be read on one.',
    method:
      'The World Bank republishes the International Telecommunication Union\'s estimates, which BPS ' +
      'feeds with its household survey data on access and use.',
    series: [
      [2015, 22.0], [2016, 25.4], [2017, 32.3], [2018, 39.9], [2019, 47.7],
      [2020, 53.7], [2021, 62.1], [2022, 66.5], [2023, 69.2],
    ],
    latestNote: 'The Indonesian internet providers\' association (APJII) surveyed 79.5% penetration in 2024, on its own definition.',
  },
];

// The 38 provinces, grouped by island region, with BPS mid-2024 population
// estimates in millions (rounded to two decimals; the rounded figures sum
// to about the national mid-2024 estimate of 281.6 million).
export const PROVINCES = [
  { name: 'Aceh', capital: 'Banda Aceh', region: 'Sumatra', pop: 5.55 },
  { name: 'North Sumatra', capital: 'Medan', region: 'Sumatra', pop: 15.59 },
  { name: 'West Sumatra', capital: 'Padang', region: 'Sumatra', pop: 5.84 },
  { name: 'Riau', capital: 'Pekanbaru', region: 'Sumatra', pop: 6.73 },
  { name: 'Jambi', capital: 'Jambi City', region: 'Sumatra', pop: 3.72 },
  { name: 'South Sumatra', capital: 'Palembang', region: 'Sumatra', pop: 8.84 },
  { name: 'Bengkulu', capital: 'Bengkulu City', region: 'Sumatra', pop: 2.11 },
  { name: 'Lampung', capital: 'Bandar Lampung', region: 'Sumatra', pop: 9.42 },
  { name: 'Bangka Belitung Islands', capital: 'Pangkal Pinang', region: 'Sumatra', pop: 1.53 },
  { name: 'Riau Islands', capital: 'Tanjung Pinang', region: 'Sumatra', pop: 2.18 },
  { name: 'Jakarta', capital: 'Jakarta', region: 'Java', pop: 10.56 },
  { name: 'West Java', capital: 'Bandung', region: 'Java', pop: 49.94 },
  { name: 'Central Java', capital: 'Semarang', region: 'Java', pop: 37.89 },
  { name: 'Yogyakarta', capital: 'Yogyakarta City', region: 'Java', pop: 3.76 },
  { name: 'East Java', capital: 'Surabaya', region: 'Java', pop: 41.81 },
  { name: 'Banten', capital: 'Serang', region: 'Java', pop: 12.43 },
  { name: 'Bali', capital: 'Denpasar', region: 'Bali & Nusa Tenggara', pop: 4.29 },
  { name: 'West Nusa Tenggara', capital: 'Mataram', region: 'Bali & Nusa Tenggara', pop: 5.65 },
  { name: 'East Nusa Tenggara', capital: 'Kupang', region: 'Bali & Nusa Tenggara', pop: 5.66 },
  { name: 'West Kalimantan', capital: 'Pontianak', region: 'Kalimantan', pop: 5.87 },
  { name: 'Central Kalimantan', capital: 'Palangka Raya', region: 'Kalimantan', pop: 2.81 },
  { name: 'South Kalimantan', capital: 'Banjarmasin', region: 'Kalimantan', pop: 4.27 },
  { name: 'East Kalimantan', capital: 'Samarinda', region: 'Kalimantan', pop: 3.96 },
  { name: 'North Kalimantan', capital: 'Tanjung Selor', region: 'Kalimantan', pop: 0.74 },
  { name: 'North Sulawesi', capital: 'Manado', region: 'Sulawesi', pop: 2.70 },
  { name: 'Central Sulawesi', capital: 'Palu', region: 'Sulawesi', pop: 3.12 },
  { name: 'South Sulawesi', capital: 'Makassar', region: 'Sulawesi', pop: 9.46 },
  { name: 'Southeast Sulawesi', capital: 'Kendari', region: 'Sulawesi', pop: 2.84 },
  { name: 'Gorontalo', capital: 'Gorontalo City', region: 'Sulawesi', pop: 1.23 },
  { name: 'West Sulawesi', capital: 'Mamuju', region: 'Sulawesi', pop: 1.53 },
  { name: 'Maluku', capital: 'Ambon', region: 'Maluku & Papua', pop: 1.95 },
  { name: 'North Maluku', capital: 'Sofifi', region: 'Maluku & Papua', pop: 1.36 },
  { name: 'West Papua', capital: 'Manokwari', region: 'Maluku & Papua', pop: 0.58 },
  { name: 'Southwest Papua', capital: 'Sorong', region: 'Maluku & Papua', pop: 0.61 },
  { name: 'Papua', capital: 'Jayapura', region: 'Maluku & Papua', pop: 1.09 },
  { name: 'South Papua', capital: 'Merauke', region: 'Maluku & Papua', pop: 0.54 },
  { name: 'Central Papua', capital: 'Nabire', region: 'Maluku & Papua', pop: 1.36 },
  { name: 'Highland Papua', capital: 'Wamena', region: 'Maluku & Papua', pop: 1.46 },
];

export const REGIONS = ['Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

export const PUBLISHERS = [
  {
    name: 'BPS — Statistics Indonesia',
    role:
      'The national statistical office (Badan Pusat Statistik). It runs the population and economic ' +
      'censuses, the Sakernas labour force survey, the Susenas household survey, the consumer price ' +
      'survey and the customs-based trade statistics quoted here, and publishes them as Berita Resmi ' +
      'Statistik (official statistical releases).',
  },
  {
    name: 'World Bank — World Development Indicators',
    role:
      'The World Bank\'s comparable cross-country database. It republishes BPS national accounts in ' +
      'current US dollars and carries the ITU internet-use estimates, so a reader can set Indonesia ' +
      'beside its neighbours on the same definitions.',
  },
];
