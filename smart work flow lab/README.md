# Astro Project Foundation

Phase 1 output: a fully wired Astro project — Tailwind, TypeScript, linting,
formatting, git hooks, fonts, and a token-driven design/theme system.
Verified end-to-end (build, typecheck, lint, format, commit hooks all pass).

## Stack

- **Astro 7** (static output, strict TypeScript)
- **Tailwind CSS v4** — CSS-first config via `@theme`, no `tailwind.config.js` needed
- **TypeScript strict mode** + `noUncheckedIndexedAccess`, path alias `@/*` → `src/*`
- **ESLint 9** (flat config) — `@typescript-eslint`, `eslint-plugin-astro`, `eslint-plugin-jsx-a11y`
- **Prettier** — with `prettier-plugin-astro` and `prettier-plugin-tailwindcss` (auto class sorting)
- **Husky** + **lint-staged** — pre-commit runs lint + format on staged files only
- **Commitlint** — enforces [Conventional Commits](https://www.conventionalcommits.org/) on every commit
- **Fontsource** — self-hosted variable fonts (Inter, Fraunces, JetBrains Mono), no external font requests
- Typed environment variables via `astro:env`

## Getting started

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

## Scripts

| Script                 | Does                                                    |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Start the dev server                                    |
| `npm run build`        | Production build to `dist/`                             |
| `npm run preview`      | Preview the production build locally                    |
| `npm run typecheck`    | `astro check` — TypeScript + Astro template diagnostics |
| `npm run lint`         | ESLint across `.ts`, `.astro`, `.js`                    |
| `npm run lint:fix`     | ESLint with autofix                                     |
| `npm run format`       | Prettier write, whole project                           |
| `npm run format:check` | Prettier check (CI-friendly, no writes)                 |

## Design tokens & theming

All design tokens live in `src/styles/tokens.css` as plain CSS custom
properties (colors in OKLCH for even perceptual steps), then get exposed to
Tailwind utilities via the `@theme inline` block in `src/styles/global.css`.

- **Use semantic tokens in components**, not raw ramp values: `bg-(--color-surface)`,
  `text-(--color-text-muted)`, `border-(--color-border)` — these automatically
  adapt between light/dark.
- **Raw ramps** (`--color-primary-500`, `--color-neutral-700`, etc.) are for
  building new semantic roles, not for direct use in one-off components.
- **Dark mode** is driven by `data-theme="light"|"dark"` on `<html>`, with a
  `system` fallback via `prefers-color-scheme`. See `src/lib/theme.ts` for the
  toggle API and the no-flash inline init script (already wired into
  `Layout.astro`'s `<head>`).

To restyle the brand, edit the ramps in `tokens.css` — everything downstream
(components, Tailwind utilities) updates automatically.

## Environment variables

Declared and typed in `astro.config.mjs` under `env.schema`. Import with:

```ts
import { PUBLIC_SITE_NAME } from 'astro:env/client';
import { DATABASE_URL } from 'astro:env/server'; // server-only, never bundled
```

See `.env.example` for the full list. Copy it to `.env` and never commit `.env`.

## Git workflow

Pre-commit runs `lint-staged` (ESLint --fix + Prettier on staged files).
Commit messages are enforced via Commitlint + Conventional Commits — e.g.
`feat: add pricing page`, `fix: correct nav focus order`. See Phase 0's Git
Workflow section for branch naming and PR conventions.
