'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WIGGLE_CONFIG, NOQTA_INFO } from '@/lib/data';

function initWiggle(element, intensity) {
    if (!element) return () => {};
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween;
    const onEnter = () => {
        tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' });
    };
    const onLeave = () => {
        if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); }
    };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    return () => {
        element.removeEventListener('mouseenter', onEnter);
        element.removeEventListener('mouseleave', onLeave);
    };
}

export default function Navbar() {
    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        const footerEl = document.querySelector('.main-footer');

        // Declared up-front: several registrations below (navbar-colour
        // invalidation, wiggle, popouts, scroll, keydown) append their disposers
        // to this list.
        const cleanups = [];

        // Start white on dark (hero is dark)
        if (navbar) { navbar.classList.add('on-dark'); navbar.classList.remove('on-light'); }

        // PERF: the previous version ran querySelectorAll + getBoundingClientRect
        // for every section on EVERY scroll frame — a selector query plus a
        // forced layout, 60x/second. We now resolve the elements once and cache
        // their document offsets, and only re-measure when the layout can
        // actually change (resize, fonts loading, ScrollTrigger refresh).
        let lightSections = [];
        let stackRange = null;
        let footerTop = Infinity;
        let measured = false;

        const measureSections = () => {
            const offsetOf = (el) => {
                const rect = el.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                return { top, bottom: top + rect.height };
            };
            lightSections = Array.from(
                document.querySelectorAll('.content-section, .Double-marquee, .light-section')
            ).map(offsetOf);

            const stackSection = document.querySelector('#stack-section');
            stackRange = stackSection ? offsetOf(stackSection) : null;

            footerTop = footerEl ? offsetOf(footerEl).top : Infinity;
            measured = true;
        };

        const invalidateSections = () => { measured = false; };
        window.addEventListener('resize', invalidateSections);
        cleanups.push(() => window.removeEventListener('resize', invalidateSections));

        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(invalidateSections);
        }
        // Pinned sections (ProjectStackScroll) inject a pin-spacer and change the
        // document height, so any ScrollTrigger refresh invalidates our offsets.
        ScrollTrigger.addEventListener('refresh', invalidateSections);
        cleanups.push(() => ScrollTrigger.removeEventListener('refresh', invalidateSections));

        const updateNavbarColor = () => {
            if (!navbar) return;
            if (!measured) measureSections();

            const scrollPos = window.scrollY + navbar.offsetHeight / 2;
            let isOverLight = false;

            for (let i = 0; i < lightSections.length; i++) {
                const { top, bottom } = lightSections[i];
                if (scrollPos >= top && scrollPos <= bottom) {
                    isOverLight = true;
                    break;
                }
            }

            if (stackRange && scrollPos >= stackRange.top && scrollPos <= stackRange.bottom) {
                isOverLight = false;
            }

            if (scrollPos >= footerTop) {
                isOverLight = false;
            }

            if (isOverLight) {
                navbar.classList.add('on-light');
                navbar.classList.remove('on-dark');
            } else {
                navbar.classList.add('on-dark');
                navbar.classList.remove('on-light');
            }
        };

        // NOTE: the scroll listener is registered once below (merged + rAF-throttled).
        updateNavbarColor();

        // Wiggle setup
        const logoNoqta = document.querySelector('.logo-noqta-wrap');
        if (logoNoqta) cleanups.push(initWiggle(logoNoqta, WIGGLE_CONFIG.logoTruus));

        const overlay = document.querySelector('.nav-overlay');
        // Detect if device supports hover (desktop) vs touch-only
        const hasHover = window.matchMedia('(hover: hover)').matches;

        if (overlay) {
            gsap.set(overlay, { opacity: 0, visibility: 'hidden' });
        }
        const showOverlay = () => {
            if (overlay) {
                gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto' });
                gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
            }
        };
        const hideOverlay = () => {
            if (overlay) {
                gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' }) });
            }
        };

        let closeLeft = () => {};
        let closeRight = () => {};
        let leftOpen = false;
        let rightOpen = false;

        // ─── Navbar Left (Work) Hover Popout ───
        const navLeft = document.querySelector('.nav-left');
        const workBox = document.querySelector('.nav-work-box');
        const workBlob = document.querySelector('.nav-bar__work-blob-svg');

        if (navLeft && workBox && workBlob) {
            const workInner = workBox.querySelector('.nav-popout-inner');
            const workItems = workInner ? Array.from(workInner.children) : [];

            gsap.set(workBox, { visibility: 'visible', scale: 1, opacity: 1 });
            const boxRect = workBox.getBoundingClientRect();
            const blobRect = workBlob.getBoundingClientRect();
            const originX = (blobRect.left + blobRect.width / 2) - boxRect.left;
            const originY = (blobRect.top + blobRect.height / 2) - boxRect.top;
            const workOrigin = `${originX}px ${originY}px`;

            gsap.set(workBox, {
                visibility: 'hidden',
                scale: 0,
                opacity: 0,
                transformOrigin: workOrigin
            });
            gsap.set(workItems, { y: 10, opacity: 0 });
            gsap.set(workBlob, { transformOrigin: 'center center' });

            const onEnterLeft = () => {
                leftOpen = true;
                gsap.killTweensOf(workBox);
                gsap.killTweensOf(workItems);
                gsap.killTweensOf(workBlob);
                showOverlay();

                gsap.to(workBlob, { rotation: '+=360', duration: 0.7, ease: 'power3.inOut' });

                gsap.set(workBox, { visibility: 'visible' });
                gsap.fromTo(workBox,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }
                );
                gsap.to(workItems, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out', delay: 0.15 });
            };

            const onLeaveLeft = () => {
                leftOpen = false;
                gsap.killTweensOf(workBox);
                gsap.killTweensOf(workItems);
                gsap.killTweensOf(workBlob);
                hideOverlay();

                gsap.to(workBlob, { rotation: 0, duration: 0.4, ease: 'power2.out' });
                gsap.to(workItems, { y: 10, opacity: 0, duration: 0.15, ease: 'power2.in' });
                gsap.to(workBox, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'expo.in',
                    delay: 0.05,
                    onComplete: () => gsap.set(workBox, { visibility: 'hidden' })
                });
            };

            closeLeft = onLeaveLeft;

            if (hasHover) {
                // Desktop: hover to open/close
                navLeft.addEventListener('mouseenter', onEnterLeft);
                navLeft.addEventListener('mouseleave', onLeaveLeft);
                cleanups.push(() => {
                    navLeft.removeEventListener('mouseenter', onEnterLeft);
                    navLeft.removeEventListener('mouseleave', onLeaveLeft);
                });
            } else {
                // Touch: click to toggle
                const onClickLeft = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (leftOpen) {
                        onLeaveLeft();
                        leftOpen = false;
                    } else {
                        if (rightOpen) { onLeaveRight(); rightOpen = false; }
                        onEnterLeft();
                        leftOpen = true;
                    }
                };
                navLeft.addEventListener('click', onClickLeft);
                cleanups.push(() => navLeft.removeEventListener('click', onClickLeft));
            }
        }

        // ─── Navbar Right (WhatsApp) Hover Popout ───
        const navRight = document.querySelector('.nav-right');
        const waBox = document.querySelector('.nav-wa-box');
        const waSvgPath = document.querySelector('.nav-bar__whatsapp-svg path');

        if (navRight && waBox) {
            const waInner = waBox.querySelector('.nav-popout-inner');
            const waItems = waInner ? Array.from(waInner.children) : [];
            const waIcon = document.querySelector('.nav-bar__whatsapp-svg');

            gsap.set(waBox, { visibility: 'visible', scale: 1, opacity: 1 });
            const waBoxRect = waBox.getBoundingClientRect();
            const waIconRect = waIcon ? waIcon.getBoundingClientRect() : waBoxRect;
            const waOriginX = (waIconRect.left + waIconRect.width / 2) - waBoxRect.left;
            const waOriginY = (waIconRect.top + waIconRect.height / 2) - waBoxRect.top;
            const waOrigin = `${waOriginX}px ${waOriginY}px`;

            gsap.set(waBox, {
                visibility: 'hidden',
                scale: 0,
                opacity: 0,
                transformOrigin: waOrigin
            });
            gsap.set(waItems, { y: 10, opacity: 0 });

            const onEnterRight = () => {
                rightOpen = true;
                gsap.killTweensOf(waBox);
                gsap.killTweensOf(waItems);
                showOverlay();
                if (waSvgPath) gsap.to(waSvgPath, { fill: '#43FB9C', duration: 0.3 });

                gsap.set(waBox, { visibility: 'visible' });
                gsap.fromTo(waBox,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }
                );
                gsap.to(waItems, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out', delay: 0.15 });
            };

            const onLeaveRight = () => {
                rightOpen = false;
                gsap.killTweensOf(waBox);
                gsap.killTweensOf(waItems);
                hideOverlay();
                if (waSvgPath) gsap.to(waSvgPath, { fill: 'currentColor', duration: 0.3 });

                gsap.to(waItems, { y: 10, opacity: 0, duration: 0.15, ease: 'power2.in' });
                gsap.to(waBox, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'expo.in',
                    delay: 0.05,
                    onComplete: () => gsap.set(waBox, { visibility: 'hidden' })
                });
            };

            closeRight = onLeaveRight;

            if (hasHover) {
                // Desktop: hover to open/close
                navRight.addEventListener('mouseenter', onEnterRight);
                navRight.addEventListener('mouseleave', onLeaveRight);
                cleanups.push(() => {
                    navRight.removeEventListener('mouseenter', onEnterRight);
                    navRight.removeEventListener('mouseleave', onLeaveRight);
                });
            } else {
                // Touch: click to toggle
                const onClickRight = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (rightOpen) {
                        onLeaveRight();
                        rightOpen = false;
                    } else {
                        if (leftOpen) { onLeaveLeft(); leftOpen = false; }
                        onEnterRight();
                        rightOpen = true;
                    }
                };
                navRight.addEventListener('click', onClickRight);
                cleanups.push(() => navRight.removeEventListener('click', onClickRight));
            }
        }

        // Close on overlay click
        const closeAllPopouts = () => {
            closeLeft();
            closeRight();
            leftOpen = false;
            rightOpen = false;
        };

        if (overlay) {
            overlay.addEventListener('click', closeAllPopouts);
            cleanups.push(() => overlay.removeEventListener('click', closeAllPopouts));
        }

        // Single rAF-throttled scroll handler: navbar colour + popout auto-close.
        // Previously closeAllPopouts() ran on EVERY scroll event and created ~10
        // GSAP tweens per event even when nothing was open. Now it only runs when
        // a popout is actually open, and at most once per animation frame.
        let scrollTicking = false;
        const onScroll = () => {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
                scrollTicking = false;
                updateNavbarColor();
                if (leftOpen || rightOpen) closeAllPopouts();
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));

        // Close on Escape key
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeAllPopouts();
        };
        window.addEventListener('keydown', onKeyDown);
        cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

        return () => {
            cleanups.forEach(fn => fn && fn());
        };
    }, []);

    return (
        <>
            <div className="nav-overlay" />
            <nav className="navbar">
                {/* ─── Left: Projects / Work Popout ─── */}
                <div className="nav-left">
                    <div className="nav-hover-trigger">
                        <div className="logo-work-container">
                            <img src="/assets/Navbar SVG/nav-work-blob.svg" width="60" height="55" className="nav-bar__work-blob-svg" alt="" aria-hidden="true" />
                            <span className="logo-work-text">أعمالنا</span>
                        </div>

                        {/* Pop-out Box for Work Preview */}
                        <div className="nav-popout nav-work-box">
                            <div className="nav-popout-inner">
                                <a
                                    href="#stack-section"
                                    onClick={() => {
                                        const overlay = document.querySelector('.nav-overlay');
                                        if (overlay) overlay.click();
                                    }}
                                    className="nav-work-item"
                                >
                                    <div className="nav-work-item__img-wrap" style={{ background: '#10162A' }}>
                                        <img
                                            src="/assets/noqta/noqta-portfolio-slide1.png"
                                            loading="lazy"
                                            decoding="async"
                                            alt="هويات بصرية وشعارات"
                                            className="nav-work-item__img"
                                        />
                                    </div>
                                    <div className="nav-work-item__text">
                                        <span className="nav-work-badge badge-violet">
                                            هويات وشعارات
                                        </span>
                                        <h4 className="nav-work-title">
                                            تصميم الهويات والشعارات
                                        </h4>
                                    </div>
                                </a>

                                <a
                                    href="#stack-section"
                                    onClick={() => {
                                        const overlay = document.querySelector('.nav-overlay');
                                        if (overlay) overlay.click();
                                    }}
                                    className="nav-work-item"
                                >
                                    <div className="nav-work-item__img-wrap" style={{ background: '#1E1B4B' }}>
                                        <img
                                            src="/assets/noqta/noqta-marketing-slide10.png"
                                            loading="lazy"
                                            decoding="async"
                                            alt="تسويق رقمي وحملات إعلانية"
                                            className="nav-work-item__img"
                                        />
                                    </div>
                                    <div className="nav-work-item__text">
                                        <span className="nav-work-badge badge-mint">
                                            تسويق رقمي
                                        </span>
                                        <h4 className="nav-work-title">
                                            إدارة الحملات الإعلانية
                                        </h4>
                                    </div>
                                </a>

                                <a
                                    href="#stack-section"
                                    onClick={() => {
                                        const overlay = document.querySelector('.nav-overlay');
                                        if (overlay) overlay.click();
                                    }}
                                    className="nav-work-item"
                                >
                                    <div className="nav-work-item__img-wrap" style={{ background: '#151B38' }}>
                                        <img
                                            src="/assets/noqta/noqta-thumbnails-slide9.png"
                                            loading="lazy"
                                            decoding="async"
                                            alt="تصاميم الأغلفة وصناعة الميديا"
                                            className="nav-work-item__img"
                                        />
                                    </div>
                                    <div className="nav-work-item__text">
                                        <span className="nav-work-badge badge-blue">
                                            صناعة ميديا
                                        </span>
                                        <h4 className="nav-work-title">
                                            تصاميم الأغلفة (Thumbnails)
                                        </h4>
                                    </div>
                                </a>

                                <a
                                    href="#stack-section"
                                    onClick={() => {
                                        const overlay = document.querySelector('.nav-overlay');
                                        if (overlay) overlay.click();
                                    }}
                                    className="nav-work-btn"
                                >
                                    <span className="nav-work-btn__text">استكشف كافة المشاريع ←</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Center: Noqta Logo Lockup ─── */}
                <div className="nav-center">
                    <a href="#" className="logo-noqta-wrap logo-truus" aria-label="Noqta Creative Solutions">
                        <div className="logo-noqta-flex" data-wiggle-target="true">
                            {/* Noqta Icon Mark */}
                            <svg className="noqta-nav-icon" width="34" height="26" viewBox="0 0 700 420" fill="none">
                                <circle cx="350" cy="115" r="82.5" fill="currentColor" />
                                <path d="M 5 125 H 170 A 180 180 0 0 0 530 125 H 695 A 345 345 0 0 1 5 125 Z" fill="currentColor" />
                            </svg>
                            {/* Brand Name Text */}
                            <span className="noqta-nav-text">نقطة</span>
                            <span className="noqta-nav-subtext">creative</span>
                        </div>
                    </a>
                </div>

                {/* ─── Right: WhatsApp & Direct Contact Popout ─── */}
                <div className="nav-right">
                    <div className="nav-hover-trigger">
                        <div className="logo-whatsapp">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 25 27" fill="none" className="nav-bar__whatsapp-svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.601 0.986335C11.8021 1.01421 11.8112 1.04366 12.0483 1.04591C12.4513 1.04943 12.8582 1.03181 13.2602 1.04591C14.7297 1.09749 16.3092 1.56281 17.684 2.0713C18.1173 2.2315 18.4074 2.52491 18.7836 2.75782C18.9541 2.86323 19.1764 2.93811 19.3335 3.03712C19.5277 3.15943 19.7215 3.30714 19.9233 3.43555C20.3796 3.7252 20.7523 4.04895 21.1381 4.42383C21.197 4.48126 21.2369 4.59395 21.2729 4.62403C21.314 4.65863 21.388 4.65528 21.4399 4.6963C21.7068 4.90722 22.4207 5.74735 22.6147 6.04298C22.7185 6.20149 22.7985 6.47832 22.9067 6.61329C23.0415 6.7815 23.1644 6.86231 23.2963 7.08692C23.7885 7.92434 24.1902 8.84837 24.4702 9.7793C24.6279 10.304 24.8111 10.9219 24.8608 11.4668C24.9707 12.6708 25.0812 13.7784 24.9155 14.9785C24.8495 15.4578 24.7632 15.9691 24.6469 16.4365C24.4028 17.4173 23.9978 18.3669 23.5952 19.3125L23.5942 19.3154C23.2319 20.1653 22.4331 20.9908 21.8686 21.71C21.6788 21.9518 21.5246 22.1892 21.2797 22.3965C21.0348 22.6037 20.7282 22.768 20.4858 22.9746C20.3515 23.0889 20.2324 23.2615 20.0844 23.3711C19.9297 23.4854 19.7093 23.5536 19.5795 23.6641C18.8674 24.2709 18.4307 24.4852 17.5708 24.8457C16.3894 25.341 15.3983 25.5527 14.143 25.8154C14.0198 25.8414 13.6705 25.8663 13.5473 25.8525C12.9146 25.7827 12.2271 25.9044 11.5727 25.8545C10.0414 25.7376 8.57578 25.2528 7.1401 24.7734C7.00809 24.7291 6.84411 24.5744 6.72701 24.5498C6.36124 24.4742 5.86748 24.7318 5.5151 24.8535C4.11582 25.337 2.69086 25.7679 1.29732 26.2774C1.16321 26.3264 1.01916 26.4488 0.862752 26.4805C0.562812 26.5413 0.382276 26.4893 0.175252 26.2725C-0.0110214 26.0774 -0.0238393 25.8442 0.0414625 25.5899C0.195974 24.988 0.457528 24.3357 0.623494 23.7432C0.689129 23.509 0.689327 23.2415 0.768025 22.9912C0.86868 22.6711 1.01713 22.3593 1.10885 22.0225C1.25986 21.4672 1.50066 20.9638 1.61568 20.3877C1.66507 20.1397 1.73727 19.8129 1.65474 19.5703C1.54703 19.2542 1.22105 18.8061 1.07857 18.4512C0.98014 18.2061 0.934053 17.924 0.84615 17.6924C0.795172 17.5578 0.685305 17.446 0.623494 17.3076C0.333338 16.6573 0.234002 15.75 0.137166 15.044C0.0291742 14.2597 -0.0144194 13.51 0.00435316 12.7207C0.00976743 12.4965 0.125735 12.263 0.156697 12.0391C0.225199 11.5469 0.215443 11.048 0.327595 10.5459C0.427657 10.0991 0.607537 9.65975 0.740681 9.23341C1.04177 8.26936 1.59197 7.3249 2.13326 6.47266C2.68319 5.60691 3.57311 4.75118 4.3276 4.06934C4.65535 3.77309 4.99265 3.53295 5.33345 3.25684C5.60926 3.03334 5.96284 2.93518 6.23677 2.75782C6.99243 2.26894 7.82882 1.80324 8.70553 1.52735C9.27166 1.34921 11.0774 0.914319 11.601 0.986335ZM8.61275 6.26563C8.24195 6.2935 7.52111 6.42855 7.19381 6.59864C7.0884 6.6534 7.03981 6.75373 6.9526 6.80469C6.77895 6.90626 6.5672 6.92775 6.35787 7.0713C5.53363 7.63716 5.10203 9.42643 5.26802 10.3643C5.304 10.5685 5.34605 10.781 5.38521 10.9824C5.4843 11.4925 5.65625 11.8143 5.77095 12.292C5.86034 12.6635 6.20472 13.0539 6.33052 13.4258C8.20336 16.9242 11.6057 19.8244 15.6147 20.3848C16.7183 20.42 17.5983 20.0958 18.5063 19.5127C18.9765 19.211 19.0117 18.9824 19.1938 18.5078C19.2868 18.2656 19.5158 18.014 19.5639 17.7266C19.5849 17.6004 19.5657 17.4844 19.5854 17.3643C19.6052 17.2441 19.6944 17.1274 19.7231 16.9902C19.7846 16.6955 19.8101 16.284 19.5297 16.0918C19.3912 15.9972 19.1379 15.9595 19.0063 15.8828C18.956 15.8537 18.9069 15.7462 18.8461 15.6914C18.5871 15.4585 18.1002 15.3976 17.7778 15.2607C17.3352 15.0726 16.4148 14.5509 15.9633 14.5606C15.9382 14.5622 15.5716 14.6637 15.5424 14.6758C15.3846 14.7418 15.0675 15.2811 14.976 15.4502C14.8888 15.611 14.7512 16.0087 14.6655 16.1143C14.3396 16.5154 13.5792 16.4394 13.1704 16.2139C12.3996 15.7887 11.4294 14.9649 10.8569 14.3145C10.5344 13.9479 9.89438 13.3129 9.76314 12.8535C9.62042 12.3534 9.57275 11.9847 9.94869 11.5781C10.159 11.351 10.6709 10.903 10.7944 10.6367C10.8861 10.4394 10.8788 10.1244 10.7983 9.92481C10.4411 9.04176 10.0609 8.17693 9.69478 7.28907C9.64899 7.17828 9.63771 7.05901 9.58931 6.94727C9.51318 6.77179 9.28563 6.52143 9.13717 6.41016C9.00243 6.30927 8.7781 6.25318 8.61275 6.26563Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Pop-out Box for WhatsApp */}
                        <div className="nav-popout nav-wa-box">
                            <div className="nav-popout-inner">
                                <div className="nav-wa-icon-glow">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366">
                                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                                    </svg>
                                </div>
                                <h4 className="nav-wa-title">تواصل معنا عبر واتساب</h4>
                                <p className="nav-wa-desc">
                                    جاهزون لمناقشة فكرتك والبدء في مشروعك التقني أو حملتك الإعلانية القادمة.
                                </p>
                                <div className="nav-wa-numbers">
                                    <a href="https://wa.me/201069822862" target="_blank" rel="noopener noreferrer" className="nav-wa-num-badge">
                                        01069822862
                                    </a>
                                    <a href="https://wa.me/201125377606" target="_blank" rel="noopener noreferrer" className="nav-wa-num-badge">
                                        01125377606
                                    </a>
                                </div>
                                <a href={NOQTA_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="nav-wa-link">
                                    <span className="nav-wa-link-text">محادثة واتساب مباشرة ←</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
