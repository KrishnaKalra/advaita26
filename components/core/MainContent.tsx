'use client';
import styles from '@/styles/MainContent.module.css';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/ProNight';
import Cast from '@/components/sections/Gallery';
import Footer from '@/components/sections/Footer';
import CTA from '@/components/sections/CTA';
import Sponsors from '@/components/sections/Sponsor';

export default function MainContent() {
    return (
        <div className={styles.wrapper}>
            <Hero />
            <CTA />
            <Sponsors />
            <About />
            <Cast />
            <Footer />
        </div>
    );
}
