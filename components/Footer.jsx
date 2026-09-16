'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NOQTA_INFO, WIGGLE_CONFIG } from '@/lib/data';

function initWiggle(element, intensity) {
    if (!element) return () => {};
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

        // ─── Credits Popout ───
        const creditsWrapper = document.querySelector('.footer-credits-wrapper');
        if (creditsWrapper) {
            const creditsBox = creditsWrapper.querySelector('.credits-box');
            const creditsItems = creditsBox ? creditsBox.querySelectorAll('.credits-item') : [];

            if (creditsBox) {
                gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 });
                const boxRect = creditsBox.getBoundingClientRect();
                const fullWidth = boxRect.width;
                const fullHeight = boxRect.height;
                const creditsBtn = creditsWrapper.querySelector('.footer-credits');
                const startY = creditsBtn ? creditsBtn.offsetHeight + 15 : 40;

                gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY });
                gsap.set(creditsItems, { y: fullHeight });

                const onEnter = () => {
                    gsap.set(creditsBox, { visibility: 'visible' });
                    gsap.killTweensOf(creditsBox);
                    gsap.killTweensOf(creditsItems);
                    gsap.to(creditsBox, { width: fullWidth, height: fullHeight, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
                    gsap.to(creditsItems, { y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
                };

                const onLeave = () => {
                    gsap.killTweensOf(creditsBox);
                    gsap.killTweensOf(creditsItems);
                    gsap.to(creditsBox, {
                        width: 0, height: 0, opacity: 0, y: startY, duration: 0.35, ease: 'power3.in',
                        onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' })
                    });
                    gsap.to(creditsItems, { y: fullHeight, duration: 0.35, ease: 'power3.in', stagger: -0.03, delay: 0.08 });
                };

                creditsWrapper.addEventListener('mouseenter', onEnter);
                creditsWrapper.addEventListener('mouseleave', onLeave);
            }
        }

        // ─── Footer sticker pop-up on scroll ───
        const footerStickers = gsap.utils.toArray('.footer-sticker');
        const stickerRotations = [12, -10, 8, -12, 10, -8];
        gsap.set(footerStickers, { scale: 0, opacity: 0, transformOrigin: 'center bottom' });
        footerStickers.forEach((sticker, i) => gsap.set(sticker, { rotation: stickerRotations[i % stickerRotations.length] }));

        gsap.to(footerStickers, {
            scale: 1, opacity: 1,
            rotation: (i) => stickerRotations[i % stickerRotations.length] * 0.7,
            duration: 0.7, ease: 'back.out(1.7)', stagger: 0.12,
            scrollTrigger: {
                trigger: '.footer-stickers',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // ─── Sticker cursor-velocity repulsion push physics ───
        let prevX = 0, prevY = 0;
        const onMouseMove = (e) => {
            const dx = e.clientX - prevX;
            const dy = e.clientY - prevY;
            prevX = e.clientX;
            prevY = e.clientY;
            const speed = Math.hypot(dx, dy);

            footerStickers.forEach((sticker, i) => {
                const rect = sticker.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
                const PROXIMITY_RADIUS = 160;

                if (dist < PROXIMITY_RADIUS && speed > 2) {
                    const falloff = 1 - (dist / PROXIMITY_RADIUS);
                    const pushX = Math.max(-50, Math.min(50, dx * 3.5 * falloff));
                    const pushY = Math.max(-50, Math.min(50, dy * 3.5 * falloff));
                    gsap.killTweensOf(sticker);
                    gsap.to(sticker, { x: pushX, y: pushY, duration: 0.18, ease: 'power3.out' });
                    gsap.to(sticker, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)', delay: 0.18 });
                }
            });
        };
        document.addEventListener('mousemove', onMouseMove);

        // ─── Wiggle targets ───
        const wiggleTargets = [
            { selector: '.footer-email', key: 'email' },
            { selector: '.footer-whatsapp', key: 'whatsapp' },
            { selector: '.footer-phone-item', key: 'whatsapp' }
        ];
        wiggleTargets.forEach(({ selector, key }) => {
            document.querySelectorAll(selector).forEach(el => initWiggle(el, WIGGLE_CONFIG[key]));
        });

        document.querySelectorAll('.single-social').forEach(el => initWiggle(el, WIGGLE_CONFIG.socials));

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <div className="footer-inner">
            {/* Top Grid Columns */}
            <div className="footer-top" dir="rtl">
                {/* Tech Column */}
                <div className="footer-column">
                    <span className="footer-badge">فريق السوفت وير والتقنية</span>
                    <h3>نكتب كوداً يصنع مستقبلك</h3>
                    <p className="footer-col-desc">
                        تطبيقات ويب، منصات SaaS، وتطبيقات موبايل بأنظمة سحابية متطورة.
                    </p>
                </div>

                {/* Media Column */}
                <div className="footer-column">
                    <span className="footer-badge">فريق الميديا والتسويق</span>
                    <h3>نبني علامات تجارية لا تُنسى</h3>
                    <p className="footer-col-desc">
                        هويات بصرية، فيديوهات تفاعلية، واستراتيجيات تسويق تحقق أعلى وصول.
                    </p>
                </div>

                {/* Contact Column */}
                <div className="footer-column">
                    <span className="footer-badge">ابدأ مشروعك معنا</span>
                    <a href={`mailto:${NOQTA_INFO.email}`} className="footer-email">
                        {NOQTA_INFO.email}
                    </a>

                    <div className="footer-phones-wrap">
                        {NOQTA_INFO.phones.map((phone) => (
                            <a
                                key={phone}
                                href={`https://wa.me/2${phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-phone-item"
                            >
                                <span className="phone-icon">💬</span>
                                <span>{phone}</span>
                            </a>
                        ))}
                    </div>

                    <a
                        href={NOQTA_INFO.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-whatsapp"
                    >
                        محادثة مباشرة عبر واتساب ←
                    </a>

                    {/* Social Media Links */}
                    <div className="footer-socials" id="footer-socials">
                        {/* Facebook */}
                        <a
                            href={NOQTA_INFO.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="single-social"
                            aria-label="Facebook"
                        >
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href={NOQTA_INFO.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="single-social"
                            aria-label="Instagram"
                        >
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Big NOQTA Wordmark Banner */}
            <div className="footer-bottom">
                <div className="footer-big-text">
                    <div className="noqta-footer-brand-lockup">
                        {/* Noqta Icon */}
                        <svg className="noqta-footer-icon" viewBox="0 0 700 420" fill="none">
                            <circle cx="350" cy="115" r="82.5" fill="currentColor" />
                            <path d="M 5 125 H 170 A 180 180 0 0 0 530 125 H 695 A 345 345 0 0 1 5 125 Z" fill="currentColor" />
                        </svg>
                        <span className="noqta-footer-text-ar">نقطة</span>
                        <span className="noqta-footer-text-en">NOQTA</span>
                    </div>
                </div>

                {/* Floating Interactive Stickers */}
                <div className="footer-stickers">
                    <div className="footer-sticker sticker-smiley">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-smiley.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-heart">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-heart.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-hands">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-100">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-100.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-camera">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-camera.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                    <div className="footer-sticker sticker-boom">
                        <img src="/assets/Footer-Sticker SVG/footer-sticker-boom.svg" width="100%" alt="" aria-hidden="true" />
                    </div>
                </div>

                {/* Bottom Row: Hashtag & Credits */}
                <div className="footer-bottom-row">
                    <div className="footer-hashtag">
                        {NOQTA_INFO.hashtag}
                    </div>

                    <div className="footer-credits-wrapper">
                        <div className="credits-box">
                            <div className="credits-content">
                                <div className="credits-item">
                                    <span className="credits-label">تطوير وبرمجة</span>
                                    <span className="credits-name">تيم السوفت وير</span>
                                </div>
                                <div className="credits-item">
                                    <span className="credits-label">هوية وميديا</span>
                                    <span className="credits-name">تيم الماركتنج</span>
                                </div>
                            </div>
                        </div>
                        <a href="#hero" className="footer-credits">فريق نقطة © 2026</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
