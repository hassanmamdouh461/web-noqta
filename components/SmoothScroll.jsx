'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

export default function SmoothScroll() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.ticker.lagSmoothing(0);

        // Dynamic Tab Title change when switching tabs — kept regardless of the
        // motion preference, it is not an animation.
        const originalTitle = document.title;
        const handleVisibility = () => {
            document.title = document.hidden ? "وحشتنا! 👋 - تيم نقطة" : originalTitle;
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // A11Y: hijacking the wheel/scroll is exactly what "reduce motion" asks
        // us not to do — fall back to native scrolling and skip Lenis entirely.
        if (prefersReducedMotion()) {
            return () => document.removeEventListener('visibilitychange', handleVisibility);
        }

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);
        const tickerFn = (time) => { lenis.raf(time * 1000); };
        gsap.ticker.add(tickerFn);

        window.__lenis = lenis;

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerFn);
            document.removeEventListener('visibilitychange', handleVisibility);
            delete window.__lenis;
        };
    }, []);

    return null;
}
