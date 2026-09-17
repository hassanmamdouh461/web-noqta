'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARDS_DATA } from '@/lib/data';

export default function ServiceCards() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate underline SVG paths on scroll
        const underlineTween = gsap.to('.title-underline-svg path', {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.25,
            scrollTrigger: {
                trigger: '.service-cards-wrapper',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        // initCardAnimations() now returns a disposer; previously it registered
        // 10 mouse listeners + a pinned ScrollTrigger with no cleanup at all.
        let disposeCards = initCardAnimations();

        // RESPONSIVE FIX: the fan-out (desktop) and the pinned stack (mobile)
        // are two completely different layouts, and the choice was made once at
        // mount. Rotating a tablet — or resizing a window across 1200px — left
        // the old inline GSAP transforms (position/left/yPercent) in place, so
        // the cards ended up stacked on top of each other in the wrong layout.
        // Re-initialise whenever the breakpoint is actually crossed.
        const mq = window.matchMedia('(max-width: 1199px)');
        const onBreakpointChange = () => {
            if (disposeCards) disposeCards();
            // Wipe every inline style GSAP wrote before re-initialising. The
            // wrapper keeps the inline height the mobile branch computed, which
            // would otherwise survive into the desktop layout.
            gsap.set('.card', { clearProps: 'all' });
            gsap.set('.cards-wrapper', { clearProps: 'height' });
            disposeCards = initCardAnimations();
            ScrollTrigger.refresh();
        };
        mq.addEventListener('change', onBreakpointChange);

        // iOS fires `orientationchange` before the new viewport metrics settle.
        let orientationRaf = null;
        const onOrientation = () => {
            if (orientationRaf !== null) cancelAnimationFrame(orientationRaf);
            orientationRaf = requestAnimationFrame(() => {
                orientationRaf = null;
                ScrollTrigger.refresh();
            });
        };
        window.addEventListener('orientationchange', onOrientation);

        return () => {
            mq.removeEventListener('change', onBreakpointChange);
            window.removeEventListener('orientationchange', onOrientation);
            if (orientationRaf !== null) cancelAnimationFrame(orientationRaf);
            if (underlineTween.scrollTrigger) underlineTween.scrollTrigger.kill();
            underlineTween.kill();
            if (disposeCards) disposeCards();
        };
    }, []);

    return (
        <div className="service-cards-wrapper-inner">
            {/* Heading */}
            <div className="title-container" dir="rtl">
                <div className="service-header-pill">
                    <span>منظومة الحلول البرمجية المتكاملة</span>
                </div>
                <h2 className="main-title">
                    تواصل معنا إذا كنت <span className="italic-text">تحتاج:</span>
                </h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="180" viewBox="0 0 159 17" fill="none" className="title-underline-svg">
                    <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Interactive Fan-out Service Cards */}
            <div className="cards-wrapper" id="cards-wrapper">
                {CARDS_DATA.map((card) => (
                    <div key={card.color} className={`card card-${card.color}`}>
                        <div className={`card-sticker sticker-${card.sticker}`}>
                            <img
                                src={`/assets/Card-Sticker SVG/sticker-${card.sticker}.svg`}
                                alt=""
                                width="100%"
                                loading="lazy"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="card-top-info" dir="rtl">
                            <span className="card-division-badge">{card.division}</span>
                            <h3 className="card-title">{card.titleAr}</h3>
                            <span className="card-subtitle-en">{card.title}</span>
                        </div>

                        <svg width="100%" height="10" className="card-divider-svg" aria-hidden="true">
                            <use href="#card-divider" />
                        </svg>

                        <ul className="card-list" dir="rtl">
                            {card.services.map((service) => (
                                <li key={service}>
                                    <span className="card-bullet-dot" />
                                    <span>{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function initCardAnimations() {
    const cards = gsap.utils.toArray('.card');
    if (!cards.length) return () => {};

    // Everything created below is registered here so the effect can dispose of
    // it on unmount (React 19 StrictMode double-invokes effects in dev).
    const disposers = [];
    const triggers = [];

    const originalData = [
        { rotation: 4 },
        { rotation: -5 },
        { rotation: 5 },
        { rotation: -7 },
        { rotation: 5 }
    ];

    const isMobile = window.matchMedia('(max-width: 1199px)').matches;
    let leaveTimeout = null;

    if (!isMobile) {
        cards.forEach((card, index) => {
            const onEnter = () => {
                if (leaveTimeout) { clearTimeout(leaveTimeout); leaveTimeout = null; }
                const hoverGap = 120;
                const clusterGap = 145;
                const cardWidth = 320;
                const hoveredLeft = cards[index].offsetLeft;
                const leftCards = [];
                const rightCards = [];

                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex < index) leftCards.push({ card: otherCard, index: otherIndex });
                    else if (otherIndex > index) rightCards.push({ card: otherCard, index: otherIndex });
                });

                const currentTop = cards[index].offsetTop;
                const targetCommonTop = 50;
                const moveY = targetCommonTop - currentTop;

                gsap.to(cards[index], { x: 0, y: moveY, rotation: 0, scale: 1.08, duration: 0.85, ease: 'elastic.out(1, 0.5)', overwrite: true, zIndex: 50 });

                if (rightCards.length) {
                    const clusterStart = hoveredLeft + cardWidth + hoverGap;
                    rightCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart + (i * clusterGap);
                        const targetX = Math.max(targetAbsLeft - item.card.offsetLeft, 10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 0.95, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }

                if (leftCards.length) {
                    leftCards.reverse();
                    const clusterStart = hoveredLeft - hoverGap - cardWidth;
                    leftCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart - (i * clusterGap);
                        const targetX = Math.min(targetAbsLeft - item.card.offsetLeft, -10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 0.95, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }
            };

            const onLeave = () => {
                leaveTimeout = setTimeout(() => {
                    cards.forEach((c, i) => {
                        gsap.to(c, { x: 0, y: 0, scale: 1, rotation: originalData[i].rotation, duration: 0.95, ease: 'elastic.out(1, 0.5)', overwrite: true, zIndex: i + 1 });
                    });
                }, 75);
            };

            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);
            disposers.push(() => {
                card.removeEventListener('mouseenter', onEnter);
                card.removeEventListener('mouseleave', onLeave);
            });
        });
    } else {
        // Mobile stacked scroll reveal
        const cardsWrapper = document.querySelector('.cards-wrapper');
        if (!cardsWrapper) return;
        const scrollPerCard = window.innerHeight * 0.7;
        const navH = 65;
        const mobileRotations = [-4, 4, -6, 5, -3];

        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'absolute',
                left: '50%',
                top: '0',
                xPercent: -50,
                y: i === 0 ? 0 : window.innerHeight * 1.1,
                rotation: mobileRotations[i % mobileRotations.length],
                zIndex: i + 1,
                transformOrigin: 'center center'
            });
        });

        const wrapperH = window.innerHeight * 0.7 + scrollPerCard * (cards.length - 1);
        gsap.set(cardsWrapper, { height: wrapperH });

        triggers.push(ScrollTrigger.create({
            trigger: cardsWrapper,
            start: `top ${navH}px`,
            end: `+=${scrollPerCard * (cards.length - 1)}`,
            pin: true,
            pinSpacing: true,
            id: 'mobile-cards-pin'
        }));

        cards.forEach((card, i) => {
            if (i === 0) return;
            const tween = gsap.fromTo(card,
                { y: window.innerHeight * 1.1 },
                {
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardsWrapper,
                        start: `top+=${(i - 1) * scrollPerCard} ${navH}px`,
                        end: `top+=${i * scrollPerCard} ${navH}px`,
                        scrub: 0.4
                    }
                }
            );
            triggers.push(tween.scrollTrigger);
        });
    }

    return () => {
        if (leaveTimeout) { clearTimeout(leaveTimeout); leaveTimeout = null; }
        disposers.forEach((fn) => fn());
        triggers.forEach((t) => { if (t) t.kill(); });
    };
}
