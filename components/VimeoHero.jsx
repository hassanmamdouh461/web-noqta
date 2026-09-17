'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion, isCoarsePointer } from '@/lib/motion';

/**
 * Backing-store budget for the fluid canvas. Four full-screen radial gradients
 * are re-rasterised every frame, so on a high-DPI phone the fill rate alone can
 * drop the hero below 60fps. The canvas is rendered at a reduced resolution and
 * upscaled by CSS — gradient blobs are soft by nature, so the quality loss is
 * invisible while the cost drops by ~4x on a 3x display.
 */
const MAX_CANVAS_PIXELS = 1_400_000;

export default function VimeoHero() {
    const heroRef = useRef(null);
    const canvasRef = useRef(null);
    const bubbleRef = useRef(null);

    // ─── Interactive Fluid Canvas Animation ───
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // NOTE: MUST stay `null` (not undefined) — the start/stop guards below
        // compare strictly against null to detect "not running yet".
        let animId = null;

        let width = 0;
        let height = 0;

        // Orbs store their position as a FRACTION of the viewport so they keep
        // their composition when the viewport changes (rotate, URL bar hiding,
        // desktop resize). Previously they were seeded from absolute pixels and
        // were never remapped, so after a resize orbs drifted off-screen.
        const orbs = [
            { fx: 0.25, fy: 0.35, vx: 0.8, vy: 0.6, rf: 0.35, color: 'rgba(54, 36, 136, 0.75)' }, // Deep Violet
            { fx: 0.75, fy: 0.65, vx: -0.7, vy: -0.5, rf: 0.38, color: 'rgba(50, 62, 134, 0.7)' }, // Deep Indigo
            { fx: 0.5, fy: 0.5, vx: 0.5, vy: -0.8, rf: 0.28, color: 'rgba(67, 251, 156, 0.25)' }, // Neon Mint
            { fx: 0.85, fy: 0.2, vx: -0.6, vy: 0.7, rf: 0.25, color: 'rgba(61, 167, 146, 0.35)' } // Teal
        ];

        const measure = () => {
            width = canvas.clientWidth || window.innerWidth;
            height = canvas.clientHeight || window.innerHeight;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            let scale = dpr;
            if (width * height * scale * scale > MAX_CANVAS_PIXELS) {
                scale = Math.sqrt(MAX_CANVAS_PIXELS / (width * height));
            }
            scale = Math.max(scale, 0.5);

            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            ctx.setTransform(scale, 0, 0, scale, 0, 0);

            // Keep every orb inside the new viewport bounds.
            orbs.forEach((orb) => {
                orb.r = width * orb.rf;
                if (orb.x === undefined) {
                    orb.x = width * orb.fx;
                    orb.y = height * orb.fy;
                } else {
                    orb.x = Math.min(Math.max(orb.x, 0), width);
                    orb.y = Math.min(Math.max(orb.y, 0), height);
                }
            });
        };

        const drawFrame = () => {
            ctx.fillStyle = '#0B0C16';
            ctx.fillRect(0, 0, width, height);

            orbs.forEach((orb) => {
                orb.x += orb.vx;
                orb.y += orb.vy;

                if (orb.x < -orb.r * 0.2 || orb.x > width + orb.r * 0.2) orb.vx *= -1;
                if (orb.y < -orb.r * 0.2 || orb.y > height + orb.r * 0.2) orb.vy *= -1;

                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
                grad.addColorStop(0, orb.color);
                grad.addColorStop(1, 'rgba(11, 12, 22, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        measure();

        const handleResize = () => { measure(); if (animId === null) drawFrame(); };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // A11Y: with "reduce motion" we paint one static frame instead of
        // running a permanent full-screen gradient loop.
        if (prefersReducedMotion()) {
            drawFrame();
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('orientationchange', handleResize);
            };
        }

        const render = () => {
            drawFrame();
            animId = requestAnimationFrame(render);
        };

        // PERF: the loop used to run forever, redrawing 4 full-screen radial
        // gradients every frame even when the hero was 10 screens away.
        const start = () => { if (animId === null) render(); };
        const stop = () => {
            if (animId !== null) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        };

        let inView = true;
        const io = new IntersectionObserver((entries) => {
            inView = entries[0].isIntersecting;
            if (inView && !document.hidden) start();
            else stop();
        }, { threshold: 0 });
        io.observe(canvas);

        const onVisibility = () => {
            if (document.hidden) stop();
            else if (inView) start();
        };
        document.addEventListener('visibilitychange', onVisibility);

        start();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            document.removeEventListener('visibilitychange', onVisibility);
            io.disconnect();
            stop();
        };
    }, []);

    // ─── Floating Elastic Cursor Bubble (Truus-clone standard) ───
    useEffect(() => {
        const bubble = bubbleRef.current;
        const hero = heroRef.current;
        if (!bubble || !hero) return;

        // Skip on touch devices
        if (isCoarsePointer()) return;

        // Initialize matching truus-clone CSS transform
        gsap.set(bubble, { opacity: 0, scale: 0, rotation: -30 });

        const xTo = gsap.quickTo(bubble, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(bubble, 'y', { duration: 0.5, ease: 'power3' });

        let isVisible = false;

        const showBubble = () => {
            if (isVisible) return;
            isVisible = true;
            // Only kill opacity, scale, and rotation so xTo/yTo are never destroyed!
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1.5,
                delay: 0.05,
                ease: 'elastic.out(1, 0.4)'
            });
        };

        const hideBubble = () => {
            if (!isVisible) return;
            isVisible = false;
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, {
                opacity: 0,
                scale: 0,
                rotation: -30,
                duration: 0.3,
                ease: 'sine.inOut'
            });
        };

        const onMove = (e) => {
            xTo(e.clientX + 13);
            yTo(e.clientY - 43);

            const rect = hero.getBoundingClientRect();
            const isInside = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );

            const target = e.target;
            const isInteractive = target && target.closest ? Boolean(target.closest('.hero-cta-btn, .navbar, a, button')) : false;

            if (isInside && !isInteractive) {
                showBubble();
            } else {
                hideBubble();
            }
        };

        const onScroll = () => {
            const rect = hero.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
                hideBubble();
            }
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('mouseleave', hideBubble);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('mouseleave', hideBubble);
            gsap.killTweensOf(bubble);
        };
    }, []);

    return (
        <div className="vimeo-hero" ref={heroRef}>
            {/* Interactive Fluid Canvas Backdrop */}
            <canvas ref={canvasRef} className="vimeo-hero__canvas" aria-hidden="true" />

            {/* Elastic Cursor Follower */}
            <div ref={bubbleRef} className="vimeo-mute-bubble is--unmuted" aria-hidden="true">
                <div className="vimeo-mute-bubble__blob">
                    <img src="/assets/VimeoHero SVG/mute-bubble-blob.svg" alt="" className="vimeo-mute-bubble__blob-svg" />
                    <span className="noqta-bubble-label">NOQTA</span>
                </div>
            </div>

            {/* Hero Gradient Overlay */}
            <div className="vimeo-hero__fade" />

            {/* Main Center Content */}
            <div className="home-header__title">
                <h1 className="vimeo-hero__title" dir="rtl">
                    <span className="vimeo-hero__word is--relative">
                        <span className="hero-highlight-brand">نُـقـطَـة</span>
                        <div className="home-header__smiley">
                            <img src="/assets/VimeoHero SVG/smiley-face.svg" alt="" className="home-header__smiley-svg" />
                        </div>
                    </span>
                    <span className="vimeo-hero__word">&nbsp;من بداية&nbsp;</span>
                    <span className="vimeo-hero__word"><em>السطر</em></span>
                    <br />
                    <span className="vimeo-hero__word">لنهاية&nbsp;</span>
                    <span className="vimeo-hero__word is--relative hero-word--highlight">
                        <span className="hero-highlight-word">الإبداع</span>
                        <div className="home-header__star">
                            <div className="home-header__star-inner">
                                <img src="/assets/VimeoHero SVG/pink-star.svg" alt="" className="home-header__star-svg" />
                            </div>
                        </div>
                        <img src="/assets/VimeoHero SVG/oval-underline.svg" alt="" className="home-header__title-line-svg" />
                    </span>
                </h1>
            </div>

            {/* Bottom Controls Indicator */}
            <div className="vimeo-hero__controls">
                <span className="hero-scroll-indicator">
                    <span>اسحب للأسفل</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </span>
            </div>
        </div>
    );
}
