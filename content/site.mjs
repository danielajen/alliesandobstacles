// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT
//  Almost everything you'll want to change lives in this folder.
//  After editing, run `npm run build` (or `npm run dev` to preview).
//  Fields marked `// CONFIRM` should be checked with Pam before launch.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Allies & Obstacles',
  url: 'https://alliesandobstacles.com',
  tagline: 'Two books on disability, family, and the long work of activism.',
  description:
    'The home of Allies and Obstacles and Family and Disability Activism, by Pamela Block, Allison C. Carey, and Richard K. Scotch. Where to buy, reviews, podcasts, study guides, a free audiobook, and news from our contributors.',
  // Shown in the footer.
  contactEmail: 'pblock@uwo.ca', // CONFIRM: which address Pam wants public
  publisher: {
    name: 'Temple University Press',
    url: 'https://tupress.temple.edu',
  },
};

export const books = [
  {
    slug: 'allies-and-obstacles',
    short: 'Allies and Obstacles',
    title: 'Allies and Obstacles',
    subtitle: 'Disability Activism and Parents of Children with Disabilities',
    byline: 'Allison C. Carey, Pamela Block, and Richard K. Scotch',
    role: 'Authors',
    year: 2020,
    published: 'June 2020',
    pages: 348,
    accent: 'red',
    // Set to e.g. 'assets/covers/allies-and-obstacles.jpg' once Pam confirms we
    // may show the cover. Until then a typographic cover is drawn instead.
    coverImage: 'assets/covers/allies-and-obstacles.jpg',
    coverAlt: 'Cover of Allies and Obstacles: a painted red heart outlined in blue over a sweep of green, splattered with red, blue, and yellow paint',
    hook: 'When parents fight for their disabled children, whose voice leads?',
    lccn: '2019042677',
    summary: [
      'Parents of children with disabilities have been among the most powerful forces in American disability policy — winning the right to a public education, pushing people out of institutions and into communities, and taking their fight to courts and legislatures. Yet many disabled activists have experienced parent advocacy as something that speaks over them rather than with them.',
      '*Allies and Obstacles* traces that relationship across the twentieth and twenty-first centuries. Using a social-movement lens and four case studies — intellectual disability, psychiatric disability, autism, and physical disabilities such as cerebral palsy and muscular dystrophy — the authors show when parents and disabled activists have worked together, when they have clashed, and what each movement has gained and lost along the way.',
    ],
    formats: [
      { format: 'Paperback', isbn: '9781439916339', price: '$34.95' },
      { format: 'eBook', isbn: '9781439916346', price: '$34.95' },
      { format: 'Hardcover', isbn: '9781439916322', price: '$109.50' },
    ],
    buyUrl: 'https://tupress.temple.edu/books/allies-and-obstacles',
    studyGuideUrl: 'https://tupress.temple.edu/study-guides/allies-and-obstacles',
    awards: [
      {
        year: 2022,
        name: 'Outstanding Publication Award',
        from: 'Section on Disability in Society, American Sociological Association',
      },
      {
        year: 2021,
        name: 'Scholarly Achievement Award',
        from: 'North Central Sociological Association',
      },
    ],
    praise: [],
  },
  {
    slug: 'family-and-disability-activism',
    short: 'Family and Disability Activism',
    title: 'Family and Disability Activism',
    subtitle: 'Beyond Allies and Obstacles',
    byline: 'Edited by Pamela Block, Allison C. Carey, and Richard K. Scotch',
    role: 'Editors',
    year: 2025,
    published: 'June 2025',
    pages: 188,
    accent: 'blue',
    coverImage: 'assets/covers/family-and-disability-activism.jpg',
    coverAlt: 'Cover of Family and Disability Activism: a painting of a baby with medical tubes asleep in a green bassinet, in a room with flower pictures and a giraffe growth chart',
    hook: 'BIPOC and LGBTQIA2S+ disabled activists and families, in their own words.',
    summary: [
      '*Family and Disability Activism* picks up where *Allies and Obstacles* left off. Instead of studying four disability communities from the outside, it gathers first-person, cross-disability stories from disabled people and family members who identify as BIPOC and/or LGBTQIA2S+.',
      'The contributors show how race, ethnicity, gender, and sexuality shape the way families meet segregation, institutionalization, and the special-education system — and how activists who live at those intersections are moving the conversation from rights toward justice.',
    ],
    formats: [
      { format: 'Paperback', isbn: '9781439923894', price: '$19.95' },
      { format: 'eBook', isbn: '9781439923900', price: '$19.95' },
      { format: 'Hardcover', isbn: '9781439923887', price: '$99.50' },
      { format: 'Audiobook', isbn: null, price: 'Free', href: '/audiobook/' },
    ],
    buyUrl: 'https://tupress.temple.edu/books/family-and-disability-activism',
    studyGuideUrl: 'https://tupress.temple.edu/study-guides/family-and-disability-activism',
    awards: [],
    praise: [
      {
        quote: 'The best short anthology I’ve read on disability justice activism in years.',
        who: 'Kerima Çevik',
      },
    ],
  },
];

