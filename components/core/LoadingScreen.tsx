'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/LoadingScreen.module.css';

const ASSETS_TO_LOAD = [
    // Common
    '/assets/bg.webp',
    '/assets/bg2.webp',
    '/assets/smoke.webp',
    '/assets/noise.webp',
    '/assets/noiseD.webp',

    // Scene 1
    '/assets/building.webp',
    '/assets/char.webp',
    '/assets/college.webp',
    '/assets/ferris.webp',
    '/assets/fg.webp',
    '/assets/fg0.webp',
    '/assets/temple.webp',

    // Scene 2
    '/assets/scene2/S2bg.webp',
    '/assets/scene2/S2layer.webp',
    '/assets/scene2/S2layer1.webp',
    '/assets/scene2/S2layer3.webp',
    '/assets/scene2/S2layer4.webp',
    '/assets/scene2/S2layer5.webp',
    '/assets/scene2/S2layer6.webp',

    // Scene 3
    '/assets/scene3/s3bg.webp',
    '/assets/scene3/s3bg2.webp',
    '/assets/scene3/s3building.webp',
    '/assets/scene3/s3char.webp',
    '/assets/scene3/s3college.webp',
    '/assets/scene3/s3ferris.webp',
    '/assets/scene3/s3fg.webp',
    '/assets/scene3/s3fg0.webp',
    '/assets/scene3/s3temple.webp',
];

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('INITIALIZING SYSTEM...');
    const totalAssets = useRef(ASSETS_TO_LOAD.length);
    const loadedCount = useRef(0);
    const hasCompleted = useRef(false);

    useEffect(() => {
        // Prevent body scroll during load
        document.body.style.overflow = 'hidden';

        const loadAsset = (src: string) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    loadedCount.current += 1;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to preload asset: ${src}`);
                    // Still count errors so loading finishes
                    loadedCount.current += 1;
                    resolve();
                };
            });
        };

        const loadAll = async () => {
            // Create a pool of load promises
            const promises = ASSETS_TO_LOAD.map((src, index) => {
                // Stagger starts slightly so they don't all fire exactly at once if that helps browser
                // mostly just firing them all off
                return loadAsset(src);
            });

            // Monitor progress
            const interval = setInterval(() => {
                const percent = Math.floor((loadedCount.current / totalAssets.current) * 100);
                setProgress(prev => {
                    const next = Math.max(prev, percent);
                    return next > 100 ? 100 : next;
                });

                // Update text based on percent
                if (percent < 25) setStatusText('LOADING ASSETS...');
                else if (percent < 50) setStatusText('BOOTING NEURAL LINK...');
                else if (percent < 75) setStatusText('SYNCHRONIZING REALITY...');
                else if (percent < 99) setStatusText('ESTABLISHING CONNECTION...');
                else setStatusText('READY TO DIVE.');

                // Check completion
                if (loadedCount.current >= totalAssets.current && !hasCompleted.current) {
                    clearInterval(interval);
                    hasCompleted.current = true;
                    // Small delay at 100% for effect
                    setProgress(100);
                    setTimeout(() => {
                        document.body.style.overflow = '';
                        onComplete();
                    }, 800);
                }
            }, 100);

            await Promise.all(promises);
        };

        loadAll();

        return () => {
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    return (
        <div className={styles.container}>
            <div className={styles.scanlines} />
            <div className={styles.sun} />
            <div className={styles.grid} />

            <div className={styles.content}>
                <h1 className={styles.title}>ADVAITA 26</h1>

                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className={styles.progressText}>
                    {progress}%
                </div>

                <div className={styles.statusText}>
                    {statusText}<span className={styles.blink}>_</span>
                </div>
            </div>
        </div>
    );
}
