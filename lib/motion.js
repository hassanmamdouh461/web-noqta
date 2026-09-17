/**
 * Small accessibility helper: true when the visitor has asked their OS to
 * reduce motion (Windows: Settings > Accessibility > Visual effects,
 * macOS: Accessibility > Display > Reduce motion).
 *
 * The site is animation-heavy (Lenis smooth scroll, a ~4.9s intro scribble, a
 * full-screen canvas loop and several GSAP scroll/pointer effects), so this is
 * checked before starting the heaviest loops rather than trying to neuter GSAP
 * globally.
 *
 * Safe to call during SSR/prerender — returns false when there is no window.
 */
export function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
