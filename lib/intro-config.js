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
    autoPlayDelay: 100     // Delay in ms
};
