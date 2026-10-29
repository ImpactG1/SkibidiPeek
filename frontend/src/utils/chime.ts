let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!audioCtx) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
        void audioCtx.resume();
    }

    return audioCtx;
}

/**
 * Plays a bright, cheerful streamer notification chime using Web Audio API synthesis.
 * Has zero external file dependencies and produces a crisp, pleasing chord arpeggio.
 *
 * @param volume Volume between 0 and 1 (default 0.7)
 */
export function playDonationChime(volume = 0.7): void {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Arpeggio notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [
        { freq: 523.25, time: 0.0, duration: 0.45 },
        { freq: 659.25, time: 0.08, duration: 0.45 },
        { freq: 783.99, time: 0.16, duration: 0.5 },
        { freq: 1046.5, time: 0.24, duration: 0.85 },
    ];

    for (const note of notes) {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Sine wave for clean bell-like chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

        const startTime = ctx.currentTime + note.time;
        const stopTime = startTime + note.duration;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(stopTime);

        // Add a gentle second harmonic for richness
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(note.freq * 2, ctx.currentTime);

        overtoneGain.gain.setValueAtTime(0, startTime);
        overtoneGain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

        overtone.connect(overtoneGain);
        overtoneGain.connect(masterGain);

        overtone.start(startTime);
        overtone.stop(stopTime);
    }
}
