'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/sections/ProNight.module.css';

const performances = [
  {
    id: '01',
    type: 'LIVE_CONCERT',
    artist: 'THE_UPSIDE_DOWN_KEYS',
    date: 'MARCH 26',
    time: '20:00 HRS',
    status: 'SIGHTING_CONFIRMED',
    image: '/artists/band.jpg',
    description: 'High-frequency sonic resonance detected. Potential dimensional rift during peak performance.'
  },
  {
    id: '02',
    type: 'DJ_INVASION',
    artist: 'NEON_SHADOW',
    date: 'MARCH 27',
    time: '22:00 HRS',
    status: 'TRACKING_ACTIVE',
    image: '/artists/dj.jpg',
    description: 'Electronic pulse waves projected to reach critical mass. Audience heart rates monitored.'
  },
  {
    id: '03',
    type: 'EDM_FINALE',
    artist: 'PROTOCOL_X',
    date: 'MARCH 28',
    time: '21:00 HRS',
    status: 'INTERCEPTION_REQUIRED',
    image: '/artists/edm.jpg',
    description: 'Final stage experiment. Maximum energy output expected. Protective gear recommended.'
  }
];

export default function ProNight() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.wrapper}>
      <div className={styles.scanlineOverlay} />
      
      <div className={styles.container}>
        {/* SIDE NAV - SLIDE SELECTOR */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.blink}>●</span> REC_MODE: ON
          </div>
          <div className={styles.artistList}>
            {performances.map((perf, index) => (
              <button 
                key={perf.id}
                className={`${styles.navBtn} ${index === activeIndex ? styles.activeNav : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className={styles.navId}>{perf.id}</span>
                <span className={styles.navName}>{perf.artist}</span>
              </button>
            ))}
          </div>
          <div className={styles.sidebarFooter}>
            HAWKINS_NATIONAL_LAB // PRO_NIGHT_DEPT
          </div>
        </div>

        {/* MAIN VIEWER - THE SLIDE PROJECTOR */}
        <div className={styles.viewer}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className={styles.slide}
            >
              {/* SURVEILLANCE OVERLAYS */}
              <div className={styles.viewfinder}>
                <div className={styles.cornerTL} />
                <div className={styles.cornerBR} />
                <div className={styles.centerAim} />
              </div>

              <div className={styles.imageContainer}>
                <img src={performances[activeIndex].image} alt="Target" className={styles.artistImg} />
                <div className={styles.staticOverlay} />
              </div>

              <div className={styles.infoPanel}>
                <div className={styles.typeTag}>{performances[activeIndex].type}</div>
                <h2 className={styles.artistTitle}>{performances[activeIndex].artist}</h2>
                
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>DATE_OBSERVED</label>
                    <p>{performances[activeIndex].date}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>EXECUTION_TIME</label>
                    <p>{performances[activeIndex].time}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>CURRENT_STATUS</label>
                    <p className={styles.statusText}>{performances[activeIndex].status}</p>
                  </div>
                </div>

                <p className={styles.description}>
                  {performances[activeIndex].description}
                </p>

                <button className={styles.intelBtn}>ACCESS_CONCERT_INTEL</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}