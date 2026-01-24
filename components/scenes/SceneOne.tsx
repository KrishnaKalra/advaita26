'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import base from '@/styles/parallax.base.module.css';
import styles from '@/styles/parallax.scene1.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SceneOne({
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

            const bg = q('.bg');
            const bg2 = q('.bg2');

            const building = q('.building');
            const temple = q('.temple');
            const ferris = q('.ferris');
            const college = q('.collegeImg');

            const char = q('.char');

            const smoke = q('.smoke');
            const smokeBack = q('.smokeBack');
            const smokeMid = q('.smokeMid');
            const smokeFront = q('.smokeFront');

            const fg0 = q('.fg0');
            const fg = q('.fg');

            /* ---------- INERTIA ---------- */

            const inert = (el: Element | null, duration = 4.0) =>
                el
                    ? {
                        x: gsap.quickTo(el, 'x', { duration, ease: 'power4.out' }),
                        y: gsap.quickTo(el, 'y', { duration, ease: 'power4.out' }),
                    }
                    : { x: () => { }, y: () => { } };

            const bgSet = inert(bg, 6);
            const bg2Set = inert(bg2, 5.5);

            const collegeSet = inert(college, 4.5);
            const buildingSet = inert(building, 4.8);
            const templeSet = inert(temple, 4.8);

            const ferrisSet = inert(ferris, 5);
            const charSet = inert(char, 6);

            const smokeBackSet = inert(smokeBack, 7);
            const smokeMidSet = inert(smokeMid, 6.5);
            const smokeFrontSet = inert(smokeFront, 6);
            const smokeSet = inert(smoke, 6.5);

            const fg0Set = inert(fg0, 4);
            const fgSet = inert(fg, 3.8);

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

                bg2Set.y(scrollValue(2, 50, -1) + mouseValue(50, 2, 'y'));
                bg2Set.x(mouseValue(50, 2, 'x'));

                // ENVIRONMENT
                collegeSet.y(scrollValue(4, 90, -1) + mouseValue(90, 3, 'y'));
                collegeSet.x(mouseValue(90, 3, 'x'));

                buildingSet.y(scrollValue(5, 100, -1) + mouseValue(100, 4, 'y'));
                buildingSet.x(mouseValue(100, 4, 'x'));

                templeSet.y(scrollValue(5, 120, -1) + mouseValue(120, 4, 'y'));
                templeSet.x(mouseValue(120, 4, 'x'));

                ferrisSet.y(scrollValue(4, 80, -1) + mouseValue(80, 3, 'y'));
                ferrisSet.x(mouseValue(80, 3, 'x'));

                // CHARACTER
                charSet.y(scrollValue(6, 160, -1) + mouseValue(160, 6, 'y'));
                charSet.x(mouseValue(160, 6, 'x'));

                // FOREGROUND
                fg0Set.y(scrollValue(8, 120, -1) + mouseValue(120, 8, 'y'));
                fg0Set.x(mouseValue(120, 8, 'x'));

                fgSet.y(scrollValue(9, 80, -1) + mouseValue(80, 9, 'y'));
                fgSet.x(mouseValue(80, 9, 'x'));

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

                <div className={`${base.wrap} ${styles.bgWrap}`}>
                    <img src="/assets/bg.webp" className="bg" />
                </div>

                <div className={`${base.wrap} ${styles.bg2Wrap}`}>
                    <img src="/assets/bg2.webp" className="bg2" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.buildingWrap}`}>
                    <img src="/assets/building.webp" className="building" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.templeWrap}`}>
                    <img src="/assets/temple.webp" className="temple" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.ferrisWrap}`}>
                    <img src="/assets/ferris.webp" className="ferris" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div
                    className={`${base.wrap} ${styles.collegeWrap} ${styles.collegeHover}`}
                    onClick={onActivate}
                    style={{ pointerEvents: 'auto' }}
                >

                    <div className={styles.collegeTextBack}>ENTER</div>

                    <img
                        src="/assets/college.webp"
                        className={styles.collegeImg}
                        data-shake="true" data-shake-strength="0.4" />


                    <div className={styles.collegeTextFront}>GATE</div>
                </div>

                <div className={`${base.wrap} ${styles.charWrap}`}>
                    <img src="/assets/char.webp" className="char" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.smokeWrap}`}>
                    <img src="/assets/smoke.webp" className="smoke" />
                </div>

                <div className={`${base.wrap} ${styles.fg0Wrap}`}>
                    <img src="/assets/fg0.webp" className="fg0" data-shake="true" data-shake-strength="0.4" />

                </div>

                <div className={`${base.wrap} ${styles.fgWrap}`}>
                    <img src="/assets/fg.webp" className="fg" data-shake="true" data-shake-strength="0.4" />

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
