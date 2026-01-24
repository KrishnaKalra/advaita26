'use client';
import { useEffect, useRef } from 'react';
import styles from '@/styles/sections/Sponsor.module.css';

const allSponsors = [
  { name: "Google", logo: "/sponsors/google.png", status: "TITLE_ANOMALY" },
  { name: "Microsoft", logo: "/sponsors/ms.png", status: "POWER_CORE" },
  { name: "Intel", logo: "/sponsors/intel.png", status: "POWER_CORE" },
  { name: "Red Bull", logo: "/sponsors/rb.png", status: "RESEARCH" },
  { name: "GitHub", logo: "/sponsors/github.png", status: "RESEARCH" },
  { name: "Dell", logo: "/sponsors/dell.png", status: "RESEARCH" },
  { name: "Nvidia", logo: "/sponsors/nvidia.png", status: "OPERATIONAL" },
];

export default function Sponsors() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Optional: Add Mouse Wheel to Horizontal Scroll logic
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.fullWidthContainer}>
        
        {/* FIXED HEADER */}
        <div className={styles.folderHeader}>
          <div className={styles.tab}>SECURE_DATABASE // PARTNERS</div>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>AUTHORIZED_ENTITIES</h2>
            <div className={styles.metaData}>
              <span>SCAN_MODE: HORIZONTAL</span>
              <div className={styles.stamp}>TOP SECRET</div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE ROW */}
        <div className={styles.scrollContainer} ref={scrollRef}>
          <div className={styles.evidenceRow}>
            {allSponsors.map((sponsor, idx) => (
              <div key={idx} className={styles.evidenceCard}>
                <div className={styles.tape} />
                <div className={styles.imageBox}>
                  <img src={sponsor.logo} alt={sponsor.name} className={styles.logo} />
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.idRow}>
                    <span className={styles.idCode}>REF_{idx + 101}</span>
                    <span className={styles.statusBadge}>{sponsor.status}</span>
                  </div>
                  <p className={styles.subjectName}>SUBJECT: {sponsor.name}</p>
                </div>
              </div>
            ))}
            {/* End of Folder Filler */}
            <div className={styles.endOfFolder}>
              <p>NO_MORE_DATA</p>
            </div>
          </div>
        </div>

        <div className={styles.systemFooter}>
          <div className={styles.scrollIndicator}>
            <div className={styles.progressLine} />
            <span>SCROLL_TO_REVEAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}