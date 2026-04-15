import { getCollection, type CollectionEntry } from 'astro:content';

const SITE_URL = 'https://philosophyspread.live';
const ESSAYS_PAGE_SIZE = 9;
const BITS_PAGE_SIZE = 12;
const MODULES_PAGE_SIZE = 4;

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const toAbsolute = (pathname: string) => new URL(pathname, SITE_URL).toString();

const parseDate = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate.toISOString();
};

const buildUrlTag = ({ loc, lastmod }: SitemapEntry) => {
  const lines = ['  <url>', `    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }
  lines.push('  </url>');

  return lines.join('\n');
};

const latestDate = (values: string[]): string | undefined => {
  if (!values.length) {
    return undefined;
  }

  return values.reduce((latest, current) =>
    new Date(current).valueOf() > new Date(latest).valueOf() ? current : latest,
  );
};

const buildPaginationEntries = (
  basePath: string,
  totalItems: number,
  pageSize: number,
  lastmod?: string,
): SitemapEntry[] => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return Array.from({ length: totalPages }, (_, index) => ({
    loc: toAbsolute(`${basePath}/page/${index + 1}`),
    lastmod,
  }));
};

const buildDetailEntries = <T extends string>(
  items: CollectionEntry<T>[],
  basePath: string,
  getLastMod?: (entry: CollectionEntry<T>) => string | undefined,
) =>
  items.map((entry) => ({
    loc: toAbsolute(`${basePath}/${entry.id}`),
    lastmod: getLastMod?.(entry),
  }));

export async function GET() {
  const [essays, bits, modules, pages] = await Promise.all([
    getCollection('essays'),
    getCollection('bits'),
    getCollection('logicModules'),
    getCollection('pages'),
  ]);

  const termsPage = pages.find((entry) => entry.id === 'terms');
  const contributePage = pages.find((entry) => entry.id === 'contribute');

  const staticEntries: SitemapEntry[] = [
    { loc: toAbsolute('/') },
    {
      loc: toAbsolute('/terms'),
      lastmod: parseDate(termsPage?.data.lastUpdated),
    },
    {
      loc: toAbsolute('/contribute'),
      lastmod: parseDate(contributePage?.data.lastUpdated),
    },
    {
      loc: toAbsolute('/authors'),
      lastmod: parseDate(pages.find((entry: CollectionEntry<'pages'>) => entry.id === 'authors')?.data.lastUpdated),
    },
  ];

  const essayDates = essays
    .map((entry) => parseDate(entry.data.pubDate))
    .filter((date): date is string => Boolean(date));
  const bitDates = bits
    .map((entry) => parseDate(entry.data.timestamp))
    .filter((date): date is string => Boolean(date));

  const entries: SitemapEntry[] = [
    ...staticEntries,
    ...buildPaginationEntries('/essays', essays.length, ESSAYS_PAGE_SIZE, latestDate(essayDates)),
    ...buildPaginationEntries('/bits', bits.length, BITS_PAGE_SIZE, latestDate(bitDates)),
    ...buildPaginationEntries('/logic-modules', modules.length, MODULES_PAGE_SIZE),
    ...buildDetailEntries(essays, '/essays', (entry) => parseDate(entry.data.pubDate)),
    ...buildDetailEntries(bits, '/bits', (entry) => parseDate(entry.data.timestamp)),
    ...buildDetailEntries(modules, '/logic-modules'),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(buildUrlTag),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
