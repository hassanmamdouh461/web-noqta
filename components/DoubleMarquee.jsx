'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brands } from '@/lib/data';

const MARQUEE_BG_COLORS = [
    "#43FB9C",
    "#3DA792",
    "#362488",
    "#323E86",
    "#F0BEFA",
    "#F5693C",
    "#82A0FF"
];

function buildMarqueeTracks(isMobile) {
    const tracks = [[], []];
    for (let t = 0; t < 2; t++) {
        const shuffled = [...brands].sort(() => 0.5 - Math.random());
        const items = shuffled.map((brand, i) => ({
            brand,
            color: MARQUEE_BG_COLORS[i % MARQUEE_BG_COLORS.length],
            isDark: [MARQUEE_BG_COLORS[2], MARQUEE_BG_COLORS[3]].includes(MARQUEE_BG_COLORS[i % MARQUEE_BG_COLORS.length])
        }));
        tracks[t] = isMobile ? items : [...items, ...items];
    }
    return tracks;
}

export default function DoubleMarquee() {
    const [tracks, setTracks] = useState([[], []]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const mobile = window.matchMedia('(max-width: 768px)').matches;
        setTracks(buildMarqueeTracks(mobile));

        gsap.set('.marquee-left .marquee-svg-item:nth-child(2) path', { strokeDashoffset: 1000 });

        const marqueeTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.Double-marquee',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        marqueeTl
            .to('.marquee-underline', { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power2.out' })
            .to('.marquee-left .marquee-svg-item:nth-child(1)', { scale: 1, opacity: 1, rotation: -10, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
            .to('.marquee-left .marquee-svg-item:nth-child(2) path', { strokeDashoffset: 0, duration: 1.3, ease: 'power2.out' }, '-=0.3');

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.vars.trigger === '.Double-marquee') t.kill();
            });
        };
    }, []);

    return (
        <section className="Double-marquee">
            {/* Left Column: Title & Animated Graphics */}
            <div className="marquee-left" dir="rtl">
                <div className="marquee-text-container">
                    <div className="marquee-pill-tag">
                        <span>التقنيات والأدوات الإبداعية</span>
                    </div>
                    <h2>
                        تقنيات حديثة<br />
                        وأدوات <span className="text-with">عالمية:</span>
                    </h2>
                    <svg xmlns="http://www.w3.org/2000/svg" className="marquee-underline" viewBox="0 0 132 5" fill="none">
                        <path d="M1 2.08377C44.3458 3.90451 87.9791 5.71442 131 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="marquee-left-subtext">
                        نستخدم أحدث أطر العمل في البرمجة والأنظمة السحابية وأقوى أدوات الإنتاج الفني والمونتاج.
                    </p>
                </div>

                <div className="marquee-blob-container">
                    <img src="/assets/Marquee-blob SVG/marquee-blob.svg" className="marquee-blob" alt="" aria-hidden="true" />
                    <div className="marquee-svg-container">
                        <div className="marquee-svg-item">
                            <img src="/assets/Marquee-blob SVG/marquee-hand.svg" width="100%" alt="" aria-hidden="true" />
                        </div>
                        <div className="marquee-svg-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none">
                                <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Two Vertical Scrolling Columns */}
            <div className="marquee-right">
                {tracks.map((trackItems, colIndex) => (
                    <div key={colIndex} className={`marquee-column marquee-column--${colIndex}`}>
                        <div className="marquee-track">
                            {trackItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="marquee-item"
                                    style={{
                                        backgroundColor: item.color,
                                        color: item.isDark ? '#FFFFFF' : '#07080F'
                                    }}
                                >
                                    <div className="marquee-badge-content">
                                        <span className="marquee-badge-cat">
                                            {item.brand.category === 'tech' ? '⚡ CODE' : '🎨 MEDIA'}
                                        </span>
                                        <h4 className="marquee-badge-name">{item.brand.name}</h4>
                                        <span className="marquee-badge-label">{item.brand.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
