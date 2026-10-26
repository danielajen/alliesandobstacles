// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT
//  Almost everything you'll want to change lives in this folder.
//  After editing, run `npm run build` (or `npm run dev` to preview).
//  Fields marked `// CONFIRM` should be checked with Pam before launch.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Allies & Obstacles',
  url: 'https://alliesandobstacles.com',
  description:
    'Allies and Obstacles and Family and Disability Activism, by Allison C. Carey, Pamela Block, and Richard K. Scotch (Temple University Press): where to buy, reviews, study guides, the free audiobook, and contributors.',
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
    // Cover description from the study guide
    coverAlt: 'Cover of Allies and Obstacles: a red heart, with a blue outline on half of the heart and white outline on the other side. A green paint smear runs behind the heart. Paint splatters in red, blue, green, and yellow surround the heart.',
    hook: null,
    lccn: '2019042677',
    // Publisher's description, word for word (tupress.temple.edu/books/allies-and-obstacles)
    summary: [
      'Parents of children with disabilities often situate their activism as a means of improving the world for their child. However, some disabled activists perceive parental activism as working against the independence and dignity of people with disabilities. This thorny relationship is at the heart of the groundbreaking *Allies and Obstacles*.',
      'The authors chronicle parents’ path-breaking advocacy in arenas such as the right to education and to liberty via deinstitutionalization as well as how they engaged in legal and political advocacy. *Allies and Obstacles* provides a macro analysis of parent activism using a social movement perspective to reveal and analyze the complex—and often tense—relationship of parents to disability rights organizations and activism.',
      'The authors look at organizational and individual narratives using four case studies that focus on intellectual disability, psychiatric diagnoses, autism, and a broad range of physical disabilities including cerebral palsy and muscular dystrophy. These cases explore the specific ways in which activism developed among parents and people with disabilities, as well as the points of alliance and the key points of contestation. Ultimately, *Allies and Obstacles* develops new insights into disability activism, policy, and the family.',
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
    praise: [
      { quote: 'Through an insightful historical account, Carey, Block, and Scotch trace the goals, issue frames, tactics, strategies, and organizational forms associated with disability-based parental activism…. This book provides a careful and much-needed analysis of the interplay between parent activists and the disability rights movement…. Allies and Obstacles is a must-read not only for disability scholars in sociology and in disability studies but for scholars of social movements and political sociology.', who: 'American Journal of Sociology' },
      { quote: '(H)ighly informative…. Allies and Obstacles is an essential read that challenges facile categorizations, easy binaries, and any quick reliance on rights talk.', who: 'H-Disability' },
      { quote: '(A) thought-provoking book filled with new information about a phenomenon that has received little scholarly attention and raises questions about social movement fluidity, messiness, and complexity which should be of general interest to social movement scholars.', who: 'Mobilization' },
    ],
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
    // Cover alt text from the references and image descriptions document (Dina Dwairi)
    coverAlt: 'Cover of Family and Disability Activism: portrait of a cyborg infant in a green bassinet that also features curious birds, a growth chart, flower pictures and a dream catcher.',
    hook: 'Giving voice to a range of intersectional disability and parent experiences within social movement activism',
    // Publisher's description, word for word (tupress.temple.edu/books/family-and-disability-activism)
    summary: [
      'In 2020, Pamela Block, Allison C. Carey, and Richard K. Scotch published *Allies and Obstacles*, which examined the tensions and connections between disability activism and parents of children with disabilities. In *Family and Disability Activism*, they continue to examine these issues with a focus on the path-breaking advocacy by marginalized activists with intersectional lived experiences.',
      '*Family and Disability Activism* reveals how families and disabled people who identify as BIPOC and/or LGBTQIA2S+ understand issues of rights versus justice. Contributions by Deaf and disabled activists emphasize the frequent need for either care or independence. Other chapters show how members of the disabled community and their families must navigate systemic issues of segregation, institutionalization, and access to special education services differently depending on their ethnic and racial identities.',
      'Expanding the conversation about disability, kinship, biological and chosen families, and activism, this volume amplifies important voices in the fight for disability rights.',
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
      { quote: 'Family and Disability Activism is a book that proposes dialogue in this moment of division. An excellent expansion of Allies and Obstacles, it is the best short anthology I’ve read on disability justice activism in years. The cross-disability inclusion is on point and needed.', who: 'Kerima Çevik, Disabled Parent Activist, Creator of #AutisticWhileBlack' },
      { quote: 'Authors, families, and strategies are as diverse as disability itself; Family and Disability Activism is an exciting foray into disability activism’s history, present, and future.', who: 'Faye Ginsburg and Rayna Rapp, authors of Disability Worlds' },
      { quote: 'Concisely and compellingly, Family and Disability Activism demonstrates how culture and racial and ethnic identity affect disability activism.', who: 'History: Reviews of New Books' },
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
