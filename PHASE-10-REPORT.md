# Phase 10 — Production Readiness Report

**Scope:** Production hardening only. No redesign, no new components, no layout changes beyond what was strictly required to fix a real production defect. Architecture, routing, and content collections from Phases 1–9 are unchanged.

**Result:** Build passes with zero errors/warnings, zero broken links, zero automated accessibility violations (light **and** dark mode), and deployment configs are in place for both Netlify and Vercel.

---

## 1. Production Audit

| Check                      | Result                                                                        |
| -------------------------- | ----------------------------------------------------------------------------- |
| Orphaned components        | None found — every component in `src/components/` is imported somewhere       |
| Unused images              | None — all 4 cover images are referenced by content or the component showcase |
| Duplicate utilities        | None found in `src/lib/`                                                      |
| Dead/broken internal links | **1 found and fixed** — see below                                             |
| Invalid routes             | None — full crawl of all 32 built pages found zero unresolved `href`s         |

**Fix — dead footer links:** The footer's "Company" group (About / Contact / Privacy) pointed to `#`, i.e., no real page existed for any of them. Rather than fabricate thin placeholder pages, the group was removed and the footer grid rebalanced (`sm:grid-cols-4` → `sm:grid-cols-3`) to fit the remaining two groups cleanly.
_Files: `src/config/navigation.ts`, `src/components/layout/Footer.astro`_

**Also fixed while here:** the base `Button.astro` component didn't type `rel`/`target`, which caused 5 TypeScript errors once Phase 9's commerce components started passing them for affiliate links (`rel="sponsored noopener" target="_blank"`). Explicitly typed both props, as you approved.
_File: `src/components/ui/Button.astro`_

---

## 2. Performance

| Item                           | Status                                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Static rendering               | Already fully static (Astro `output: 'static'`)                                                                                                                                                                                            |
| Code splitting / tree shaking  | Handled by Astro/Vite by default                                                                                                                                                                                                           |
| Image optimization (WebP/AVIF) | Already in place via `astro:assets` + `CoverImage`                                                                                                                                                                                         |
| `font-display: swap`           | Already set by Fontsource on every `@font-face`                                                                                                                                                                                            |
| Preconnect / DNS-prefetch      | **Evaluated, not needed** — every asset (fonts, images, scripts) is self-hosted; there are no external origins to preconnect to                                                                                                            |
| Hero image preload             | **Added** — article cover images (the real LCP element on article pages) are now preloaded via `<link rel="preload">`, computed from the same image pipeline `CoverImage` uses, so the browser doesn't wait to discover it deep in the DOM |
| Asset hashing                  | Already automatic (`/_astro/*.HASH.ext`)                                                                                                                                                                                                   |
| Unused JavaScript              | **1 real issue found and fixed** — see below                                                                                                                                                                                               |

**Fix — Fuse.js was shipping on every page, not just search:** `SearchModal` renders inside the site `Header`, so it's present on every single page. Its search script used a static `import Fuse from 'fuse.js'`, meaning the ~26KB search library was being fetched and parsed on every pageview, whether or not anyone ever opened search. Converted to a dynamic `import('fuse.js')` inside the function that actually needs it, so the chunk now only loads the moment someone opens the search dialog or types a query. Applied the same fix to the standalone `/search` page (was eagerly loading Fuse even when landing with no query).
_Files: `src/components/navigation/SearchModal.astro`, `src/pages/search.astro`_

**Current payload (whole site, uncompressed):** ~40KB JS total (before the search chunk lazy-loads), ~88KB CSS total. No framework runtime shipped anywhere.

---

## 3. Technical SEO

| Check                                                         | Result                                           |
| ------------------------------------------------------------- | ------------------------------------------------ |
| Unique title/description per page                             | ✔ via `SEO.astro` / `BaseLayout`                 |
| Canonical URLs                                                | ✔                                                |
| Open Graph + Twitter Card tags                                | ✔                                                |
| JSON-LD (WebSite, Organization, Article, BreadcrumbList, FAQ) | ✔ already implemented in `lib/seo.ts`            |
| `robots.txt`                                                  | ✔ present, correct                               |
| `sitemap.xml`                                                 | ✔ present, correct — **one inconsistency fixed** |
| RSS feed                                                      | ✔ present, correct                               |

**Fix — sitemap/robots-meta inconsistency:** `/search` already correctly sets `<meta name="robots" content="noindex">`, but the `@astrojs/sitemap` integration doesn't read per-page meta tags — it works off the build's route list. So `/search` was still being advertised in `sitemap.xml` despite telling crawlers not to index it. Added a `filter` to the sitemap config to exclude it, so the two now agree.
_File: `astro.config.mjs`_

---

## 4. Accessibility (WCAG AA)

