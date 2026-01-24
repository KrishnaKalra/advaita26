'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import base from '@/styles/parallax.base.module.css';
import styles from '@/styles/parallax.scene3.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SceneThree({
    onActivate,
    registerShakeTargets,
    onScrollProgress,
}: {
    onActivate: () => void;
    registerShakeTargets: (targets: HTMLElement[]) => void;
    onScrollProgress: (p: number) => void;
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

            const s3bg = q('.s3bg');
            const s3bg2 = q('.s3bg2');

            const s3building = q('.s3building');
            const s3temple = q('.s3temple');
            const s3ferris = q('.s3ferris');
            const s3college = q('.s3college');

            const s3char = q('.s3char');

            const smoke = q('.smoke');
            const smokeBack = q('.smokeBack');
            const smokeMid = q('.smokeMid');
            const smokeFront = q('.smokeFront');

            const s3fg0 = q('.s3fg0');
            const s3fg = q('.s3fg');

            /* ---------- INERTIA ---------- */

            const inert = (el: Element | null, duration = 4.0) =>
                el
                    ? {
                        x: gsap.quickTo(el, 'x', { duration, ease: 'power4.out' }),
                        y: gsap.quickTo(el, 'y', { duration, ease: 'power4.out' }),
                    }
                    : { x: () => { }, y: () => { } };

            const s3bgSet = inert(s3bg, 6);
            const s3bg2Set = inert(s3bg2, 5.5);

            const s3collegeSet = inert(s3college, 4.5);
            const s3buildingSet = inert(s3building, 4.8);
            const s3templeSet = inert(s3temple, 4.8);

            const s3ferrisSet = inert(s3ferris, 5);
            const s3charSet = inert(s3char, 6);

            const smokeBackSet = inert(smokeBack, 7);
            const smokeMidSet = inert(smokeMid, 6.5);
            const smokeFrontSet = inert(smokeFront, 6);
            const smokeSet = inert(smoke, 6.5);

            const s3fg0Set = inert(s3fg0, 4);
            const s3fgSet = inert(s3fg, 3.8);

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
                s3bgSet.y(scrollValue(1, 30, 1) + mouseValue(30, 2, 'y'));
                s3bgSet.x(mouseValue(30, 2, 'x'));

                s3bg2Set.y(scrollValue(2, 50, -1) + mouseValue(50, 2, 'y'));
                s3bg2Set.x(mouseValue(50, 2, 'x'));

                // ENVIRONMENT
                s3collegeSet.y(scrollValue(4, 100, -1) + mouseValue(90, 3, 'y'));
                s3collegeSet.x(mouseValue(90, 3, 'x'));

                s3buildingSet.y(scrollValue(5, 80, -1) + mouseValue(100, 4, 'y'));
                s3buildingSet.x(mouseValue(100, 4, 'x'));

                s3templeSet.y(scrollValue(5, 90, -1) + mouseValue(120, 4, 'y'));
                s3templeSet.x(mouseValue(120, 4, 'x'));

                s3ferrisSet.y(scrollValue(4, 80, -1) + mouseValue(80, 3, 'y'));
                s3ferrisSet.x(mouseValue(80, 3, 'x'));

                // s3charACTER
                s3charSet.y(scrollValue(6, 50, -1) + mouseValue(160, 6, 'y'));
                s3charSet.x(mouseValue(160, 6, 'x'));

                // FOREGROUND
                s3fg0Set.y(scrollValue(8, 120, -1) + mouseValue(120, 8, 'y'));
                s3fg0Set.x(mouseValue(120, 8, 'x'));

                s3fgSet.y(scrollValue(9, 20, -1) + mouseValue(80, 9, 'y'));
                s3fgSet.x(mouseValue(80, 9, 'x'));

                // SMOKE BREATHING
                const breathe = Math.sin(gsap.ticker.time * 0.5) * 15;

                smokeBackSet.y(
                    scrollValue(3, 40, -1) + breathe * 0.5 + mouseValue(40, 2, 'y')
                );
                smokeBackSet.x(mouseValue(40, 2, 'x'));

                smokeMidSet.y(
                    scrollValue(5, 60, -1) + breathe + mouseValue(60, 4, 'y')
                );
                smokeMidSet.x(mouseValue(60, 4, 'x'));

                smokeFrontSet.y(
                    scrollValue(7, 100, -1) + breathe * 1.5 + mouseValue(100, 6, 'y')
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
                    onScrollProgress(self.progress);
                },
            });
        }, frame);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            ctx.revert();
        };
    }, [onActivate]);

    /* ---------- JSX (UNCHANGED) ---------- */

    return (
        <main className={base.page}>
            <div className="grain" />

            <section
                ref={frameRef}
                className={`${base.frame} ${styles.sceneFrame}`}
            >

                <div className={`${base.wrap} ${styles.s3bgWrap}`}>
                    <img src="/assets/scene3/s3bg.webp" className="s3bg" />
                </div>

                <div className={`${base.wrap} ${styles.s3bg2Wrap}`}>
                    <img src="/assets/scene3/s3bg2.webp" className="s3bg2" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.s3buildingWrap}`}>
                    <img src="/assets/scene3/s3building.webp" className="s3building" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.s3templeWrap}`}>
                    <img src="/assets/scene3/s3temple.webp" className="s3temple" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.s3ferrisWrap}`}>
                    <img src="/assets/scene3/s3ferris.webp" className="s3ferris" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div
                    className={`${base.wrap} ${styles.s3collegeWrap} ${styles.collegeHover}`}
                    onClick={onActivate}
                    style={{ pointerEvents: 'auto' }}
                >

                    <div className={styles.s3collegeTextBack}>ENTER</div>

                    <img
                        src="/assets/scene3/s3college.webp"
                        className={styles.s3college}
                        data-shake="true" data-shake-strength="0.4" />


                    <div className={styles.collegeTextFront}>GATE</div>
                </div>

                {/* --- ADVAITA TEXT (Behind Character) --- */}
                <div className={`${base.wrap} ${styles.advaitaTextWrap}`}>
                    <h1 className={styles.advaitaText}>Advaita</h1>
                </div>

                <div className={`${base.wrap} ${styles.s3charWrap}`}>
                    <img src="/assets/scene3/s3char.webp" className="s3char" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.smokeWrap}`}>
                    <img src="/assets/smoke.webp" className="smoke" />
                </div>

                <div className={`${base.wrap} ${styles.s3fg0Wrap}`}>
                    <img src="/assets/scene3/s3fg0.webp" className="s3fg0" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.s3fgWrap}`}>
                    <img src="/assets/scene3/s3fg.webp" className="s3fg" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.smokeBackWrap}`}>
                    <img src="/assets/smoke.webp" className="smokeBack" />
                </div>

                <div className={`${base.wrap} ${styles.smokeMidWrap}`}>
                    <img src="/assets/smoke.webp" className="smokeMid" />
                </div>

                <div className={`${base.wrap} ${styles.smokeFrontWrap}`}>
                    <img src="/assets/smoke.webp" className="smokeFront" />
                </div>
            </section>
        </main>
    );
}
