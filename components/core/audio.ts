type Track = {
  audio: HTMLAudioElement;
  targetVolume: number;
};

const tracks: Record<string, Track> = {};
let activeTrack: string | null = null;
let unlocked = false;

export function unlockAudio() {
  unlocked = true;
}

export function isUnlocked() {
  return unlocked;
}

export function registerMusic(id: string, src: string, volume = 1) {
  if (tracks[id]) return;

  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0;
  audio.preload = 'auto';

  // Load the audio to prepare it
  audio.load();

  tracks[id] = {
    audio,
    targetVolume: volume,
  };
}

export function playMusic(id: string, fade = 1.5) {
  if (!unlocked) {
    console.log('[Audio] Not unlocked yet, skipping playMusic');
    return;
  }

  // Always update active track identifier immediately
  const previousTrack = activeTrack;
  activeTrack = id;

  console.log('[Audio] Transitioning to music:', id);

  Object.entries(tracks).forEach(([key, track]) => {
    if (key === id) {
      // Ensure audio is ready to play
      track.audio.volume = 0; // Start fresh for fade-in

      const playPromise = track.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Started playing:', id);
            fadeTo(track.audio, track.targetVolume, fade);
          })
          .catch((error) => {
            console.error('[Audio] Play failed:', error);
            // If play fails (autoplay policy), we might need to retry on next interaction
            // but for now, we just log.
          });
      }
    } else if (key === previousTrack && track.audio.currentTime > 0 && !track.audio.paused) {
      // Fade out previous track
      fadeTo(track.audio, 0, fade, () => {
        track.audio.pause();
        track.audio.currentTime = 0;
      });
    } else {
      // Ensure other tracks are silent/paused
      track.audio.volume = 0;
      track.audio.pause();
    }
  });
}

export function playSFX(src: string, volume = 1) {
  if (!unlocked) return;

  const audio = new Audio(src);
  audio.volume = volume;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.error('[Audio] SFX play failed:', error);
    });
  }
}

export function pauseMusic(id: string) {
  const track = tracks[id];
  if (track && !track.audio.paused) {
    track.audio.pause();
  }
}

export function resumeMusic(id: string) {
  const track = tracks[id];
  if (track && track.audio.paused) {
    track.audio.play().catch(e => console.error("Resume failed", e));
    // Ensure volume is up if it was faded out? 
    // We assume resume is simple toggle. 
    // If we want fail-safe, we make sure volume is target
    if (track.audio.volume < track.targetVolume) {
      track.audio.volume = track.targetVolume;
    }
  }
}

export function setTrackVolume(id: string, vol: number) {
  const track = tracks[id];
  if (track) {
    track.audio.volume = vol;
  }
}

export function setTrackEndedCallback(id: string, callback: () => void) {
  const track = tracks[id];
  if (track) {
    // Remove existing if we want to be safe, but we don't store the ref to remove.
    // Simple append for now is okay as we usually call this once on mount.
    // A better approach for this simple app: `onended` property.
    track.audio.onended = callback;
  }
}

export function getActiveTrackId() {
  return activeTrack;
}

export function getAudioState(id: string) {
  const track = tracks[id];
  if (!track) return null;
  return {
    currentTime: track.audio.currentTime,
    duration: track.audio.duration || 0,
    paused: track.audio.paused,
    volume: track.audio.volume,
  };
}

export function seekMusic(id: string, time: number) {
  const track = tracks[id];
  if (track) {
    track.audio.currentTime = time;
  }
}

function fadeTo(
  audio: HTMLAudioElement,
  target: number,
  duration: number,
  onDone?: () => void
) {
  // Cancel any existing fade on this audio element if we could track it, 
  // but for now simply overwriting the volume loop usually works "okay" 
  // as long as we don't have fighting intervals. 
  // Ideally we'd store the fade interval ID on the track object.

  const start = audio.volume;
  const startTime = performance.now();

  const tick = (now: number) => {
    const elapsed = (now - startTime) / 1000;
    const t = Math.min(elapsed / duration, 1);

    // Ease out cubic
    // const ease = 1 - Math.pow(1 - t, 3); 
    // Linear is often safer for crossfades to avoid dips
    audio.volume = start + (target - start) * t;

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      audio.volume = target; // Ensure exact target hit
      if (onDone) onDone();
    }
  };

  requestAnimationFrame(tick);
}
