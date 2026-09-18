"use client";

import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRACK_RECORD } from "@/lib/data";
import WebpImage from './WebpImage';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

// `w`/`h` are the intrinsic pixel sizes of each file. They are emitted as
// width/height attributes so the browser can reserve the right box before the
// bytes arrive — Lighthouse flags images without them, and it is the cheapest
// guard against layout shift if a container ever loses its aspect-ratio.
const SHOWCASE_SLIDES = [
    {
        id: 1,
        title: "التصاميم الإبداعية وبناء الهويات والشعارات",
        src: "/assets/noqta/noqta-portfolio-slide1.png",
        alt: "Branding & Logos",
        className: "motion-card__card--1",
        w: 1024, h: 765
    },
    {
        id: 2,
        title: "استراتيجيات التسويق الرقمي وإدارة المنصات",
        src: "/assets/noqta/noqta-marketing-slide10.png",
        alt: "Marketing Services",
        className: "motion-card__card--2",
        w: 1024, h: 766
    },
    {
        id: 3,
        title: "صناعة الميديا وأغلفة الفيديو عالية التفاعل (Thumbnails)",
        src: "/assets/noqta/noqta-thumbnails-slide9.png",
        alt: "Content & Thumbnails",
        className: "motion-card__card--3",
        w: 1024, h: 622
    },
    {
        id: 4,
        title: "أرقام ونتائج الحملات الإعلانية ونمو المشاهدات",
        src: "/assets/noqta/noqta-results-slide13.png",
        alt: "Campaign Analytics",
        className: "motion-card__card--4",
        w: 662, h: 495
    }
];

export default function MotionCards() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(null);

    // Close modal on Escape + freeze the smooth scroller behind it.
    useEffect(() => {
        if (!activeSlide) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setActiveSlide(null);
        };
        window.addEventListener("keydown", handleKeyDown);

        // Without this the page keeps scrolling under the lightbox (Lenis is
        // not stopped by the modal because it listens on window).
        const lenis = typeof window !== "undefined" ? window.__lenis : null;
        if (lenis) lenis.stop();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (lenis) lenis.start();
            document.body.style.overflow = prevOverflow;
        };
    }, [activeSlide]);

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;

        const ctx = gsap.context(() => {
            // Interactive mouse inertia & hover focus on photo cards.
            // Scoped to the section instead of the whole document.
            const cards = root.querySelectorAll(".motion-card__card");
            cards.forEach((card) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(card, "rotation");
                const startX = gsap.getProperty(card, "x");
                const startY = gsap.getProperty(card, "y");

                const onEnter = () => {
                    card.style.zIndex = "40";
                    gsap.to(card, {
                        scale: 1.07,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };

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
                    card.style.zIndex = "";
                    gsap.to(card, {
                        x: startX,
                        y: startY,
                        rotation: startRotation,
                        scale: 1,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.4)"
                    });
                };

                card.addEventListener("mouseenter", onEnter);
                card.addEventListener("mousemove", onMove);
                card.addEventListener("mouseleave", onLeave);
            });

            // Interactive mouse inertia on floating labels
            const labels = root.querySelectorAll(".motion-card__floating-label");
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
            // `gsap.from` renders its start state immediately, so this sets the
            // metrics to opacity 0 the moment the script runs and only restores
            // them when the trigger fires. Under prefers-reduced-motion that
            // tween never ran, leaving "+25 / +100,000 / +40 / +30" permanently
            // transparent — measured at opacity 0 on both 390px and 1280px, i.e.
            // four real numbers lost for those visitors. Skip the tween entirely
            // when motion is reduced so the metrics simply render as authored.
            const statNumbers = root.querySelectorAll(".motion-card__stat-num");
            if (!prefersReducedMotion()) {
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
            }

            // ─── Card entrance animation (the entry choreography this section
            // used to have). Each card rises and fades in with a stagger when
            // the section enters the viewport. Skipped under prefers-reduced-
            // motion so the site still respects the user setting.
            if (!prefersReducedMotion()) {
                gsap.from(root.querySelectorAll(".motion-card__card"), {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 78%",
                        once: true,
                    },
                    opacity: 0,
                    y: 60,
                    scale: 0.92,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "power3.out",
                });
            }

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
                            loading="lazy"
                            decoding="async" width={181} height={116}
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
                        loading="lazy"
                        decoding="async" width={527} height={526}
                    />
                </div>

                {/* 4 Cards */}
                <div ref={containerRef} className="motion-card__cards">
                    {SHOWCASE_SLIDES.map((slide) => (
                        <div
                            key={slide.id}
                            className={`motion-card__card ${slide.className}`}
                            onClick={() => setActiveSlide(slide)}
                            role="button"
                            tabIndex={0}
                            title={`انقر لعرض: ${slide.title}`}
                            aria-label={`عرض بالحجم الكامل: ${slide.title}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    // A11Y: without preventDefault the Space key
                                    // also scrolls the page on top of opening
                                    // the lightbox.
                                    e.preventDefault();
                                    setActiveSlide(slide);
                                }
                            }}
                        >
                            <div className="motion-card__card-image">
                                <WebpImage
                                    src={slide.src}
                                    loading="lazy"
                                    decoding="async"
                                    alt={slide.alt}
                                    className="cover-image"
                                    width={slide.w}
                                    height={slide.h}
                                />
                            </div>
                        </div>
                    ))}
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

            {/* Lightbox Modal for Full Slide View */}
            {activeSlide && (
                <div
                    className="motion-card__modal-backdrop"
                    onClick={() => setActiveSlide(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="motion-card__modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="motion-card__modal-header" dir="rtl">
                            <h3 className="motion-card__modal-title">{activeSlide.title}</h3>
                            <button
                                className="motion-card__modal-close"
                                onClick={() => setActiveSlide(null)}
                                aria-label="إغلاق"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="motion-card__modal-body">
                            <WebpImage src={activeSlide.src} alt={activeSlide.title} decoding="async" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
