# Move the portfolio to mhabir.dev

The canonical site is `https://mhabir.dev/`. Keep the existing GitHub Pages
site active so previously shared `mehedi-hasan-abir.github.io` links can be
checked and preserved through the domain change. This checklist separates
the prepared repository changes from the one-time account settings.

## Prepared in this repository

- The real Vite template is `client/index.html`; Vite builds it to `dist/public`.
- Canonical, Open Graph, Twitter image, structured-data, sitemap, robots, and
  generated `/blog/` and `/works/` URLs use `mhabir.dev`.
- `client/public/CNAME` contains `mhabir.dev` for compatibility with the
  current branch-publishing method. GitHub Pages uses the repository setting,
  rather than this file, when publishing with a custom Actions workflow.
- `.github/workflows/pages.yml` checks and builds on pushes to `main`, then
  deploys `dist/public` as a GitHub Pages artifact. It needs the repository
  variable `VITE_GOOGLE_ANALYTICS_ID`. Browser Sentry has been removed.
- `npm run verify` checks TypeScript, tests, the build, generated metadata,
  sitemap, robots file, CNAME, and hosted CV PDF.

## Stage 1: Move the domain on the existing gh-pages deployment

The remote Pages setting is currently **Deploy from a branch → gh-pages →
/(root)**. Keep that publishing source during the domain move. This limits
the live change to the domain and URLs; switch publishing automation later.

1. For search monitoring and Google's Change of Address tool, verify the old
   site's URL-prefix property and the new `mhabir.dev` Domain property in
   Search Console before the redirect starts. Export a baseline only if
   Search Console already has data; a new property does not recreate earlier
   search history. Existing Google Analytics data is separate and stays in
   the existing Analytics property. Search Console is recommended for this
   migration but is not required to connect the domain to GitHub Pages.
   Keep ownership verification valid after the move: Google's HTML-file
   verification does not follow redirects to another domain, so use its HTML
   tag method for the old site and retain the tag in the new site's template.
2. Run `npm run verify` locally and confirm `dist/public/CNAME` contains only
   `mhabir.dev`. Commit and back up the prepared feature branch, but keep
   `.github/workflows/pages.yml` off remote `main` until Stage 2. Record
   `git ls-remote origin refs/heads/gh-pages` before publishing.
3. In GitHub account **Settings → Pages**, verify `mhabir.dev` with GitHub's
   TXT record in Cloudflare DNS. Keep the TXT record. In repository **Settings
   → Pages**, leave **Source** on `gh-pages` `/ (root)` and save **Custom
   domain** as `mhabir.dev`.
4. Immediately configure Cloudflare DNS: remove conflicting default web
   records; add DNS-only `A` records for `@` pointing to `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Add a
   DNS-only `CNAME` for `www` pointing to `mehedi-hasan-abir.github.io`.
   Avoid wildcard records. Publish the prepared build promptly once the
   DNS records are in place.
5. Publish the verified `dist/public` build to the existing branch with
   `npx gh-pages -d dist/public --branch gh-pages`. Confirm the remote
   `gh-pages` hash changed, Pages reports a successful build, and the new
   asset appears at `https://mhabir.dev/`. Enable **Enforce HTTPS** when the
   certificate is available. The legacy `npm run deploy` also checks the new
   live domain, so use it only after HTTPS resolves.
6. Test the new homepage, `/blog/`, `/works/`, `/sitemap.xml`, and
   `/images/resume.pdf`. Test redirects from matching old `github.io` paths
   and from `www.mhabir.dev`; check the final URL, HTTPS, status, and page
   content. Resolve any broken path or redirect before submitting the move
   to Google. Keep the repository and `gh-pages` branch.
7. Submit the new sitemap and **Change of Address** in Search Console after
   redirects work. Monitor branded-query traffic and indexing. Update
   GitHub/LinkedIn profiles and other links under your control. Keep old
   redirects for at least one year; longer is better for shared links.

## Stage 2: Automate publication after the domain is stable

1. In GitHub repository **Settings → Secrets and variables → Actions →
   Variables**, set `VITE_GOOGLE_ANALYTICS_ID` to the existing GA4 measurement
   ID. Browser error reporting to Sentry is disabled. Do not
   commit local `.env` values.
2. Change repository **Pages → Source** to **GitHub Actions**, then merge and
   push the prepared source and `.github/workflows/pages.yml` to `main` in
   the same cutover. A push to `main` then checks, builds, and publishes
   `dist/public` as a Pages artifact. GitHub ignores `CNAME` files in this
   publishing mode.
3. Confirm the Actions deployment succeeds and the same new-domain pages,
   CV PDF, HTTPS, and old-URL redirects still work. Leave `gh-pages` in the
   repository as a fallback; it is no longer the publishing source.

The repository is prepared locally; DNS, GitHub settings, Search Console,
remote publication, and live redirects require separate verification at cutover.

## References

- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Google's site-move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google ownership verification](https://support.google.com/webmasters/answer/9008080)