Ran an automated **axe-core** audit (WCAG 2.0/2.1 A + AA ruleset) across all 12 distinct page types, **in both light and dark mode** — not just eyeballed. This surfaced real, pre-existing bugs that a visual check alone wouldn't have caught:

| #   | Issue                                                                                                | Root cause                                                                                                                                                                                                                                                                                       | Fix                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Code-block text failed AA in both themes                                                             | The Shiki `github-light`/`github-dark` themes have a few token colors below 4.5:1                                                                                                                                                                                                                | Switched to Shiki's purpose-built `github-light-high-contrast` / `github-dark-high-contrast` themes                        |
| 2   | Rank numerals (Popular Articles) failed AA                                                           | Used a _border_ color (`--color-border-strong`) as text — border tokens aren't calibrated for text contrast                                                                                                                                                                                      | Switched to `--color-text-muted`                                                                                           |
| 3   | Success/warning/danger `Badge`s failed AA                                                            | Text color was the same raw swatch as the background tint, too light against it                                                                                                                                                                                                                  | Added dedicated, theme-aware `--color-{success,warning,danger}-text` tokens, darker in light mode / lighter in dark mode   |
| 4   | "Best Choice" ribbon badges failed AA                                                                | White text on `accent-500` (a mid-tone amber) — insufficient contrast at any reasonable amber lightness                                                                                                                                                                                          | Darkened to `accent-700` background                                                                                        |
| 5   | **Entire article body text nearly unreadable in dark mode** (1.95:1, needs 4.5:1)                    | Tailwind Typography's `prose-neutral` styles were never inverted for dark mode — this site uses a custom `[data-theme]` attribute, not the OS-level `prefers-color-scheme` Tailwind's `dark:` variant expects by default, so `dark:` utilities were silently inert everywhere they might be used | Registered a `@custom-variant dark` matching `[data-theme='dark']`, then applied `dark:prose-invert` to the article layout |
| 6   | Inline `<code>` in prose failed AA in dark mode                                                      | Hardcoded to `--color-primary-700` (a light-mode-only value) instead of the theme-aware `--color-link`                                                                                                                                                                                           | Swapped to `--color-link`                                                                                                  |
| 7   | Several kicker/link texts (Hero, SectionHeading, nav hovers, etc.) failed AA in dark mode            | Hardcoded to `--color-primary-600` instead of the already-theme-aware `--color-link`                                                                                                                                                                                                             | Swapped every persistent-state occurrence (8 files) to `--color-link`                                                      |
| 8   | Affiliate/commerce CTA buttons rendered with invisible text when embedded in article content via MDX | Tailwind Typography's `.prose a { color }` selector was overriding the buttons' own `text-white`, because commerce components (`AffiliateBox`, `ProductCard`, `BestChoice`, `CTA`, `ComparisonTable`, `ProsCons`, `AdSlot`) render _inside_ `.prose` when used as MDX components                 | Added Typography's own `not-prose` escape hatch to all 7 commerce components' root elements                                |
| 9   | A "Callout" MDX admonition box failed AA in dark mode                                                | Used a light-only tint (`primary-100/40`) that composites into a muddy mid-tone over a dark page background                                                                                                                                                                                      | Switched to the same low-opacity-on-mid-tone pattern already proven correct in `Alert` (`primary-500/10`)                  |
| 10  | Tag-count text on `/blog/tags` failed AA                                                             | `Badge` is intentionally theme-invariant (always a light chip) but this one usage nested a theme-_aware_ muted text color inside it, which assumed a dark background that was never actually there                                                                                               | Switched to a fixed `--color-neutral-600`, matching Badge's own always-light design                                        |

**Final result: 0 violations, light mode. 0 violations, dark mode. Across all 12 page types tested.**

Also confirmed present and working: skip-to-content link (first Tab stop on every page), visible focus rings (`:focus-visible` outline, sitewide), semantic form labels + `aria-describedby` error wiring, native `<dialog>`/`<details>` for modals and accordions (built-in keyboard support).

---

## 5. Security Headers

No headers existed before this phase (fully static site, no server to set them). Added identical policies to both `netlify.toml` and `vercel.json`:

- `Content-Security-Policy` — locked to same-origin for scripts, styles, fonts, connections, and images (+`data:`); no framing (`frame-ancestors 'none'`), no plugins (`object-src 'none'`), forms restricted to same-origin.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geolocation/interest-cohort all denied), `Strict-Transport-Security` (2-year max-age, preload-eligible).

**Honest caveat on the CSP:** `script-src` and `style-src` include `'unsafe-inline'`. This is a real, deliberate tradeoff, not an oversight — the theme-init script and every page's JSON-LD block are inline by necessity (JSON-LD content differs per page, so a single static hash allowlist across every route isn't feasible without a server generating per-request nonces, which a fully static site doesn't have). Two components (`AdSlot`, `CoverImage`) also use inline `style` attributes to reserve dimensions and prevent layout shift. Everything else in the policy is fully locked down. If you later add a server/edge function, switching to nonce-based CSP would let you drop `'unsafe-inline'` entirely.

