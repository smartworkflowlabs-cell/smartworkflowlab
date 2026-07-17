/**
 * Scroll-triggered reveal + number count-up.
 * -------------------------------------------
 * Two independent, tiny IntersectionObservers:
 *  - [data-reveal]: adds .is-revealed once the element enters the viewport.
 *  - [data-count-to]: animates a number from 0 to the target once visible.
 * Both fire once (observer.unobserve after triggering) and both no-op
 * gracefully if IntersectionObserver isn't available.
 */
export function initScrollEffects(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // No IO support: just show everything immediately rather than leaving
    // content permanently hidden.
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  revealEls.forEach((el) => {
    revealObserver.observe(el);
  });

  // Failsafe: never leave content invisible. If for any reason the observer
  // hasn't revealed an element within a few seconds (e.g. some headless/
  // screenshot contexts, or a browser that batches IO oddly), force it on.
  window.setTimeout(() => {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }, 2500);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        countObserver.unobserve(el);

        const target = Number(el.dataset.countTo);
        const suffix = el.dataset.countSuffix ?? '';
        if (!Number.isFinite(target)) continue;

        if (prefersReducedMotion) {
          el.textContent = `${target}${suffix}`;
          continue;
        }

        const duration = 1100;
        const start = performance.now();
        const startVal = 0;

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / duration);
          // ease-out-cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(startVal + (target - startVal) * eased);
          el.textContent = `${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.4 },
  );

  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    countObserver.observe(el);
  });
}
