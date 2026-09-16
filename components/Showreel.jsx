'use client';

import { useState } from 'react';
import { NOQTA_INFO } from '@/lib/data';

export default function Showreel() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="showreel-section" id="showreel-section">
            <div className="showreel__container" dir="rtl">
                <div className="showreel__header">
                    <div className="showreel__badge">
                        <span>الإنتاج الفني والميديا • Media & Reels</span>
                    </div>
                    <h2 className="showreel__title">شاهد كيف نحوّل الأفكار إلى واقع بصري مبهر</h2>
                    <p className="showreel__desc">
                        مونتاج سينمائي، موشن جرافيكس 2D/3D، وتصاميم سوشيال ميديا تكسر رتابة التايم لاين.
                    </p>
                </div>

                <div className="showreel__media-box">
                    <img
                        src="/assets/noqta/noqta-thumbnails-slide9.png"
                        alt="Noqta Media Showreel"
                        className="showreel__preview-img"
                    />
                    <div className="showreel__overlay">
                        <a
                            href={NOQTA_INFO.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="showreel__play-btn"
                            aria-label="شاهد أحدث الأعمال على إنستغرام"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>شاهد أحدث أعمالنا على إنستغرام</span>
                        </a>
                        <div className="showreel__brand-tag">
                            {NOQTA_INFO.hashtag}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
