const CANONICAL_HOST = 'philosophyspread.live';

export function GET({ url }: { url: URL }) {
  const isCanonicalHost = url.hostname === CANONICAL_HOST;
  const body = isCanonicalHost
    ? `User-agent: *\nAllow: /\n\nSitemap: https://${CANONICAL_HOST}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
