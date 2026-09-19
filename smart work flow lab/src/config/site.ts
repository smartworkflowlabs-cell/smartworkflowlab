/**
 * Site-wide identity constants.
 * ------------------------------
 * Single source of truth for anything that used to be copy-pasted between
 * BaseLayout, rss.xml.ts, and the various JSON-LD builders — change it once,
 * here, rather than hunting down every brand string in the repo.
 */

export const SITE_NAME = 'SmartWorkflowLab';
export const SITE_DESCRIPTION =
  'Practical guides to AI productivity tools, workflow automation, and getting more done with less busywork.';
/** Falls back to this if `Astro.site` isn't set in astro.config.mjs. Keep in sync with `site` there. */
export const SITE_URL = 'https://smartworkflowlab.com';
/** Default Open Graph / Twitter card image — used whenever a page doesn't provide its own. */
export const DEFAULT_OG_IMAGE_PATH = '/og-default.png';
/** Used for twitter:site / twitter:creator. Update once there's a real handle. */
export const TWITTER_HANDLE = '@smartworkflowlab';
/** Absolute-from-root path; used for the Organization schema's `logo` and OG fallback image. */
export const SITE_LOGO_PATH = '/favicon.svg';
/** Public contact address — used on the About/Contact pages and Organization schema. */
export const CONTACT_EMAIL = 'smartworkflowlabs@gmail.com';
