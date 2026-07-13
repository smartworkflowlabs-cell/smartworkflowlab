/**
 * Premium interactions
 * --------------------
 * Tasteful, GPU-accelerated micro-interactions for the marketing surfaces.
 * Everything here is opt-in via data-attributes, no-ops without JS, and
 * fully disabled under prefers-reduced-motion. Only transform/opacity are
 * animated so it stays at 60fps.
 *
 *  [data-magnetic]        button/link subtly pulls toward the cursor
 *  [data-tilt]            card tilts in 3D toward the cursor
 *  [data-glow]            radial glow follows the cursor across the element
 *  [data-parallax="0.2"]  element drifts on scroll at the given speed
 *  [data-scroll-progress] a fixed top bar fills as the page scrolls
 */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

function initMagnetic(): void {
  if (!isFinePointer() || reduced()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '') || 0.35;
    let raf = 0;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'translate(0, 0)';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
  });
}

function initTilt(): void {
  if (!isFinePointer() || reduced()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt || '') || 6;
    let raf = 0;
    el.style.transformStyle = 'preserve-3d';
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
  });
}

function initGlow(): void {
  if (!isFinePointer()) return; // glow is subtle; fine on reduced-motion (no transition)
  document.querySelectorAll<HTMLElement>('[data-glow]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
      el.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
    });
  });
}

function initParallax(): void {
  if (reduced()) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (els.length === 0) return;
  let raf = 0;
  const update = () => {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '') || 0.2;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${center * -speed}px, 0)`;
    });
    raf = 0;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;
  let raf = 0;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
    raf = 0;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

export function initPremiumInteractions(): void {
  if (typeof window === 'undefined') return;
  initMagnetic();
  initTilt();
  initGlow();
  initParallax();
  initScrollProgress();
}
