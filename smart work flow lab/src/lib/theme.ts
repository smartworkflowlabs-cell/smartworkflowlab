/**
 * Theme system
 * ------------
 * Three states: 'light' | 'dark' | 'system'. Persisted to localStorage.
 * `themeInitScript` must run BEFORE first paint (inline, in <head>) to avoid
 * a flash of the wrong theme — see Layout.astro.
 */

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

/**
 * Source for the inline no-flash script. Kept as a plain string (not an
 * imported function) so it can be inlined verbatim into <head> without
 * Astro/Vite trying to bundle or defer it.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'system';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`;

/** Get the user's explicit stored preference, if any (does not resolve 'system'). */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

/** Apply and persist a theme choice at runtime (e.g. from a toggle button). */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  if (theme === 'system') {
    window.localStorage.removeItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/** Convenience toggle between light/dark (ignores system; picks the opposite of current). */
export function toggleTheme(): void {
  if (typeof window === 'undefined') return;
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}
