'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MEDIA_PROJECTS = [
    {
        id: 'media-1',
        tone: '1',
        title: 'Aura Brand Identity',
        arabicTitle: 'هوية بصرية ونظام متكامل',
        index: '01',
        lede: 'بناء استراتيجية وهوية بصرية كاملة تنبض بالحياة عبر كل منصة.',
        body: 'من الشعار وحتى أسلوب الحركة (Motion Systems) وكتابة المحتوى، صممنا حضوراً رقمياً فريداً يترك بصمة لا تُنسى في ذهن العميل.',
        category: 'Brand Systems & Strategy',
        image: 'https://images.unsplash.com/photo-1542744094-3a3172720a44?auto=format&fit=crop&w=700&h=933&q=80',
        tags: ['Brand Identity', 'Art Direction', 'Motion System']
    },
    {
        id: 'media-2',
        tone: '2',
        title: 'Trendsetter Reels',
        arabicTitle: 'سلسلة ريلز وتيك توك فيروسية',
        index: '02',
        lede: 'أفكار محتوى أصلية صنعت خصيصاً للانتشار والتفاعل العضوي.',
        body: 'إنتاج محتوى فيديو قصير حقق أكثر من 4.8 مليون مشاهدة أورجانيك، مع ارتفاع معدل المتابعين بنسبة 280% خلال 60 يوماً فقط.',
        category: 'Social Production & Viral Growth',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&h=933&q=80',
        tags: ['TikTok Production', 'Viral Scripts', 'Creator Editing']
    },
    {
        id: 'media-3',
        tone: '3',
        title: 'Cinematic TVC Film',
        arabicTitle: 'إعلان تجاري سينمائي',
        index: '03',
        lede: 'قصة سينمائية مؤثرة تروي جوهر العلامة وتصل للقلب.',
        body: 'إخراج فني متكامل، تصوير بعدسات سينمائية احترافية ومؤثرات صوتية وموسيقى خاصة لفتت انتباه الجمهور وصنعت حديث السوق.',
        category: 'High-End Film Production',
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&h=933&q=80',
        tags: ['Cinematography', 'Sound Design', 'Color Grading']
    },
    {
        id: 'media-4',
        tone: '4',
        title: 'Performance Growth',
        arabicTitle: 'حملات تسويقية مبنية على الأرقام',
        index: '04',
        lede: 'تحويل المشاهدات والتفاعل إلى عوائد مالية حقيقية.',
        body: 'استهداف دقيق واختبار مستمر للإعلانات والرسائل التسويقية (A/B Testing) حقق معدل عائد استثماري إعلاني ROAS تجاوز 5.2x.',
        category: 'Performance Marketing & Media Buying',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&h=933&q=80',
        tags: ['Paid Ads', 'Funnel Optimization', 'Data Insights']
    },
    {
        id: 'media-5',
        tone: '5',
        title: 'Creative Retainer',
        arabicTitle: 'شراكة إبداعية سنوية متكاملة',
        index: '05',
        lede: 'فريق تسويق وإنتاج كامل يعمل كامتداد طبيعي لشركتك.',
        body: 'تخطيط شهري، جلسات تصوير مستمرة، وإدارة لمنصات التواصل تضمن بقاء البراند في صدارة مجاله وتفاعله الدائم مع التريندات.',
        category: 'End-to-End Creative Partner',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=933&q=80',
        tags: ['Content Calendar', 'Studio Shoots', 'Community Growth']
    }
];

export default function MediaStackScroll() {
    const stackRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.media-stack .media-card');
            if (!cards.length) return;

            const PEEK = 38;
            const SCALE_STEP = 0.04;

            const stackPose = (index) => ({
                y: index * PEEK,
                scale: 1 - index * SCALE_STEP,
            });

            // Initial pose: cards hidden slightly below
            cards.forEach((card, i) => {
                gsap.set(card, {
                    zIndex: cards.length - i,
                    y: window.innerHeight * 0.65 + i * PEEK,
                    scale: stackPose(i).scale * 0.92,
                    rotate: 0,
                    transformOrigin: '50% 0%',
                });
            });

            const isMobile = window.innerWidth <= 768;
            const scrollFactor = isMobile ? 0.35 : 0.45;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: stackRef.current,
                    start: 'top top',
                    end: () => `+=${cards.length * window.innerHeight * scrollFactor}`,
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // Phase 1: Cards gather smoothly into deck
            cards.forEach((card, i) => {
                tl.to(
                    card,
                    {
                        ...stackPose(i),
                        ease: 'power3.out',
                        duration: 1.0,
                    },
                    i * 0.06
                );
            });

            tl.to({}, { duration: 0.2 });

            // Phase 2: Each card flies away, revealing the card behind it
            const flyAt = tl.duration();
            const flyingCards = cards.slice(0, -1);

            flyingCards.forEach((card, i) => {
                const time = flyAt + i * 0.9;
                const behindCards = cards.slice(i + 1);
                const tiltAngle = i % 2 === 0 ? -11 : 11;

                tl.to(
                    card,
                    {
                        y: () => -window.innerHeight * 0.9,
                        rotate: tiltAngle,
                        scale: 0.95,
                        opacity: 0,
                        ease: 'power2.inOut',
                        duration: 0.85,
                    },
                    time
                );

                tl.to(
                    behindCards,
                    {
                        y: (idx) => stackPose(idx).y,
                        scale: (idx) => stackPose(idx).scale,
                        ease: 'power2.out',
                        duration: 0.85,
                    },
                    time
                );
            });

            tl.to({}, { duration: 0.2 });
        }, stackRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={stackRef} className="media-stack-section" id="media-projects">
            <div className="media-stack__header">
                <div className="media-stack__badge">
                    <span className="badge-pulse" />
                    <span>MARKETING, MEDIA & STORYTELLING</span>
                </div>
                <h2 className="media-stack__title">
                    ميديا تخطف الانتباه <span className="highlight-text">/ CREATIVE DECK</span>
                </h2>
                <p className="media-stack__sub">
                    انزل بالسكرول لمشاهدة البطاقات تتدفق وتكشف الحملات الإبداعية
                </p>
            </div>

            <div className="media-stack__stage">
                <div className="media-stack__deck media-stack">
                    {MEDIA_PROJECTS.map((item) => (
                        <article
                            key={item.id}
                            className="media-card"
                            data-tone={item.tone}
                            data-cursor="media"
                        >
                            <div className="media-card__content">
                                <div className="media-card__top">
                                    <div className="media-card__tag-box">
                                        <span className="media-card__category">{item.category}</span>
                                        <h3 className="media-card__title">{item.title}</h3>
                                        <h4 className="media-card__ar-title">{item.arabicTitle}</h4>
                                    </div>
                                    <span className="media-card__index">{item.index}</span>
                                </div>

                                <p className="media-card__lede">{item.lede}</p>
                                <p className="media-card__body">{item.body}</p>

                                <div className="media-card__bottom">
                                    <div className="media-card__tags">
                                        {item.tags.map((t) => (
                                            <span key={t} className="pill-tag">{t}</span>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="media-card__cta"
                                        onClick={() => {
                                            const el = document.getElementById('contact-footer');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <span>استكشف الحملة</span>
                                        <span className="media-card__cta-arrow">←</span>
                                    </button>
                                </div>
                            </div>

                            <div className="media-card__media">
                                <div className="media-card__frame">
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                    <div className="frame-gloss" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
