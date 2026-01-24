'use client';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SceneOne from '@/components/scenes/SceneOne';
import SceneTwo from '@/components/scenes/SceneTwo';
import SceneThree from '../scenes/SceneThree';
import Navbar from '@/components/core/Navbar';
import MainContent from '@/components/core/MainContent';
import MusicPlayer from '@/components/core/MusicPlayer';
import { registerMusic, playMusic, unlockAudio, playSFX, isUnlocked } from '@/components/core/audio';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

interface SceneManagerProps {
    skipIntro?: boolean;
}

export default function SceneManager({ skipIntro = false }: SceneManagerProps) {
    /* ---------- REFS ---------- */
    const shakeTargets = useRef<HTMLElement[]>([]);
    const seam12Ref = useRef<HTMLDivElement>(null); // Scene 1 → 2
    const seam23Ref = useRef<HTMLDivElement>(null); // Scene 2 → 3
    const sceneTwoRef = useRef<HTMLDivElement>(null);
    const sceneThreeRef = useRef<HTMLDivElement>(null);

    /* ---------- STATE ---------- */
    const [showIntro, setShowIntro] = useState(!skipIntro);
    // Phase 1: Scene 1 visible, others hidden
    // Phase 2: Scene 1 & 2 visible
    // Phase 3: All scenes (Scene 3) visible
    const [activePhase, setActivePhase] = useState(skipIntro ? 3 : 1);
    const introRemovedRef = useRef(false);

    /* ---------- HANDLE ENTER WEBSITE ---------- */
    const handleEnterWebsite = () => {
        if (introRemovedRef.current) return;

        // Unlock audio specifically for Chrome autoplay policies
        unlockAudio();

        // Progress to Phase 3 (unlock Scene 3)
        setActivePhase(3);

        // Wait a frame for DOM to update so Scene 3 exists
        setTimeout(() => {
            introRemovedRef.current = true;

            // Play Scene 3 music explicitly
            playMusic('scene3');

            // Scroll to Scene 3 first
            if (sceneThreeRef.current) {
                gsap.to(window, {
                    scrollTo: sceneThreeRef.current.offsetTop,
                    duration: 1.5,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        // Remove intro after scroll completes
                        setShowIntro(false);
                        // Reset scroll to top since Scene 3 is now the top
                        window.scrollTo(0, 0);
                        // Refresh ScrollTrigger after DOM change
                        ScrollTrigger.refresh();
                    }
                });
            } else {
                setShowIntro(false);
                window.scrollTo(0, 0);
                ScrollTrigger.refresh();
            }
        }, 50);
    };

    /* ---------- MUSIC SCROLL TRIGGERS ---------- */
    useEffect(() => {
        if (!showIntro) {
            // If intro is hidden, only play Scene 3 music
            if (isUnlocked()) {
                playMusic('scene3');
            }
            return;
        }

        // Scene 1 music trigger + Thunder
        const trigger1 = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: () => sceneTwoRef.current?.offsetTop ?? window.innerHeight,
            onEnter: () => {
                playMusic('scene1');
            },
            onEnterBack: () => playMusic('scene1'),
        });

        // Scene 1 Thunder Loop (Local management)
        const thunderAudio = new Audio('/audio/sfx/thunder.mp3');
        thunderAudio.loop = true;
        thunderAudio.volume = 0;

        // We only want thunder in Scene 1 (Phase 1)
        if (activePhase === 1 && isUnlocked()) {
            thunderAudio.play().catch(() => { });
            gsap.to(thunderAudio, { volume: 0.3, duration: 2 });
        }

        return () => {
            trigger1.kill();
            // Cleanup Thunder
            thunderAudio.pause();
            thunderAudio.src = '';
        };
    }, [showIntro, activePhase]);

    useEffect(() => {
        if (!showIntro || !sceneTwoRef.current || activePhase < 2) return;

        const trigger2 = ScrollTrigger.create({
            trigger: sceneTwoRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            onEnter: () => playMusic('scene2'),
            onEnterBack: () => playMusic('scene2'),
        });

        return () => {
            trigger2.kill();
        };
    }, [showIntro, activePhase]);

    useEffect(() => {
        if (!sceneThreeRef.current || activePhase < 3) return;

        const trigger3 = ScrollTrigger.create({
            trigger: sceneThreeRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            onEnter: () => playMusic('scene3'),
            onEnterBack: () => playMusic('scene3'),
        });

        // Auto-remove intro when Scene 3 is fully at top
        let introRemoveTrigger: ScrollTrigger | null = null;
        if (showIntro) {
            introRemoveTrigger = ScrollTrigger.create({
                trigger: sceneThreeRef.current,
                start: 'top top',
                onEnter: () => {
                    if (!introRemovedRef.current) {
                        introRemovedRef.current = true;
                        setShowIntro(false);
                        window.scrollTo(0, 0);
                        ScrollTrigger.refresh();
                    }
                },
            });
        }

        return () => {
            trigger3.kill();
            if (introRemoveTrigger) introRemoveTrigger.kill();
        };
    }, [showIntro, activePhase]);

    /* ---------- PRELOAD SFX ---------- */
    useEffect(() => {
        // Preload earthquake to avoid lag
        const eq = new Audio('/audio/sfx/erathquake.mp3');
        eq.preload = 'auto';
        eq.load();
    }, []);

    /* ---------- FORCE START AT TOP ---------- */
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    /* ---------- EARTHQUAKE STATE (REF-BASED) ---------- */
    const quakeTime = useRef(0);
    const quakeAmplitude = useRef(0.2);
    const quakeFrequency = useRef(0.5);

    /* ---------- EARTHQUAKE LOOP (RAF, SCROLL-INDEPENDENT) ---------- */
    const updateEarthquake = () => {
        quakeTime.current += 0.016 * quakeFrequency.current;

        shakeTargets.current.forEach(el => {
            // Check if element is still in DOM
            if (!el.isConnected) return;

            const strength = Number(el.dataset.shakeStrength ?? 0.5);
            if (strength <= 0) return;

            const seed = Number(el.dataset.shakeSeed ?? 0);
            const amp = quakeAmplitude.current * strength;

            gsap.set(el, {
                yPercent: Math.sin(quakeTime.current * 2.1 + seed) * 3 * amp,
                xPercent: Math.sin(quakeTime.current * 1.4 + seed * 1.3) * 1.6 * amp,
                rotation: Math.sin(quakeTime.current * 1.1 + seed * 0.7) * 0.06 * amp,
            });
        });
    };

    useEffect(() => {
        let rafId: number;

        const loop = () => {
            updateEarthquake();
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, []);

    /* ---------- SEAM ANIMATIONS ---------- */
    useEffect(() => {
        if (!showIntro || !seam12Ref.current || !sceneTwoRef.current || activePhase < 2) return;

        const tween = gsap.fromTo(
            seam12Ref.current,
            { y: 0 },
            {
                y: -200,
                ease: 'none',
                scrollTrigger: {
                    trigger: sceneTwoRef.current,
                    start: 'top 90%',
                    end: 'top top',
                    scrub: true,
                },
            }
        );

        return () => {
            tween.kill();
        };
    }, [showIntro, activePhase]);

    useEffect(() => {
        if (!showIntro || !seam23Ref.current || !sceneThreeRef.current || activePhase < 3) return;

        const tween = gsap.fromTo(
            seam23Ref.current,
            { y: 0 },
            {
                y: -200,
                ease: 'none',
                scrollTrigger: {
                    trigger: sceneThreeRef.current,
                    start: 'top 90%',
                    end: 'top top',
                    scrub: true,
                },
            }
        );

        return () => {
            tween.kill();
        };
    }, [showIntro, activePhase]);

    /* ---------- SCENE SCROLL CALLBACK (REQUIRED BY SCENES) ---------- */
    const handleSceneScroll = (_p: number) => {
        // intentionally empty for now
    };

    /* ---------- CLICK ON COLLEGE (SCENE ONE) ---------- */
    const handleActivate = () => {
        unlockAudio();

        // Immediate SFX
        const sfx = new Audio('/audio/sfx/erathquake.mp3');
        sfx.volume = 0.6;
        sfx.play().catch(e => console.error(e));

        playMusic('scene1');

        quakeAmplitude.current = 0.12;
        quakeFrequency.current = 16;

        // Progress to Phase 2 (unlock Scene 2)
        setActivePhase(2);

        // Wait a small bit for render to happen so Scene 2 exists
        setTimeout(() => {
            ScrollTrigger.refresh();

            gsap.to({}, {
                duration: 5,
                onUpdate: () => {
                    quakeAmplitude.current = gsap.utils.interpolate(0.12, 0.2, 0.015);
                    quakeFrequency.current = gsap.utils.interpolate(16, 0.5, 0.015);
                },
                onComplete: () => {
                    quakeAmplitude.current = 0.2;
                    quakeFrequency.current = 0.5;
                },
            });

            gsap.delayedCall(1, () => {
                if (!sceneTwoRef.current) return;
                gsap.to(window, {
                    scrollTo: sceneTwoRef.current.offsetTop,
                    duration: 4,
                    ease: 'power3.inOut',
                });
            });
        }, 50);
    };

    /* ---------- REGISTER SHAKE TARGETS (SHARED) ---------- */
    const registerShakeTargets = (targets: HTMLElement[]) => {
        shakeTargets.current.push(...targets);

        targets.forEach(el => {
            if (!el.dataset.shakeSeed) {
                el.dataset.shakeSeed = String(Math.random() * 1000);
            }
        });
    };

    /* ---------- RENDER ---------- */
    return (
        <>
            {/* WEBSITE NAVBAR (Only visible in Phase 3) */}
            <div style={{
                opacity: activePhase >= 3 ? 1 : 0,
                pointerEvents: activePhase >= 3 ? 'auto' : 'none',
                transition: 'opacity 1s ease 1s'
            }}>
                <Navbar />
            </div>

            {showIntro && (
                <>
                    {/* SCENE ONE */}
                    <SceneOne
                        onActivate={handleActivate}
                        onScrollProgress={handleSceneScroll}
                        registerShakeTargets={registerShakeTargets}
                    />

                    {/* 🔗 SEAM / TRANSITION IMAGE */}
                    {activePhase >= 2 && (
                        <div
                            ref={seam12Ref}
                            style={{
                                position: 'relative',
                                zIndex: 999,
                                height: 700,
                                marginTop: -400,
                                marginBottom: -300,
                                pointerEvents: 'none',
                            }}
                        >
                            <img
                                src="/assets/trans.webp"
                                alt=""
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '120%',
                                    height: '120%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    )}

                    {/* SCENE TWO */}
                    {activePhase >= 2 && (
                        <div ref={sceneTwoRef}>
                            <SceneTwo
                                onActivate={() => { }}
                                onScrollProgress={handleSceneScroll}
                                registerShakeTargets={registerShakeTargets}
                                onEnterWebsite={handleEnterWebsite}
                            />
                        </div>
                    )}

                    {/* 🔗 SEAM 2 -> 3 */}
                    {activePhase >= 3 && (
                        <div
                            ref={seam23Ref}
                            style={{
                                position: 'relative',
                                zIndex: 999,
                                height: 700,
                                marginTop: -250,
                                marginBottom: -250,
                                pointerEvents: 'none',
                            }}
                        >
                            <img
                                src="/assets/trans.webp"
                                alt=""
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '120%',
                                    height: '120%',
                                    objectFit: 'cover',
                                    transform: 'rotate(180deg)',
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* SCENE THREE - Always visible (main website top) */}
            {(activePhase >= 3 || !showIntro) && (
                <div ref={showIntro ? sceneThreeRef : undefined}>
                    <SceneThree
                        onActivate={handleActivate}
                        onScrollProgress={handleSceneScroll}
                        registerShakeTargets={registerShakeTargets}
                    />
                </div>
            )}

            {/* MAIN WEBSITE CONTENT (Below Scene 3) */}
            {(activePhase >= 3 || !showIntro) && (
                <>
                    <MainContent />

                    {/* Floating Music Player */}
                    <div style={{
                        opacity: activePhase >= 3 ? 1 : 0,
                        pointerEvents: activePhase >= 3 ? 'auto' : 'none',
                        transition: 'opacity 1s ease 2s'
                    }}>
                        <MusicPlayer />
                    </div>
                </>
            )}
        </>
    );
}
