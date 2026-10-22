import { statSync } from 'node:fs';
import { join as join_ } from 'node:path';
import { site, books, media, mediaTypes } from '../content/site.mjs';
import { authors, contributors, team } from '../content/people.mjs';
import { audiobook, accessibleResources } from '../content/audiobook.mjs';
import { research as researchPages } from '../content/research.mjs';
import { occupyingDisability as OD } from '../content/occupying.mjs';
import { parts, keyIdeas, allianceFrames, language, research, timeline, timelineKinds, cite, fdaContents } from '../content/book.mjs';
import { esc, rich, join, link, icon, cover, button, avatar, sectionHead, breadcrumbs } from './components.mjs';

// `has(file)` is injected by the build so pages know whether a download exists.
let has = () => false;
const ASSETS = new URL('../assets/', import.meta.url).pathname;
export const setFileCheck = (fn) => (has = fn);

const bookBySlug = Object.fromEntries(books.map((b) => [b.slug, b]));
const [AO, FDA] = books;
const richard = authors.find((a) => a.tribute);
const ACCENTS = ['red', 'blue', 'yellow'];

export const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function page(path, title, description, body, bodyClass = '') {
  return { path, title, description, body, bodyClass };
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

const MEDIA_ICON = { podcast: 'mic', interview: 'mic', 'study-guide': 'doc', talk: 'users', article: 'doc', review: 'quote' };

function mediaItem(m, { showBook = true } = {}) {
  const book = bookBySlug[m.book];
  return `<li class="media-item reveal" data-type="${m.type}" data-book="${m.book}">
    <span class="chip chip--${m.type}">${icon(MEDIA_ICON[m.type])}${mediaTypes[m.type].label}</span>
    <h3 class="media-item__title">${link(m.url, esc(m.title))}</h3>
    <p class="media-item__meta">${esc(m.source)}${m.year ? ` · ${m.year}` : ''}${
      showBook && book ? `<span class="book-tag book-tag--${book.accent}"><cite>${esc(book.short)}</cite></span>` : ''
    }</p>
  </li>`;
}

function mediaSection(bookSlug, types, title, id) {
  const items = media.filter((m) => m.book === bookSlug && types.includes(m.type));
  if (!items.length) return '';
  return `<section class="block" aria-labelledby="${id}">
    <h2 id="${id}" class="block__h">${title}</h2>
    <ul class="media-list media-list--compact" role="list">${join(items, (m) => mediaItem(m, { showBook: false }))}</ul>
  </section>`;
}

function download(file, label, note = '', { url = null, ext = null, size = null } = {}) {
  const kind = (ext || (file || url).split('.').pop()).toUpperCase();
  const href = url || (file && has(file) ? `/assets/${file}` : null);
  const bytes = !url && file && has(file) ? statSync(join_(ASSETS, file)).size : null;
  const sz = size || (bytes ? `${bytes >= 1e6 ? Math.round(bytes / 1e6) + ' MB' : Math.max(1, Math.round(bytes / 1e3)) + ' KB'}` : '');
  if (href) {
    return `<a class="download" href="${esc(href)}"${url ? '' : ' download'}>
      <span class="download__icon">${icon('download')}</span>
      <span class="download__text"><span class="download__label">${esc(label)}</span>${note ? `<span class="download__note">${esc(note)}</span>` : ''}</span>
      <span class="download__ext">${kind}${sz ? `<span class="download__size">${sz}</span>` : ''}</span>
    </a>`;
  }
  return `<div class="download download--soon">
    <span class="download__icon">${icon('download')}</span>
    <span class="download__text"><span class="download__label">${esc(label)}</span><span class="download__note">Coming soon — check back shortly.</span></span>
    <span class="download__ext">${kind}</span>
  </div>`;
}

function bookCard(b, { headingLevel = 3, big = false } = {}) {
  const h = `h${headingLevel}`;
  const badges = [];
  if (b.awards.length) badges.push(`<span class="badge">${icon('award')}${b.awards.length} national awards</span>`);
  if (b.slug === audiobook.book) badges.push(`<span class="badge badge--yellow">${icon('headphones')}Free audiobook</span>`);
  badges.push(`<span class="badge">${icon('book')}${b.pages} pages</span>`);
  return `<article class="book-card book-card--${b.accent}${big ? ' book-card--big' : ''} reveal">
    <a class="book-card__cover" href="/books/${b.slug}/" tabindex="-1" aria-hidden="true">${cover(b)}</a>
    <div class="book-card__body">
      <p class="eyebrow">${b.role === 'Editors' ? 'Edited volume' : 'Monograph'} · ${b.year}</p>
      <${h} class="book-card__title"><a href="/books/${b.slug}/">${esc(b.title)}</a></${h}>
      <p class="book-card__subtitle">${esc(b.subtitle)}</p>
      <p class="book-card__hook">${esc(b.hook)}</p>
      <p class="badges">${badges.join('')}</p>
      <div class="btn-row">
        ${button(`/books/${b.slug}/`, `Explore the book<span class="visually-hidden">: ${esc(b.short)}</span>`, { variant: 'primary', ic: 'arrow', iconEnd: true })}
        ${button(b.buyUrl, `Buy<span class="visually-hidden"> ${esc(b.short)}</span>`, { variant: 'ghost' })}
      </div>
    </div>
  </article>`;
}

function personCard(a) {
  return `<li class="person-card${a.tribute ? ' person-card--tribute' : ''} reveal">
    ${avatar(a)}
    <div>
      <h3><a href="/authors/${a.slug}/">${esc(a.name)}</a></h3>
      ${a.lifespan ? `<p class="person-card__life">${esc(a.lifespan)}</p>` : ''}
      <p class="person-card__role">${esc(a.role)}</p>
    </div>
  </li>`;
}

function citeBox(slug) {
  const styles = cite[slug];
  const id = `cite-${slug}`;
  return `<section class="side-card cite" aria-labelledby="${id}-h">
    <h2 id="${id}-h">${icon('quote')}Cite this book</h2>
    <div class="tabs" data-tabs>
      <div class="tabs__list tabs__list--mini" role="tablist" aria-label="Citation style" hidden>
        ${join(Object.keys(styles), (s, i) => `<button type="button" role="tab" id="${id}-tab-${s}" aria-controls="${id}-${s}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${s}</button>`)}
      </div>
      ${join(
        Object.entries(styles),
        ([s, text]) => `<div class="cite__panel" id="${id}-${s}" role="tabpanel" aria-labelledby="${id}-tab-${s}">
          <p class="tabs__heading cite__style">${s}</p>
          <p class="cite__text" data-copy-source>${rich(text)}</p>
          <button type="button" class="copy-btn" data-copy hidden>${icon('copy')}<span data-copy-label>Copy ${s} citation</span></button>
        </div>`,
      )}
    </div>
  </section>`;
}

function stat(n, label) {
  return `<div class="stat reveal"><dt>${label}</dt><dd>${n}</dd></div>`;
}

function timelineList(items, { compact = false } = {}) {
  return `<ol class="timeline${compact ? ' timeline--compact' : ''}" role="list" data-timeline>${join(
    items,
    (e) => `<li class="tl tl--${e.kind} reveal" data-kind="${e.kind}">
      <p class="tl__year">${esc(e.year)}</p>
      <div class="tl__card">
        <p class="tl__kind"><span class="dot dot--${e.kind}" aria-hidden="true"></span>${timelineKinds[e.kind].short}</p>
        <h3 class="tl__title">${rich(e.title)}</h3>
        ${compact ? '' : `<p class="tl__text">${rich(e.text)}</p>`}
      </div>
    </li>`,
  )}</ol>`;
}

function framesList(light = false) {
  return `<ol class="frames${light ? ' frames--light' : ''}" role="list">${join(
    allianceFrames,
    (f, i) => `<li class="frame frame--${ACCENTS[i]} reveal">
      <span class="frame__n" aria-hidden="true">${i + 1}</span>
      <p class="frame__k">${esc(f.k)} <span>${esc(f.over)}</span></p>
      <p class="frame__t">${esc(f.text)}</p>
    </li>`,
  )}</ol>`;
}

// ─── Home ────────────────────────────────────────────────────────────────────

function home() {
  const latest = media.filter((m) => ['review', 'podcast', 'article'].includes(m.type)).slice(0, 6);
  const picks = ['1949', '1950', '1975', '1979', '1990', '2005', '2020', '2025'];
  const tlPicks = timeline.filter((e) => picks.includes(e.year));
  return page(
    '/',
    'Home',
    null,
    `
<section class="hero">
  <div class="wrap hero__grid">
    <div class="hero__text">
      <p class="eyebrow eyebrow--rule">Pamela Block · Allison C. Carey · Richard K. Scotch</p>
      <h1 class="hero__title">Parents, disabled activists, and the <em>uneasy alliances</em> between them.</h1>
      <p class="hero__lede">Two books on seventy years of disability activism, including the award-winning <cite>Allies and Obstacles</cite> — from the parents who built the first national movements in the 1950s to BIPOC and LGBTQIA2S+ families organizing today.</p>
      <div class="btn-row">
        ${button('/books/', 'Explore the books', { ic: 'book' })}
        ${button('/audiobook/', 'Free audiobook', { variant: 'ghost', ic: 'headphones' })}
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="steps"><span></span><span></span><span></span></div>
      <a href="/books/${AO.slug}/" class="hero__cover hero__cover--back" tabindex="-1">${cover(AO)}</a>
      <a href="/books/${FDA.slug}/" class="hero__cover hero__cover--front" tabindex="-1">${cover(FDA)}</a>
    </div>
  </div>
  <div class="wrap">
    <dl class="stats">
      ${stat('2', 'Books')}
      ${stat('1949<span aria-hidden="true">–</span><span class="visually-hidden"> to </span>2025', 'Years of activism')}
      ${stat(research.interviews, 'Activists interviewed')}
      ${stat(contributors.length, 'Chapter contributors')}
      ${stat('2', 'National book awards')}
    </dl>
  </div>
</section>

<section class="section" aria-labelledby="books-h">
  <div class="wrap">
    ${sectionHead('The books', { eyebrow: 'Temple University Press', id: 'books-h', lede: 'A history and its sequel. The first maps how parent activism shaped disability policy; the second centers the voices the first could not fully hold.' })}
    <div class="book-grid">${join(books, (b) => bookCard(b))}</div>
  </div>
</section>

<section class="section section--ink" aria-labelledby="q-h">
  <div class="wrap question">
    <div class="question__text reveal">
      <p class="eyebrow">The question at the heart of the books</p>
      <h2 id="q-h" class="question__title">Allies, obstacles, <em>or something in between?</em></h2>
      <p>Parents won the right to public education, helped empty the institutions, and built a nationwide system of services. Yet many disabled activists experience parent advocacy as speaking <em>for</em> them rather than <em>with</em> them. The authors argue that parents are best understood as “sometimes allies” — and that three shared commitments predict when an alliance will hold.</p>
      <a class="more-link more-link--light" href="/books/${AO.slug}/#ideas">Read the key ideas ${icon('arrow')}</a>
    </div>
    ${framesList()}
  </div>
</section>

<section class="section" aria-labelledby="tl-h">
  <div class="wrap">
    ${sectionHead('Seventy years of organizing', { eyebrow: 'Timeline', id: 'tl-h', lede: 'When parent-led organizations appeared — and why some disability communities organized decades before others.', action: `<a class="more-link" href="/timeline/">Full timeline ${icon('arrow')}</a>` })}
  </div>
  <div class="rail-wrap">
    <ol class="rail" role="list" tabindex="0" aria-label="Key moments. Scroll sideways for more.">
      ${join(
        tlPicks,
        (e) => `<li class="rail__item rail__item--${e.kind}">
        <p class="rail__year">${esc(e.year)}</p>
        <p class="rail__title">${rich(e.title)}</p>
        <p class="rail__kind"><span class="dot dot--${e.kind}" aria-hidden="true"></span>${timelineKinds[e.kind].short}</p>
      </li>`,
      )}
      <li class="rail__item rail__item--more"><a href="/timeline/">See all ${timeline.length} moments ${icon('arrow')}</a></li>
    </ol>
  </div>
</section>

<section class="band band--yellow" aria-labelledby="audio-h">
  <div class="wrap band__grid">
    <div class="band__icon" aria-hidden="true">${icon('headphones')}</div>
    <div>
      <h2 id="audio-h">Listen to <cite>${esc(FDA.title)}</cite> for free</h2>
      <p>The full audiobook is free to download and keep. No account, no subscription. We walk you through adding it to your phone, computer, or favorite audiobook app.</p>
    </div>
    <div>${button('/audiobook/', 'Get the audiobook', { variant: 'dark', ic: 'arrow', iconEnd: true })}</div>
  </div>
</section>

<section class="section" aria-labelledby="recog-h">
  <div class="wrap recog">
    <div class="recog__awards reveal">
      <p class="eyebrow">Recognition</p>
      <h2 id="recog-h">Award-winning scholarship</h2>
      <ul class="award-list" role="list">${join(
        AO.awards,
        (a) => `<li>${icon('award', 'icon award-list__icon')}<div><p class="award-list__name">${esc(a.name)}, ${a.year}</p><p class="award-list__from">${esc(a.from)} · <cite>${esc(AO.short)}</cite></p></div></li>`,
      )}</ul>
    </div>
    <div class="quotes">
      ${join(
        FDA.praise.slice(0, 2),
        (q, i) => `<figure class="pullquote${i ? ' pullquote--alt' : ''} reveal">
        <blockquote><p>${esc(q.quote)}</p></blockquote>
        <figcaption>${esc(q.who)}, on <cite>${esc(FDA.title)}</cite></figcaption>
      </figure>`,
      )}
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="authors-h">
  <div class="wrap">
    ${sectionHead('The authors', { eyebrow: 'Authors & editors', id: 'authors-h', lede: 'An anthropologist and two sociologists, in Canada and the United States.', action: `<a class="more-link" href="/authors/">Meet the authors ${icon('arrow')}</a>` })}
    <ul class="people-grid" role="list">${join(authors, (a) => personCard(a))}</ul>
  </div>
</section>

<section class="section" aria-labelledby="memory-h">
  <div class="wrap">
    <div class="memorial-card reveal">
      <div class="memorial-card__candle" aria-hidden="true">${icon('candle')}</div>
      <div>
        <p class="eyebrow">In memory</p>
        <h2 id="memory-h">Richard K. Scotch, ${richard.lifespan}</h2>
        <p>Our co-author, colleague, and friend died in June 2026. A pioneer of disability policy scholarship, Richard first proposed the collaboration that became <cite>Allies and Obstacles</cite>.</p>
        <a class="more-link" href="/authors/richard-scotch/">Read our tribute to Richard ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="media-h">
  <div class="wrap">
    ${sectionHead('Listen, read, discuss', { eyebrow: 'Reviews, podcasts & articles', id: 'media-h', action: `<a class="more-link" href="/media/">All media &amp; resources ${icon('arrow')}</a>` })}
    <ul class="media-list" role="list">${join(latest, (m) => mediaItem(m))}</ul>
  </div>
</section>

<section class="section" aria-labelledby="contrib-h">
  <div class="wrap contrib-teaser">
    <div class="reveal">
      <p class="eyebrow"><cite>${esc(FDA.title)}</cite></p>
      <h2 id="contrib-h">Meet the chapter contributors</h2>
      <p>Activists, parents, scholars, and self-advocates who wrote the chapters of <cite>${esc(FDA.title)}</cite>, with links to their work and their latest news.</p>
      <a class="more-link" href="/contributors/">See all ${contributors.length} contributors ${icon('arrow')}</a>
    </div>
    <ul class="name-cloud" role="list">${join(contributors, (c, i) => `<li><a href="/contributors/#${slugify(c.name)}">${avatar(c, ACCENTS[i % 3])}<span>${esc(c.name)}</span></a></li>`)}</ul>
  </div>
</section>
`,
    'home',
  );
}

// ─── Books ───────────────────────────────────────────────────────────────────

function booksIndex() {
  return page(
    '/books/',
    'The Books',
    'Allies and Obstacles (2020) and Family and Disability Activism (2025), from Temple University Press.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['The Books', '/books/']])}
    <h1>The books</h1>
    <p class="page-head__lede">Two companion volumes on parents, disabled activists, and the movements they have built — sometimes together, sometimes at odds.</p>
  </div>
</header>
<section class="section section--flush-top">
  <div class="wrap">
    <div class="book-grid book-grid--stack">${join(books, (b) => bookCard(b, { headingLevel: 2, big: true }))}</div>
  </div>
</section>`,
  );
}

