import { getEffectiveness } from '../data/typeChart';

const LEVEL = 50;
const HP_MULTIPLIER = 2; // biar HP pool terasa cukup untuk battle multi-giliran

export function battleMaxHp(pokemon) {
    return Math.floor(pokemon.hp * HP_MULTIPLIER);
}

/**
 * Hitung damage pakai formula Pokemon yang disederhanakan (level tetap 50).
 * Return { damage, effectiveness, isStab, missed }
 */
export function calculateDamage(attacker, defender, move) {
    // Cek akurasi
    const accuracy = move.accuracy ?? 100;
    const missed = Math.random() * 100 > accuracy;
    if (missed) {
        return { damage: 0, effectiveness: 1, isStab: false, missed: true };
    }

    const isPhysical = move.category === 'Physical';
    const atkStat = isPhysical ? attacker.attack : attacker.sp_attack;
    const defStat = isPhysical ? defender.defense : defender.sp_defense;

    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    const effectiveness = getEffectiveness(move.type, defender.types);
    const randomFactor = 0.85 + Math.random() * 0.15;

    const base = ((2 * LEVEL) / 5 + 2) * (move.power ?? 40) * (atkStat / Math.max(1, defStat)) / 50 + 2;
    const damage = Math.max(1, Math.floor(base * stab * effectiveness * randomFactor));

    return { damage, effectiveness, isStab: stab > 1, missed: false };
}

/**
 * AI bot sederhana: 80% pilih move dengan expected damage tertinggi, 20% acak (biar tidak terlalu sempurna).
 */
export function pickBotMove(botPokemon, playerPokemon) {
    const moves = botPokemon.moves;

    if (Math.random() < 0.2) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    let bestMove = moves[0];
    let bestScore = -1;

    for (const move of moves) {
        const eff = getEffectiveness(move.type, playerPokemon.types);
        const stab = botPokemon.types.includes(move.type) ? 1.5 : 1;
        const score = (move.power ?? 40) * eff * stab * ((move.accuracy ?? 100) / 100);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

export function effectivenessLabel(effectiveness) {
    if (effectiveness === 0) return 'Tidak berpengaruh...';
    if (effectiveness >= 2) return 'Sangat efektif!';
    if (effectiveness < 1) return 'Kurang efektif...';
    return null;
}
