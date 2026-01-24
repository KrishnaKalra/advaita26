'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/sections/Hero.module.css';

const FULL_TEXT = "Deep within the coordinates of IIIT Bhubaneswar, a dimensional rift is widening. Advaita is no longer just a fest—it is a 96-hour convergence of technical mastery and cultural chaos. Since its inception, this anomaly has evolved into the most eminent power surge on the Eastern Front, pulling the nation’s elite technocrats into its neon-soaked orbit. The barrier is at its thinnest this March. Prepare to step through the gate.";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // 1. Mouse Parallax & Glow Movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const { clientX, clientY } = e;
      const xPct = (clientX / window.innerWidth - 0.5) * 20;
      const yPct = (clientY / window.innerHeight - 0.5) * 20;
      
      sectionRef.current.style.setProperty('--mx', `${clientX}px`);
      sectionRef.current.style.setProperty('--my', `${clientY}px`);
      sectionRef.current.style.setProperty('--rx', `${xPct}px`);
      sectionRef.current.style.setProperty('--ry', `${yPct}px`);
    };

    // 2. Typewriter Logic
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(FULL_TEXT.slice(0, i));
      i++;
      if (i > FULL_TEXT.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <section className={styles.heroSection} ref={sectionRef}>
      {/* BACKGROUND FX */}
      <div className={styles.magneticRift} />
      <div className={styles.dynamicGlow} />
      <div className={styles.ashOverlay} />
      
      {/* CRT SCANLINES */}
      <div className={styles.crtContainer}>
        <div className={styles.scanlines} />
      </div>

      <div className={styles.container}>
        <div className={styles.headerTerminal}>
          <span className={styles.statusDot} /> 
          ACCESSING IIITB_SERVER // PORTAL_STATUS: OPENING
        </div>

        <div className={styles.contentLayer}>
          <h1 className={styles.mainTitle} data-text="ADVAITA">
            ADVAITA
          </h1>

          <div className={styles.descriptionContainer}>
            <div className={styles.dossierLabel}>CLASSIFIED DATA // DECRYPTING...</div>
            <p className={styles.typewriterText}>
              {typedText}
              <span className={styles.cursor}>_</span>
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>TEMPORAL WINDOW</div>
              <div className={styles.statValue}>MAR 26 - 29</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>THREAT LEVEL</div>
              <div className={styles.statValue}>EXTREME</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>LOCATION</div>
              <div className={styles.statValue}>SECTOR_IIITB</div>
            </div>
          </div>

          <div className={styles.buttonRack}>
            <button className={styles.primaryBtn}>
              <span className={styles.btnText}>ENTER THE GATE</span>
              <div className={styles.btnReflex} />
            </button>
            <button className={styles.secondaryBtn}>
              ACCESS FILES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}