function bookHead(b) {
  const isFda = b.slug === audiobook.book;
  return `<header class="book-head book-head--${b.accent}">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['The Books', '/books/'], [b.short, `/books/${b.slug}/`]])}
    <div class="book-head__grid">
      <div class="book-head__cover">${cover(b, { size: 'cover--lg' })}</div>
      <div class="book-head__text">
        <p class="eyebrow">${b.role === 'Editors' ? 'Edited volume' : 'Monograph'} · ${esc(b.published)}</p>
        <h1>${esc(b.title)}</h1>
        <p class="book-head__subtitle">${esc(b.subtitle)}</p>
        <p class="book-head__byline">${esc(b.byline)}</p>
        <dl class="facts">
          <div><dt>Publisher</dt><dd>${esc(site.publisher.name)}</dd></div>
          <div><dt>Published</dt><dd>${esc(b.published)}</dd></div>
          <div><dt>Length</dt><dd>${b.pages} pages</dd></div>
          ${b.awards.length ? `<div><dt>Awards</dt><dd>${b.awards.length} national</dd></div>` : ''}
        </dl>
        <div class="btn-row">
          ${button(b.buyUrl, 'Buy paperback or e-book', { ic: 'book' })}
          ${isFda ? button('/audiobook/', 'Free audiobook', { variant: 'ghost', ic: 'headphones' }) : ''}
          ${button(b.studyGuideUrl, 'Study guide', { variant: 'ghost', ic: 'doc' })}
        </div>
      </div>
    </div>
  </div>
</header>`;
}

