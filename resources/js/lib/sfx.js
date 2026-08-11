// Efek suara: pakai file custom hasil upload admin kalau ada, kalau tidak
// fallback ke suara sintesis Web Audio API (tanpa file eksternal sama sekali).

let audioCtx = null;
let customSounds = {
    attack: null, hit: null, win: null, lose: null,
    pick: null, battleStart: null, pokemonFaint: null, enemyFaint: null,
    gacha: null, gachaLegendary: null,
};

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

/**
 * Suara saat trainer dipilih. Bisa override per-trainer (pick_sound_url),
 * kalau tidak ada pakai default global, kalau masih tidak ada baru sintesis.
 */
export function playPickSound(overrideUrl) {
    const url = overrideUrl || customSounds.pick;
    if (url) return playCustom(url);

    playTone(660, 0.1, 'sine', 0, 0.15);
    playTone(880, 0.15, 'sine', 0.08, 0.18);
}

export function playBattleStartSound() {
    if (customSounds.battleStart) return playCustom(customSounds.battleStart);

    playTone(220, 0.12, 'sawtooth', 0, 0.15);
    playTone(330, 0.12, 'sawtooth', 0.1, 0.15);
    playTone(440, 0.25, 'square', 0.2, 0.18);
}

export function playPokemonFaintSound() {
    if (customSounds.pokemonFaint) return playCustom(customSounds.pokemonFaint);

    const notes = [440, 370, 293, 220];
    notes.forEach((freq, i) => playTone(freq, 0.22, 'sine', i * 0.09, 0.13));
}

export function playEnemyFaintSound() {
    if (customSounds.enemyFaint) return playCustom(customSounds.enemyFaint);

    const notes = [440, 554, 659];
    notes.forEach((freq, i) => playTone(freq, 0.18, 'triangle', i * 0.08, 0.16));
}

export function playGachaSound() {
    if (customSounds.gacha) return playCustom(customSounds.gacha);

    const notes = [523.25, 587.33, 659.25, 783.99];
    notes.forEach((freq, i) => playTone(freq, 0.2, 'sine', i * 0.07, 0.14));
}

/**
 * Suara spesial buat gacha tier Legendaris — lebih megah, lebih panjang,
 * beberapa nada bertumpuk biar terasa "mewah".
 */
export function playGachaLegendarySound() {
    if (customSounds.gachaLegendary) return playCustom(customSounds.gachaLegendary);

    const ctx = getCtx();
    if (!ctx) return;

    // Arpeggio naik panjang
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => playTone(freq, 0.4, 'triangle', i * 0.1, 0.16));

    // Lapisan drone rendah biar terasa lebih megah/gold
    playTone(196, 1.2, 'sawtooth', 0, 0.08);
    playTone(261.63, 1.2, 'sawtooth', 0.05, 0.06);
}
