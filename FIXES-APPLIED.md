# Fixes Applied — SmartWorkflowLab (SEO / hygiene pass)

All changes below were applied to this codebase and validated with `astro check`
(0 errors / 0 warnings) and a production `astro build` (all 255 routes rendered,
schema + canonicals verified in the built HTML).

## Batch 1 — High priority

- **Placeholders removed** — every `[Your Company]` / `[Your Site Name]` /
  `[Your Site]` in post bodies and two author fields → `SmartWorkflowLab`
  (8 posts).
- **Broken internal links fixed** — ~16 links that pointed to non-existent pages
  were either repointed to a real, relevant page or unlinked (text kept). All
  redirect-hop links now point straight to the final URL. Result: **0 broken
  internal links.**
- **Double H1 fixed** — removed the duplicate body `# Title` in
  `ai-workflow-automation-cost-pricing-guide-2026` and
  `rpa-vs-ai-automation-guide-2026` (H1 already comes from the layout).
- **Blog index meta description** rewritten (was leftover "engineering, design,
  and product" template text).
- **BreadcrumbList JSON-LD added to blog articles** (`ArticleLayout.astro`) —
  the only section that was missing it.

## Batch 2 — Medium priority

- **Author names normalized** to `SmartWorkflowLab Editorial Team` everywhere.
- **Categories consolidated** from 20 → 6: **AI Tools, Automation, Comparisons,
  Using AI, Marketing & SEO, AI Privacy & Safety.** Mega-menu + footer updated to
  match. 301 redirects added (Netlify + Vercel) for every old category slug.
- **Titles trimmed** (20 posts) so they fit search snippets, plus a smarter
  `<title>` rule in `SEO.astro`: the " · SmartWorkflowLab" suffix is only added
  when the whole title stays ≤ 60 chars (brand still appears in OG/Twitter).
- **Meta descriptions trimmed** to ≤ 160 chars (6 posts).
- **`/components` style-guide page** set to `noindex` and excluded from the
  sitemap.
- **Trailing-slash policy** made explicit and consistent: `trailingSlash: 'always'`
  - `build.format: 'directory'` in `astro.config.mjs` (matches the host configs).
    ⚠️ If Search Console shows your live URLs indexed WITHOUT a trailing slash,
    switch this to `'never'` and set `trailingSlash: false` in `vercel.json`.
- **coverAlt added** to 4 posts that were missing it.
- **FAQ added** to the 2 posts without it (now emit FAQPage schema).

## Batch 3 — Low priority

- **Cover images recompressed** — `src/assets/covers` 56 MB → 7.3 MB (max 1600px,
  quality 82). No display-quality loss; Astro still re-optimizes at build.
- **`updatedDate` added** to 6 posts that lacked it.
- **Stray `blog.zip` removed** from `src/content`.
- **`.npmrc` added** (`legacy-peer-deps=true`) so `npm install` works without the
  pre-existing eslint peer-dependency conflict.

## Left for you (editorial — intentionally not auto-changed)

- A few long posts read dense (e.g. `ai-tools-for-office-work`,
  `ai-workflow-automation-cost-pricing-guide-2026`) — worth breaking up long
  sentences.
- Two posts have a flat outline (no H3s): `how-to-fact-check-…`,
  `intelligent-document-processing-…` — add sub-headings when you next edit them.
- Run a fresh Lighthouse + axe pass (light & dark) after deploy.
- Optional: create the few pages the content still wants to link to (e.g. a
  customer-support-automation guide, a website-cost guide) and restore those
  links.
