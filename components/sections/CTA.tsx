'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/sections/CTA.module.css';

const stats = [
  { label: "ANOMALY_FUN_EVENTS", value: "25+", desc: "RECREATIONAL PROTOCOLS" },
  { label: "VOLTAGE_PRO_SHOWS", value: "05+", desc: "HIGH-DECIBEL OUTPUT" },
  { label: "CIRCUIT_TECH_EVENTS", value: "09+", desc: "COGNITIVE STRESS TESTS" },
  { label: "CULTURAL_FREQ", value: "08+", desc: "VIBRATIONAL ANALYSIS" },
  { label: "DATA_FOOTFALL", value: "6000+", desc: "POPULATION DENSITY" },
];

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 12;
      const y = (clientY / window.innerHeight - 0.5) * 12;
      containerRef.current.style.setProperty('--rx', `${-y}deg`);
      containerRef.current.style.setProperty('--ry', `${x}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={styles.wrapper}>
      {/* Background Dust/Ash Particles */}
      <div className={styles.ashOverlay} />
      
      <div className={styles.cabinetContainer} ref={containerRef}>
        <div className={styles.bezel}>
          <div className={styles.screen}>
            {/* CRT VFX */}
            <div className={styles.scanlines} />
            <div className={styles.vhsGlitch} />
            
            <div className={styles.content}>
              <div className={styles.terminalHeader}>
                <div className={styles.blinkingLight} />
                <span>HAWKINS_NATIONAL_LAB // AUTH_ACCESS_ONLY</span>
                <span className={styles.timer}>SYSTEM_TIME: 19:84:00</span>
              </div>

              <div className={styles.mainGrid}>
                {/* LEFT: THE MONITOR DATA */}
                <div className={styles.dataPanel}>
                  <h3 className={styles.panelTitle}>ANOMALY_METRICS</h3>
                  {stats.map((stat, i) => (
                    <div key={i} className={styles.statRow}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statDesc}>{stat.desc}</span>
                      </div>
                      <span className={styles.statValue}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* RIGHT: PHYSICAL CONTROLS */}
                <div className={styles.controlPanel}>
                  <div className={styles.buttonGrid}>
                    {['ACCOMODATION', 'RULEBOOK', 'BROCHURE', 'REGISTER'].map((text, i) => (
                      <div key={i} className={styles.btnHousing}>
                        <label className={styles.btnLabel}>FUNC_{i + 1}</label>
                        <button 
                          className={`${styles.tactileBtn} ${text === 'REGISTER' ? styles.danger : ''}`}
                          onMouseEnter={() => setActiveBtn(i)}
                          onMouseLeave={() => setActiveBtn(null)}
                        >
                          <span className={styles.innerShadow} />
                          {text}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className={styles.ventilation}>
                    <div className={styles.grill} />
                    <div className={styles.serial}>SN: IIITB-2026-ADV</div>
                  </div>
                </div>
              </div>

              <div className={styles.bottomBar}>
                <div className={styles.warningTicker}>
                  CAUTION: DIMENSIONAL GATE STABILITY AT 14%... PROCEED WITH EXTREME VIGILANCE... 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}