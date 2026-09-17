/**
 * Small accessibility / capability helpers shared by the animation components.
 *
 * The site is animation-heavy (Lenis smooth scroll, a ~4.9s intro scribble, a
 * full-screen canvas loop and several GSAP scroll/pointer effects), so these
 * are checked before starting the heaviest loops rather than trying to neuter
 * GSAP globally.
 *
 * All helpers are safe to call during SSR/prerender — they return a
 * conservative default when there is no window.
 */

export function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True for touch-only devices (phones, tablets). Desktop browsers and hybrid
 * laptops with a mouse return false.
 * Used to switch hover-driven UI (nav popouts, credits box) to tap-driven, and
 * to skip pointer-only effects such as the custom cursor followers.
 */
export function isCoarsePointer() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/**
 * True when the pointer can actually hover. Kept separate from
 * isCoarsePointer() because a Surface/iPad-with-trackpad reports both.
 */
export function hasHover() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return window.matchMedia('(hover: hover)').matches;
}

/** Viewport width, or 0 during prerender. */
export function viewportWidth() {
    if (typeof window === 'undefined') return 0;
    return window.innerWidth;
}
