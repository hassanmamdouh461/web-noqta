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

        const xTo = gsap.quickTo(bubble, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(bubble, 'y', { duration: 0.5, ease: 'power3' });

        const onMove = (e) => {
            xTo(e.clientX + 14);
            yTo(e.clientY - 45);
        };

        const onEnter = () => {
            gsap.killTweensOf(bubble);
            gsap.to(bubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
        };

        const onLeave = () => {
            gsap.killTweensOf(bubble);
            gsap.to(bubble, { opacity: 0, scale: 0, rotation: -25, duration: 0.3, ease: 'power2.in' });
        };

        window.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseenter', onEnter);
        hero.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            hero.removeEventListener('mouseenter', onEnter);
            hero.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div className="vimeo-hero" ref={heroRef}>
            {/* Interactive Fluid Canvas Backdrop */}
            <canvas ref={canvasRef} className="vimeo-hero__canvas" />

            {/* Elastic Cursor Follower */}
            <div ref={bubbleRef} className="vimeo-mute-bubble is--unmuted" style={{ pointerEvents: 'none' }}>
                <div className="vimeo-mute-bubble__blob">
                    <img src="/assets/VimeoHero SVG/mute-bubble-blob.svg" alt="" className="vimeo-mute-bubble__blob-svg" />
                    <span className="noqta-bubble-label">NOQTA</span>
                </div>
            </div>

            {/* Hero Gradient Overlay */}
            <div className="vimeo-hero__fade" />

            {/* Main Center / Bottom Content */}
            <div className="home-header__title" ref={titleRef}>
                {/* Micro Badges */}
                <div className="hero-division-pills">
                    <span className="hero-pill hero-pill--tech">
                        <span className="pill-dot" /> 01 السوفت وير والحلول التقنية
                    </span>
                    <span className="hero-pill hero-pill--media">
                        <span className="pill-dot" /> 02 الميديا والتسويق الإبداعي
                    </span>
                </div>

                <h1 className="vimeo-hero__title" dir="rtl">
                    <span className="vimeo-hero__word">نحن </span>
                    <span className="vimeo-hero__word is--relative">
                        <span className="hero-highlight-brand">نُـقـطَـة </span>
                        <div className="home-header__smiley">
                            <img src="/assets/VimeoHero SVG/smiley-face.svg" alt="" className="home-header__smiley-svg" />
                        </div>
                    </span>
                    <br />
                    <span className="vimeo-hero__word">حيث تُبنى </span>
                    <span className="vimeo-hero__word"><em>الأفكار </em></span>
                    <span className="vimeo-hero__word">بأعلى </span>
                    <span className="vimeo-hero__word is--relative">
                        <span className="hero-highlight-word">احترافية</span>
                        <div className="home-header__star">
                            <div className="home-header__star-inner">
                                <img src="/assets/VimeoHero SVG/pink-star.svg" alt="" className="home-header__star-svg" />
                            </div>
                        </div>
                        <img src="/assets/VimeoHero SVG/oval-underline.svg" alt="" className="home-header__title-line-svg" />
                    </span>
                </h1>

                <p className="hero-lead-text" dir="rtl">
                    فريق متكامل يجمع بين خبرة <strong>هندسة البرمجيات والأنظمة السحابية</strong>، وبين شغف <strong>صناعة الهوية والميديا والتسويق الرقمي</strong>. نبدأ معك من أول نقطة لنصل بفكرتك إلى أقصى آفاق النجاح.
                </p>

                {/* Hero Action CTA Buttons */}
                <div className="hero-cta-group">
                    <a href="#stack-section" className="hero-cta-btn hero-cta-btn--primary">
                        استكشف أعمالنا ومشاريعنا
                        <span className="hero-cta-arrow">↓</span>
                    </a>
                    <a href={NOQTA_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hero-cta-btn hero-cta-btn--secondary">
                        تواصل معنا مباشرة
                        <span className="hero-cta-dot" />
                    </a>
                </div>
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
