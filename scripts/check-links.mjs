// Checks every internal link and asset reference in dist/.
// Pass --external to also check outside links (slower, needs internet).
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../content/site.mjs';

const ROOT = 'dist';
const BASE = ('/' + (process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');
const checkExternal = process.argv.includes('--external');

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const problems = [];
const warnings = [];
const external = new Map();
const ids = new Map();

const pages = [];
for await (const f of walk(ROOT)) pages.push([f, await readFile(f, 'utf8')]);
for (const [f, html] of pages) ids.set(f, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

for (const [f, html] of pages) {
  const seen = new Set();
  for (const [, id] of html.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(id)) problems.push(`${f}: duplicate id "${id}"`);
    seen.add(id);
  }
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(mailto:|tel:)/.test(url)) continue;
    if (/^https?:/.test(url)) {
      if (!url.includes('fonts.g') && !url.startsWith(site.url)) (external.get(url) || external.set(url, []).get(url)).push(f);
      continue;
    }
    let [path, hash] = url.split('#');
    if (BASE !== '/' && path.startsWith(BASE)) path = path.slice(BASE.length - 1);
    let target = path ? join(ROOT, path) : f;
    if (path.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) problems.push(`${f}: broken link ${url}`);
    else if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) problems.push(`${f}: missing anchor ${url}`);
  }
}

if (checkExternal) {
  await Promise.all(
    [...external.keys()].map(async (url) => {
      try {
        const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 link-check' }, signal: AbortSignal.timeout(20000) });
        if (r.status >= 400 && ![401, 403, 429].includes(r.status)) problems.push(`external ${r.status}: ${url}`);
      } catch (e) {
        // Some sites (e.g. H-Net) block scripts but work in a browser — warn only.
        warnings.push(`could not reach (${e.cause?.code || e.name}), check by hand: ${url}`);
      }
    }),
  );
}

console.log(`Checked ${pages.length} pages${checkExternal ? ` and ${external.size} external links` : ''}.`);
if (warnings.length) console.log(warnings.map((w) => `⚠ ${w}`).join('\n'));
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('✓ No problems found.');
