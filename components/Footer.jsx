'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOCIAL_ICONS, WIGGLE_CONFIG } from '@/lib/data';

function initWiggle(element, intensity) {
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween;
    const onEnter = () => { tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' }); };
    const onLeave = () => { if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); } };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    return () => { element.removeEventListener('mouseenter', onEnter); element.removeEventListener('mouseleave', onLeave); };
}

export default function Footer() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Map link underline draw/undraw
        const footerMapLink = document.querySelector('.footer-map-link');
        if (footerMapLink) {
            const mapSvgPaths = footerMapLink.querySelectorAll('.draw-btn__svg path');
            mapSvgPaths.forEach(path => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
            });
            const onEnter = () => gsap.fromTo(mapSvgPaths, { strokeDashoffset: (i, el) => el.getTotalLength() }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, overwrite: true });
            const onLeave = () => gsap.to(mapSvgPaths, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
            footerMapLink.addEventListener('mouseenter', onEnter);
            footerMapLink.addEventListener('mouseleave', onLeave);
        }

        // Credits pop-out
        const creditsWrapper = document.querySelector('.footer-credits-wrapper');
        if (creditsWrapper) {
            const creditsBox = creditsWrapper.querySelector('.credits-box');
            const creditsItems = creditsBox.querySelectorAll('.credits-item');

            gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 });
            const boxRect = creditsBox.getBoundingClientRect();
            const boxHeight = boxRect.height;

            const creditsBtn = creditsWrapper.querySelector('.footer-credits');
            const startY = creditsBtn ? creditsBtn.offsetHeight + 15 : 40;

            gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY });
            gsap.set(creditsItems, { y: boxHeight });

            const onEnter = () => {
                gsap.set(creditsBox, { visibility: 'visible' });
                gsap.fromTo(creditsBox, { width: 0, height: 0, opacity: 0, y: startY }, { width: 'auto', height: 'auto', opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                gsap.fromTo(creditsItems, { y: boxHeight }, { y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05, delay: 0.1 });
            };

            const onLeave = () => {
                gsap.to(creditsItems, { y: boxHeight, duration: 0.2, ease: 'power2.in' });
                gsap.to(creditsBox, { width: 0, height: 0, opacity: 0, y: startY, duration: 0.3, ease: 'power2.in', delay: 0.1, onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' }) });
            };

            creditsWrapper.addEventListener('mouseenter', onEnter);
            creditsWrapper.addEventListener('mouseleave', onLeave);
        }

        // Stickers Proximity Push
        const stickers = document.querySelectorAll('.footer-sticker');
        const footerBottom = document.querySelector('.footer-bottom');

        if (stickers.length && footerBottom) {
            let lastMouseX = 0;
            let lastMouseY = 0;
            let lastTime = performance.now();

            const onMouseMove = (e) => {
                const now = performance.now();
                const dt = (now - lastTime) / 1000;
                const vx = dt > 0 ? (e.clientX - lastMouseX) / dt : 0;
                const vy = dt > 0 ? (e.clientY - lastMouseY) / dt : 0;
                const speed = Math.hypot(vx, vy);
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                lastTime = now;

                if (speed < 120) return;

                stickers.forEach(sticker => {
                    const rect = sticker.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = cx - e.clientX;
                    const dy = cy - e.clientY;
                    const dist = Math.hypot(dx, dy);
                    const threshold = 180;

                    if (dist < threshold && dist > 0) {
                        const force = Math.min((speed / 1000) * ((threshold - dist) / threshold) * 50, 80);
                        const nx = dx / dist;
                        const ny = dy / dist;

                        gsap.to(sticker, {
                            x: `+=${nx * force}`,
                            y: `+=${ny * force}`,
                            rotation: `+=${(Math.random() - 0.5) * 20}`,
                            duration: 0.2,
                            ease: 'power2.out',
                            overwrite: 'auto',
                            onComplete: () => {
                                gsap.to(sticker, {
                                    x: 0,
                                    y: 0,
                                    rotation: 0,
                                    duration: 1.2,
                                    ease: 'elastic.out(1, 0.3)'
                                });
                            }
                        });
                    }
                });
            };

            footerBottom.addEventListener('mousemove', onMouseMove);
        }

        // Social icon wiggle
        document.querySelectorAll('.single-social').forEach(el => initWiggle(el, WIGGLE_CONFIG.socials || 4));
    }, []);

    return (
        <div className="footer-inner">
            <div className="footer-top">
                {/* Wing 1: Tech */}
                <div className="footer-column">
                    <span className="footer-badge">الجزء التكنيكال</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3, marginTop: '0.4rem' }}>
                        سوفت وير عالي الأداء،<br />
                        تطبيقات سحابية وذكاء اصطناعي.
                    </h3>
                </div>

                {/* Wing 2: Media */}
                <div className="footer-column">
                    <span className="footer-badge">الماركتنج والميديا</span>
                    <address style={{ fontStyle: 'normal', lineHeight: 1.6, marginTop: '0.4rem' }}>
                        صناعة محتوى، إنتاج فيديو،<br />
                        وهوية بصرية تصنع الفارق.
                    </address>
                    <a href="#services" className="footer-map-link">
                        <span>استكشف حلولنا</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 169 10" fill="none" className="draw-btn__svg">
                            <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"></path>
                            <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"></path>
                        </svg>
                    </a>
                </div>

                {/* Contact */}
                <div className="footer-column">
                    <span className="footer-badge">ابدأ مشروعك</span>
                    <a href="mailto:hello@noqta.agency" className="footer-email">hello@noqta.agency</a>
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="footer-whatsapp">تواصل عبر واتساب*</a>
                    <p className="footer-note">*فريقنا متاح دائماً لدراسة فكرتك وتقديم عرض فني متكامل.</p>
                    <div className="footer-socials" id="footer-socials">
                        {SOCIAL_ICONS.map(({ href, label, svg }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="single-social w-inline-block"
                                aria-label={label}
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Big NOQTA Wordmark */}
            <div className="footer-bottom">
                <div className="footer-big-text" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'clamp(1rem, 3vw, 2.5rem)',
                        fontFamily: 'Epilogue, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(3.5rem, 12vw, 11rem)',
                        lineHeight: 0.9,
                        letterSpacing: '-0.04em',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        userSelect: 'none'
                    }}>
                        <span>NOQTA</span>
                        <span style={{
                            width: 'clamp(20px, 4vw, 50px)',
                            height: 'clamp(20px, 4vw, 50px)',
                            borderRadius: '50%',
                            backgroundColor: '#f5693c',
                            boxShadow: '0 0 30px #f5693c',
                            display: 'inline-block'
                        }}></span>
                        <span>نقطة</span>
                    </div>
                </div>

                {/* Interactive Stickers with Proximity Push */}
                <div className="footer-stickers">
                    <div className="footer-sticker sticker-smiley">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-smiley.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-heart">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-heart.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-hands">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-100">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-100.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-camera">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-camera.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-boom">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-boom.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                    </div>
                </div>

                {/* Bottom row: credits */}
                <div className="footer-bottom-row">
                    <div style={{ fontSize: '0.85rem', opacity: 0.6, color: '#fff' }}>
                        © {new Date().getFullYear()} Noqta Agency. All rights reserved.
                    </div>
                    <div className="footer-credits-wrapper">
                        <div className="credits-box">
                            <div className="credits-content">
                                <div className="credits-item credit-wiggle">
                                    <div className="overflow-wrapper"><span className="credits-label">engineering by</span></div>
                                    <div className="overflow-wrapper"><span className="credits-name" data-wiggle-target="true">Noqta Tech</span></div>
                                </div>
                                <div className="credits-item credit-wiggle">
                                    <div className="overflow-wrapper"><span className="credits-label">creative by</span></div>
                                    <div className="overflow-wrapper"><span className="credits-name" data-wiggle-target="true">Noqta Media</span></div>
                                </div>
                            </div>
                        </div>
                        <a href="#" className="footer-credits" onClick={(e) => e.preventDefault()}>credits</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
