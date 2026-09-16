"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRACK_RECORD } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function MotionCards() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Interactive mouse inertia on photo cards
            const cards = document.querySelectorAll(".motion-card__card");
            cards.forEach((card) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(card, "rotation");
                const startX = gsap.getProperty(card, "x");
                const startY = gsap.getProperty(card, "y");

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    speedY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;

                    gsap.to(card, {
                        x: startX + speedX * 0.8,
                        y: startY + speedY * 0.8,
                        rotation: startRotation + speedX * 0.15,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                };

                const onLeave = () => {
                    gsap.to(card, {
                        x: startX,
                        y: startY,
                        rotation: startRotation,
                        duration: 0.9,
                        ease: "elastic.out(1, 0.4)"
                    });
                };

                card.addEventListener("mousemove", onMove);
                card.addEventListener("mouseleave", onLeave);
            });

            // Interactive mouse inertia on floating labels
            const labels = document.querySelectorAll(".motion-card__floating-label");
            labels.forEach((label) => {
                let lastX = 0;
                let speedX = 0;

                const startRotation = gsap.getProperty(label, "rotation");
                const startX = gsap.getProperty(label, "x");
                const startY = gsap.getProperty(label, "y");

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    lastX = e.clientX;

                    gsap.to(label, {
                        x: startX + speedX * 1.2,
                        rotation: startRotation + speedX * 0.25,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                };

                const onLeave = () => {
                    gsap.to(label, {
                        x: startX,
                        y: startY,
                        rotation: startRotation,
                        duration: 1.1,
                        ease: "elastic.out(1, 0.3)"
                    });
                };

                label.addEventListener("mousemove", onMove);
                label.addEventListener("mouseleave", onLeave);
            });

            // Underline Draw Animation on scroll
            const underlinePath = sectionRef.current?.querySelector(".motion-card__underline-path");
            if (underlinePath) {
                const pathLen = underlinePath.getTotalLength();
                gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                gsap.to(underlinePath, {
                    strokeDashoffset: 0,
                    duration: 1.4,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            // Metric Counters Animation
            const statNumbers = document.querySelectorAll(".motion-card__stat-num");
            gsap.from(statNumbers, {
                scale: 0.8,
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".motion-card__stats-grid",
                    start: "top 85%"
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="motion-card-section" id="motion-card-section">
            {/* Heading Text */}
            <div className="motion-card__heading" dir="rtl">
                <h2 className="motion-card__title">
                    وكالة إبداعية وتقنية
                    <br />
                    صُممت للمستقبل.
                </h2>
                <p className="motion-card__subtitle">
                    من أول سطر كود.. إلى أعلى انتشار وتريند.
                    <span className="motion-card__sticker motion-card__sticker--top">
                        <img
                            src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg"
                            alt=""
                            className="motion-card__sticker-img"
                        />
                    </span>
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
                    <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Interactive Physics Cards Area */}
            <div className="motion-card__cards-area">
                {/* Colored SVG blob behind */}
                <div className="motion-card__blob">
                    <img
                        src="/assets/MotionCard SVG/motion-card-blob.svg"
                        alt=""
                        className="motion-card__blob-svg"
                    />
                </div>

                {/* 4 Cards */}
                <div ref={containerRef} className="motion-card__cards">
                    {/* Card 1: Branding & Logos */}
                    <div className="motion-card__card motion-card__card--1">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/noqta/noqta-portfolio-slide1.png"
                                loading="lazy"
                                alt="Branding & Logos"
                                className="cover-image"
                            />
                        </div>
                    </div>

                    {/* Card 2: 3D Marketing Strategy */}
                    <div className="motion-card__card motion-card__card--2">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/noqta/noqta-marketing-slide10.png"
                                loading="lazy"
                                alt="Marketing Services"
                                className="cover-image"
                            />
                        </div>
                    </div>

                    {/* Card 3: Video Thumbnails */}
                    <div className="motion-card__card motion-card__card--3">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/noqta/noqta-thumbnails-slide9.png"
                                loading="lazy"
                                alt="Content & Thumbnails"
                                className="cover-image"
                            />
                        </div>
                    </div>

                    {/* Card 4: Campaign Results */}
                    <div className="motion-card__card motion-card__card--4">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/noqta/noqta-results-slide13.png"
                                loading="lazy"
                                alt="Campaign Analytics"
                                className="cover-image"
                            />
                        </div>
                    </div>
                </div>

                {/* Floating neon labels */}
                <div className="motion-card__floating-labels">
                    <div className="motion-card__floating-label motion-card__floating-label--pink">
                        <p className="motion-card__floating-text">الكود النظيف = أساس النجاح ⚡</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--orange">
                        <p className="motion-card__floating-text">الهوية التي تلتصق بالأذهان 🎨</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--red">
                        <p className="motion-card__floating-text">أرقام ونتائج تتحدث عن نفسها 📈</p>
                    </div>
                </div>
            </div>

            {/* Operational Track Record KPIs */}
            <div className="motion-card__stats-grid" dir="rtl">
                {TRACK_RECORD.map((stat, i) => (
                    <div key={i} className="motion-card__stat-item">
                        <div className="motion-card__stat-num">{stat.number}</div>
                        <div className="motion-card__stat-label">{stat.label}</div>
                        <div className="motion-card__stat-sub">{stat.sublabel}</div>
                    </div>
                ))}
            </div>

            {/* Bottom Paragraph Description */}
            <div className="motion-card__footer-text" dir="rtl">
                <p className="motion-card__description">
                    في نقطة، لا نقدم حلولاً جاهزة. نجمع بين عقلية <strong>المطور التقني</strong> الذي يضمن قوة واستقرار أنظمتك البرمجية، وحس <strong>المصمم والمسوق الإبداعي</strong> الذي يضمن أن تلمس رسالتك قلوب الجماهير وتحقق أعلى عوائد نمو.
                </p>
            </div>
        </section>
    );
}
