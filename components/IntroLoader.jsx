'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function IntroLoader({ onComplete }) {
    const loaderRef = useRef(null);
    const dotRef = useRef(null);
    const brandRef = useRef(null);
    const subRef = useRef(null);
    const barRef = useRef(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        // Immediately lock scrolling while intro plays
        document.body.style.overflow = 'hidden';
        if (window.__lenis) {
            window.__lenis.stop();
        }

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
                // Unlock scroll
                document.body.style.overflow = '';
                if (window.__lenis) {
                    window.__lenis.start();
                }

                // Trigger hero entrance
                if (onComplete) onComplete();

                // Fade out/slide curtain up
                gsap.to(loaderRef.current, {
                    yPercent: -100,
                    duration: 0.85,
                    ease: 'expo.inOut',
                    onComplete: () => {
                        setHidden(true);
                    }
                });

                // Animate Navbar and Hero in
                gsap.fromTo('.navbar',
                    { y: -30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 }
                );

                gsap.fromTo('.vimeo-hero__word',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.75, stagger: 0.04, ease: 'back.out(1.4)', delay: 0.25 }
                );
            }
        });

        // Frame 0 setup
        gsap.set(dotRef.current, { scale: 0, opacity: 0 });
        gsap.set(brandRef.current, { y: 20, opacity: 0 });
        gsap.set(subRef.current, { y: 15, opacity: 0 });
        gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' });

        // Sequence
        // 1. Dot pops in and pulses
        tl.to(dotRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(2)'
        })
        // 2. Brand Name "NOQTA • نقطة" appears
        .to(brandRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out'
        }, '-=0.2')
        // 3. Subtitle "SOFTWARE & CREATIVE MEDIA"
        .to(subRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
        }, '-=0.25')
        // 4. Progress bar fills quickly & dot expands
        .to(barRef.current, {
            scaleX: 1,
            duration: 0.65,
            ease: 'power2.inOut'
        }, '-=0.2')
        .to(dotRef.current, {
            boxShadow: '0 0 50px 15px rgba(245, 105, 60, 0.8)',
            scale: 1.25,
            duration: 0.35,
            yoyo: true,
            repeat: 1
        }, '-=0.5');

        return () => {
            document.body.style.overflow = '';
            if (window.__lenis) window.__lenis.start();
        };
    }, [onComplete]);

    if (hidden) return null;

    return (
        <div
            ref={loaderRef}
            id="intro-preloader"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                backgroundColor: '#0c0e12',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                pointerEvents: 'all',
                color: '#ffffff'
            }}
        >
            {/* Background subtle radial glow */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245, 105, 60, 0.15) 0%, rgba(75, 105, 240, 0.08) 50%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }}
            />

            {/* Central Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'center',
                    padding: '0 20px'
                }}
            >
                {/* Glowing Noqta Dot */}
                <div
                    ref={dotRef}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#f5693c',
                        boxShadow: '0 0 25px 5px rgba(245, 105, 60, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff'
                        }}
                    />
                </div>

                {/* Team Name */}
                <div
                    ref={brandRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        lineHeight: 1
                    }}
                >
                    <span style={{ fontFamily: 'Epilogue, sans-serif' }}>NOQTA</span>
                    <span style={{ color: '#f5693c' }}>•</span>
                    <span style={{ fontFamily: 'Cairo, sans-serif', color: '#82a0ff' }}>نقطة</span>
                </div>

                {/* Subtitle */}
                <p
                    ref={subRef}
                    style={{
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.75)',
                        margin: 0
                    }}
                >
                    Software &amp; Creative Media
                </p>

                {/* Sleek Line Indicator */}
                <div
                    style={{
                        width: '180px',
                        height: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '8px'
                    }}
                >
                    <div
                        ref={barRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #f5693c, #82a0ff)',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