function bookSide(b) {
  return `<aside class="book-body__side" aria-label="Book details">
    ${
      b.awards.length
        ? `<section class="side-card side-card--awards" aria-labelledby="awards-h">
      <h2 id="awards-h">${icon('award')}Awards</h2>
      <ul role="list">${join(b.awards, (a) => `<li><strong>${esc(a.name)}</strong>, ${a.year}<br><span>${esc(a.from)}</span></li>`)}</ul>
    </section>`
        : ''
    }
    <section class="side-card" aria-labelledby="formats-h">
      <h2 id="formats-h">${icon('book')}Formats</h2>
      <table class="formats">
        <caption class="visually-hidden">Formats, ISBNs and prices for ${esc(b.title)}</caption>
        <thead><tr><th scope="col">Format</th><th scope="col">ISBN</th><th scope="col">Price</th></tr></thead>
        <tbody>${join(
          b.formats,
          (f) => `<tr><th scope="row">${f.href ? `<a href="${f.href}">${esc(f.format)}</a>` : esc(f.format)}</th><td>${f.isbn ? `<span class="isbn">${esc(f.isbn)}</span>` : '—'}</td><td>${esc(f.price)}</td></tr>`,
        )}</tbody>
      </table>
      <p class="side-card__note">Publisher prices in US dollars. Also available from booksellers and libraries — ask for it by ISBN.</p>
      ${button(b.buyUrl, `Order from ${esc(site.publisher.name)}`, { variant: 'primary' })}
    </section>
    ${citeBox(b.slug)}
  </aside>`;
}

function chapterItem(c) {
  const isApp = c.title.startsWith('Appendix');
  const label = c.n ? `Chapter ${c.n}` : isApp ? 'Appendix' : '';
  const title = isApp ? c.title.replace(/^Appendix: /, '') : c.title;
  const mark = c.n ?? (c.id === 'introduction' ? 'In' : c.id === 'conclusion' ? 'Co' : 'Ap');
  return `<li class="ch" id="${c.id}">
    <details class="ch__d">
      <summary class="ch__s">
        <span class="ch__n" aria-hidden="true">${mark}</span>
        <span class="ch__head">
          ${label ? `<span class="ch__label">${label}</span>` : ''}
          <span class="ch__title">${esc(title)}</span>
        </span>
        <span class="ch__page"><span class="visually-hidden">, begins on page </span><span aria-hidden="true">p.&nbsp;</span>${c.page}</span>
        <span class="ch__chev" aria-hidden="true">${icon('chevron')}</span>
      </summary>
      <div class="ch__body">
        <p class="ch__summary">${rich(c.summary)}</p>
        ${c.opens ? `<div class="ch__opens"><p class="mini-h">${c.id === 'conclusion' ? 'How it closes' : 'How it opens'}</p><p>${rich(c.opens)}</p></div>` : ''}
        <div class="ch__cols">
          ${c.sections.length ? `<div><p class="mini-h">In this chapter</p><ul class="ch__sections">${join(c.sections, (s) => `<li>${esc(s)}</li>`)}</ul></div>` : ''}
          ${c.questions.length ? `<div><p class="mini-h">Questions for discussion</p><ol class="ch__qs">${join(c.questions, (q) => `<li>${rich(q)}</li>`)}</ol></div>` : ''}
        </div>
      </div>
    </details>
  </li>`;
}

