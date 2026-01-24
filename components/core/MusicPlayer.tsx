'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { registerMusic, playMusic, pauseMusic, resumeMusic, setTrackEndedCallback } from './audio';
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
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // NEW: State for the static glitch effect
    const [isChangingTrack, setIsChangingTrack] = useState(false);
    
    const hasInitRef = useRef(false);

    // Helper to trigger the static flash
    const triggerStatic = () => {
        setIsChangingTrack(true);
        setTimeout(() => setIsChangingTrack(false), 300); // Flash for 300ms
    };

    const changeTrack = useCallback((direction: 'next' | 'prev') => {
        triggerStatic(); // Trigger visual noise
        
        // Small timeout to allow the static to cover the text change visually
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 0; 
                    return prev + 0.55; 
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentIndex]);

    const currentTrack = PLAYLIST[currentIndex];

    const handleToggle = () => {
        if (isPlaying) {
            pauseMusic(currentTrack.id);
            setIsPlaying(false);
        } else {
            resumeMusic(currentTrack.id);
            setIsPlaying(true);
        }
    };

    return (
        <div
            className={`${styles.container} ${isHovered ? styles.expanded : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* NEW: TV STATIC OVERLAY */}
            <div className={`${styles.staticOverlay} ${isChangingTrack ? styles.activeStatic : ''}`} />

            {/* Liquid Layer */}
            <div className={styles.liquidContainer} style={{ height: `${progress}%` }}>
                <div className={styles.liquidBody} />
            </div>

            {/* Spore Background */}
            <div className={styles.spores} />

            {/* Icon */}
            <div className={styles.iconWrap} onClick={handleToggle}>
                <div className={`${styles.cassette} ${isPlaying ? styles.spinning : ''}`}>
                    <div className={styles.tapeWheel} />
                    <div className={styles.tapeWheel} />
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.trackInfo}>
                    <span className={styles.trackName}>{currentTrack.title}</span>
                    <span className={styles.artistName}>{currentTrack.artist}</span>
                </div>

                <div className={styles.buttons}>
                    <button onClick={(e) => { e.stopPropagation(); changeTrack('prev'); }} className={styles.btn}>
                        <FaStepBackward />
                    </button>
                    
                    <button onClick={(e) => { e.stopPropagation(); handleToggle(); }} className={`${styles.btn} ${styles.playBtn}`}>
                        {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: '2px' }} />}
                    </button>
                    
                    <button onClick={(e) => { e.stopPropagation(); changeTrack('next'); }} className={styles.btn}>
                        <FaStepForward />
                    </button>
                </div>
            </div>
        </div>
    );
}