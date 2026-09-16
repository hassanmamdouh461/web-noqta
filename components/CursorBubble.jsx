'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function CursorBubble() {
    useEffect(() => {
        const cursorBubble = document.querySelector('.cursor-bubble');
        if (!cursorBubble) return;

        const xTo = gsap.quickTo(cursorBubble, 'x', { duration: 0.45, ease: 'power3' });
        const yTo = gsap.quickTo(cursorBubble, 'y', { duration: 0.45, ease: 'power3' });

        let isHoveringClickable = false;
        gsap.set(cursorBubble, { rotation: -25, scale: 0, opacity: 0 });

        const onMouseMove = (e) => {
            xTo(e.clientX + 14);
            yTo(e.clientY - 42);
        };

        const onMouseOver = (e) => {
            const targetSelector = '.logo-noqta-wrap, .stack-card__cta, .hero-cta-btn, .single-social, .footer-whatsapp, .footer-email, .nav-work-item, .nav-work-btn, .showreel__play-btn';
            const found = e.target.closest(targetSelector);

            if (found && !isHoveringClickable) {
                isHoveringClickable = true;
                if (found.matches('.logo-noqta-wrap')) cursorBubble.textContent = 'NOQTA';
                else if (found.matches('.stack-card__cta, .nav-work-item, .nav-work-btn')) cursorBubble.textContent = 'VIEW';
                else if (found.matches('.footer-whatsapp')) cursorBubble.textContent = 'CHAT';
                else if (found.matches('.footer-email')) cursorBubble.textContent = 'EMAIL';
                else if (found.matches('.showreel__play-btn')) cursorBubble.textContent = 'PLAY';
                else cursorBubble.textContent = 'CLICK';

                gsap.killTweensOf(cursorBubble);
                gsap.to(cursorBubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
            } else if (!found && isHoveringClickable) {
                isHoveringClickable = false;
                gsap.killTweensOf(cursorBubble);
                gsap.to(cursorBubble, { opacity: 0, scale: 0, rotation: -25, duration: 0.25, ease: 'power2.in' });
            }
        };

        const onMouseLeave = () => {
            if (isHoveringClickable) {
                isHoveringClickable = false;
                gsap.killTweensOf(cursorBubble);
                gsap.to(cursorBubble, { opacity: 0, scale: 0, rotation: -25, duration: 0.25, ease: 'power2.in' });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return <div className="cursor-bubble">CLICK</div>;
}