function aoPage(b) {
  const maxRole = Math.max(...research.byRole.map((r) => r.n));
  const toc = [
    ['overview', 'Overview'],
    ['inside', 'Inside the book'],
    ['ideas', 'Key ideas'],
    ['research', 'The research'],
    ['why', 'Why we wrote it'],
    ['reviews-h', 'Reviews'],
    ['pods-h', 'Podcasts & talks'],
  ];
  return page(
    `/books/${b.slug}/`,
    b.title,
    `${b.title}: ${b.subtitle}. ${b.byline}. Chapter guide, key ideas, reviews, podcasts, and where to buy.`,
    `
${bookHead(b)}

<nav class="subnav" aria-label="On this page">
  <div class="wrap"><ul>${join(toc, ([id, l]) => `<li><a href="#${id}">${l}</a></li>`)}</ul></div>
</nav>

<div class="wrap book-body">
  <div class="book-body__main">
    <section class="block prose" id="overview" aria-labelledby="about-h">
      <h2 id="about-h" class="block__h">About the book</h2>
      ${join(b.summary, (p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${rich(p)}</p>`)}
    </section>

    <section class="block" id="inside" aria-labelledby="inside-h">
      <div class="block__top">
        <h2 id="inside-h" class="block__h">Inside the book</h2>
        <button type="button" class="text-btn" data-expand-all hidden aria-controls="chapter-guide">Expand all</button>
      </div>
      <p class="muted">An introduction, nine chapters in two parts, and a conclusion. Open any chapter for a summary, the story it opens with, its sections, and questions for classes and reading groups.</p>
      <div id="chapter-guide">
      ${join(
        parts,
        (p) => `${p.label ? `<div class="part"><p class="part__label">${p.label}</p><h3 class="part__title">${esc(p.title)}</h3><p class="part__blurb">${esc(p.blurb)}</p></div>` : ''}
        <ol class="chapters" role="list">${join(p.chapters, chapterItem)}</ol>`,
      )}
      </div>
    </section>

    <section class="block" id="ideas" aria-labelledby="ideas-h">
      <h2 id="ideas-h" class="block__h">Key ideas</h2>
      <ul class="ideas" role="list">${join(
        keyIdeas,
        (k, i) => `<li class="idea idea--${ACCENTS[i % 3]} reveal"><h3>${esc(k.term)}</h3><p>${rich(k.text)}</p><p class="idea__where">${esc(k.where)}</p></li>`,
      )}</ul>
      <div class="alliance reveal">
        <h3>What makes an alliance?</h3>
        <p>Parent organizations are most likely to ally with groups led by disabled activists when they share three commitments:</p>
        ${framesList(true)}
      </div>
      <details class="lang">
        <summary><span>${icon('type')}A note on language</span>${icon('chevron')}</summary>
        <div class="lang__body">
          <p>Disability language is contested, and different communities prefer different terms. The authors use each community’s preferred language when writing about it, moving between person-first and identity-first language as a sign of respect.</p>
          <dl>${join(language, (l) => `<div><dt>${esc(l.term)}</dt><dd>${esc(l.text)}</dd></div>`)}</dl>
        </div>
      </details>
    </section>

    <section class="block" id="research" aria-labelledby="research-h">
      <h2 id="research-h" class="block__h">The research</h2>
      <p>The book draws on organizational and archival documents, news coverage, blogs, and online forums, plus <strong>${research.interviews} interviews</strong> with activists aged ${research.ages}. The interviews focused on people whose voices are least visible online, including older activists and self-advocates with intellectual disabilities.</p>
      <figure class="bars reveal">
        <figcaption class="bars__cap">Who was interviewed <span>${research.interviews} people</span></figcaption>
        <ul role="list">${join(
          research.byRole,
          (r, i) => `<li><span class="bars__label">${esc(r.label)}</span><span class="bars__track" aria-hidden="true"><span class="bars__bar bars__bar--${ACCENTS[i % 3]}" style="--w:${((r.n / maxRole) * 100).toFixed(1)}%"></span></span><span class="bars__n">${r.n}</span></li>`,
        )}</ul>
      </figure>
      <p class="muted small">Source: the book’s methods appendix. Interviewees are identified by pseudonyms.</p>
    </section>

    <section class="block prose" id="why" aria-labelledby="why-h">
      <h2 id="why-h" class="block__h">Why we wrote it</h2>
      <p>This is a deeply personal project. Pamela’s mother, Barbara Kilcup, was a special education teacher and, when her children were young, a strident parent advocate. Over time, Barbara and Pamela’s sister Hope worked together and came to align closely with disabled activists. For Pamela, they showed how powerful a parent ally can be.</p>
      <p>Allison grew up engaged with the intellectual disability community through her family and the Arc. Richard, whose career began with the history of disability civil rights, proposed that they write the book together.</p>
      <blockquote class="inline-quote"><p>Parents discovered long ago that they could accomplish far more by working to benefit all children with disabilities rather than just their own child.</p><footer>— from the Conclusion</footer></blockquote>
    </section>

    ${mediaSection(b.slug, ['review'], 'Reviews', 'reviews-h')}
    ${mediaSection(b.slug, ['podcast', 'interview', 'talk'], 'Podcasts, interviews & talks', 'pods-h')}
    ${mediaSection(b.slug, ['article'], 'Related writing', 'articles-h')}
  </div>
  ${bookSide(b)}
</div>

<section class="section section--tint" aria-labelledby="tl-h">
  <div class="wrap">
    ${sectionHead('When parents organized', { eyebrow: 'From Chapter 5', id: 'tl-h', lede: 'National parent-led organizations and the years they were founded.', action: `<a class="more-link" href="/timeline/">Full timeline ${icon('arrow')}</a>` })}
    ${timelineList(timeline.filter((e) => e.kind === 'parent' && /^\d{4}$/.test(e.year)), { compact: true })}
  </div>
</section>

<section class="section" aria-labelledby="other-h">
  <div class="wrap">
    ${sectionHead('Read the follow-up', { id: 'other-h' })}
    <div class="book-grid book-grid--single">${bookCard(FDA)}</div>
  </div>
</section>`,
    `book-page book-page--${b.accent}`,
  );
}

function fdaPage(b) {
  return page(
    `/books/${b.slug}/`,
    b.title,
    `${b.title}: ${b.subtitle}. ${b.byline}. Contributors, reviews, the free audiobook, and where to buy.`,
    `
${bookHead(b)}

<div class="wrap book-body">
  <div class="book-body__main">
    <section class="block prose" aria-labelledby="about-h">
      <h2 id="about-h" class="block__h">About the book</h2>
      ${join(b.summary, (p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${rich(p)}</p>`)}
    </section>

    <section class="block" aria-labelledby="praise-h">
      <h2 id="praise-h" class="block__h">Praise</h2>
      <div class="quote-grid">${join(
        b.praise,
        (q, i) => `<figure class="pullquote pullquote--inline${i % 2 ? ' pullquote--alt' : ''} reveal"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${q.who === 'Choice' ? '<cite>Choice</cite>' : esc(q.who)}</figcaption></figure>`,
      )}</div>
    </section>

    <section class="block" aria-labelledby="toc-h">
      <h2 id="toc-h" class="block__h">Contents</h2>
      <ol class="fda-toc" role="list">${join(fdaContents, (c) => {
        const who = c.authors.map((a) => {
          const author = authors.find((x) => x.name === a);
          const href = author ? `/authors/${author.slug}/` : contributors.some((x) => x.name === a) ? `/contributors/#${slugify(a)}` : null;
          return href ? `<a href="${href}">${esc(a)}</a>` : esc(a);
        });
        const names = who.length > 2 ? `${who.slice(0, -1).join(', ')}, and ${who.at(-1)}` : who.join(' and ');
        return `<li><span class="fda-toc__n">${c.n ? `${c.n}` : ''}</span><div><p class="fda-toc__t">${esc(c.title)}</p><p class="fda-toc__a">${names}</p></div><span class="fda-toc__p"><span class="visually-hidden">page </span>${c.page}</span></li>`;
      })}</ol>
    </section>

    <section class="block" aria-labelledby="contrib-h">
      <h2 id="contrib-h" class="block__h">Contributors</h2>
      <ul class="name-cloud name-cloud--in" role="list">${join(contributors, (c, i) => `<li><a href="/contributors/#${slugify(c.name)}">${avatar(c, ACCENTS[i % 3])}<span>${esc(c.name)}</span></a></li>`)}</ul>
      <p class="muted">With the editors, Pamela Block, Allison C. Carey, and Richard K. Scotch.</p>
      <a class="more-link" href="/contributors/">Contributor profiles and news ${icon('arrow')}</a>
    </section>

    <section class="block" aria-labelledby="audio-h">
      <h2 id="audio-h" class="block__h">Free audiobook &amp; accessible resources</h2>
      <div class="audio-teaser">
        <span class="audio-teaser__icon" aria-hidden="true">${icon('headphones')}</span>
        <div><p><strong>The whole book, read aloud, free to download and keep.</strong> Step-by-step help for iPhone, Android, Mac, Windows, and screen readers.</p>
        ${button('/audiobook/', 'Go to the audiobook', { variant: 'dark', ic: 'arrow', iconEnd: true })}</div>
      </div>
      ${join(accessibleResources, (r) => `<p>${esc(r.description)}</p><div class="download-list">${join(r.files, (f) => download(f.file, `${r.title} — ${f.label}`))}</div>`)}
    </section>

    ${mediaSection(b.slug, ['review'], 'Reviews', 'reviews-h')}
    ${mediaSection(b.slug, ['podcast', 'interview', 'talk'], 'Podcasts, interviews & talks', 'pods-h')}
  </div>
  ${bookSide(b)}
</div>

<section class="section section--tint" aria-labelledby="other-h">
  <div class="wrap">
    ${sectionHead('Where it began', { id: 'other-h' })}
    <div class="book-grid book-grid--single">${bookCard(AO)}</div>
  </div>
