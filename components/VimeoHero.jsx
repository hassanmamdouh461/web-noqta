'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { NOQTA_INFO } from '@/lib/data';

export default function VimeoHero() {
    const heroRef = useRef(null);
    const canvasRef = useRef(null);
    const bubbleRef = useRef(null);
    const titleRef = useRef(null);
    const controlsRef = useRef(null);

    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    // ─── Interactive Fluid Canvas Animation ───
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Gradient orbs
        const orbs = [
            { x: width * 0.25, y: height * 0.35, vx: 0.8, vy: 0.6, r: width * 0.35, color: 'rgba(54, 36, 136, 0.75)' }, // Deep Violet
            { x: width * 0.75, y: height * 0.65, vx: -0.7, vy: -0.5, r: width * 0.38, color: 'rgba(50, 62, 134, 0.7)' }, // Deep Indigo
            { x: width * 0.5, y: height * 0.5, vx: 0.5, vy: -0.8, r: width * 0.28, color: 'rgba(67, 251, 156, 0.25)' }, // Neon Mint
            { x: width * 0.85, y: height * 0.2, vx: -0.6, vy: 0.7, r: width * 0.25, color: 'rgba(61, 167, 146, 0.35)' } // Teal
        ];

        const render = () => {
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

            animId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    // ─── Floating Elastic Cursor Bubble ───
    useEffect(() => {
        const bubble = bubbleRef.current;
        const hero = heroRef.current;
        if (!bubble || !hero) return;

        // Skip on coarse pointers (touch devices)
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        // Initialize bubble completely off-screen and invisible
        gsap.set(bubble, {
            x: -500,
            y: -500,
            scale: 0,
            autoAlpha: 0,
            rotation: -25
        });

        let isVisible = false;
        let lastX = -1000;
        let lastY = -1000;

        const showBubble = (targetX, targetY) => {
            if (!isVisible) {
                isVisible = true;
                // Place at cursor immediately before popping in so it never flies in from corner
                gsap.set(bubble, { x: targetX, y: targetY });
                gsap.to(bubble, {
                    autoAlpha: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.45)',
                    overwrite: 'auto'
                });
            } else {
                // Follow cursor smoothly with natural fluid inertia
                gsap.to(bubble, {
                    x: targetX,
                    y: targetY,
                    duration: 0.32,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        };

        const hideBubble = () => {
            if (!isVisible) return;
            isVisible = false;
            gsap.to(bubble, {
                autoAlpha: 0,
                scale: 0,
                rotation: -25,
                duration: 0.22,
                ease: 'power2.in',
                overwrite: 'auto',
                onComplete: () => {
                    gsap.set(bubble, { x: -500, y: -500 });
                }
            });
        };

        const checkInside = (x, y) => {
            if (x <= 0 || y <= 0) return false;
            const rect = hero.getBoundingClientRect();
            return (
                x >= rect.left + 5 &&
                x <= rect.right - 5 &&
                y >= rect.top + 5 &&
                y <= rect.bottom - 5
            );
        };

        const isInteractiveHover = (el) => {
            if (!el || !el.closest) return false;
            return Boolean(el.closest('.hero-cta-btn, .navbar, .home-header__title a, button'));
        };

        const onMove = (e) => {
            lastX = e.clientX;
            lastY = e.clientY;

            const isInside = checkInside(lastX, lastY);
            const isOverBtn = isInteractiveHover(e.target);

            if (isInside && !isOverBtn) {
                showBubble(lastX + 14, lastY - 45);
            } else {
                hideBubble();
            }
        };

        const onScrollOrUpdate = () => {
            if (lastX === -1000 || lastY === -1000) return;
            const el = document.elementFromPoint(lastX, lastY);
            const isInside = checkInside(lastX, lastY);
            const isOverBtn = isInteractiveHover(el);

            if (isInside && !isOverBtn) {
                showBubble(lastX + 14, lastY - 45);
            } else {
                hideBubble();
            }
        };

        const onWindowMouseLeave = () => {
            lastX = -1000;
            lastY = -1000;
            hideBubble();
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('scroll', onScrollOrUpdate, { passive: true });
        document.addEventListener('mouseleave', onWindowMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', onScrollOrUpdate);
            document.removeEventListener('mouseleave', onWindowMouseLeave);
            gsap.killTweensOf(bubble);
        };
    }, []);

    return (
        <div className="vimeo-hero" ref={heroRef}>
            {/* Interactive Fluid Canvas Backdrop */}
            <canvas ref={canvasRef} className="vimeo-hero__canvas" />

            {/* Elastic Cursor Follower */}
            <div ref={bubbleRef} className="vimeo-mute-bubble is--unmuted" style={{ pointerEvents: 'none', opacity: 0, visibility: 'hidden' }}>
                <div className="vimeo-mute-bubble__blob">
                    <img src="/assets/VimeoHero SVG/mute-bubble-blob.svg" alt="" className="vimeo-mute-bubble__blob-svg" />
                    <span className="noqta-bubble-label">NOQTA</span>
                </div>
            </div>

            {/* Hero Gradient Overlay */}
            <div className="vimeo-hero__fade" />

            {/* Main Center Content */}
            <div className="home-header__title" ref={titleRef}>
                <h1 className="vimeo-hero__title" dir="rtl">
                    <span className="vimeo-hero__word is--relative">
                        <span className="hero-highlight-brand">نُـقـطَـة </span>
                        <div className="home-header__smiley">
                            <img src="/assets/VimeoHero SVG/smiley-face.svg" alt="" className="home-header__smiley-svg" />
                        </div>
                    </span>
                    <span className="vimeo-hero__word">من بداية </span>
                    <span className="vimeo-hero__word"><em>السطر</em></span>
                    <br />
                    <span className="vimeo-hero__word">لنهاية </span>
                    <span className="vimeo-hero__word is--relative">
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
            <div className="vimeo-hero__controls" ref={controlsRef}>
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
