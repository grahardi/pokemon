// Efek suara: pakai file custom hasil upload admin kalau ada, kalau tidak
// fallback ke suara sintesis Web Audio API (tanpa file eksternal sama sekali).

let audioCtx = null;
let customSounds = { attack: null, hit: null, win: null, lose: null };

function getCtx() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

/**
 * Panggil ini sekali di awal interaksi user (klik tombol) supaya browser
 * mengizinkan AudioContext aktif (kebijakan autoplay browser modern).
 */
export function unlockAudio() {
    getCtx();
}

/**
 * Set URL suara custom hasil upload admin (dipanggil sekali saat halaman game dimuat).
 * Slot yang null/kosong otomatis fallback ke suara sintesis.
 */
export function setCustomSounds(sounds) {
    customSounds = { ...customSounds, ...sounds };
}

function playCustom(url) {
    try {
        const audio = new Audio(url);
        audio.volume = 0.6;
        audio.play().catch(() => {});
        return true;
    } catch (e) {
        return false;
    }
}

function playTone(freq, duration, type = 'sine', startTime = 0, gainValue = 0.18) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
}

export function playAttackSound() {
    if (customSounds.attack) return playCustom(customSounds.attack);

    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(550, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
}

export function playHitSound() {
    if (customSounds.hit) return playCustom(customSounds.hit);

    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
}

export function playWinSound() {
    if (customSounds.win) return playCustom(customSounds.win);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C — arpeggio mayor, terdengar ceria
    notes.forEach((freq, i) => playTone(freq, 0.3, 'triangle', i * 0.13, 0.2));
}

export function playLoseSound() {
    if (customSounds.lose) return playCustom(customSounds.lose);

    const notes = [392, 349.23, 293.66, 261.63]; // menurun, terdengar sendu
    notes.forEach((freq, i) => playTone(freq, 0.35, 'sawtooth', i * 0.16, 0.14));
}
