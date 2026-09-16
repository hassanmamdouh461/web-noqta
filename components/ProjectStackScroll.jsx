'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA, NOQTA_INFO } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectStackScroll() {
    const sectionRef = useRef(null);
    const deckRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const deck = deckRef.current;
        if (!section || !deck) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.stack-card');
            if (!cards.length) return;

            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const PEEK = isMobile ? 24 : 38;
            const SCALE_STEP = 0.04;

            function stackPose(index) {
                return {
                    y: index * PEEK,
                    scale: 1 - index * SCALE_STEP,
                };
            }

            // Initial pose: offscreen downwards
            cards.forEach((card, i) => {
                gsap.set(card, {
                    zIndex: cards.length - i,
                    y: window.innerHeight * 0.7 + i * PEEK,
                    scale: stackPose(i).scale * 0.92,
                    rotate: 0,
                    transformOrigin: "50% 0%",
                });
            });

            // Master ScrollTrigger timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${cards.length * window.innerHeight * 0.85}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            // Step 1: Cards rise into stack
            cards.forEach((card, i) => {
                tl.to(
                    card,
                    { ...stackPose(i), ease: "power2.out", duration: 1.2 },
                    i * 0.08
                );
            });

            tl.to({}, { duration: 0.3 });

            // Step 2: Flying cards away one by one on further scroll
            const flyAt = tl.duration();
            const flying = cards.slice(0, -1);

            flying.forEach((card, i) => {
                const time = flyAt + i * 1.1;
                const behind = cards.slice(i + 1);

                // Card tilts and flies up
                tl.to(
                    card,
                    {
                        y: () => -window.innerHeight * 1.12,
                        rotate: -22,
                        scale: 0.94,
                        opacity: 0.85,
                        ease: "power1.inOut",
                        duration: 1.1,
                    },
                    time
                );

                // Cards behind slide up into the top stack position
                tl.to(
                    behind,
                    {
                        y: (index) => stackPose(index).y,
                        scale: (index) => stackPose(index).scale,
                        ease: "power1.out",
                        duration: 1.1,
                    },
                    time
                );
            });

            tl.to({}, { duration: 0.35 });

            window.addEventListener("resize", () => ScrollTrigger.refresh());
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="stack-section" id="stack-section" aria-label="Projects">
            {/* Stack Header */}
            <div className="stack__header">
                <div className="stack__badge">
                    <span>معرض الأعمال والمشاريع • Selected Works</span>
                </div>
                <h2>أعمال حية تُحقق نتائج ملموسة</h2>
                <p>
                    تصفّح مجموعة مختارة من مشاريعنا في الهويات البصرية، حملات التسويق، وتطوير السوفت وير. اسحب للأسفل لتفقد كل مشروع.
                </p>
            </div>

            {/* Stacking Cards Stage */}
            <div className="stack__stage">
                <div ref={deckRef} className="stack__deck">
                    {PROJECTS_DATA.map((project, index) => (
                        <article
                            key={project.id}
                            className="stack-card"
                            data-tone={project.tone}
                        >
                            {/* Card Content (Right / Text) */}
                            <div className="stack-card__content">
                                <div className="stack-card__top">
                                    <span className="stack-card__badge-tag">
                                        {project.badgeAr}
                                    </span>
                                    <span className="stack-card__index">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="stack-card__title">
                                    {project.titleAr}
                                </h3>

                                <p className="stack-card__lede">
                                    {project.lede}
                                </p>

                                <p className="stack-card__body">
                                    {project.body}
                                </p>

                                <div className="stack-card__footer">
                                    <span className="stack-card__client-tag">
                                        العميل: {project.client}
                                    </span>

                                    <a
                                        href={NOQTA_INFO.whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="stack-card__cta"
                                    >
                                        ناقش مشروعاً مشابهاً
                                        <span className="stack-card__cta-arrow" aria-hidden="true">←</span>
                                    </a>
                                </div>
                            </div>

                            {/* Card Media (Left / Preview) */}
                            <div className="stack-card__media">
                                <div className="stack-card__media-inner">
                                    <img
                                        src={project.image}
                                        alt={project.titleAr}
                                        loading="lazy"
                                    />
                                    <div className="stack-card__overlay-tag">
                                        {project.tag}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
