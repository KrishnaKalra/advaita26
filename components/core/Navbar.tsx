'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (id: string, isExternal: boolean = false) => {
        setMenuOpen(false); 

        // If it's an external page (like the Events page)
        if (isExternal) {
            router.push(`/${id}`);
            return;
        }

        // If we are already on the home page, scroll to section
        if (pathname === '/') {
            if (id === 'top') {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            const el = document.getElementById(id);
            if (el) {
                const offset = 100; 
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: "smooth" });
            }
        } else {
            // If we're on /events and click a home link, go back home first
            router.push(`/#${id}`);
        }
    };

    return (
        <>
            <nav 
                className={styles.navbar} 
                style={{ 
                    marginTop: scrolled ? '-5px' : '0px',
                    backgroundColor: menuOpen ? 'transparent' : undefined,
                    borderBottom: scrolled ? '2px solid #e31212' : 'none' // Added neon red glow on scroll
                }}
            >
                <div className={styles.container}>
                    <div className={styles.logo} onClick={() => handleNavClick('top')}>
                        ADVAITA
                    </div>

                    {/* DESKTOP LINKS */}
                    <div className={styles.links}>
                        <div className={styles.linkWrapper}>
                            <div className={styles.bulb} />
                            {/* LINKED TO EVENTS PAGE */}
                            <button onClick={() => handleNavClick('events', true)} className={styles.link}>Events</button>
                        </div>
                        <div className={styles.linkWrapper}>
                            <div className={styles.bulb} />
                            <button onClick={() => handleNavClick('merch')} className={styles.link}>Merch</button>
                        </div>
                        <div className={styles.linkWrapper}>
                            <div className={styles.bulb} />
                            <button onClick={() => handleNavClick('passes')} className={styles.link}>Passes</button>
                        </div>
                        <div className={styles.linkWrapper}>
                            <div className={styles.bulb} />
                            <button onClick={() => handleNavClick('register')} className={styles.link}>Register</button>
                        </div>
                    </div>

                    {/* MOBILE PULL CORD */}
                    <button 
                        className={styles.hamburger}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <div className={styles.pullString} />
                        <div className={styles.pullKnob} />
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.menuOpen : ''}`}>
                <button onClick={() => handleNavClick('top')} className={styles.mobileLink}>Home</button>
                <button onClick={() => handleNavClick('events', true)} className={styles.mobileLink}>The Events</button>
                <button onClick={() => handleNavClick('merch')} className={styles.mobileLink}>Merch</button>
                <button onClick={() => handleNavClick('register')} className={styles.mobileLink}>Register</button>
                
                <div className={styles.closeHint}>
                    PULL THE CORD TO CLOSE
                </div>
            </div>
        </>
    );
}