// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(),
    sitemap({
      // Keep in sync with any page that sets `noindex` — the sitemap
      // integration works off the build's route list, not rendered meta
      // tags, so exclusions have to be declared here too.
      filter: (page) => !page.includes('/search'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Site-wide default: every <Image>/<Picture> gets a responsive srcset,
    // a computed `sizes` attribute (when `sizes="auto"` is set on the
    // instance), and the CSS needed to scale within its container.
    // Individual components can still override with `layout="none"`.
    layout: 'constrained',
    responsiveStyles: true,
  },
  markdown: {
    shikiConfig: {
      // Both themes are emitted as CSS variables on every token; which one
      // is *visible* is controlled by global.css based on `data-theme`,
      // matching the existing light/dark toggle instead of `prefers-color-scheme`.
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  env: {
    schema: {
      // Public: exposed to client bundles, prefixed automatically with PUBLIC_
      PUBLIC_SITE_NAME: envField.string({
        context: 'client',
        access: 'public',
        default: 'Site Name',
      }),
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://example.com',
      }),

      // Secret: server-only, never bundled into client JS
      API_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
