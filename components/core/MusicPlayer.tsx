'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    registerMusic,
    playMusic,
    pauseMusic,
    resumeMusic,
    setTrackEndedCallback,
    getAudioState,
    seekMusic,
    getActiveTrackId
} from './audio';
import styles from '@/styles/MusicPlayer.module.css';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const PLAYLIST = [
    { id: 'scene3', title: 'Kids', artist: 'Stranger Things Score', src: '/audio/music/Kids.mp3' },
    { id: 'track2', title: 'End Of Beginning', artist: 'Djo', src: '/audio/music/End of Beginning.mp3' },
    { id: 'track3', title: 'Running Up That Hill', artist: 'Kate Bush', src: '/audio/music/Running Up That Hill.mp3' },
    { id: 'track4', title: 'Every Breath You Take', artist: 'The Police', src: '/audio/music/Every Breath You Take.mp3' },
];

export default function MusicPlayer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // VU Meter state
    const [vuLevels, setVuLevels] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

    // State for the static glitch effect
    const [isChangingTrack, setIsChangingTrack] = useState(false);

    const hasInitRef = useRef(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Helper to trigger the static flash
    const triggerStatic = () => {
        setIsChangingTrack(true);
        setTimeout(() => setIsChangingTrack(false), 300);
    };

    const changeTrack = useCallback((direction: 'next' | 'prev') => {
        triggerStatic();

        setTimeout(() => {
            setCurrentIndex(prev => {
                let newIndex = prev + (direction === 'next' ? 1 : -1);
                if (newIndex >= PLAYLIST.length) newIndex = 0;
                if (newIndex < 0) newIndex = PLAYLIST.length - 1;

                const newTrack = PLAYLIST[newIndex];
                playMusic(newTrack.id);
                return newIndex;
            });
            setIsPlaying(true);
            setProgress(0);
        }, 100);
    }, []);

    useEffect(() => {
        PLAYLIST.forEach(track => {
            if (track.id !== 'scene3') {
                registerMusic(track.id, track.src, 0.8);
            }
            setTrackEndedCallback(track.id, () => changeTrack('next'));
        });
        hasInitRef.current = true;
    }, [changeTrack]);

    // Sync state and simulate VU meter
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTrack = PLAYLIST[currentIndex];
            const state = getAudioState(currentTrack.id);

            if (state) {
                const p = (state.currentTime / state.duration) * 100;
                setProgress(isNaN(p) ? 0 : p);
                setCurrentTime(state.currentTime);
                setDuration(state.duration);
                setIsPlaying(!state.paused);

                // Simulate VU Meter levels if playing
                if (!state.paused) {
                    setVuLevels(prev => prev.map(() => Math.random() * 100));
                } else {
                    setVuLevels(prev => prev.map(l => l * 0.8)); // Fade out
                }

                // Sync track ID
                const activeId = getActiveTrackId();
                if (activeId && activeId !== currentTrack.id) {
                    const foundIndex = PLAYLIST.findIndex(t => t.id === activeId);
                    if (foundIndex !== -1) {
                        setCurrentIndex(foundIndex);
                    }
                }
            }
        }, 150);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const currentTrack = PLAYLIST[currentIndex];

    const handleToggle = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isPlaying) {
            pauseMusic(currentTrack.id);
            setIsPlaying(false);
        } else {
            resumeMusic(currentTrack.id);
            setIsPlaying(true);
        }
    };

    const handleScrub = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!progressBarRef.current || duration === 0) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, x / width));
        const newTime = percentage * duration;

        seekMusic(currentTrack.id, newTime);
        setProgress(percentage * 100);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => !window.matchMedia("(max-width: 768px)").matches && setIsExpanded(true)}
            onMouseLeave={() => !window.matchMedia("(max-width: 768px)").matches && setIsExpanded(false)}
        >
            {/* TV STATIC OVERLAY */}
            <div className={`${styles.staticOverlay} ${isChangingTrack ? styles.activeStatic : ''}`} />

            {/* Industrial Chassis Details */}
            <div className={styles.screw} style={{ top: '8px', left: '8px' }} />
            <div className={styles.screw} style={{ top: '8px', right: '8px' }} />
            <div className={styles.screw} style={{ bottom: '8px', left: '8px' }} />
            <div className={styles.screw} style={{ bottom: '8px', right: '8px' }} />

            {/* Cassette Icon Wrap */}
            <div className={styles.iconWrap} onClick={handleToggle}>
                <div className={`${styles.cassette} ${isPlaying ? styles.spinning : ''}`}>
                    <div className={styles.tapeWindow}>
                        <div className={styles.reel}>
                            <div className={styles.spoke} />
                        </div>
                        <div className={styles.reel}>
                            <div className={styles.spoke} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className={styles.controls}>
                {/* VU Meter & LED Display Row */}
                <div className={styles.topDisplay}>
                    <div className={styles.vuMeter}>
                        {vuLevels.map((level, i) => (
                            <div key={i} className={styles.vuBarContainer}>
                                <div
                                    className={styles.vuBarFill}
                                    style={{ height: `${level}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={styles.ledDisplay}>
                        <div className={styles.displayGlow} />
                        <div className={styles.displayText}>
                            <span className={styles.trackLabel}>TAPE_0{currentIndex + 1}</span>
                            <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.trackInfo}>
                    <div className={styles.titleRow}>
                        <span className={styles.trackName}>{currentTrack.title}</span>
                    </div>
                    <span className={styles.artistName}>{currentTrack.artist}</span>
                </div>

                {/* Scrubber / Tape Progress */}
                <div
                    className={styles.scrubberContainer}
                    onClick={handleScrub}
                    ref={progressBarRef}
                >
                    <div className={styles.scrubberBg} />
                    <div className={styles.scrubFill} style={{ width: `${progress}%` }} />
                    <div className={styles.scrubHandle} style={{ left: `${progress}%` }} />
                </div>

                {/* Mechanical Buttons Section */}
                <div className={styles.buttons}>
                    <div className={styles.btnGroup}>
                        <button onClick={(e) => { e.stopPropagation(); changeTrack('prev'); }} className={styles.btn}>
                            <FaStepBackward />
                            <span className={styles.btnLabel}>REW</span>
                        </button>
                    </div>

                    <div className={styles.btnGroup}>
                        <button onClick={handleToggle} className={`${styles.btn} ${styles.playBtn} ${isPlaying ? styles.btnActive : ''}`}>
                            {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: '2px' }} />}
                            <span className={styles.btnLabel}>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                        </button>
                    </div>

                    <div className={styles.btnGroup}>
                        <button onClick={(e) => { e.stopPropagation(); changeTrack('next'); }} className={styles.btn}>
                            <FaStepForward />
                            <span className={styles.btnLabel}>F.FWD</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Visual Balance/Texture */}
            <div className={styles.meshTexture} />
        </div>
    );
}
