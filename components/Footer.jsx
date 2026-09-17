'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NOQTA_INFO, WIGGLE_CONFIG } from '@/lib/data';
import { prefersReducedMotion } from '@/lib/motion';

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

        // Every listener / tween registered below returns a cleanup that we
        // collect here — the previous version only removed `mousemove` and left
        // the credits hover listeners, the wiggle listeners and the sticker
        // ScrollTrigger alive after unmount.
        const cleanups = [];

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
                cleanups.push(() => {
                    creditsWrapper.removeEventListener('mouseenter', onEnter);
                    creditsWrapper.removeEventListener('mouseleave', onLeave);
                });
            }
        }

        // ─── Footer sticker pop-up on scroll ───
        const footerStickers = gsap.utils.toArray('.footer-sticker');
        const stickerRotations = [12, -10, 8, -12, 10, -8];
        gsap.set(footerStickers, { scale: 0, opacity: 0, transformOrigin: 'center bottom' });
        footerStickers.forEach((sticker, i) => gsap.set(sticker, { rotation: stickerRotations[i % stickerRotations.length] }));

        const stickerTween = gsap.to(footerStickers, {
            scale: 1, opacity: 1,
            rotation: (i) => stickerRotations[i % stickerRotations.length] * 0.7,
            duration: 0.7, ease: 'back.out(1.7)', stagger: 0.12,
            scrollTrigger: {
                trigger: '.footer-stickers',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        cleanups.push(() => {
            if (stickerTween.scrollTrigger) stickerTween.scrollTrigger.kill();
            stickerTween.kill();
        });

        // ─── Sticker cursor-velocity repulsion push physics ───
        // PERF: the original handler called getBoundingClientRect() for all six
        // stickers on EVERY mousemove event (up to ~120/s) — that is a forced
        // layout per event. Instead we cache the centres, invalidate the cache
        // on scroll/resize, and do the work once per animation frame.
        const PROXIMITY_RADIUS = 160;
        let stickerCentres = [];
        let centresDirty = true;
        const invalidateCentres = () => { centresDirty = true; };
        const measureCentres = () => {
            stickerCentres = footerStickers.map((sticker) => {
                const rect = sticker.getBoundingClientRect();
                return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
            });
            centresDirty = false;
        };

        window.addEventListener('scroll', invalidateCentres, { passive: true });
        window.addEventListener('resize', invalidateCentres);
        cleanups.push(() => {
            window.removeEventListener('scroll', invalidateCentres);
            window.removeEventListener('resize', invalidateCentres);
        });

        let prevX = 0, prevY = 0;
        let lastX = 0, lastY = 0;
        let hasPrev = false;
        let moveRaf = null;

        const applyRepulsion = () => {
            moveRaf = null;
            const dx = hasPrev ? lastX - prevX : 0;
            const dy = hasPrev ? lastY - prevY : 0;
            prevX = lastX;
            prevY = lastY;
            hasPrev = true;
            if (Math.hypot(dx, dy) <= 2) return;
            if (centresDirty) measureCentres();

            for (let i = 0; i < footerStickers.length; i++) {
                const { cx, cy } = stickerCentres[i] || {};
                if (cx === undefined) continue;
                const dist = Math.hypot(prevX - cx, prevY - cy);
                if (dist >= PROXIMITY_RADIUS) continue;

                const falloff = 1 - (dist / PROXIMITY_RADIUS);
                const pushX = Math.max(-50, Math.min(50, dx * 3.5 * falloff));
                const pushY = Math.max(-50, Math.min(50, dy * 3.5 * falloff));
                const sticker = footerStickers[i];
                gsap.killTweensOf(sticker);
                gsap.to(sticker, { x: pushX, y: pushY, duration: 0.18, ease: 'power3.out' });
                gsap.to(sticker, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)', delay: 0.18 });
            }
        };

        const onMouseMove = (e) => {
            lastX = e.clientX;
            lastY = e.clientY;
            if (moveRaf === null) moveRaf = requestAnimationFrame(applyRepulsion);
        };

        if (!prefersReducedMotion()) {
            document.addEventListener('mousemove', onMouseMove);
            cleanups.push(() => {
                document.removeEventListener('mousemove', onMouseMove);
                if (moveRaf !== null) cancelAnimationFrame(moveRaf);
            });
        }

        // ─── Wiggle targets ───
        const wiggleTargets = [
            { selector: '.footer-email', key: 'email' },
            { selector: '.footer-whatsapp', key: 'whatsapp' },
            { selector: '.footer-phone-item', key: 'whatsapp' }
        ];
        // initWiggle returns a disposer — the previous code dropped it on the
        // floor, leaking a mouseenter/mouseleave pair per element.
        wiggleTargets.forEach(({ selector, key }) => {
            document.querySelectorAll(selector).forEach(el => cleanups.push(initWiggle(el, WIGGLE_CONFIG[key])));
        });

        document.querySelectorAll('.single-social').forEach(el => cleanups.push(initWiggle(el, WIGGLE_CONFIG.socials)));

        return () => {
            cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); });
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

            {/* Big NOQTA Wordmark Banner (Exact truus-clone SVG style) */}
            <div className="footer-bottom">
                <div className="footer-big-text">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="5 20 1015 258"
                        fill="currentColor"
                        className="footer-logo__svg"
                        aria-label="نقطة"
                        role="img"
                    >
                        <circle cx="868.25" cy="144.00" r="35.50" />
                        <circle cx="588.35" cy="85.00" r="33.50" />
                        <circle cx="656.10" cy="87.00" r="33.50" />
                        <circle cx="120.95" cy="130.50" r="33.50" />
                        <circle cx="188.55" cy="132.50" r="33.50" />
                        <path d="M 11 130 L 11 144 L 12 145 L 12 152 L 13 153 L 13 157 L 14 158 L 14 162 L 15 163 L 15 166 L 17 170 L 17 173 L 19 176 L 19 179 L 24 189 L 24 191 L 27 195 L 31 204 L 33 206 L 33 207 L 35 209 L 37 213 L 40 216 L 40 217 L 44 221 L 44 222 L 63 241 L 64 241 L 67 244 L 68 244 L 71 247 L 72 247 L 80 253 L 87 256 L 89 258 L 93 260 L 95 260 L 100 263 L 102 263 L 105 265 L 107 265 L 108 266 L 110 266 L 111 267 L 113 267 L 117 269 L 121 269 L 122 270 L 125 270 L 126 271 L 131 271 L 132 272 L 137 272 L 138 273 L 147 273 L 148 274 L 150 273 L 151 274 L 162 274 L 163 273 L 173 273 L 174 272 L 181 272 L 182 271 L 185 271 L 186 270 L 190 270 L 191 269 L 194 269 L 195 268 L 198 268 L 199 267 L 204 266 L 207 264 L 209 264 L 212 262 L 214 262 L 228 255 L 230 253 L 233 252 L 235 250 L 239 248 L 242 245 L 243 245 L 246 242 L 247 242 L 258 232 L 259 233 L 259 237 L 258 238 L 258 241 L 257 242 L 257 247 L 256 248 L 256 255 L 255 256 L 255 269 L 322 269 L 322 258 L 323 257 L 323 253 L 324 252 L 324 249 L 325 248 L 325 245 L 326 244 L 326 242 L 333 228 L 335 226 L 335 225 L 340 220 L 340 219 L 350 209 L 351 209 L 354 206 L 355 206 L 360 202 L 370 197 L 372 197 L 373 196 L 375 196 L 376 195 L 378 195 L 382 193 L 386 193 L 387 192 L 395 192 L 396 191 L 405 191 L 406 192 L 412 192 L 413 193 L 417 193 L 418 194 L 421 194 L 422 195 L 427 196 L 430 198 L 432 198 L 438 201 L 440 203 L 446 206 L 451 211 L 452 211 L 463 223 L 463 224 L 465 226 L 465 227 L 467 229 L 468 232 L 471 236 L 471 238 L 474 243 L 474 245 L 475 246 L 475 249 L 476 250 L 476 253 L 477 254 L 477 259 L 478 260 L 478 269 L 545 269 L 545 260 L 546 259 L 546 254 L 547 253 L 548 246 L 552 238 L 552 236 L 555 232 L 556 229 L 560 224 L 560 223 L 571 211 L 572 211 L 577 206 L 578 206 L 580 204 L 596 196 L 598 196 L 602 194 L 605 194 L 606 193 L 610 193 L 611 192 L 618 192 L 619 191 L 627 191 L 628 192 L 636 192 L 637 193 L 641 193 L 642 194 L 644 194 L 645 195 L 647 195 L 648 196 L 653 197 L 663 202 L 665 204 L 668 205 L 672 209 L 673 209 L 684 220 L 684 221 L 690 228 L 697 242 L 697 244 L 699 248 L 699 251 L 700 252 L 700 257 L 701 258 L 701 269 L 768 269 L 768 256 L 767 255 L 767 248 L 766 247 L 766 242 L 765 241 L 765 237 L 764 236 L 764 233 L 763 232 L 763 230 L 764 229 L 779 243 L 780 243 L 783 246 L 784 246 L 792 252 L 795 253 L 797 255 L 811 262 L 813 262 L 816 264 L 821 265 L 827 268 L 830 268 L 831 269 L 834 269 L 835 270 L 838 270 L 839 271 L 844 271 L 845 272 L 850 272 L 851 273 L 860 273 L 861 274 L 863 273 L 865 274 L 875 274 L 876 273 L 886 273 L 887 272 L 894 272 L 895 271 L 899 271 L 900 270 L 904 270 L 905 269 L 908 269 L 909 268 L 911 268 L 912 267 L 914 267 L 915 266 L 920 265 L 923 263 L 925 263 L 928 261 L 930 261 L 938 257 L 940 255 L 945 253 L 947 251 L 948 251 L 950 249 L 954 247 L 957 244 L 958 244 L 962 240 L 963 240 L 982 221 L 982 220 L 985 217 L 985 216 L 988 213 L 988 212 L 992 207 L 993 204 L 995 202 L 996 199 L 998 197 L 1000 191 L 1002 189 L 1002 187 L 1004 184 L 1004 182 L 1007 176 L 1007 173 L 1008 172 L 1008 170 L 1010 166 L 1010 163 L 1011 162 L 1011 159 L 1012 158 L 1012 153 L 1013 152 L 1013 145 L 1014 144 L 1014 130 L 948 130 L 948 133 L 947 134 L 947 142 L 946 143 L 946 147 L 945 148 L 945 151 L 944 152 L 944 154 L 942 157 L 942 159 L 937 169 L 935 171 L 933 175 L 930 178 L 930 179 L 921 188 L 920 188 L 916 192 L 915 192 L 912 195 L 909 196 L 907 198 L 899 202 L 897 202 L 893 204 L 890 204 L 889 205 L 886 205 L 885 206 L 881 206 L 880 207 L 859 207 L 858 206 L 853 206 L 852 205 L 849 205 L 848 204 L 846 204 L 845 203 L 840 202 L 830 197 L 828 195 L 825 194 L 822 191 L 821 191 L 807 177 L 807 176 L 801 168 L 797 160 L 797 158 L 795 155 L 795 153 L 794 152 L 794 149 L 792 145 L 792 139 L 791 138 L 791 130 L 724 130 L 724 139 L 725 140 L 725 148 L 726 149 L 726 155 L 727 156 L 727 159 L 728 160 L 728 163 L 729 164 L 729 167 L 730 168 L 729 170 L 715 157 L 714 157 L 711 154 L 710 154 L 707 151 L 706 151 L 701 147 L 698 146 L 696 144 L 680 136 L 675 135 L 672 133 L 670 133 L 666 131 L 663 131 L 662 130 L 659 130 L 658 129 L 655 129 L 654 128 L 651 128 L 650 127 L 645 127 L 644 126 L 636 126 L 635 125 L 611 125 L 610 126 L 602 126 L 601 127 L 592 128 L 591 129 L 584 130 L 580 132 L 577 132 L 574 134 L 569 135 L 566 137 L 564 137 L 554 142 L 552 144 L 544 148 L 542 150 L 538 152 L 535 155 L 534 155 L 530 159 L 529 159 L 512 176 L 511 176 L 493 158 L 492 158 L 489 155 L 488 155 L 485 152 L 484 152 L 476 146 L 454 135 L 449 134 L 446 132 L 443 132 L 439 130 L 436 130 L 435 129 L 432 129 L 431 128 L 427 128 L 426 127 L 426 26 L 374 26 L 374 126 L 372 128 L 369 128 L 368 129 L 365 129 L 364 130 L 361 130 L 360 131 L 357 131 L 356 132 L 351 133 L 348 135 L 343 136 L 327 144 L 322 148 L 316 151 L 309 157 L 308 157 L 301 164 L 300 164 L 297 167 L 296 165 L 297 164 L 297 161 L 298 160 L 298 156 L 299 155 L 299 150 L 300 149 L 300 139 L 301 138 L 301 130 L 234 130 L 234 139 L 233 140 L 233 144 L 232 145 L 232 149 L 231 150 L 230 155 L 228 158 L 228 160 L 224 168 L 222 170 L 221 173 L 218 176 L 218 177 L 205 190 L 204 190 L 201 193 L 200 193 L 195 197 L 185 202 L 183 202 L 182 203 L 180 203 L 176 205 L 172 205 L 171 206 L 167 206 L 166 207 L 146 207 L 145 206 L 140 206 L 139 205 L 135 205 L 134 204 L 129 203 L 126 201 L 124 201 L 120 199 L 118 197 L 110 193 L 106 189 L 105 189 L 96 180 L 96 179 L 92 175 L 92 174 L 88 169 L 83 159 L 83 157 L 82 156 L 82 154 L 81 153 L 81 151 L 79 147 L 79 143 L 78 142 L 78 135 L 77 134 L 77 130 Z" />
                    </svg>
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
