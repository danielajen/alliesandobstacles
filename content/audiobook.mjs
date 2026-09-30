// ─────────────────────────────────────────────────────────────────────────────
//  FREE AUDIOBOOK + ACCESSIBLE RESOURCES  (Family and Disability Activism)
//
//  Drop the files into  assets/downloads/  using the names below and rebuild.
//  Anything whose file is missing shows as "Coming soon" instead of a broken
//  link, so the page is safe to publish before the recordings are ready.
// ─────────────────────────────────────────────────────────────────────────────

export const audiobook = {
  book: 'family-and-disability-activism',
  narration: null, // e.g. 'Read by the contributors'  // CONFIRM
  runtime: null, // e.g. '6 hr 40 min'

  // The whole book in one download — the easiest option for most listeners.
  fullDownloads: [
    {
      label: 'Whole book, chapter by chapter (MP3, zipped)',
      file: 'downloads/audiobook/family-and-disability-activism-mp3.zip',
      note: 'Works with every player. Unzip it, or open it straight in BookPlayer / Smart AudioBook Player.',
    },
    {
      label: 'Whole book as a single audiobook file (M4B)',
      file: 'downloads/audiobook/family-and-disability-activism.m4b',
      note: 'Keeps your place and shows chapters in Apple Books, BookPlayer and most audiobook apps.',
    },
  ],

  // One entry per track. File names are suggestions — match whatever is recorded.
  tracks: [
    { title: 'Opening credits and dedication', file: 'downloads/audiobook/00-opening.mp3' },
    { title: 'Introduction', file: 'downloads/audiobook/01-introduction.mp3' },
    // { title: 'Chapter 1 — …', file: 'downloads/audiobook/02-chapter-1.mp3' },
  ],
};

export const accessibleResources = [
  {
    title: 'References and image descriptions',
    description:
      'Every reference cited in Family and Disability Activism, together with full text descriptions of the book’s figures and tables. Made to be read alongside the audiobook or with a screen reader.',
    files: [
      { label: 'Word document (.docx)', file: 'downloads/family-and-disability-activism-references-and-image-descriptions.docx' },
      { label: 'PDF', file: 'downloads/family-and-disability-activism-references-and-image-descriptions.pdf' },
    ],
  },
];
