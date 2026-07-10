# SmartWorkflowLab Rebrand — Final Checklist

**Verification method:** Every item below was checked against the actual built HTML output (`dist/`), not just the source — including a final project-wide grep for all six banned terms across both `src/` and `dist/`, which returned **zero matches**. Typecheck, lint, and an axe-core WCAG AA accessibility audit (light + dark mode, 13 page types) all pass clean after the rewrite — no regressions introduced.

---

## Site identity (single source of truth: `src/config/site.ts`)

| Item | Before | After |
|---|---|---|
| Site name | Working Draft | **SmartWorkflowLab** |
| Site description | "Notes on engineering, design, and product…" | "Practical guides to AI productivity tools, workflow automation, and getting more done with less busywork." |
| Twitter handle | @workingdraft | @smartworkflowlab |

Because `BaseLayout`, `SEO.astro`, and `rss.xml.ts` all read from this one file, updating it here cascaded correctly to:
- Browser tab titles (`<title>`)
- Meta descriptions (default/fallback)
- Open Graph title/description defaults
- RSS feed title/description

## Header & Footer

- ✅ Header logo text → **SmartWorkflowLab**
- ✅ Footer logo text → **SmartWorkflowLab**
- ✅ Footer tagline → rewritten to match the new description
- ✅ Footer copyright line → **© 2026 SmartWorkflowLab**
- ✅ Footer "Categories" link group → AI Tools / Automation / Productivity
- ✅ Footer "Company" group (About/Contact/Privacy, all dead `#` links from an earlier phase) — left removed, as fixed in the prior production-hardening pass

## Navigation & Categories

- ✅ Mega menu categories: ~~Engineering / Design / Product~~ → **AI Tools / Automation / Productivity**
- ✅ Mega menu descriptions rewritten to match
- ✅ Homepage "Featured Categories" icons + descriptions rewritten for the new taxonomy
- ✅ All 6 blog posts recategorized into the new taxonomy (2 posts each)
- ✅ Category archive pages (`/blog/category/ai-tools`, `/automation`, `/productivity`) regenerate automatically from post frontmatter — no manual page edits needed

## Homepage sections

| Section | Change |
|---|---|
| Hero kicker | "Working Draft — Vol. 4" → **"SmartWorkflowLab — Issue 12"** |
| Hero headline | "Good work rarely looks finished." → **"Stop collecting AI tools. Start finishing things."** |
| Hero subhead | Rewritten around AI tools/workflow automation testing |
| Hero featured-post label | "Currently drafting" → **"Just tested"** |
| Featured Categories | New icons, descriptions, and category names (see above) |
| Popular Articles | Automatically pulls from the 3 posts flagged `popular: true` — now AI/productivity content |
| Latest Articles | Automatically pulls the 3 newest posts — no manual copy to change |
| Newsletter | Kicker/heading/description rewritten ("Stay in the loop" / "Get new AI workflow tips…") |
| FAQ | All 4 Q&As rewritten to describe SmartWorkflowLab specifically |
| Closing CTA | Was promoting the internal `/components` design-system page as a marketing CTA — replaced with real editorial/trust copy ("We buy the subscriptions so you don't have to") linking to tool reviews and the blog instead |

## Blog content — full rewrite, not find-and-replace

Six demo posts about Astro/web-dev topics don't fit an AI productivity brand, so each was rewritten as a genuine, on-topic article rather than just re-skinned:

| Old file (deleted) | New file | New title | Category | Author |
|---|---|---|---|---|
| `astro-content-collections.md` | `no-code-workflow-automation-guide.md` | No-code workflow automation: a practical starting guide | Automation | Sam Osei |
| `shipping-fast-small-teams.md` | `hidden-costs-of-over-automation.md` | The hidden costs of over-automating your workflow | Automation | Alex Rivera |
| `building-a-design-system.md` | `why-your-task-manager-isnt-the-problem.md` | Why your task manager isn't the problem | Productivity | Maya Chen |
| `naming-things-is-hard.md` | `naming-ai-workflows-that-make-sense-later.md` | Naming your AI workflows so future-you doesn't hate present-you | Productivity | Maya Chen |
| `accessible-forms-guide.md` | `ai-choosing-writing-assistant.md` | How to choose an AI writing assistant without wasting a subscription | AI Tools | Sam Osei |
| `mdx-and-components.mdx` | `ai-productivity-tools-compared.mdx` | 5 AI productivity tools compared | AI Tools | Alex Rivera |

Popularity flags were preserved (3 posts still marked `popular: true`, spread across all 3 categories) and every post keeps its original cover image asset — only the `coverAlt` text changed to accurately describe reuse in the new context.

**Bonus:** the MDX post now demonstrates the *entire* commerce component suite in genuinely appropriate context (not just as a components tech-demo) — `ComparisonTable` for a real tool comparison, `BestChoice` for the top pick, `ProsCons` for tradeoffs, `AffiliateBox` for a budget alternative, and `Callout` for a methodology note. This is more thorough than the original demo, which only exercised 3 of the 7 available components.

## Demo authors

| Before | After |
|---|---|
| Priya Nair | **Maya Chen** |
| Jordan Blake | **Sam Osei** |
| Diego Ramirez | **Alex Rivera** |

Author archive pages (`/blog/author/maya-chen`, etc.) regenerate automatically from the new names — no manual routing changes.

## `/components` design-system showcase page

This page is internal documentation, not marketing content, but it still contained two of the banned name-strings as unrelated Avatar-component demo data, plus "Engineering"/"Design" as sample Tag-chip demo labels:

- ✅ Avatar demo: "Priya Nair" → **Nina Patel**, "Diego Ramirez" → **Marcus Webb** (kept Amara Okafor, Liam Chen, Sofia Rossi — not on the banned list)
- ✅ Tag demo chips: "Design" / "Engineering" → **"Automation" / "AI Tools"**

## Search & misc.

- ✅ Search page meta description: "Search Working Draft's posts…" → **"Search SmartWorkflowLab's posts…"**
- ✅ Search input placeholder text was already generic ("Search posts...") — no change needed
- ✅ Code comments referencing the old brand name (in `SEO.astro`, `CategoryLayout.astro`) updated for internal consistency, even though not user-facing

## Explicitly NOT changed (per your instructions)

- Layout, spacing, typography, color tokens, design system — untouched
- Component APIs and props — untouched
- Routing structure and dynamic route handlers — untouched (only the *values* flowing through them, like category names and slugs, changed — an unavoidable consequence of renaming the categories themselves)
- Accessibility, performance, and SEO architecture from the prior production-hardening pass — untouched and re-verified clean

## Final verification results

```
grep -rn "Working Draft|Priya Nair|Jordan Blake|Diego Ramirez" src/ dist/   → 0 matches
grep -rn "Engineering|Design|Product" (as category/demo usage)             → 0 matches
npm run typecheck                                                          → 0 errors, 0 warnings
npm run lint                                                               → 0 errors
npm run build                                                              → 29 pages, 0 errors
axe-core WCAG AA audit, light + dark mode, 13 page types                   → 0 violations
```