</section>`,
    `book-page book-page--${b.accent}`,
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function timelinePage() {
  return page(
    '/timeline/',
    'Timeline',
    'A timeline of parent-led and disabled-led disability activism in the United States, from the 1930s to today.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Timeline', '/timeline/']])}
    <p class="eyebrow">From the pages of <cite>Allies and Obstacles</cite></p>
    <h1>Seventy years of organizing</h1>
    <p class="page-head__lede">Parent-led organizations, disabled-led movements, and the laws they fought for. Some communities organized in the 1950s, others not until the 2000s — Chapter 5 of <cite>Allies and Obstacles</cite> explains why.</p>
  </div>
</header>
<section class="section section--flush-top">
  <div class="wrap narrow">
    <form class="filters" data-filters data-filter-list="[data-timeline] > li" hidden aria-label="Filter the timeline">
      <fieldset>
        <legend>Show</legend>
        <div class="seg seg--wrap">
          <label><input type="radio" name="kind" value="" checked><span>Everything</span></label>
          ${join(Object.entries(timelineKinds), ([k, v]) => `<label><input type="radio" name="kind" value="${k}"><span><span class="dot dot--${k}" aria-hidden="true"></span>${v.label}</span></label>`)}
        </div>
      </fieldset>
      <p class="filters__count" aria-live="polite" data-count></p>
    </form>
    <h2 class="visually-hidden">Events, from the 1930s to today</h2>
    ${timelineList(timeline)}
    <p class="muted small tl-source">Founding dates of parent-led organizations follow Table 5.1 of <cite>Allies and Obstacles</cite>.</p>
  </div>
</section>`,
  );
}

// ─── Audiobook ───────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: 'iphone',
    label: 'iPhone & iPad',
    intro: 'The simplest way is the free BookPlayer app, which remembers your place and lets you change the reading speed.',
    steps: [
      'Install <strong>BookPlayer</strong> (free) from the App Store.',
      'On this page, tap <strong>Whole book, chapter by chapter</strong> (the ZIP file) and choose <strong>Download</strong>. Safari saves it in the <strong>Files</strong> app, in <strong>Downloads</strong>.',
      'Open the <strong>Files</strong> app, find the file in Downloads, then tap and hold it. Choose <strong>Share</strong>, then <strong>BookPlayer</strong>.',
      'BookPlayer adds every chapter, in order. Tap the book to start listening.',
    ],
    tip: 'Prefer Apple Books? Download the M4B file on a Mac and add it there (see the Mac tab) — it will then appear in Apple Books on your iPhone.',
  },
  {
    id: 'android',
    label: 'Android',
    intro: 'Android phones can play the files straight away. For bookmarks and chapter lists, use a free audiobook player.',
    steps: [
      'Install <strong>Smart AudioBook Player</strong> or <strong>Voice</strong> (both free) from the Google Play Store.',
      'On this page, tap <strong>Whole book, chapter by chapter</strong> (the ZIP file). It is saved to your <strong>Downloads</strong> folder.',
      'Open the <strong>Files</strong> app, tap the ZIP file, and choose <strong>Extract</strong>. Move the extracted folder into a folder called <strong>Audiobooks</strong> (create it if needed).',
      'Open your audiobook app and point it to the <strong>Audiobooks</strong> folder. The book appears with all its chapters.',
    ],
    tip: 'Just want to listen now? Tap any chapter in the list above to play it in your browser.',
  },
  {
    id: 'mac',
    label: 'Mac',
    intro: 'Adding the book to your Mac puts it in Apple Books, and it can sync to your iPhone or iPad from there.',
    steps: [
      'Download the <strong>single audiobook file (M4B)</strong>.',
      'Double-click the file. It opens in <strong>Apple Books</strong> and is added to <strong>Audiobooks</strong> in your library.',
      'To copy it to your iPhone or iPad, connect the device, open <strong>Finder</strong>, select the device in the sidebar, choose the <strong>Audiobooks</strong> tab, tick the book, and click <strong>Sync</strong>.',
    ],
    tip: 'If you downloaded the MP3 chapters instead, drag them into the Music app, select them all, choose Song › Get Info › Options, and set the media kind to Audiobook.',
  },
  {
    id: 'windows',
    label: 'Windows PC',
    intro: 'Windows plays the files with its built-in Media Player — nothing to install.',
    steps: [
      'Download <strong>Whole book, chapter by chapter</strong> (the ZIP file).',
      'Open your <strong>Downloads</strong> folder, right-click the file and choose <strong>Extract All</strong>.',
      'Open the new folder and double-click the first chapter. It plays in <strong>Media Player</strong>, and the other chapters follow in order.',
    ],
    tip: 'VLC media player (free) is a good alternative and lets you change the playback speed. To put the book on a phone, copy the folder over with a USB cable and follow the iPhone or Android steps.',
  },
  {
    id: 'screen-reader',
    label: 'Screen readers',
    intro: 'Every control on this page works with a keyboard and screen reader.',
    steps: [
      'Use your screen reader’s heading navigation to jump to <strong>Download the book</strong>, then to <strong>Chapters</strong>.',
      'Each chapter has its own play button and its own download link, labelled with the chapter title.',
      'The <strong>references and image descriptions</strong> document at the bottom of this page comes as a Word file and a PDF, so you can follow citations and figures while you listen.',
    ],
    tip: 'BookPlayer (iOS) and Voice (Android) both work well with VoiceOver and TalkBack.',
  },
];