// ─── Media, reviews, podcasts, study guides ──────────────────────────────────
// type: 'review' | 'podcast' | 'interview' | 'talk' | 'study-guide' | 'article'
// book: a book slug above, or 'both'
export const media = [
  // Family and Disability Activism
  {
    type: 'review',
    book: 'family-and-disability-activism',
    title: 'Review in History: Reviews of New Books',
    source: 'History: Reviews of New Books, vol. 54, no. 3',
    year: 2026,
    url: 'https://www.tandfonline.com/doi/full/10.1080/03612759.2026.2646738',
  },
  {
    type: 'review',
    book: 'family-and-disability-activism',
    title: 'Review in Disability & Society',
    source: 'Disability & Society',
    year: 2025,
    url: 'https://www.tandfonline.com/doi/full/10.1080/09687599.2025.2538968',
  },
  // Wordgathering review by Rachael A. Zubal-Ruggieri — the link was returning
  // "Not Found" in Sept 2026. Uncomment once wordgathering.com is back up:
  // {
  //   type: 'review',
  //   book: 'family-and-disability-activism',
  //   title: 'Review by Rachael A. Zubal-Ruggieri',
  //   source: 'Wordgathering, vol. 19, no. 2',
  //   year: 2025,
  //   url: 'https://wordgathering.com/vol19/issue2s/block-carey-scotch/',
  // },
  {
    type: 'study-guide',
    book: 'family-and-disability-activism',
    title: 'Study guide for Family and Disability Activism',
    source: 'Temple University Press',
    year: 2025,
    url: 'https://tupress.temple.edu/study-guides/family-and-disability-activism',
  },

  // Allies and Obstacles
  {
    type: 'podcast',
    book: 'allies-and-obstacles',
    title: 'Barrier Free Futures with Allison C. Carey, Pamela Block, and Richard K. Scotch',
    source: 'Barrier Free Futures',
    year: 2023,
    url: 'https://sites.libsyn.com/63596/12232023-allison-c-carey-pamela-block-richard-k-scotch',
  },
  {
    type: 'podcast',
    book: 'allies-and-obstacles',
    title: 'Episode 42: Allyship and parent activism',
    source: 'Disability History Association Podcast',
    year: 2023,
    url: 'https://podcasts.apple.com/nz/podcast/podcast-episode-42-allyship-parent-activism-and/id1660996319?i=1000632958911',
  },
  {
    type: 'podcast',
    book: 'allies-and-obstacles',
    title: 'Episode 24: Allies and Obstacles with the authors',
    source: 'Beyond Awareness, with Diana Pastora Carson',
    year: null,
    url: 'https://www.dianapastoracarson.com/podcasts/beyond-awareness-disability-awareness-that-matters/episodes/2147799613',
  },
  {
    type: 'talk',
    book: 'allies-and-obstacles',
    title: 'Disability Activism book talk',
    source: 'Institute on Disabilities, Temple University',
    year: null,
    url: 'https://disabilities.temple.edu/miniseries/book-talk',
  },
  {
    type: 'review',
    book: 'allies-and-obstacles',
    title: 'Review by Amy Heider',
    source: 'Society for Disability Studies',
    year: 2025,
    url: 'https://disstudies.org/2025/07/28/allies-and-obstacles-disability-activism-and-parents-of-children-with-disabilities-review-by-amy-heider/',
  },
  {
    type: 'review',
    book: 'allies-and-obstacles',
    title: 'Review by Neil Dhingra',
    source: 'H-Disability, H-Net Reviews',
    year: 2021,
    url: 'https://networks.h-net.org/node/4189/reviews/7490422/dhingra-carey-and-block-and-scotch-allies-and-obstacles-disability',
  },
  // Wordgathering vol. 14 no. 4 review — link returning "Not Found" in Sept 2026:
  // https://wordgathering.com/vol14/issue4/reviews/carey-block-scotch/
  {
    type: 'review',
    book: 'allies-and-obstacles',
    title: 'Review in Future Reflections',
    source: 'National Federation of the Blind',
    year: 2021,
    url: 'https://nfb.org/images/nfb/publications/fr/fr40/2/fr400212.htm',
  },
  {
    type: 'article',
    book: 'allies-and-obstacles',
    title: 'Sometimes Allies: Parent-Led Disability Organizations and Social Movements',
    source: 'Disability Studies Quarterly 39, no. 1 — an earlier version of Chapter 6',
    year: 2019,
    url: 'https://dsq-sds.org/article/view/6281/5183',
  },
  {
    type: 'study-guide',
    book: 'allies-and-obstacles',
    title: 'Study guide for Allies and Obstacles',
    source: 'Temple University Press',
    year: 2020,
    url: 'https://tupress.temple.edu/study-guides/allies-and-obstacles',
  },
];

export const mediaTypes = {
  review: { label: 'Review', plural: 'Reviews' },
  podcast: { label: 'Podcast', plural: 'Podcasts' },
  interview: { label: 'Interview', plural: 'Interviews' },
  talk: { label: 'Talk', plural: 'Talks & events' },
  'study-guide': { label: 'Study guide', plural: 'Study guides' },
  article: { label: 'Article', plural: 'Articles' },
};
