'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/core/Navbar';
import MusicPlayer from '@/components/core/MusicPlayer';
import styles from '@/styles/Events.module.css';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isCorrupted?: boolean; // For the "Upside Down" effect
}

const EVENTS_DATA: Event[] = [
  {
    id: 'EV-001',
    title: "Snow Ball '84",
    date: "DEC 23, 1984",
    time: "19:00 HRS",
    location: "Hawkins Middle Gym",
    description: "The classic middle school dance. High risk of psychic interference. Dress code: 80s Formal.",
    image: "https://images.unsplash.com/photo-1533219057257-4bb9ed5d2cc6?q=80&w=1000",
  },
  {
    id: 'EV-002',
    title: "The Gate Breach",
    date: "ERROR_NULL",
    time: "00:00 HRS",
    location: "Hawkins Lab - Floor -4",
    description: "UNAUTHORIZED ACCESS DETECTED. Entities from the lower dimension are manifesting. Proceed with caution.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000",
    isCorrupted: true,
  },
  {
    id: 'EV-003',
    title: "Starcourt Rally",
    date: "JULY 04, 1985",
    time: "14:00 HRS",
    location: "Starcourt Mall",
    description: "Celebrate the grand opening. Scoops Ahoy is serving free samples. Pay no attention to the power fluctuations.",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1000",
  }
];

export default function EventsPage() {
  const [glitch, setGlitch] = useState(false);

  // Trigger occasional "System Flickers"
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <section className={`${styles.wrapper} ${glitch ? styles.systemGlitch : ''}`}>
        {/* Background Atmosphere */}
        <div className={styles.ashOverlay} />
        <div className={styles.vignette} />

        <div className={styles.header}>
          <div className={styles.topLabel}>HAWKINS INDIANA // 1984</div>
          <h1 className={styles.mainTitle}>
            <span className={styles.glowText}>ADVAITA</span> 
            <span className={styles.redText}>EVENTS</span>
          </h1>
        </div>

        <div className={styles.grid}>
          {EVENTS_DATA.map((event) => (
            <div 
              key={event.id} 
              className={`${styles.card} ${event.isCorrupted ? styles.corrupted : ''}`}
            >
              <div className={styles.imageContainer}>
                <img src={event.image} alt={event.title} className={styles.cardImg} />
                <div className={styles.scanlines} />
                <div className={styles.statusBadge}>{event.isCorrupted ? 'WARNING' : 'ACTIVE'}</div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.meta}>
                  <span className={styles.date}>{event.date}</span>
                  <span className={styles.id}>{event.id}</span>
                </div>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.description}>{event.description}</p>
                
                <div className={styles.locationBlock}>
                  <span className={styles.label}>LOC:</span>
                  <span className={styles.value}>{event.location}</span>
                </div>

                <button className={styles.actionBtn}>
                  <span className={styles.btnLabel}>ACCESS FILE</span>
                  <div className={styles.btnGlow} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className={styles.vhsFooter}>
          <div className={styles.vhsRec}>
            <span className={styles.recDot}>●</span> PLAY 00:24:84
          </div>
          <div className={styles.vhsMode}>HI-FI STEREO</div>
        </footer>
      </section>
      <MusicPlayer />
    </>
  );
}