function audiobookPage() {
  const b = bookBySlug[audiobook.book];
  const tracksReady = audiobook.tracks.filter((t) => has(t.file));
  return page(
    '/audiobook/',
    'Free Audiobook',
    `Download the audiobook of ${b.title} for free, with step-by-step help for iPhone, Android, Mac, Windows and screen readers.`,
    `
<header class="page-head page-head--audio">
  <div class="wrap page-head__grid">
    <div>
      ${breadcrumbs([['Home', '/'], ['Free Audiobook', '/audiobook/']])}
      <p class="eyebrow">Free to download and keep</p>
      <h1>Listen to <cite>${esc(b.title)}</cite></h1>
      <p class="page-head__lede">The complete audiobook, free for everyone. No account, no subscription, no app you have to use. Download it once and listen however suits you.</p>
      <ol class="steps-mini">
        <li><a href="#download-h"><span>1</span>Download the book</a></li>
        <li><a href="#devices-h"><span>2</span>Add it to your device</a></li>
        <li><a href="#resources-h"><span>3</span>References &amp; image descriptions</a></li>
      </ol>
    </div>
    <div class="page-head__cover">${cover(b)}</div>
  </div>
</header>

<section class="section section--flush-top" aria-labelledby="download-h">
  <div class="wrap narrow">
    <h2 id="download-h" class="step-h"><span class="step-h__n" aria-hidden="true">1</span>Download the book</h2>
    ${audiobook.narration || audiobook.runtime ? `<p class="meta-line">${[audiobook.narration, audiobook.runtime].filter(Boolean).map(esc).join(' · ')}</p>` : ''}
    <p>Not sure which to pick? Choose the <strong>ZIP</strong> — it works everywhere.</p>
    <div class="download-list">${join(audiobook.fullDownloads, (d) => download(d.file, d.label, d.note, d))}</div>

    <h3 id="chapters-h" class="sub-h">Chapters</h3>
    ${
      tracksReady.length
        ? `<p>Play a chapter here in your browser, or download chapters one at a time.</p>
    <ol class="tracks">${join(
      tracksReady,
      (t) => `<li class="track">
        <span class="track__title">${esc(t.title)}${t.reader ? `<span class="track__reader">Read by ${esc(t.reader)}</span>` : ''}</span>
        <audio controls preload="none" src="/assets/${esc(t.file)}" aria-label="Play: ${esc(t.title)}"></audio>
        <a class="track__dl" href="/assets/${esc(t.file)}" download>${icon('download')}<span>Download<span class="visually-hidden"> ${esc(t.title)}</span></span></a>
      </li>`,
    )}</ol>`
        : `<p class="notice">${icon('headphones')}<span>Individual chapters will appear here, ready to play in your browser, as soon as the recordings are published.</span></p>`
    }
  </div>
</section>

${
  audiobook.credits?.length
    ? `<section class="section section--flush-top" aria-labelledby="credits-h">
  <div class="wrap narrow">
    <h3 id="credits-h" class="sub-h">Audiobook credits</h3>
    <dl class="credits">${join(audiobook.credits, (c) => `<div><dt>${esc(c.role)}</dt><dd>${esc(c.names.join(', '))}</dd></div>`)}</dl>
    <p><a class="more-link" href="/team/">Meet the project team ${icon('arrow')}</a></p>
  </div>
</section>`
    : ''
}

<section class="section section--tint" aria-labelledby="devices-h">
  <div class="wrap narrow">
    <h2 id="devices-h" class="step-h"><span class="step-h__n" aria-hidden="true">2</span>Add it to your device</h2>
    <p>Pick the device you use. Menu names can differ slightly between versions.</p>
    <div class="tabs" data-tabs data-tabs-hash data-tabs-guess>
      <div class="tabs__list" role="tablist" aria-label="Choose your device" hidden>
        ${join(PLATFORMS, (p, i) => `<button type="button" role="tab" id="tab-${p.id}" aria-controls="panel-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(p.label)}</button>`)}
      </div>
      ${join(
        PLATFORMS,
        (p) => `<section class="tabs__panel" id="panel-${p.id}" role="tabpanel" aria-labelledby="tab-${p.id}" tabindex="0">
        <h3 class="tabs__heading">${esc(p.label)}</h3>
        <p>${p.intro}</p>
        <ol class="howto">${join(p.steps, (s) => `<li>${s}</li>`)}</ol>
        <p class="tip"><strong>Tip:</strong> ${p.tip}</p>
      </section>`,
      )}
    </div>
    <div class="callout">
      <h3>What about Audible, Spotify, or Libby?</h3>
      <p>Those services only play audiobooks bought or borrowed through them, so they can’t open these files. Any of the free players above will work instead — or simply play the chapters on this page.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="resources-h">
  <div class="wrap narrow">
    <h2 id="resources-h" class="step-h"><span class="step-h__n" aria-hidden="true">3</span>References &amp; image descriptions</h2>
    ${join(accessibleResources, (r) => `<p>${esc(r.description)}</p><div class="download-list">${join(r.files, (f) => download(f.file, `${r.title} — ${f.label}`))}</div>`)}
    <p class="help">Having trouble? <a href="mailto:${esc(site.contactEmail)}?subject=${encodeURIComponent('Audiobook help')}">Email us</a> and tell us what device you’re using — we’re happy to help.</p>
  </div>
</section>`,
    'audio-page',
  );
}

// ─── Authors ─────────────────────────────────────────────────────────────────

function authorsIndex() {
  return page(
    '/authors/',
    'Authors',
    'Pamela Block, Allison C. Carey, and Richard K. Scotch — authors of Allies and Obstacles and editors of Family and Disability Activism.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Authors', '/authors/']])}
    <h1>Authors &amp; editors</h1>
    <p class="page-head__lede">An anthropologist and two sociologists, in Canada and the United States, who have spent their careers studying disability, activism, and family.</p>
  </div>
</header>
<section class="section section--flush-top">
  <div class="wrap">
    <ul class="author-grid" role="list">${join(
      authors,
      (a) => `<li class="author-card author-card--${a.accent} reveal">
        ${avatar(a)}
        ${a.tribute ? `<p class="eyebrow">In memory · ${esc(a.lifespan)}</p>` : ''}
        <h2><a href="/authors/${a.slug}/">${esc(a.name)}</a></h2>
        <p class="author-card__role">${esc(a.role)}</p>
        <p>${rich(firstSentence(a.bio[a.tribute ? 1 : 0]))}</p>
        <span class="more-link" aria-hidden="true">${a.tribute ? 'Read the tribute' : 'Full profile'} ${icon('arrow')}</span>
      </li>`,
    )}</ul>
  </div>
</section>`,
  );
}

// First sentence of a bio, without stopping at initials such as "Allison C. Carey"
function firstSentence(text) {
  const m = text.match(/^.*?[a-z0-9)”’][.!?](?=\s+[A-Z“‘*]|$)/s);
  return (m ? m[0] : text).trim();
}

// Occupying Disability contents, set out like the Family and Disability Activism contents
function odContents() {
  const names = (list) => {
    const who = list.map((n) => (n === 'Pamela Block' ? `<strong>${esc(n)}</strong>` : esc(n)));
    return who.length > 2 ? `${who.slice(0, -1).join(', ')}, and ${who.at(-1)}` : who.join(' and ');
  };
  let n = 0;
  return `<section class="od" aria-labelledby="od-h">
    <h2 id="od-h">Inside <cite>Occupying Disability</cite></h2>
    <p>${esc(OD.publisher)}, edited by ${esc(OD.editors)}. Every chapter and its authors, grouped by the book’s three parts. Chapter titles link to the chapter on ${link(OD.url, 'Springer')}.</p>
    ${join(
      OD.parts,
      (p, i) => `<details class="od__part"${i === 0 ? ' open' : ''}>
      <summary><span class="od__k">Part ${i + 1}</span> ${esc(p.title)} <span class="od__count">${p.chapters.length} chapters</span></summary>
      <ol class="fda-toc" role="list">${join(p.chapters, (c) => {
        n += 1;
        return `<li><span class="fda-toc__n">${n}</span><div><p class="fda-toc__t">${link(c.url, esc(c.title))}</p><p class="fda-toc__a">${names(c.authors)}</p></div><span class="fda-toc__p"><span class="visually-hidden">pages </span>${esc(c.pages)}</span></li>`;
      })}</ol>
    </details>`,
    )}
  </section>`;
}

function pubList(pubs) {
  return `<ul class="pub-list" role="list">${join(
    pubs,
    (p) => `<li><cite class="pub-list__title">${p.url ? link(p.url, esc(p.title)) : esc(p.title)}</cite><span class="pub-list__detail">${esc(p.detail)}</span></li>`,
  )}</ul>`;
}

function authorPage(a) {
  const tribute = a.tribute;
  return page(
    `/authors/${a.slug}/`,
    tribute ? `Remembering ${a.name}` : a.name,
    tribute ? `A tribute to our co-author ${a.name} (${a.lifespan}).` : `${a.name}, ${a.role}.`,
    `
<header class="page-head${tribute ? ' page-head--tribute' : ''}">
  <div class="wrap person-head">
    <div>
      ${breadcrumbs([['Home', '/'], ['Authors', '/authors/'], [a.name, `/authors/${a.slug}/`]])}
      ${tribute ? `<p class="eyebrow">In memory</p>` : ''}
      <h1>${esc(a.name)}</h1>
      ${tribute ? `<p class="person-head__life">${esc(a.lifespan)}</p>` : ''}
      <p class="page-head__lede">${esc(a.role)}</p>
    </div>
    ${avatar(a)}
  </div>
</header>

<div class="wrap person-body">
  <div class="prose">
    <h2 class="visually-hidden">${tribute ? 'His life and work' : 'Biography'}</h2>
    ${join(a.bio, (p, i) => `<p${tribute && i === a.bio.length - 1 ? ' class="tribute-close"' : i === 0 ? ' class="lead"' : ''}>${rich(p)}</p>`)}


    ${
      a.slug === 'pamela-block'
        ? `<h2>Research</h2><ul class="research-links" role="list">${join(
            researchPages,
            (r) => `<li><a class="research-link research-link--${r.accent}" href="/authors/pamela-block/${r.slug}/"><span class="research-link__k">${esc(r.title)}</span><span class="research-link__t">${esc(r.lede.split(' — ')[0].split('. ')[0])}.</span>${icon('arrow')}</a></li>`,
          )}</ul>`
        : ''
    }

    <h2>${tribute ? 'His books' : 'Selected publications'}</h2>
    ${pubList(a.publications)}

    ${a.slug === 'pamela-block' ? odContents() : ''}

    ${a.honors ? `<h2>Honors</h2><ul class="pub-list" role="list">${join(a.honors, (h) => `<li><span class="pub-list__title">${esc(h.name)}</span><span class="pub-list__detail">${h.year}</span></li>`)}</ul>` : ''}
  </div>
  <aside class="person-side" aria-label="More">
    <div class="side-card">
      <h2>${tribute ? 'Remembering Richard' : 'Find out more'}</h2>
      <ul class="link-list" role="list">${join(a.links, (l) => `<li>${link(l.url, esc(l.label))}</li>`)}</ul>
    </div>
    <div class="side-card">
      <h2>Other authors</h2>
      <ul class="link-list" role="list">${join(authors.filter((x) => x !== a), (x) => `<li><a href="/authors/${x.slug}/">${esc(x.name)}</a></li>`)}</ul>
    </div>
  </aside>
</div>`,
    tribute ? 'tribute-page' : '',
  );
}


