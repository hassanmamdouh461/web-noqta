"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionCards() {
    const sectionRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Elastic momentum fling for cards
            const cards = document.querySelectorAll(".motion-card__card");
            cards.forEach((card) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(card, "rotation") || 0;
                const startX = gsap.getProperty(card, "x") || 0;
                const startY = gsap.getProperty(card, "y") || 0;

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    speedY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onEnter = (e) => {
                    speedX = 0;
                    speedY = 0;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onLeave = () => {
                    gsap.to(card, {
                        x: startX + speedX * 4,
                        y: startY + speedY * 4,
                        rotation: startRotation + speedX * 0.4,
                        duration: 0.6,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(card, {
                                x: startX,
                                y: startY,
                                rotation: startRotation,
                                duration: 0.8,
                                ease: "elastic.out(1, 0.4)"
                            });
                        }
                    });
                };

                card.addEventListener("mousemove", onMove);
                card.addEventListener("mouseenter", onEnter);
                card.addEventListener("mouseleave", onLeave);
            });

            // Elastic momentum fling for floating labels
            const labels = document.querySelectorAll(".motion-card__floating-label");
            labels.forEach((label) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(label, "rotation") || 0;
                const startX = gsap.getProperty(label, "x") || 0;
                const startY = gsap.getProperty(label, "y") || 0;

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    speedY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onEnter = (e) => {
                    speedX = 0;
                    speedY = 0;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onLeave = () => {
                    gsap.to(label, {
                        x: startX + speedX * 5,
                        y: startY + speedY * 5,
                        rotation: startRotation + speedX * 0.5,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(label, {
                                x: startX,
                                y: startY,
                                rotation: startRotation,
                                duration: 0.9,
                                ease: "elastic.out(1, 0.35)"
                            });
                        }
                    });
                };

                label.addEventListener("mousemove", onMove);
                label.addEventListener("mouseenter", onEnter);
                label.addEventListener("mouseleave", onLeave);
            });

            // Entry Animations: Sticker Pop & Underline Draw
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });

            const topStickerImg = sectionRef.current.querySelector(".motion-card__sticker--top img");
            if (topStickerImg) {
                gsap.set(topStickerImg, { scale: 0, opacity: 0, rotation: -30 });
                tl.to(topStickerImg, { scale: 1, opacity: 1, rotation: 0, duration: 1.7, ease: "elastic.out(1, 0.4)" }, 0);
            }

            const underlinePath = sectionRef.current.querySelector(".motion-card__underline-path");
            if (underlinePath) {
                const pathLen = underlinePath.getTotalLength();
                gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                tl.to(underlinePath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0.2);
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="motion-card-section" id="motion-card-section">
            {/* ─── Part 1: Bold Heading Text ─── */}
            <div className="motion-card__heading">
                <div className="noqta-mini-tag">
                    <span className="noqta-dot-pulse" />
                    <span>تيم نقطة • THE DUAL FORCE</span>
                </div>
                <h2 className="motion-card__title">
                    كود يبني ويتحمل.
                    <br />
                    وميديا تصنع أثر.
                </h2>
                <p className="motion-card__subtitle">
                    FROM ARCHITECTURE TO GO-VIRAL.
                    <span className="motion-card__sticker motion-card__sticker--top">
                        <img
                            src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg"
                            alt="Noqta Hands sticker"
                            className="motion-card__sticker-img"
                        />
                    </span>
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
                    <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* ─── Part 2: Cards with Colorful Bars & Blue Blob ─── */}
            <div className="motion-card__cards-area">
                <div className="motion-card__blob">
                    <img
                        src="/assets/MotionCard SVG/motion-card-blob.svg"
                        alt=""
                        className="motion-card__blob-svg"
                    />
                </div>

                {/* 4 Interactive Photo Cards */}
                <div className="motion-card__cards">
                    <div className="motion-card__card motion-card__card--1" data-cursor="drag">
                        <div className="motion-card__card-image">
                            <img
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                                loading="lazy"
                                alt="Code Architecture"
                                className="cover-image"
                            />
                            <div className="card-inner-caption">01 // CODE ARCHITECTURE</div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--2" data-cursor="drag">
                        <div className="motion-card__card-image">
                            <img
                                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
                                loading="lazy"
                                alt="Video Production"
                                className="cover-image"
                            />
                            <div className="card-inner-caption">02 // CINEMATIC MEDIA</div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--3" data-cursor="drag">
                        <div className="motion-card__card-image">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                                loading="lazy"
                                alt="Data & Growth"
                                className="cover-image"
                            />
                            <div className="card-inner-caption">03 // SCALABLE APPS</div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--4" data-cursor="drag">
                        <div className="motion-card__card-image">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                                loading="lazy"
                                alt="Creative Direction"
                                className="cover-image"
                            />
                            <div className="card-inner-caption">04 // CREATIVE DIRECTION</div>
                        </div>
                    </div>
                </div>

                {/* Floating labels — positioned freely over the cards area */}
                <div className="motion-card__floating-labels">
                    <div className="motion-card__floating-label motion-card__floating-label--pink">
                        <p className="motion-card__floating-text">🚀 كود نظيف وسريع</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--orange">
                        <p className="motion-card__floating-text">🎬 ميديا تخطف العين</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--red">
                        <p className="motion-card__floating-text">⚡ شراكة نجاح حقيقية</p>
                    </div>
                </div>
            </div>

            {/* ─── Part 3: Bottom Paragraph Text ─── */}
            <div className="motion-card__footer-text">
                <p className="motion-card__description">
                    في <strong>نقطة (Noqta)</strong>، ما بنفصلش بين قوة البرمجة وسحر المحتوى. 
                    بنبني الأنظمة البرمجية والمواقع بأعلى أداء وتجاوب، وبنصنع لها الهوية البصرية، 
                    الفيديوهات، والحملات التسويقية اللي بتخليها تتصدر وتبيع.
                </p>
            </div>
        </section>
    );
}
