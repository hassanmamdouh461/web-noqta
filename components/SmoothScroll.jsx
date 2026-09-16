'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);
        const tickerFn = (time) => { lenis.raf(time * 1000); };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        // Dynamic Tab Title change when switching tabs
        const originalTitle = document.title;
        const handleVisibility = () => {
            document.title = document.hidden ? "وحشتنا! 👋 - تيم نقطة" : originalTitle;
        };
        document.addEventListener('visibilitychange', handleVisibility);

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
