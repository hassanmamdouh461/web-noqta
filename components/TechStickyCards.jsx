'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TECH_PROJECTS = [
    {
        id: 'tech-1',
        tag: 'AI & Cloud Infrastructure',
        title: 'PulseFlow SaaS',
        arabicTitle: 'منصة بالس فلو السحابية',
        desc: 'نظام سحابي ذكي لمعالجة البيانات وأتمتة العمليات للمؤسسات الكبرى ببنية تحتية فائقة المرونة وسرعة استجابة أقل من 40ms.',
        metrics: '99.99% Uptime • +120k Daily Requests',
        stack: ['Next.js 15', 'Python FastAPI', 'PostgreSQL', 'Docker'],
        image: '/assets/projects/card-img-1.jpg',
        bg: '#12161f',
        accent: '#00f2fe'
    },
    {
        id: 'tech-2',
        tag: 'Mobile & High-Scale Web',
        title: 'Kyan Commerce',
        arabicTitle: 'منظومة كيان للتجارة الإلكترونية',
        desc: 'تطبيق موبايل ومتجر إلكتروني متكامل يتحمل آلاف المعاملات في الثانية، متصل بأنظمة المخازن ونقاط البيع وبوابات الدفع المحلية.',
        metrics: '3.4x Conversion Rate • +50k Active Users',
        stack: ['React Native', 'Node.js', 'Redis', 'Paymob'],
        image: '/assets/projects/card-img-2.jpg',
        bg: '#0c1b30',
        accent: '#4facfe'
    },
    {
        id: 'tech-3',
        tag: 'FinTech & Security API',
        title: 'NovaPay System',
        arabicTitle: 'بوابة نوفا باي للمدفوعات',
        desc: 'بنية تحتية للمدفوعات الرقمية والتحويلات اللحظية متوافقة مع معايير الأمان PCI-DSS، تقدم حلول دفع آمنة وسلسة.',
        metrics: 'End-to-End Encryption • Zero Downtime',
        stack: ['TypeScript', 'Go', 'Kubernetes', 'AWS'],
        image: '/assets/projects/card-img-3.jpg',
        bg: '#1b122c',
        accent: '#f7797d'
    },
    {
        id: 'tech-4',
        tag: 'IoT & Realtime Operations',
        title: 'Nexus Fleet OS',
        arabicTitle: 'نظام نكسس لإدارة الأساطيل',
        desc: 'نظام تتبع ذكي وإدارة عمليات لوجستية بالزمن الحقيقي مع خوارزميات توجيه المسارات بالذكاء الاصطناعي لتوفير استهلاك الوقود 22%.',
        metrics: 'Live GPS Sync • -22% Operational Cost',
        stack: ['Vue 3', 'WebSockets', 'Python AI', 'MongoDB'],
        image: '/assets/projects/card-img-4.jpg',
        bg: '#21180f',
        accent: '#f39c12'
    }
];

export default function TechStickyCards() {
    const sectionRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.sticky-cards .tech-card');
            const totalCards = cards.length;
            if (!totalCards) return;

            const segmentSize = 1 / totalCards;
            const cardYOffset = 6;
            const cardScaleStep = 0.065;

            cards.forEach((card, i) => {
                gsap.set(card, {
                    xPercent: -50,
                    yPercent: -50 + i * cardYOffset,
                    scale: 1 - i * cardScaleStep,
                    zIndex: totalCards - i,
                });
            });

            const isMobile = window.innerWidth <= 768;
            const scrollDistance = isMobile ? window.innerHeight * 1.6 : window.innerHeight * 2.2;

            const trigger = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: `+=${scrollDistance}px`,
                pin: true,
                pinSpacing: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const activeIndex = Math.min(
                        Math.floor(progress / segmentSize),
                        totalCards - 1
                    );
                    const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

                    cards.forEach((card, i) => {
                        if (i < activeIndex) {
                            gsap.set(card, {
                                yPercent: -170,
                                rotationX: 28,
                                opacity: 0,
                                filter: 'blur(4px)',
                                pointerEvents: 'none'
                            });
                        } else if (i === activeIndex) {
                            gsap.set(card, {
                                yPercent: gsap.utils.interpolate(-50, -170, segProgress),
                                rotationX: gsap.utils.interpolate(0, 28, segProgress),
                                scale: gsap.utils.interpolate(1, 0.96, segProgress),
                                opacity: gsap.utils.interpolate(1, 0, segProgress),
                                filter: `blur(${gsap.utils.interpolate(0, 4, segProgress)}px)`,
                                pointerEvents: segProgress > 0.7 ? 'none' : 'auto'
                            });
                        } else {
                            const behindIndex = i - activeIndex;
                            const currentYOffset = (behindIndex - segProgress) * cardYOffset;
                            const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;
                            const currentOpacity = gsap.utils.clamp(0.4, 1, 1 - (behindIndex - segProgress) * 0.15);

                            gsap.set(card, {
                                yPercent: -50 + currentYOffset,
                                rotationX: 0,
                                scale: currentScale,
                                opacity: currentOpacity,
                                filter: 'blur(0px)',
                                pointerEvents: 'auto'
                            });
                        }
                    });
                },
            });

            return () => trigger.kill();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="sticky-cards-section" id="tech-projects">
            {/* Header / Intro banner */}
            <div className="sticky-cards__top-bar">
                <div className="sticky-cards__badge">
                    <span className="badge-dot" />
                    <span>SOFTWARE & ENGINEERING</span>
                </div>
                <h2 className="sticky-cards__heading">
                    كود يبني المستقبل <span className="highlight-text">/ TECH BUILDS</span>
                </h2>
                <p className="sticky-cards__sub">
                    انزل بالسكرول وشوف مشاريعنا البرمجية التي تحرك أعمالاً كبرى
                </p>
            </div>

            {/* 3D Sticky Cards container */}
            <div className="sticky-cards">
                {TECH_PROJECTS.map((project, idx) => (
                    <article
                        key={project.id}
                        className="card tech-card"
                        id={`tech-card-${idx + 1}`}
                        style={{ backgroundColor: project.bg }}
                        data-cursor="tech"
                    >
                        {/* Column 1: Info */}
                        <div className="col col--info">
                            <div className="card-header-badge">
                                <span className="card-tag">{project.tag}</span>
                                <span className="card-num">0{idx + 1}</span>
                            </div>

                            <div className="card-body-content">
                                <h3 className="card-title-en">{project.title}</h3>
                                <h4 className="card-title-ar">{project.arabicTitle}</h4>
                                <p className="card-desc">{project.desc}</p>
                            </div>

                            <div className="card-footer-info">
                                <div className="card-metrics">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    <span>{project.metrics}</span>
                                </div>
                                <div className="card-stack-pills">
                                    {project.stack.map((item) => (
                                        <span key={item} className="tech-pill">{item}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Media preview */}
                        <div className="col col--media">
                            <div className="card-media-wrapper">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                />
                                <div className="media-overlay">
                                    <span className="live-demo-tag">Explore Architecture →</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
