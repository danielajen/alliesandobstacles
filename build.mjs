// Builds the static site into dist/. No dependencies — just Node 18+.
//   node build.mjs
//
// Environment (set automatically by the GitHub Pages workflow):
//   SITE_URL   public origin + path, e.g. https://alliesandobstacles.com
//              or https://user.github.io/alliesandobstacles
//   BASE_PATH  path the site is served from, e.g. / or /alliesandobstacles/
import { rm, mkdir, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { site } from './content/site.mjs';

const OUT = 'dist';
const BASE = ('/' + (process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');
// GitHub Pages can report http:// for a custom domain even with HTTPS enforced; public URLs are always https.
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/+$/, '').replace(/^http:\/\/(?!localhost|127\.)/, 'https://');

const { layout } = await import('./src/layout.mjs');
const { allPages, setFileCheck } = await import('./src/pages.mjs');

const missing = new Set();
setFileCheck((file) => {
  const ok = existsSync(join('assets', file));
  if (!ok) missing.add(file);
  return ok;
});

// Root-relative links ("/books/…") are written as if the site lives at "/".
// When it's served from a sub-path (a GitHub project page), prefix them.
const rebase = (html) => (BASE === '/' ? html : html.replace(/(\s(?:href|src|action)=")\/(?!\/)/g, `$1${BASE}`));

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp('assets', join(OUT, 'assets'), { recursive: true, filter: (src) => !src.endsWith('.gitkeep') && !src.endsWith('.DS_Store') });
await cp('static', OUT, { recursive: true, filter: (src) => !src.endsWith('.gitkeep') });

const pages = allPages();
for (const p of pages) {
  const file = p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, rebase(layout(p)));
}

const urls = pages.filter((p) => !p.path.endsWith('.html'));
await writeFile(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((p) => `  <url><loc>${site.url}${p.path}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(join(OUT, '.nojekyll'), '');
if (process.env.CUSTOM_DOMAIN) await writeFile(join(OUT, 'CNAME'), `${process.env.CUSTOM_DOMAIN}\n`);

console.log(`✓ Built ${pages.length} pages into ${OUT}/ (base ${BASE}, ${site.url})`);
if (missing.size) {
  console.log(`\n  ${missing.size} download(s) not uploaded yet — shown as "Coming soon":`);
  for (const f of missing) console.log(`    assets/${f}`);
}
