'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/core/Navbar';
import styles from '@/styles/merch/Merch.module.css';

export default function MerchPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xOffset = (clientX / window.innerWidth - 0.5) * 20;
            const yOffset = (clientY / window.innerHeight - 0.5) * 20;

            setMousePosition({ x: xOffset, y: yOffset });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const merchItems = [
        { id: 1, title: "Advaita '26 Classic Tee", image: "/assets/merch/web-1.gif",link:"https://konfhub.com/checkout/advaita2026?ticketId=8088"},
        { id: 2, title: "WSQK Edition", image: "/assets/merch/web-2.gif" ,link:"https://konfhub.com/checkout/advaita2026?ticketId=80882"},
        { id: 3, title: "Hellfire Club Hoodie", image: "/assets/merch/web-3.gif",link:"https://konfhub.com/checkout/advaita2026?ticketId=80648"
},
    ];

    return (
        <>
            <Navbar />
            <div
                className={styles.merchSection}
                style={{
                    '--mx': `${50 + mousePosition.x / 2}%`,
                    '--my': `${50 + mousePosition.y / 2}%`,
                    '--rx': `${mousePosition.x}px`,
                    '--ry': `${mousePosition.y}px`,
                } as React.CSSProperties}
            >
                {/* ATMOSPHERIC LAYERS */}
                <div className={styles.magneticRift}></div>
                <div className={styles.ashOverlay}></div>

                {/* CRT EFFECT */}
                <div className={styles.crtContainer}>
                    <div className={styles.scanlines}></div>
                </div>

                <div className={styles.container}>
                    <h1 className={styles.mainTitle}>MERCHANDISE</h1>

                    <div className={styles.merchGrid}>
                        {merchItems.map((item) => (
                            <Link href={item.link} target="_blank" rel="noopener noreferrer" >
                            <div key={item.id} className={styles.merchItem}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={400}
                                        height={400}
                                        className={styles.merchImage}
                                        unoptimized // since they are gifs
                                    />
                                </div>
                                <h3 className={styles.merchTitle}>{item.title}</h3>
                            </div>
                            </Link>
                        ))}
                    </div>

                    <div className={styles.buttonContainer}>
                        <Link href="/" className={styles.secondaryBtn}>
                            RETURN TO BASE
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
