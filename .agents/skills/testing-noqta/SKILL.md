---
name: testing-noqta
description: How to run and end-to-end test the Noqta Next.js static-export site locally, including device/touch emulation quirks (intro overlay pointer-events lock, hover:none media branching, credits-box tap desync).
---

# Testing the Noqta site

Single-page Arabic RTL marketing site (Next.js 15, `output: 'export'`).

## Running

- Node comes via nvm — prefix shells: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"` (v24).
- Dev server: `npm run dev` in the repo root → http://localhost:3000.
- Production check: `npm run build` then `cd out && python3 -m http.server 4000` → http://localhost:4000. Verify the export is rebuilt after fixes (`href="#hero"`, PNG apple-touch-icon should appear in served HTML).

## Browser automation

- Chrome for Testing: `/opt/.devin/chrome/chrome/linux-*/chrome-linux64/chrome`, launched with `--no-sandbox --remote-debugging-port=29229` (visible) or headless for scripted runs.
- playwright-core works with the system binary (install into /tmp, NOT the repo, to keep the tree clean).
- Device emulation MUST set viewport + deviceScaleFactor + touch + a mobile UA — the site branches on `matchMedia('(hover:none)')` and `'(pointer:coarse)'` for nav popouts, cursor bubble, credits box, and ServiceCards layout.

## Gotchas

- **Intro overlay**: `body.is-transitioning` sets `pointer-events:none !important` for ~3.4–5.4s after load, and React 19 StrictMode double-mount flashes it off ~550ms then re-adds. Wait for *stable* absence (~2s), never first absence — otherwise taps "succeed" but do nothing.
- **Touch taps**: `Input.dispatchTouchEvent` (touchStart+touchEnd) synthesizes click + pointerdown, and a compat `mouseenter` fires on first entry into an element (not re-fired while the virtual cursor stays inside). Credits box on <768px opens via that mouseenter before the click lands; the animating box (y:+59) covers the pill so the click is swallowed → `creditsOpen` stays false → doc tap-outside handler early-returns. Test with taps on truly outside points (below the pill), not `.footer-hashtag` (it sits inside the open box's bounds).
- **Headed vs headless**: the headed X11 Chrome reports `(hover:none)/(pointer:none)` — hover effects (nav popouts, cursor bubble) can't be shown on-screen; verify them in a headless desktop context which reports `hover:hover` correctly.
- **Logo click**: `.logo-noqta-wrap` preventDefaults — replays intro scribble + scrolls to top; URL hash unchanged (by design).
- Footer tap-outside targets: avoid wa.me badges/links (they navigate the tab away — `wa.me` loads WhatsApp manifest → external 404 in console, harmless but ends the demo flow).
- Next.js dev overlay "N" badge bottom-left is not part of the site; ignore it in screenshots.

## Key selectors

`.nav-left` / `.nav-right` (popout triggers), `.nav-work-item` (work links → #stack-section), `.logo-noqta-wrap` (center logo), `.vimeo-hero` / `.vimeo-hero__title` / `.hero-scroll-indicator`, `[aria-label*="عرض بالحجم الكامل"]` (lightbox open), `.motion-card__modal-close` (✕), `.footer-credits` (pill), `.credits-box`, `.footer-hashtag`, `.home-header__smiley`/`.home-header__star` (landscape ≤560px rules).