---

## 6. Caching

| Asset type                                                   | Policy                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| `/_astro/*` (hashed build output)                            | `public, max-age=31536000, immutable`                               |
| HTML pages                                                   | `public, max-age=0, must-revalidate` (so edits go live immediately) |
| `rss.xml`, `sitemap*.xml`, `robots.txt`, `search-index.json` | `public, max-age=3600`                                              |

---

## 7. Build Validation

```
npm run build      → 32 pages, 0 errors, 0 warnings
npm run astro check → 0 errors, 0 warnings, 0 hints
npm run lint        → 0 errors, 0 warnings
```

Full internal-link crawl of all 32 generated pages: **0 broken links.**
Headless-browser crawl of every page type: **0 console errors, 0 failed requests, all 200 OK.**

---

## 8. Deployment Configuration

Created (neither existed before):

- **`netlify.toml`** — build command, publish dir, Node version pin, all headers/caching above.
- **`vercel.json`** — build command, output dir, framework hint, matching headers/caching, `cleanUrls`/`trailingSlash` for clean URL output.

Both point at `npm run build` → `dist/`, no changes needed to the app itself to deploy to either platform.

---

## 9. Production Verification

Crawled with a real headless browser (not just static analysis): homepage, blog index, article pages (`.md` and `.mdx`), category pages, tag pages, author pages, archive (year + month), tag index, search (empty + populated), pagination routes, RSS, sitemap, robots.txt. All returned 200, all rendered with zero console/page/request errors, zero layout-breaking issues found.

---

## 10. Remaining Recommendations (not done — outside this phase's "no redesign" scope)

- **`/components`** (the internal design-system reference page) is currently indexable. Worth a decision: keep it public for portfolio/documentation value, or mark `noindex` like `/search` if you'd rather keep it out of search results as thin/internal content.
- **CSP `'unsafe-inline'`** — see the honest caveat in §5. Removable if a server/edge layer is ever introduced for nonce generation.
- **Lighthouse scores** weren't run directly in this environment (no Chrome DevTools Lighthouse CLI available here), but given the measured payload (~40KB JS total, hashed+immutable caching, 0 axe violations, static rendering, LCP preload in place), the site is well-positioned for the 95–100 targets across all four categories — recommend running a real Lighthouse pass post-deploy to confirm against your actual hosting/CDN latency.
- The affiliate/ad-related `href="#"` values in demo content (`components.astro`'s "As link" example) are intentional style-guide placeholders, not real navigation — left as-is.

---

## Files touched this phase

```
astro.config.mjs                                    (sitemap filter, Shiki high-contrast themes)
netlify.toml                                         (new)
vercel.json                                          (new)
src/components/ui/Button.astro                       (rel/target typing)
src/components/ui/Badge.astro                        (theme-aware feedback text tokens)
src/components/ui/Text.astro                         (theme-aware success tone)
src/components/ui/Input.astro                        (theme-aware danger tone)
src/components/ui/Textarea.astro                     (theme-aware danger tone)
src/components/ui/Select.astro                       (theme-aware danger tone)
src/components/ui/Table.astro                        (--color-link fix)
src/components/navigation/MegaMenu.astro              (--color-link fix)
src/components/navigation/SearchModal.astro           (lazy Fuse.js, --color-link fix)
src/components/layout/Header.astro                    (--color-link fix)
src/components/layout/Footer.astro                    (dead-link group removed, grid fix)
src/components/home/SectionHeading.astro               (--color-link fix)
src/components/home/FeaturedCategories.astro            (--color-link fix)
src/components/home/Hero.astro                        (--color-link fix)
src/components/home/PopularArticles.astro              (rank numeral contrast fix)
src/components/mdx/Callout.astro                       (dark-mode-safe info tint)
src/components/commerce/AdSlot.astro                   (not-prose)
src/components/commerce/AffiliateBox.astro              (not-prose)
src/components/commerce/BestChoice.astro                (not-prose, accent-700)
src/components/commerce/CTA.astro                      (not-prose)
src/components/commerce/ComparisonTable.astro            (not-prose, accent-700)
src/components/commerce/ProductCard.astro                (not-prose)
src/components/commerce/ProsCons.astro                  (not-prose)
src/config/navigation.ts                              (dead-link group removed)
src/layouts/BaseLayout.astro                           (preloadImageUrl prop)
src/layouts/ArticleLayout.astro                        (LCP preload, dark:prose-invert, --color-link fix)
src/pages/blog/tags.astro                              (tag-count contrast fix)
src/pages/search.astro                                 (lazy Fuse.js)
```

**Deployment readiness: ready for GitHub + Netlify or Vercel.**
