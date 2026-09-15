'use client';

import SvgSymbols from '@/components/SvgSymbols';
import Navbar from '@/components/Navbar';
import VimeoHero from '@/components/VimeoHero';
import ServiceCards from '@/components/ServiceCards';
import MotionCards from '@/components/MotionCards';
import TechStickyCards from '@/components/TechStickyCards';
import MediaStackScroll from '@/components/MediaStackScroll';
import DoubleMarquee from '@/components/DoubleMarquee';
import Footer from '@/components/Footer';
import TransitionScribble from '@/components/TransitionScribble';
import CursorBubble from '@/components/CursorBubble';
import SmoothScroll from '@/components/SmoothScroll';
import HorizontalWords from '@/components/HorizontalWords';
import IntroLoader from '@/components/IntroLoader';

export default function Home() {
    return (
        <>
            <IntroLoader />
            <SvgSymbols />
            <SmoothScroll />
            <CursorBubble />
            
            {/* Header & Hero */}
            <header className="main-header" id="home">
                <Navbar />
                <VimeoHero />
            </header>

            {/* Kinetic Typography Marquee */}
            <HorizontalWords />

            <main>
                {/* Agency Core Philosophy & Motion Fling Cards */}
                <div className="content-section motion-cards-wrapper" id="about">
                    <MotionCards />
                </div>

                {/* Showcase 1: Tech & Software Projects (3D Sticky Perspective Cards) */}
                <TechStickyCards />

                {/* Showcase 2: Media & Marketing Projects (Stack Scroll Deck) */}
                <MediaStackScroll />

                {/* Services & Capabilities Cards (Expandable on hover) */}
                <div className="content-section service-cards-wrapper" id="services">
                    <ServiceCards />
                </div>
            </main>

            {/* Double Infinite Marquee */}
            <section className="Double-marquee">
                <DoubleMarquee />
            </section>

            {/* Footer with Contact, Stickers & QR */}
            <footer className="main-footer" id="contact-footer">
                <Footer />
            </footer>

            <TransitionScribble />
        </>
    );
}
