'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import base from '@/styles/parallax.base.module.css';
import styles from '@/styles/parallax.scene2.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SceneTwo({
    onActivate,
    registerShakeTargets,
    onScrollProgress,
    onEnterWebsite,
}: {
    onActivate: () => void;
    registerShakeTargets: (targets: HTMLElement[]) => void;
    onScrollProgress: (p: number) => void;
    onEnterWebsite?: () => void;
}) {

    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        /* ---------- STATE ---------- */

        let scrollP = 0;
        let mouseX = 0;
        let mouseY = 0;

        /* ---------- MOUSE ---------- */

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        };

        window.addEventListener('mousemove', onMouseMove);

        const ctx = gsap.context(() => {
            /* ---------- ELEMENTS ---------- */

            const q = (s: string) => frame.querySelector(s);

            const bg = q('.bg');
            const l0 = q('.l0');

            const l1 = q('.l1');

            const l3 = q('.l3');
            const l4 = q('.l4');
            const l5 = q('.l5');

            const smoke = q('.smoke');
            const smokeBack = q('.smokeBack');
            const smokeMid = q('.smokeMid');
            const smokeFront = q('.smokeFront');

            const l6 = q('.l6');

            /* ---------- INERTIA ---------- */

            const inert = (el: Element | null, duration = 4.0) =>
                el
                    ? {
                        x: gsap.quickTo(el, 'x', {
                            duration,
                            ease: 'power4.out',
                        }),
                        y: gsap.quickTo(el, 'y', {
                            duration,
                            ease: 'power4.out',
                        }),
                    }
                    : { x: () => { }, y: () => { } };

            const bgSet = inert(bg, 6);
            const l0Set = inert(l0, 5.5);

            const l1Set = inert(l1, 4.8);

            const l3Set = inert(l3, 5);
            const l4Set = inert(l4, 4.8);
            const l5Set = inert(l5, 6);

            const smokeBackSet = inert(smokeBack, 7);
            const smokeMidSet = inert(smokeMid, 6.5);
            const smokeFrontSet = inert(smokeFront, 6);
            const smokeSet = inert(smoke, 6.5);

            const l6Set = inert(l6, 3.8);

            const shakeEls = Array.from(
                frame.querySelectorAll('[data-shake="true"]')
            ) as HTMLElement[];

            registerShakeTargets(shakeEls);

            /* ---------- SCROLL POSE ---------- */

            const scrollValue = (
                level: number,
                max: number,
                direction: 1 | -1
            ) => {
                const speed = gsap.utils.clamp(1, 9, level) / 9;
                const t = gsap.utils.clamp(
                    0,
                    1,
                    (scrollP - (1 - speed)) / speed
                );
                return t * max * direction;
            };

            /* ---------- MOUSE POSE ---------- */

            const mouseValue = (
                maxScroll: number,
                mouseLevel: number,
                axis: 'x' | 'y'
            ) => {
                const strength = gsap.utils.clamp(1, 9, mouseLevel) / 9;
                const input = axis === 'x' ? mouseX : mouseY;
                return maxScroll * 0.2 * strength * input;
            };

            /* ---------- FOG DRIFT ---------- */

            [smoke, smokeBack, smokeMid, smokeFront].forEach((el, i) => {
                if (!el) return;
                gsap.to(el, {
                    xPercent: -20,
                    duration: 20 + i * 5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            });

            /* ---------- TICK LOOP ---------- */

            const tick = () => {
                // BACKGROUND
                bgSet.y(scrollValue(1, 30, 1) + mouseValue(30, 2, 'y'));
                bgSet.x(mouseValue(30, 2, 'x'));

                l0Set.y(scrollValue(2, 100, 1) + mouseValue(50, 2, 'y'));
                l0Set.x(mouseValue(50, 2, 'x'));

                // ENVIRONMENT
                l1Set.y(
                    scrollValue(5, 120, 1) + mouseValue(100, 4, 'y')
                );
                l1Set.x(mouseValue(100, 4, 'x'));

                l4Set.y(
                    scrollValue(5, 80, 1) + mouseValue(120, 4, 'y')
                );
                l4Set.x(mouseValue(120, 4, 'x'));

                l3Set.y(
                    scrollValue(4, 90, 1) + mouseValue(80, 3, 'y')
                );
                l3Set.x(mouseValue(80, 3, 'x'));

                // l5ACTER
                l5Set.y(
                    scrollValue(6, 10, 1) + mouseValue(200, 8, 'y')
                );
                l5Set.x(mouseValue(200, 8, 'x'));

                l6Set.y(
                    scrollValue(9, 80, -1) + mouseValue(320, 15, 'y')
                );
                l6Set.x(mouseValue(320, 15, 'x'));

                // SMOKE BREATHING
                const breathe = Math.sin(gsap.ticker.time * 0.5) * 15;

                smokeBackSet.y(
                    scrollValue(3, 40, -1) +
                    breathe * 0.5 +
                    mouseValue(40, 2, 'y')
                );
                smokeBackSet.x(mouseValue(40, 2, 'x'));

                smokeMidSet.y(
                    scrollValue(5, 60, -1) +
                    breathe +
                    mouseValue(60, 4, 'y')
                );
                smokeMidSet.x(mouseValue(60, 4, 'x'));

                smokeFrontSet.y(
                    scrollValue(7, 100, -1) +
                    breathe * 1.5 +
                    mouseValue(100, 6, 'y')
                );
                smokeFrontSet.x(mouseValue(100, 6, 'x'));
            };

            gsap.ticker.add(tick);

            /* ---------- SCROLL ---------- */

            ScrollTrigger.create({
                trigger: frame,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: self => {
                    scrollP = self.progress;
                },
            });
        }, frame);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            ctx.revert();
        };
    }, []);

    /* ---------- JSX ---------- */

    return (
        <main className={base.page}>
            <section ref={frameRef} className={base.frame}>
                <div className={`${base.wrap} ${styles.bgWrap}`}>
                    <img src="/assets/scene2/s2bg.webp" className="bg" />
                </div>

                <div className={`${base.wrap} ${styles.l0Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer.webp"
                        className="l0"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                <div className={`${base.wrap} ${styles.l1Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer1.webp"
                        className="l1"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                <div className={`${base.wrap} ${styles.l3Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer3.webp"
                        className="l3"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                <div className={`${base.wrap} ${styles.l4Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer4.webp"
                        className="l4"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                <div className={`${base.wrap} ${styles.l5Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer5.webp"
                        className="l5"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                <div className={`${base.wrap} ${styles.l6Wrap}`}>
                    <img
                        src="/assets/scene2/s2layer6.webp"
                        className="l6"
                        data-shake="true"
                        data-shake-strength="0.4"
                    />
                </div>

                {/* Enter Website Button */}
                {onEnterWebsite && (
                    <button
                        className="enter-website-btn"
                        onClick={onEnterWebsite}
                    >
                        <span className="enter-website-btn__icon">⚡</span>
                        <span className="enter-website-btn__text">Enter Website</span>
                        <span className="enter-website-btn__arrow">↓</span>
                    </button>
                )}

            </section>

            <style jsx>{`
                @import url('https://fonts.cdnfonts.com/css/itc-benguiat');

                .enter-website-btn {
                    position: fixed;
                    bottom: 60px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    
                    padding: 1rem 2.5rem;
                    background: linear-gradient(180deg, rgba(196, 30, 58, 0.9) 0%, rgba(139, 0, 0, 0.9) 100%);
                    border: 2px solid #c41e3a;
                    border-radius: 0;
                    
                    color: #fff;
                    font-family: 'ITC Benguiat', 'Times New Roman', serif;
                    font-size: 1.1rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    
                    cursor: pointer;
                    transition: all 0.3s ease;
                    
                    box-shadow: 
                        0 0 30px rgba(196, 30, 58, 0.5),
                        0 0 60px rgba(196, 30, 58, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    
                    animation: btnPulse 2s ease-in-out infinite;
                }

                @keyframes btnPulse {
                    0%, 100% {
                        box-shadow: 
                            0 0 30px rgba(196, 30, 58, 0.5),
                            0 0 60px rgba(196, 30, 58, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1);
                        transform: translateX(-50%) skewX(0deg);
                    }
                    2% {
                        transform: translateX(-50%) skewX(10deg);
                        box-shadow: 
                             -2px 0 #00ffff, 
                             2px 0 #ff00ff;
                    }
                    4% {
                        transform: translateX(-50%) skewX(-10deg);
                        box-shadow: 
                             -2px 0 #ff00ff, 
                             2px 0 #00ffff;
                    }
                    5% {
                        transform: translateX(-50%) skewX(0deg);
                        box-shadow: 
                             0 0 30px rgba(196, 30, 58, 0.5),
                             0 0 60px rgba(196, 30, 58, 0.3),
                             inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    }
                    50% {
                        box-shadow: 
                            0 0 40px rgba(196, 30, 58, 0.7),
                            0 0 80px rgba(196, 30, 58, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    }
                }

                .enter-website-btn:hover {
                    background: linear-gradient(180deg, rgba(212, 42, 70, 0.95) 0%, rgba(160, 16, 16, 0.95) 100%);
                    transform: translateX(-50%) scale(1.05);
                    box-shadow: 
                        0 0 50px rgba(196, 30, 58, 0.7),
                        0 0 100px rgba(196, 30, 58, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    animation: btnPulse 0.2s infinite; /* rapid glitch on hover */
                }

                .enter-website-btn__icon {
                    font-size: 1.3rem;
                }

                .enter-website-btn__text {
                    font-weight: 400;
                }

                .enter-website-btn__arrow {
                    font-size: 1.2rem;
                    animation: arrowBounce 1s ease-in-out infinite;
                }

                @keyframes arrowBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(4px); }
                }
            `}</style>
        </main>
    );
}

