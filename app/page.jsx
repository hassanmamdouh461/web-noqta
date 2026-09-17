'use client';

import SvgSymbols from '@/components/SvgSymbols';
import Navbar from '@/components/Navbar';
import VimeoHero from '@/components/VimeoHero';
import HorizontalWords from '@/components/HorizontalWords';
import MotionCards from '@/components/MotionCards';
import ProjectStackScroll from '@/components/ProjectStackScroll';
import ServiceCards from '@/components/ServiceCards';
import Showreel from '@/components/Showreel';
import DoubleMarquee from '@/components/DoubleMarquee';
import Footer from '@/components/Footer';
import TransitionScribble from '@/components/TransitionScribble';
import CursorBubble from '@/components/CursorBubble';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
    return (
        <>
            <SvgSymbols />
            <SmoothScroll />
            <CursorBubble />

            {/* Keyboard users can jump straight past the fixed navbar. */}
            <a href="#main-content" className="skip-link">تخطَّ إلى المحتوى الرئيسي</a>

            {/* Header: Fixed Navbar + Interactive Hero */}
            <header className="main-header" id="hero">
                <Navbar />
                <VimeoHero />
            </header>

            {/* NOTE: everything that is neither the header nor the footer now
                lives inside <main>. HorizontalWords and DoubleMarquee used to
                sit between </header> and <main>, which left the page without a
                single contiguous main landmark for screen readers. */}
            <main id="main-content">
                {/* Pinned Horizontal Words on Scroll */}
                <HorizontalWords />

                {/* Motion Cards with Physics Inertia & Metrics */}
                <div className="content-section motion-cards-wrapper">
                    <MotionCards />
                </div>

                {/* 3D Stacking Cards Scroll for Project Showcase */}
                <ProjectStackScroll />

                {/* Interactive Fan-out Service Cards */}
                <div className="content-section service-cards-wrapper">
                    <ServiceCards />
                </div>

                {/* Showreel & Video Production Section */}
                <Showreel />

                {/* Dual Vertical Marquee with Tech & Media Tools */}
                <DoubleMarquee />
            </main>

            {/* Footer with Contact Links, WhatsApp, Socials & Stickers */}
            <footer className="main-footer">
                <Footer />
            </footer>

            <TransitionScribble />
        </>
    );
}
