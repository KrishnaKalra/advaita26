'use client';

import { ReactNode } from 'react';
import styles from '@/styles/parallaxFrame.module.css';

export default function ParallaxFrame({ children }: { children: ReactNode }) {
    return (
        <div className={styles.frameOuter}>
            <div className={styles.frameInner}>
                {children}
            </div>
        </div>
    );
}
