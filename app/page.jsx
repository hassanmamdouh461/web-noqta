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

            {/* Header: Fixed Navbar + Interactive Hero */}
            <header className="main-header" id="hero">
                <Navbar />
                <VimeoHero />
            </header>

            {/* Pinned Horizontal Words on Scroll */}
            <HorizontalWords />

            <main>
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
            </main>

            {/* Dual Vertical Marquee with Tech & Media Tools */}
            <DoubleMarquee />

            {/* Footer with Contact Links, WhatsApp, Socials & Stickers */}
            <footer className="main-footer">
                <Footer />
            </footer>

            <TransitionScribble />
        </>
    );
}
