'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brands } from '@/lib/data';

const MARQUEE_BG_COLORS = [
    "#8dffc4",
    "#42fa9a",
    "#3da791",
    "#362488",
    "#323e86"
];

const DARK_COLORS = ["#362488", "#323e86", "#3da791"];

/**
 * Tracks are built deterministically at module scope (no Math.random, no
 * window access) so the content is rendered into the statically exported HTML
 * instead of being injected after hydration — previously `useState([[], []])`
 * meant the exported index.html contained ZERO marquee items, i.e. the whole
 * "التقنيات والأدوات" section was invisible to crawlers and to no-JS visitors.
 *
 * Each track is duplicated once because the CSS marquee translates the track by
 * -50%; it needs exactly two copies to loop seamlessly. On mobile the columns
 * become a horizontal grid, and the duplicate half is hidden via CSS
 * (`.marquee-track > .marquee-item:nth-child(n + 13)`).
 */
const MARQUEE_TRACKS = [0, 1].map((trackIndex) => {
    const offset = trackIndex * 3;
    const rotated = brands.slice(offset).concat(brands.slice(0, offset));
    const items = rotated.map((brand, i) => {
        const color = MARQUEE_BG_COLORS[i % MARQUEE_BG_COLORS.length];
        return { brand, color, isDark: DARK_COLORS.includes(color) };
    });
    return [...items, ...items];
});

export default function DoubleMarquee() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

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
            // The timeline itself was never killed before — only its trigger was,
            // which left the tween objects (and their targets) referenced.
            if (marqueeTl.scrollTrigger) marqueeTl.scrollTrigger.kill();
            marqueeTl.kill();
        };
    }, []);

    return (
        <section className="Double-marquee" id="tools">
            <div className="Double-marquee__container">
                {/* Right Column in RTL: Title & Animated Graphics */}
                <div className="marquee-left" dir="rtl">
                    <div className="marquee-text-container">
                        <div className="marquee-pill-tag">
                            <span>التقنيات والأدوات الإبداعية</span>
                        </div>
                        <h2>
                            تقنيات حديثة<br />
                            وأدوات{' '}
                            <span className="text-with">
                                عالمية:
                                <svg xmlns="http://www.w3.org/2000/svg" className="marquee-underline" viewBox="0 0 132 5" fill="none">
                                    <path d="M1 2.08377C44.3458 3.90451 87.9791 5.71442 131 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </h2>
                        <p className="marquee-left-subtext">
                            نستخدم أحدث أطر العمل في البرمجة والأنظمة السحابية وأقوى أدوات الإنتاج الفني والمونتاج.
                        </p>
                    </div>

                    <div className="marquee-blob-container" aria-hidden="true">
                        <img src="/assets/Marquee-blob SVG/marquee-blob.svg" className="marquee-blob" alt="" loading="lazy" decoding="async" width={404} height={474} />
                        <div className="marquee-svg-container">
                            <div className="marquee-svg-item">
                                <img src="/assets/Marquee-blob SVG/marquee-hand.svg" width={92} height={157} alt="" loading="lazy" decoding="async" />
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

                {/* Right column in RTL: on ≥1024px this renders as a static
                   2×3 grid of square cards (the older "تقنيات حديثة" look the
                   designer asked to bring back); on phones it stays the two
                   vertical scrolling marquee columns.

                   The markup is IDENTICAL for both — all 12 brands, twice
                   per track, are always in the DOM. The desktop layout is
                   pure CSS: marquee.css hides the second column and hides
                   every item past the 6th of the first track, then lays the
                   remaining 6 out with `display: grid` on `.marquee-track`.
                   Keeping the data untouched is what protects the phone
                   marquee — a previous attempt swapped the track contents
                   for a 6-brand list, which silently de-duplicated the
                   phone scroll down to 6 unique brands. */}
                <div className="marquee-right" dir="ltr">
                    {MARQUEE_TRACKS.map((trackItems, colIndex) => (
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
                                            <p className="marquee-badge-name">{item.brand.name}</p>
                                            <span className="marquee-badge-label">{item.brand.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
