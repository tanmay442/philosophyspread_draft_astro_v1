import { getCollection, type CollectionEntry } from 'astro:content';

const ESSAYS_PAGE_SIZE = 9;
const BITS_PAGE_SIZE = 12;
const MODULES_PAGE_SIZE = 4;
const SITE_URL = 'https://philosophyspread.live';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

function parseDate(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }

  return date.toISOString();
}

function toAbsolute(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

function buildUrlTag(entry: SitemapEntry): string {
  const escapedLoc = entry.loc
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

  const escapedLastMod = entry.lastmod
    ? entry.lastmod
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;')
    : undefined;

  return [
    '  <url>',
    `    <loc>${escapedLoc}</loc>`,
    escapedLastMod ? `    <lastmod>${escapedLastMod}</lastmod>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function latestDate(entries: string[]): string | undefined {
  if (entries.length === 0) {
    return undefined;
  }

  return entries
    .sort((a, b) => new Date(b).valueOf() - new Date(a).valueOf())[0];
}

function buildPaginationEntries(
  basePath: string,
  totalItems: number,
  pageSize: number,
  pageLastMod?: string,
): SitemapEntry[] {
  const pages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Array.from({ length: pages }, (_, index) => {
    const page = index + 1;
    return {
      loc: toAbsolute(`${basePath}/page/${page}`),
      lastmod: pageLastMod,
    };
  });
}

export async function GET() {
  const [essays, bits, modules, pages] = await Promise.all([
    getCollection('essays'),
    getCollection('bits'),
    getCollection('logicModules'),
    getCollection('pages'),
  ]);

  const staticEntries: SitemapEntry[] = [
    { loc: toAbsolute('/') },
    {
      loc: toAbsolute('/terms'),
      lastmod: parseDate(pages.find((entry: CollectionEntry<'pages'>) => entry.id === 'terms')?.data.lastUpdated),
    },
    {
      loc: toAbsolute('/contribute'),
      lastmod: parseDate(pages.find((entry: CollectionEntry<'pages'>) => entry.id === 'contribute')?.data.lastUpdated),
    },
  ];

  const essayDates = essays
    .map((entry: CollectionEntry<'essays'>) => parseDate(entry.data.pubDate))
    .filter((value): value is string => Boolean(value));
  const bitDates = bits
    .map((entry: CollectionEntry<'bits'>) => parseDate(entry.data.timestamp))
    .filter((value): value is string => Boolean(value));

  const essayPaginationEntries = buildPaginationEntries('/essays', essays.length, ESSAYS_PAGE_SIZE, latestDate(essayDates));
  const bitPaginationEntries = buildPaginationEntries('/bits', bits.length, BITS_PAGE_SIZE, latestDate(bitDates));
  const modulePaginationEntries = buildPaginationEntries('/logic-modules', modules.length, MODULES_PAGE_SIZE);

  const essayEntries: SitemapEntry[] = essays.map((entry: CollectionEntry<'essays'>) => ({
    loc: toAbsolute(`/essays/${entry.id}`),
    lastmod: parseDate(entry.data.pubDate),
  }));

  const bitEntries: SitemapEntry[] = bits.map((entry: CollectionEntry<'bits'>) => ({
    loc: toAbsolute(`/bits/${entry.id}`),
    lastmod: parseDate(entry.data.timestamp),
  }));

  const moduleEntries: SitemapEntry[] = modules.map((entry: CollectionEntry<'logicModules'>) => ({
    loc: toAbsolute(`/logic-modules/${entry.id}`),
  }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[
      ...staticEntries,
      ...essayPaginationEntries,
      ...bitPaginationEntries,
      ...modulePaginationEntries,
      ...essayEntries,
      ...bitEntries,
      ...moduleEntries,
    ].map(buildUrlTag),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