// ─── Pam's research pages ────────────────────────────────────────────────────

function researchPage(r) {
  const other = researchPages.find((x) => x !== r);
  const ext = (url, label) => link(url, esc(label));
  return page(
    `/authors/pamela-block/${r.slug}/`,
    `${r.title} · Pamela Block`,
    `${r.lede}`,
    `
<header class="page-head research-head research-head--${r.accent}">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Authors', '/authors/'], ['Pamela Block', '/authors/pamela-block/'], [r.nav, `/authors/pamela-block/${r.slug}/`]])}
    <p class="eyebrow">${esc(r.eyebrow)}</p>
    <h1>${esc(r.title)}</h1>
    <p class="page-head__lede">${rich(r.lede)}</p>
    <nav class="research-tabs" aria-label="Research areas"><ul role="list">${join(
      researchPages,
      (x) => `<li><a href="/authors/pamela-block/${x.slug}/"${x === r ? ' aria-current="page"' : ''}>${esc(x.nav)}</a></li>`,
    )}</ul></nav>
  </div>
</header>

<div class="wrap person-body">
  <div>
    <section class="block prose" aria-labelledby="overview-h">
      <h2 id="overview-h" class="block__h">Overview</h2>
      ${join(r.intro, (p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${rich(p)}</p>`)}
    </section>

    <section class="block" aria-labelledby="themes-h">
      <h2 id="themes-h" class="block__h">Themes</h2>
      <ul class="ideas" role="list">${join(
        r.themes,
        (t, i) => `<li class="idea idea--${ACCENTS[i % 3]} reveal"><h3>${esc(t.k)}</h3><p>${rich(t.text)}</p></li>`,
      )}</ul>
    </section>

    <section class="block" aria-labelledby="projects-h">
      <h2 id="projects-h" class="block__h">Projects</h2>
      <ol class="projects" role="list">${join(
        r.projects,
        (p) => `<li class="project reveal">
          <p class="project__years">${esc(p.years)}</p>
          <div>
            <h3 class="project__title">${esc(p.title)}</h3>
            <p class="project__role">${esc(p.role)}</p>
            <p>${rich(p.text)}</p>
            ${p.url ? `<p class="project__link">${ext(p.url, p.urlLabel || 'Learn more')}</p>` : ''}
          </div>
        </li>`,
      )}</ol>
    </section>

    <section class="block" aria-labelledby="pubs-h">
      <h2 id="pubs-h" class="block__h">Selected publications</h2>
      <ul class="pub-list" role="list">${join(
        r.publications,
        (p) => `<li><cite class="pub-list__title">${p.url ? ext(p.url, p.title) : esc(p.title)}</cite><span class="pub-list__detail">${esc(p.detail)}</span></li>`,
      )}</ul>
    </section>

    ${
      r.media?.length
        ? `<section class="block" aria-labelledby="media-h"><h2 id="media-h" class="block__h">In the news</h2><ul class="pub-list" role="list">${join(
            r.media,
            (m) => `<li><span class="pub-list__title">${esc(m.split(' — ')[0])}</span><span class="pub-list__detail">${esc(m.split(' — ').slice(1).join(' — '))}</span></li>`,
          )}</ul></section>`
        : ''
    }
  </div>

  <aside class="person-side" aria-label="More">
    <div class="side-card side-card--awards">
      <h2>${icon('award')}Recognition</h2>
      <ul role="list" class="link-list">${join(r.recognition, (x) => `<li>${rich(x)}</li>`)}</ul>
    </div>
    <div class="side-card">
      <h2>More from Pam</h2>
      <ul class="link-list" role="list">
        <li><a href="/authors/pamela-block/">Profile and books</a></li>
        <li><a href="/authors/pamela-block/${other.slug}/">${esc(other.title)}</a></li>
        <li><a href="http://pamelablock.blogspot.com/" rel="noopener">Pam’s blog${icon('external', 'icon icon--ext')}<span class="visually-hidden"> (external site)</span></a></li>
        <li><a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></li>
      </ul>
    </div>
  </aside>
</div>`,
    `research-page research-page--${r.accent}`,
  );
}

// ─── Contributors ────────────────────────────────────────────────────────────

function contributorsPage() {
  const updates = contributors
    .flatMap((c) => (c.updates || []).map((u) => ({ ...u, who: c })))
    .sort((x, y) => String(y.date).localeCompare(String(x.date)));
  const hasProfile = (c) => c.bio || c.links?.length || c.updates?.length;
  const profiled = contributors.filter(hasProfile);
  const pending = contributors.filter((c) => !hasProfile(c));
  const fmtDate = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return page(
    '/contributors/',
    'Contributors',
    `The chapter authors of ${FDA.title}, with links to their work and their latest news.`,
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Contributors', '/contributors/']])}
    <p class="eyebrow"><cite>${esc(FDA.title)}</cite></p>
    <h1>Chapter contributors</h1>
    <p class="page-head__lede">The activists, parents, scholars, and self-advocates who wrote <cite>${esc(FDA.title)}</cite>. Follow their work, read what they’ve published since, and find out what they’re doing now.</p>
  </div>
</header>

${
  updates.length
    ? `<section class="section section--flush-top" aria-labelledby="updates-h">
  <div class="wrap narrow">
    <h2 id="updates-h">Latest news</h2>
    <ul class="updates" role="list">${join(
      updates.slice(0, 8),
      (u) => `<li><time datetime="${esc(u.date)}">${fmtDate(u.date)}</time><p><a href="#${slugify(u.who.name)}">${esc(u.who.name)}</a>: ${u.url ? link(u.url, esc(u.text)) : esc(u.text)}</p></li>`,
    )}</ul>
  </div>
</section>`
    : ''
}

<section class="section section--flush-top" aria-labelledby="all-h">
  <div class="wrap">
    <h2 id="all-h" class="visually-hidden">Contributor profiles</h2>
    <ul class="contrib-list" role="list">${join(profiled, (c, i) => contributorCard(c, ACCENTS[i % 3]))}</ul>
    ${
      pending.length
        ? `<div class="contrib-more">
      <h2 id="more-h">Also in this volume</h2>
      <p>Profiles are added as contributors send them in.</p>
      <ul class="contrib-names" role="list" aria-labelledby="more-h">${join(pending, (c) => `<li id="${slugify(c.name)}"><strong>${esc(c.name)}</strong>${c.chapter ? chapterLine(c.chapter) : ''}</li>`)}</ul>
    </div>`
        : ''
    }
  </div>
</section>

<section class="section section--tint" aria-labelledby="yours-h">
  <div class="wrap narrow">
    <div class="callout callout--flat">
      <h2 id="yours-h">Are you a contributor?</h2>
      <p>We’d love to share your work. Send us a short bio, a photo if you’d like one, links to your publications or website, and any news — a new article, a talk, an award — and we’ll add it here. You can send updates any time.</p>
      <p>${button(`mailto:${site.contactEmail}?subject=${encodeURIComponent('Contributor page: my information')}`, 'Send your information', { ic: 'mail' })}</p>
    </div>
  </div>
</section>`,
  );
}

// "4. Title" → "Chapter 4" label plus the title in italics, as the press prints it
function chapterLine(ch) {
  const m = ch.match(/^(\d+)\.\s*(.*)$/);
  return `<p class="contrib-card__chapter">${m ? `<span>Chapter ${m[1]}</span> ` : ''}<cite>${esc(m ? m[2] : ch)}</cite></p>`;
}

