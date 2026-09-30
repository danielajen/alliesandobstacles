# alliesandobstacles.com

The website for **Allies and Obstacles** (2020) and **Family and Disability Activism** (2025) by Pamela Block, Allison C. Carey, and Richard K. Scotch (Temple University Press).

It's a static site with no dependencies. `build.mjs` turns the files in `content/` into HTML in `dist/`, and GitHub Actions publishes it to GitHub Pages on every push to `main`.

```bash
npm run dev              # build and preview at http://localhost:8080
npm run check            # build and check every internal link
npm run check:external   # also check outside links
```

## Editing content

| File | What's in it |
| --- | --- |
| `content/site.mjs` | Book details, buy links, awards, praise, and every review, podcast, talk, and study guide |
| `content/book.mjs` | The *Allies and Obstacles* chapter guide, key ideas, research figures, the timeline, and citations |
| `content/people.mjs` | Author bios and publications, the tribute to Richard, and the chapter contributors |
| `content/audiobook.mjs` | Audiobook tracks and the references and image descriptions document |

- Wrap a book title in `*asterisks*` to put it in italics.
- Put downloads in `assets/downloads/` using the file names in `content/audiobook.mjs`. Until a file is there, the page shows "Coming soon" instead of a broken link.
- Push to `main` and the site rebuilds itself.

## Hosting (GitHub Pages)

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes the site. The first run starts on the next push, or from the **Actions** tab. The site then appears at `https://<account>.github.io/<repo>/`, and links adjust to that sub-path automatically.

### Using alliesandobstacles.com

The domain is registered at DreamHost. To serve the site at `alliesandobstacles.com` instead of the `github.io` address:

1. In the DreamHost panel, go to **Domains → DNS** for `alliesandobstacles.com`. Remove any existing A records for the bare domain, then add:
   - `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`
   - a `CNAME` record for `www` pointing to `<account>.github.io`
2. In GitHub, go to **Settings → Pages → Custom domain**, enter `alliesandobstacles.com`, save, and tick **Enforce HTTPS** once the check passes.

The next build switches canonical URLs, the sitemap, and share previews to the custom domain automatically.
