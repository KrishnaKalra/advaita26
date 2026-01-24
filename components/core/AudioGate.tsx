'use client';
import { useState, useEffect, useRef } from 'react';
import { unlockAudio, registerMusic, playMusic } from './audio';
import gsap from 'gsap';

interface AudioGateProps {
  onDone: () => void;
  onSkipToWebsite?: () => void;
}

export default function AudioGate({ onDone, onSkipToWebsite }: AudioGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (flashRef.current) {
        gsap.to(flashRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Animate title letters with individual flickering
    titleLettersRef.current.forEach((letter, index) => {
      gsap.to(letter, {
        delay: index * 0.1,
        duration: 1,
        opacity: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          // Start random flickering per letter
          gsap.to(letter, {
            opacity: 0.6,
            duration: Math.random() * 0.5 + 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 2,
          });
        }
      });
    });
  }, []);

  const enableAudio = async () => {
    setIsLoading(true);
    unlockAudio();
    registerMusic('scene1', '/audio/music/ST_INTRO.mp3', 0.8);
    registerMusic('scene2', '/audio/music/vecna.mp3', 0.8);
    registerMusic('scene3', '/audio/music/Kids.mp3', 0.8);
    await new Promise(resolve => setTimeout(resolve, 100));
    playMusic('scene1');
    onDone();
  };

  const skipToWebsite = async () => {
    setIsLoading(true);
    unlockAudio();
    registerMusic('scene1', '/audio/music/ST_INTRO.mp3', 0.8);
    registerMusic('scene2', '/audio/music/vecna.mp3', 0.8);
    registerMusic('scene3', '/audio/music/Kids.mp3', 0.8);
    await new Promise(resolve => setTimeout(resolve, 100));
    playMusic('scene3');
    if (onSkipToWebsite) onSkipToWebsite();
    else onDone();
  };

  const silent = () => {
    onDone();
  };

  return (
    <div className="audio-gate" ref={containerRef}>
      <div className="audio-gate__bg" />
      <div className="audio-gate__flashlight" ref={flashRef} />
      <div className="audio-gate__vignette" />
      <div className="audio-gate__particles" />
      <div className="audio-gate__vines" />

      <div className="audio-gate__content">
        <div className="audio-gate__logo">
          <h1 className="audio-gate__title">
            {['A', 'D', 'V', 'A', 'I', 'T', 'A'].map((letter, index) => (
              <span
                key={index}
                className="audio-gate__letter"
                ref={(el) => { if (el) titleLettersRef.current[index] = el; }}
                style={{ opacity: 0 }} // Start hidden for animation
              >
                {letter}
              </span>
            ))}
          </h1>
          <div className="audio-gate__year-wrap">
            <span className="audio-gate__year-line"></span>
            <span className="audio-gate__year">2026</span>
            <span className="audio-gate__year-line"></span>
          </div>
        </div>

        <p className="audio-gate__subtitle">
          <span className="audio-gate__flicker">The gate is opening...</span>
        </p>

        <p className="audio-gate__warning">
          HEADPHONES HIGHLY RECOMMENDED
        </p>

        <div className="audio-gate__buttons">
          <button
            className="audio-gate__btn audio-gate__btn--primary"
            onClick={enableAudio}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="audio-gate__loading">SUMMONING...</span>
            ) : (
              <>ENTER THE UPSIDE DOWN</>
            )}
          </button>

          <button
            className="audio-gate__btn audio-gate__btn--secondary"
            onClick={silent}
            disabled={isLoading}
          >
            ENTER IN SILENCE
          </button>

          <div className="audio-gate__skip-divider">
            <span className="audio-gate__skip-line" />
            <span className="audio-gate__skip-text" style={{ fontFamily: '"ITC Benguiat", serif' }}>or</span>
            <span className="audio-gate__skip-line" />
          </div>

          <button
            className="audio-gate__btn audio-gate__btn--skip"
            onClick={skipToWebsite}
            disabled={isLoading}
          >
            SKIP TO WEBSITE →
          </button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.cdnfonts.com/css/itc-benguiat');

        .audio-gate {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          overflow: hidden;
          font-family: 'ITC Benguiat', serif;
          cursor: none;
        }

        .audio-gate__bg {
          position: absolute;
          inset: 0;
          background: #000;
          background-image: 
            linear-gradient(rgba(20,0,0,0.8), rgba(0,0,0,1)),
            url('/assets/bg2.webp'); /* Use existing dark BG as base */
          background-size: cover;
          background-position: center;
          opacity: 0.3;
          animation: bgPulse 10s ease-in-out infinite;
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .audio-gate__flashlight {
          position: absolute;
          top: 0;
          left: 0;
          width: 500px;
          height: 500px;
          margin-left: -250px;
          margin-top: -250px;
          background: radial-gradient(circle, rgba(196, 30, 58, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          z-index: 5;
          filter: blur(30px);
          box-shadow: 0 0 50px rgba(196, 30, 58, 0.5);
        }

        .audio-gate__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 20%, #000 80%);
          pointer-events: none;
          z-index: 6;
        }

        .audio-gate__particles {
          position: absolute;
          inset: 0;
          opacity: 0.7;
          background-image: 
            radial-gradient(3px 3px at 15% 25%, rgba(196, 30, 58, 0.7), transparent),
            radial-gradient(2px 2px at 35% 65%, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(3px 3px at 55% 35%, rgba(196, 30, 58, 0.6), transparent),
            radial-gradient(2px 2px at 75% 75%, rgba(255, 255, 255, 0.4), transparent),
            radial-gradient(1px 1px at 90% 10%, rgba(196, 30, 58, 0.5), transparent),
            radial-gradient(2px 2px at 10% 90%, rgba(255, 255, 255, 0.3), transparent);
          background-size: 200% 200%;
          animation: floatDust 30s linear infinite;
          z-index: 7;
          pointer-events: none;
        }

        @keyframes floatDust {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, 10px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .audio-gate__vines {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(to bottom, transparent, rgba(0,0,0,0.5)),
            url('/assets/vines.png'); /* Assume a vines overlay image for Stranger Things theme */
          background-size: cover;
          background-position: center;
          opacity: 0.2;
          z-index: 4;
          pointer-events: none;
          animation: vineCreep 20s linear infinite;
        }

        @keyframes vineCreep {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        .audio-gate__content {
          position: relative;
          text-align: center;
          color: #c41e3a;
          padding: 2rem;
          max-width: 600px;
          z-index: 20;
          cursor: default;
        }

        .audio-gate__title {
          font-size: clamp(3rem, 12vw, 5.5rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
          color: transparent;
          -webkit-text-stroke: 2px #c41e3a;
          text-shadow: 
            0 0 20px rgba(196, 30, 58, 0.6),
            0 0 40px rgba(196, 30, 58, 0.4);
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 0.5rem;
        }

        .audio-gate__letter {
          display: inline-block;
          position: relative;
          animation: letterFloat 5s ease-in-out infinite;
        }

        .audio-gate__letter:nth-child(odd) {
          animation-delay: 0.5s;
        }

        @keyframes letterFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .audio-gate__letter:nth-child(1) { font-size: 1.2em; transform: translateY(0.05em); }
        .audio-gate__letter:nth-child(7) { font-size: 1.2em; transform: translateY(0.05em); }

        .audio-gate__year-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: -0.5rem;
          margin-bottom: 3rem;
        }

        .audio-gate__year-line {
          height: 2px;
          background: #c41e3a;
          width: 50px;
          box-shadow: 0 0 15px #c41e3a;
          animation: lineGlow 2s ease-in-out infinite;
        }

        @keyframes lineGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .audio-gate__year {
          font-size: 1.5rem;
          letter-spacing: 0.2em;
          color: #c41e3a;
          font-weight: 700;
          text-shadow: 0 0 15px #c41e3a;
        }

        .audio-gate__subtitle {
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          color: #aaa;
          margin-bottom: 3rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .audio-gate__flicker {
          animation: textFlicker 4s infinite steps(1);
        }

        @keyframes textFlicker {
          0%, 100% { opacity: 1; }
          20% { opacity: 0.8; }
          22% { opacity: 0.3; }
          24% { opacity: 1; }
          50% { opacity: 0.6; }
          52% { opacity: 0.2; }
          54% { opacity: 1; }
          56% { opacity: 0.4; }
          90% { opacity: 1; }
          92% { opacity: 0.2; }
          94% { opacity: 1; }
        }

        .audio-gate__warning {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: #ff4444;
          margin-bottom: 2rem;
          opacity: 0.8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: warningPulse 3s infinite;
        }

        @keyframes warningPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .audio-gate__buttons {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          align-items: center;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
        }

        .audio-gate__btn {
          font-family: 'ITC Benguiat', serif;
          font-size: 1.1rem;
          padding: 1rem 2rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .audio-gate__btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .audio-gate__btn:hover::before {
          left: 100%;
        }

        .audio-gate__btn--primary {
          background: transparent;
          color: #c41e3a;
          border: 2px solid #c41e3a;
          box-shadow: 
            0 0 15px rgba(196, 30, 58, 0.2),
            inset 0 0 10px rgba(196, 30, 58, 0.1);
          font-weight: 700;
        }

        .audio-gate__btn--primary:hover:not(:disabled) {
          background: rgba(196, 30, 58, 0.1);
          box-shadow: 
            0 0 30px rgba(196, 30, 58, 0.5),
            inset 0 0 20px rgba(196, 30, 58, 0.3);
          transform: scale(1.02);
          text-shadow: 0 0 8px #c41e3a;
        }

        .audio-gate__btn--secondary {
          background: transparent;
          color: #666;
          border: 1px solid #333;
          font-size: 0.9rem;
        }

        .audio-gate__btn--secondary:hover:not(:disabled) {
          border-color: #666;
          color: #888;
          box-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        .audio-gate__skip-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          color: #444;
          margin: 0.5rem 0;
        }
        
        .audio-gate__skip-line {
          flex: 1;
          height: 1px;
          background: #333;
        }

        .audio-gate__btn--skip {
          background: transparent;
          font-family: 'Courier New', monospace;
          color: #c41e3a;
          font-size: 0.85rem;
          padding: 0.5rem;
          opacity: 0.7;
          border: none;
        }

        .audio-gate__btn--skip:hover:not(:disabled) {
          opacity: 1;
          background: transparent;
          text-shadow: 0 0 5px #c41e3a;
          transform: translateX(5px);
        }

        .audio-gate__loading {
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}