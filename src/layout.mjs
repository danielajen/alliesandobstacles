import { site, books } from '../content/site.mjs';
import { authors } from '../content/people.mjs';
import { esc, icon, join } from './components.mjs';

const NAV = [
  ['The Books', '/books/'],
  ['Free Audiobook', '/audiobook/'],
  ['Authors', '/authors/'],
  ['Contributors', '/contributors/'],
  ['Media', '/media/'],
];

// Runs before first paint so saved display choices never flash.
const PREFS_BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=JSON.parse(localStorage.getItem('ao-display')||'{}');['size','contrast','theme','motion'].forEach(function(k){if(p[k])d.setAttribute('data-'+k,p[k])})}catch(e){}})();`;

function structuredData(path) {
  const graph = [
    { '@type': 'WebSite', '@id': `${site.url}/#site`, url: `${site.url}/`, name: site.name, description: site.description },
    ...books.map((b) => ({
      '@type': 'Book',
      '@id': `${site.url}/books/${b.slug}/#book`,
      name: `${b.title}: ${b.subtitle}`,
      url: `${site.url}/books/${b.slug}/`,
      datePublished: String(b.year),
      numberOfPages: b.pages,
      publisher: { '@type': 'Organization', name: site.publisher.name, url: site.publisher.url },
      [b.role === 'Editors' ? 'editor' : 'author']: authors.map((a) => ({ '@type': 'Person', name: a.name })),
      isbn: b.formats.find((f) => f.format === 'Paperback')?.isbn,
      ...(b.awards.length ? { award: b.awards.map((a) => `${a.name} (${a.year}), ${a.from}`) } : {}),
      workExample: b.formats
        .filter((f) => f.isbn)
        .map((f) => ({ '@type': 'Book', isbn: f.isbn, bookFormat: `https://schema.org/${f.format === 'eBook' ? 'EBook' : f.format}` })),
    })),
  ];
  if (path !== '/' && !path.startsWith('/books/')) return '';
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function seg(name, legend, options) {
  return `<fieldset>
    <legend>${legend}</legend>
    <div class="seg">${join(options, ([v, l]) => `<label><input type="radio" name="${name}" value="${v}"><span>${l}</span></label>`)}</div>
  </fieldset>`;
}

export function layout({ path, title, description, body, bodyClass = '' }) {
  const fullTitle = path === '/' ? `${site.name} — Allies and Obstacles and Family and Disability Activism` : `${title} · ${site.name}`;
  const desc = description || site.description;
  const active = (url) => path.startsWith(url);
  const canonical = `${site.url}${path.replace(/404\.html$/, '')}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${path.startsWith('/books/') && path.length > 7 ? 'book' : 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Allies and Obstacles: two books on disability, family, and activism">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbf7ee" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121317" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
<script>${PREFS_BOOT}</script>
<script src="/assets/site.js" defer></script>
${structuredData(path)}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to main content</a>
<div class="primary-rule" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/"${path === '/' ? ' aria-current="page"' : ''}>
      <span class="brand__mark" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="brand__name">Allies <span class="amp">&amp;</span> Obstacles</span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>${join(
        NAV,
        ([label, url]) => `<li><a href="${url}"${active(url) ? (path === url ? ' aria-current="page"' : ' aria-current="true"') : ''}>${label}</a></li>`,
      )}</ul>
    </nav>
    <div class="header-tools">
      <button class="icon-btn" type="button" id="display-toggle" aria-expanded="false" aria-controls="display-panel">
        ${icon('type')}<span class="icon-btn__label">Display</span>
      </button>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        ${icon('menu', 'icon icon--open')}${icon('close', 'icon icon--close')}<span class="icon-btn__label">Menu</span>
      </button>
    </div>
  </div>
  <div class="display-panel" id="display-panel" hidden>
    <div class="wrap">
      <div class="display-panel__inner" role="group" aria-labelledby="display-title">
        <p class="display-panel__title" id="display-title">Display settings</p>
        ${seg('size', 'Text size', [['', 'Standard'], ['large', 'Large'], ['larger', 'Larger']])}
        ${seg('contrast', 'Contrast', [['', 'Standard'], ['high', 'High']])}
        ${seg('theme', 'Theme', [['', 'Automatic'], ['light', 'Light'], ['dark', 'Dark']])}
        ${seg('motion', 'Animation', [['', 'On'], ['off', 'Off']])}
        <button type="button" class="text-btn" data-display-reset>Reset</button>
      </div>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">
${body}
</main>

<footer class="site-footer">
  <div class="wrap site-footer__grid">
    <div class="site-footer__about">
      <a class="brand brand--footer" href="/">
        <span class="brand__mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="brand__name">Allies <span class="amp">&amp;</span> Obstacles</span>
      </a>
      <p>Books by Allison C. Carey, Pamela Block, and Richard K. Scotch, published by ${esc(site.publisher.name)}.</p>
    </div>
    <nav aria-label="Books">
      <p class="footer-heading">Books</p>
      <ul>${join(books, (b) => `<li><a href="/books/${b.slug}/">${esc(b.short)}</a></li>`)}
        <li><a href="/books/allies-and-obstacles/#inside">Chapter guide</a></li>
        <li><a href="/audiobook/">Free audiobook</a></li>
      </ul>
    </nav>
    <nav aria-label="People">
      <p class="footer-heading">People</p>
      <ul>
        <li><a href="/authors/">Authors &amp; editors</a></li>
        <li><a href="/authors/richard-scotch/">Remembering Richard Scotch</a></li>
        <li><a href="/contributors/">Chapter contributors</a></li>
        <li><a href="/team/">Project team</a></li>
        <li><a href="/media/">Media &amp; resources</a></li>
      </ul>
    </nav>
    <div>
      <p class="footer-heading">Get in touch</p>
      <ul>
        <li><a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></li>
        <li><a href="${site.publisher.url}" rel="noopener">${esc(site.publisher.name)}</a></li>
        <li><a href="/accessibility/">Accessibility</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap site-footer__base">
    <p>© ${new Date().getFullYear()} Pamela Block, Allison C. Carey, and Richard K. Scotch.</p>
    <p>The book, chapter, research, and author text on this site was written by people: the authors, the contributors, and Temple University Press. We used AI in the early stages of designing the website.</p>
  </div>
</footer>
</body>
</html>
`;
}