function contributorCard(c, accent) {
  const id = slugify(c.name);
  return `<li class="contrib-card reveal" id="${id}">
    <div class="contrib-card__photo">${avatar(c, accent)}</div>
    <div class="contrib-card__body">
      <h3>${esc(c.name)}</h3>
      ${c.pronouns ? `<p class="contrib-card__pronouns">${esc(c.pronouns)}</p>` : ''}
      ${c.chapter ? chapterLine(c.chapter) : ''}
    ${c.note ? `<p class="contrib-card__note">${esc(c.note)}</p>` : ''}
    ${c.bio ? `<p class="contrib-card__bio">${rich(c.bio)}</p>` : ''}
    ${c.links?.length ? `<ul class="contrib-card__links" role="list" aria-label="${esc(c.name)} online">${join(c.links, (l) => `<li>${link(l.url, esc(l.label))}</li>`)}</ul>` : ''}
    ${
      c.updates?.length
        ? `<div class="contrib-card__updates"><p class="mini-h">Updates</p><ul role="list">${join(
            c.updates,
            (u) => `<li><time datetime="${esc(u.date)}">${esc(u.date)}</time> ${u.url ? link(u.url, esc(u.text)) : esc(u.text)}</li>`,
          )}</ul></div>`
        : ''
    }
    </div>
  </li>`;
}

// ─── Media & resources ───────────────────────────────────────────────────────

function mediaPage() {
  const usedTypes = Object.keys(mediaTypes).filter((t) => media.some((m) => m.type === t));
  return page(
    '/media/',
    'Media & Resources',
    'Reviews, podcasts, talks, articles, and study guides for Allies and Obstacles and Family and Disability Activism.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Media & Resources', '/media/']])}
    <h1>Media &amp; resources</h1>
    <p class="page-head__lede">Reviews, podcast conversations, talks, articles, and teaching materials for both books.</p>
  </div>
</header>
<section class="section section--flush-top" aria-labelledby="list-h">
  <div class="wrap">
    <h2 id="list-h" class="visually-hidden">All media</h2>
    <form class="filters" data-filters data-filter-list="[data-media-list] > li" hidden aria-label="Filter media">
      <fieldset>
        <legend>Type</legend>
        <div class="seg seg--wrap">
          <label><input type="radio" name="type" value="" checked><span>All</span></label>
          ${join(usedTypes, (t) => `<label><input type="radio" name="type" value="${t}"><span>${mediaTypes[t].plural}</span></label>`)}
        </div>
      </fieldset>
      <fieldset>
        <legend>Book</legend>
        <div class="seg seg--wrap">
          <label><input type="radio" name="book" value="" checked><span>Both books</span></label>
          ${join(books, (b) => `<label><input type="radio" name="book" value="${b.slug}"><span>${esc(b.short)}</span></label>`)}
        </div>
      </fieldset>
      <p class="filters__count" aria-live="polite" data-count></p>
    </form>
    <ul class="media-list media-list--grid" role="list" data-media-list>${join(media, (m) => mediaItem(m))}</ul>
    <p class="notice" data-empty hidden>Nothing matches those filters yet.</p>
  </div>
</section>
<section class="section section--tint" aria-labelledby="teach-h">
  <div class="wrap narrow">
    <h2 id="teach-h">For teachers and reading groups</h2>
    <p>Both books have free study guides from Temple University Press. For <cite>Allies and Obstacles</cite>, our <a href="/books/allies-and-obstacles/#inside">chapter guide</a> adds a summary and discussion questions for every chapter.</p>
    <div class="btn-row">${join(books, (b) => button(b.studyGuideUrl, `Study guide: <cite>${esc(b.short)}</cite>`, { variant: 'ghost', ic: 'doc' }))}</div>
    <p class="help">Know of a review, interview, or syllabus we’ve missed? <a href="mailto:${esc(site.contactEmail)}?subject=${encodeURIComponent('Media for the website')}">Let us know</a>.</p>
  </div>
</section>`,
  );
}

// ─── Accessibility statement & 404 ───────────────────────────────────────────

function teamPage() {
  return page(
    '/team/',
    'Project Team',
    'The student team at Western University who built this website and produced the free audiobook.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Project team', '/team/']])}
    <p class="eyebrow">Western University</p>
    <h1>Project team</h1>
    <p class="page-head__lede">The students working with Dr. Pamela Block who built this website and produced the free audiobook of <cite>${esc(FDA.title)}</cite>.</p>
  </div>
</header>
<section class="section section--flush-top" aria-labelledby="team-h">
  <div class="wrap">
    <h2 id="team-h" class="visually-hidden">Team members</h2>
    <ul class="contrib-list" role="list">${join(
      team,
      (m, i) => `<li class="contrib-card${m.bio ? '' : ' contrib-card--compact'}" id="${slugify(m.name)}">
      <div class="contrib-card__photo">${avatar(m, ACCENTS[i % 3])}</div>
      <div class="contrib-card__body">
        <h3>${esc(m.name)}</h3>
        ${m.pronouns ? `<p class="contrib-card__pronouns">${esc(m.pronouns)}</p>` : ''}
        <p class="contrib-card__chapter">${esc(m.role)}</p>
        ${m.bio ? `<p class="contrib-card__bio">${rich(m.bio)}</p>` : ''}
        ${m.links?.length ? `<ul class="contrib-card__links" role="list" aria-label="${esc(m.name)} online">${join(m.links, (l) => `<li>${link(l.url, esc(l.label))}</li>`)}</ul>` : ''}
      </div>
    </li>`,
    )}</ul>
  </div>
</section>`,
  );
}

function accessibilityPage() {
  return page(
    '/accessibility/',
    'Accessibility',
    'How this website is built to be accessible, and how to tell us about a barrier.',
    `
<header class="page-head">
  <div class="wrap">
    ${breadcrumbs([['Home', '/'], ['Accessibility', '/accessibility/']])}
    <h1>Accessibility</h1>
    <p class="page-head__lede">These are books about disability. This website should work for everyone who wants to read about them.</p>
  </div>
</header>
<div class="wrap narrow prose section section--flush-top">
  <h2>What we’ve done</h2>
  <ul>
    <li>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</li>
    <li>Every page can be used with a keyboard alone, and works with screen readers such as VoiceOver, NVDA, JAWS, and TalkBack.</li>
    <li>Body text is set in Atkinson Hyperlegible, a typeface designed by the Braille Institute for readers with low vision.</li>
    <li>The <strong>Display</strong> button at the top of every page lets you enlarge text, switch to high contrast, choose a light or dark theme, and turn off animation. Your choices are remembered on your device.</li>
    <li>Animation is switched off automatically if your device asks for reduced motion.</li>
    <li>The free audiobook of <cite>Family and Disability Activism</cite> comes with a separate document of references and image descriptions.</li>
    <li>Every page works without JavaScript.</li>
  </ul>
  <h2>Tell us about a barrier</h2>
  <p>If something on this site doesn’t work for you, we want to know. <a href="mailto:${esc(site.contactEmail)}?subject=${encodeURIComponent('Accessibility problem on the website')}">Email us</a> with the page and what happened, and we’ll fix it — or get you the information another way.</p>
</div>`,
  );
}

function notFound() {
  return page(
    '/404.html',
    'Page not found',
    null,
    `
<header class="page-head">
  <div class="wrap narrow">
    <p class="eyebrow">Error 404</p>
    <h1>We couldn’t find that page</h1>
    <p class="page-head__lede">It may have moved. Try one of these instead:</p>
    <ul class="link-list link-list--big" role="list">
      <li><a href="/">Home</a></li>
      ${join(books, (b) => `<li><a href="/books/${b.slug}/">${esc(b.title)}</a></li>`)}
      <li><a href="/audiobook/">Free audiobook</a></li>
      <li><a href="/timeline/">Timeline</a></li>
      <li><a href="/authors/">Authors</a></li>
    </ul>
  </div>
</header>`,
  );
}

export function allPages() {
  return [
    home(),
    booksIndex(),
    aoPage(AO),
    fdaPage(FDA),
    timelinePage(),
    audiobookPage(),
    authorsIndex(),
    ...authors.map(authorPage),
    ...researchPages.map(researchPage),
    contributorsPage(),
    teamPage(),
    mediaPage(),
    accessibilityPage(),
    notFound(),
  ];
}
