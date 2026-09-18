import { NOQTA_INFO } from '@/lib/data';
import WebpImage from './WebpImage';

export default function Showreel() {
    return (
        <section className="showreel-section" id="showreel-section">
            <div className="showreel__container" dir="rtl">
                <div className="showreel__header">
                    <h2 className="showreel__title">شاهد كيف نحوّل الأفكار إلى واقع بصري مبهر</h2>
                    <p className="showreel__desc">
                        مونتاج سينمائي، موشن جرافيكس 2D/3D، وتصاميم سوشيال ميديا تكسر رتابة التايم لاين.
                    </p>
                </div>

                <div className="showreel__media-box">
                    {/* PERF: this is a ~900 KB PNG far below the fold. Without
                        loading="lazy" React 19 emitted a <link rel="preload">
                        for it in the static HTML, so it started downloading
                        immediately and competed with the hero for bandwidth. */}
                    <WebpImage
                        src="/assets/noqta/noqta-thumbnails-slide9.png"
                        alt="Noqta Media Showreel"
                        className="showreel__preview-img"
                        loading="lazy"
                        decoding="async"
                        width={1024}
                        height={622}
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
