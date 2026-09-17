// Configuration file for the Transition Scribble Intro animation

export const INTRO_COLORS = [
    { name: 'green', value: '#29725f', isLight: false },
    { name: 'lightblue', value: '#82a0ff', isLight: true },
    { name: 'darkblue', value: '#4b69f0', isLight: false },
    { name: 'lightgreen', value: '#e6fab9', isLight: true },
    { name: 'orange', value: '#f5693c', isLight: false },
    { name: 'maroon', value: '#a0325a', isLight: false },
    { name: 'pink', value: '#f0befa', isLight: true }
];

export const DEFAULT_INTRO_CONFIG = {
    // Animation timing (in seconds)
    durationIn: 2.0,       // Duration to completely paint over the screen
    durationOut: 2.5,      // Duration to wipe/undraw away
    delayBeforeOut: 0.2,   // Pause at peak coverage before undrawing

    // SVG stroke thickness relative to viewport
    strokeWidthStart: '8%',
    strokeWidthMax: '32%',
    scale: 0.7,

    // Center logo wiggle settings
    wiggleIntensity: 6,    // Rotation degrees
    wiggleSpeed: 0.14,     // Seconds per wiggle swing

    // Auto run when component mounts
    autoPlay: true,
    autoPlayDelay: 100,    // Delay in ms

    // Play the intro on every page load (the original behaviour).
    //
    // This used to be `true`, which stored a `noqta:intro-played` flag in
    // sessionStorage. sessionStorage survives reloads *and* new tabs opened
    // from the same tab, so the intro played once and then vanished for the
    // rest of the browser session — which is why it "disappeared" from the
    // site. Set it back to `true` only if you want it once per session.
    //
    // The ~4.7s where `body.is-transitioning` blocks pointer events is no
    // longer a problem on its own: `skipOnInteraction` below fast-forwards the
    // timeline (8x) on the very first tap/keypress/wheel, so the visitor is
    // never locked out.
    playOncePerSession: false,

    // Fast-forward the timeline (8x) as soon as the visitor interacts, so a tap
    // during the intro is never swallowed.
    skipOnInteraction: true
};
