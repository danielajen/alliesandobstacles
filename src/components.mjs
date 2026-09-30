// Small HTML helpers shared by every page. Everything that comes from content
// files passes through esc() so a stray "<" or "&" can't break the markup.

export const esc = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Content text may wrap book titles in *asterisks* to italicize them.
export const rich = (s = '') => esc(s).replace(/\*(.+?)\*/g, '<cite>$1</cite>');

export const join = (list, fn) => list.map(fn).join('');

export const isExternal = (url) => /^https?:\/\//.test(url);

export function link(url, text, { cls = '' } = {}) {
  const c = cls ? ` class="${cls}"` : '';
  if (!isExternal(url)) return `<a href="${esc(url)}"${c}>${text}</a>`;
  return `<a href="${esc(url)}"${c} rel="noopener">${text}${icon('external', 'icon icon--ext')}<span class="visually-hidden"> (external site)</span></a>`;
}

const ICONS = {
  external:
    '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  headphones:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="1.5"/><rect x="16" y="14" width="5" height="7" rx="1.5"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  doc: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  candle: '<path d="M9 10h6v11H9zM12 10V7"/><path d="M12 2.5c1.5 1.6 1.5 3 0 4.5-1.5-1.5-1.5-2.9 0-4.5z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  type: '<path d="M4 7V5h11v2M9.5 5v14M7 19h5M14 12v-1.5h7V12M17.5 10.5V19M16 19h3"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};

export function icon(name, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

// A drawn book cover — used until real cover images are approved. It is
// decorative (the title is always in the page text right next to it).
export function cover(book, { size = '' } = {}) {
  if (book.coverImage) {
    return `<img class="cover cover--img ${size}" src="/${esc(book.coverImage)}" alt="${esc(book.coverAlt)}" width="400" height="600" loading="lazy">`;
  }
  const authors = book.byline.replace(/^Edited by /, '').replace(', and ', ' · ').replaceAll(', ', ' · ');
  return `<div class="cover cover--${book.accent} ${size}" aria-hidden="true"><div class="cover__inner">
    <div class="cover__blocks"><span></span><span></span><span></span></div>
    <p class="cover__title">${esc(book.title)}</p>
    <p class="cover__subtitle">${esc(book.subtitle)}</p>
    <p class="cover__authors">${book.role === 'Editors' ? 'Edited by<br>' : ''}${esc(authors)}</p>
  </div></div>`;
}

export function button(url, text, { variant = 'primary', ic = null, iconEnd = false } = {}) {
  const ext = isExternal(url);
  const i = ic ? icon(ic, `icon${iconEnd ? ' icon--end' : ''}`) : '';
  return `<a class="btn btn--${variant}" href="${esc(url)}"${ext ? ' rel="noopener"' : ''}>${iconEnd ? '' : i}<span>${text}</span>${iconEnd ? i : ''}${ext ? icon('external', 'icon icon--ext') + '<span class="visually-hidden"> (external site)</span>' : ''}</a>`;
}

export function avatar(person, accent) {
  if (person.photo) {
    return `<img class="avatar" src="/${esc(person.photo)}" alt="${esc(person.photoAlt || '')}" width="160" height="160" loading="lazy">`;
  }
  const words = person.name.split(' ').filter((w) => !w.endsWith('.'));
  const initials = person.initials || (words[0][0] + words.at(-1)[0]).toUpperCase();
  return `<span class="avatar avatar--${accent || person.accent || 'blue'}" aria-hidden="true">${esc(initials)}</span>`;
}

export function sectionHead(title, { eyebrow = '', id = '', lede = '', action = '' } = {}) {
  return `<div class="section-head">
    <div>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      <h2${id ? ` id="${id}"` : ''}>${title}</h2>
      ${lede ? `<p class="section-lede">${lede}</p>` : ''}
    </div>
    ${action}
  </div>`;
}

export function breadcrumbs(trail) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${join(
    trail,
    ([label, url], i) =>
      i === trail.length - 1
        ? `<li><a href="${url}" aria-current="page">${esc(label)}</a></li>`
        : `<li><a href="${url}">${esc(label)}</a></li>`,
  )}</ol></nav>`;
}
