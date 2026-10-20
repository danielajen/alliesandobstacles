// ─────────────────────────────────────────────────────────────────────────────
//  FREE AUDIOBOOK + ACCESSIBLE RESOURCES  (Family and Disability Activism)
//
//  Drop the files into  assets/downloads/  using the names below and rebuild.
//  Anything whose file is missing shows as "Coming soon" instead of a broken
//  link, so the page is safe to publish before the recordings are ready.
// ─────────────────────────────────────────────────────────────────────────────

export const audiobook = {
  book: 'family-and-disability-activism',
  narration: 'Read by Tiara Hettigama, Rainy Lu, and Shanshan Ma-Zhang',
  runtime: '7 hr 49 min',

  // The whole book in one download. These are too large for GitHub Pages, so
  // they live on the repository's GitHub Release and are linked by URL.
  fullDownloads: [
    {
      label: 'Whole book, chapter by chapter (MP3, zipped)',
      url: 'https://github.com/danielajen/alliesandobstacles/releases/download/audiobook-2026-10/family-and-disability-activism-mp3.zip',
      ext: 'ZIP',
      size: '386 MB',
      note: 'Works with every player. Unzip it, or open it straight in BookPlayer / Smart AudioBook Player. Includes the references and image descriptions.',
    },
    {
      label: 'Whole book as a single audiobook file (M4B)',
      url: 'https://github.com/danielajen/alliesandobstacles/releases/download/audiobook-2026-10/family-and-disability-activism.m4b',
      ext: 'M4B',
      size: '233 MB',
      note: 'Keeps your place and shows chapters in Apple Books, BookPlayer and most audiobook apps.',
    },
  ],

  // One entry per chapter, in book order (titles from the Temple University Press contents).
  tracks: [
    { title: 'Introduction', file: 'downloads/audiobook/00-introduction.mp3', reader: 'Tiara Hettigama' },
    { title: 'Chapter 1: Familial Relationships in Asian American Disability Advocacy and Activism', file: 'downloads/audiobook/01-chapter-1.mp3', reader: 'Rainy Lu' },
    { title: 'Chapter 2: Learnings from My Mother’s Couch Corner: Becoming a Latina Disability Activist', file: 'downloads/audiobook/02-chapter-2.mp3', reader: 'Rainy Lu' },
    { title: 'Chapter 3: Tàcharan: An “Autie”-Ethnographic Examination of the Biopolitics of Changelings and Cyborgs', file: 'downloads/audiobook/03-chapter-3.mp3', reader: 'Rainy Lu' },
    { title: 'Chapter 4: Empathy Deficits among Neurotypicals', file: 'downloads/audiobook/04-chapter-4.mp3', reader: 'Tiara Hettigama' },
    { title: 'Chapter 5: Black Deaf Ordinary Who Deliberately Signs', file: 'downloads/audiobook/05-chapter-5.mp3', reader: 'Rainy Lu' },
    { title: 'Chapter 6: Intersections of Deafness, Blindness, Deafblindness, and Gender', file: 'downloads/audiobook/06-chapter-6.mp3', reader: 'Tiara Hettigama' },
    { title: 'Chapter 7: Aging Out of Children’s Hospitals', file: 'downloads/audiobook/07-chapter-7.mp3', reader: 'Tiara Hettigama' },
    { title: 'Chapter 8: Survive and Thrive: How Little Lobbyists Empowers Families to Fight for Disability Justice', file: 'downloads/audiobook/08-chapter-8.mp3', reader: 'Shanshan Ma-Zhang' },
    { title: 'Chapter 9: How to Do Limitless Lifelong Self-Determination', file: 'downloads/audiobook/09-chapter-9.mp3', reader: 'Shanshan Ma-Zhang' },
  ],

  // Pam: "I do want to credit the whole team" (Oct 2026). Readers from the recording sign-up sheet.
  credits: [
    { role: 'Read by', names: ['Tiara Hettigama', 'Rainy Lu', 'Shanshan Ma-Zhang'] },
    { role: 'Audio editing', names: ['Luke Vrantsidis'] },
    { role: 'References and image descriptions', names: ['Dina Dwairi'] },
    { role: 'Website and audiobook page', names: ['Daniel Ajenifuja'] },
    { role: 'Project lead', names: ['Pamela Block'] },
  ],
};

export const accessibleResources = [
  {
    title: 'References and image descriptions',
    description:
      'Every reference cited in Family and Disability Activism, chapter by chapter, together with full text descriptions of the cover and of the book’s figures and tables. Prepared by Dina Dwairi. Made to be read alongside the audiobook or with a screen reader.',
    files: [
      { label: 'Word document (.docx)', file: 'downloads/family-and-disability-activism-references-and-image-descriptions.docx' },
      { label: 'PDF', file: 'downloads/family-and-disability-activism-references-and-image-descriptions.pdf' },
    ],
  },
];
