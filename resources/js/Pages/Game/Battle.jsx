import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import HpBar from '../../Components/Game/HpBar';
import PokemonPickCard from '../../Components/Game/PokemonPickCard';
import TeamPickCard from '../../Components/Game/TeamPickCard';
import TrainerSelect from '../../Components/Game/TrainerSelect';
import TrainerAvatarTag from '../../Components/Game/TrainerAvatarTag';
import ModeSelect from '../../Components/Game/ModeSelect';
import LevelBanner from '../../Components/Game/LevelBanner';
import LevelTrack from '../../Components/Game/LevelTrack';
import EvolveSelect from '../../Components/Game/EvolveSelect';
import VictoryBurst from '../../Components/Game/VictoryBurst';
import LegendaryDropCard from '../../Components/Game/LegendaryDropCard';
import Confetti from '../../Components/Game/Confetti';
import PetalFall from '../../Components/Game/PetalFall';
import { TYPE_COLORS } from '../../data/typeChart';
import { CHALLENGE_LEVELS } from '../../data/challengeLevels';
import { LEGENDARY_DROP_POOL, DROP_EVERY_N_WINS, GACHA_TIERS } from '../../data/legendaryDrops';
import { battleMaxHp, calculateDamage, pickBotMove, effectivenessLabel } from '../../lib/battleEngine';
import { unlockAudio, playAttackSound, playHitSound, playWinSound, playLoseSound } from '../../lib/sfx';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomPick(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

export default function Battle({ totalPokemon }) {
    const [phase, setPhase] = useState('trainer');
    // trainer | nickname | mode | select | team-select | battle | result | challenge-lobby | evolve-select
    const [trainers, setTrainers] = useState([]);
    const [trainer, setTrainer] = useState(null);
    const [rivalTrainer, setRivalTrainer] = useState(null);
    const [nickname, setNickname] = useState('');
    const [mode, setMode] = useState(null);
    const [choices, setChoices] = useState([]);
    const [teamSelection, setTeamSelection] = useState([]);
    const [error, setError] = useState('');

    const [team, setTeam] = useState([]);
    const [teamHp, setTeamHp] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const [botTeam, setBotTeam] = useState([]);
    const [botTeamHp, setBotTeamHp] = useState([]);
    const [botActiveIndex, setBotActiveIndex] = useState(0);

    const [levelIndex, setLevelIndex] = useState(0);
    const [clearedLevels, setClearedLevels] = useState([]);
    const [winCount, setWinCount] = useState(0);
    const [evolvesUsed, setEvolvesUsed] = useState(0);
    const [lastOutcome, setLastOutcome] = useState(null); // 'won' | 'lost' | null
    const [challengeResult, setChallengeResult] = useState(null);
    const [victoryBurst, setVictoryBurst] = useState(null);

    const [evolutionOptions, setEvolutionOptions] = useState({});
    const [evolveSelection, setEvolveSelection] = useState(null); // {slotIndex, target}

    const [droppedPokemon, setDroppedPokemon] = useState(null);
    const [dropTier, setDropTier] = useState(null);
    const [resultRevealed, setResultRevealed] = useState(false);
    const [celebration, setCelebration] = useState(null); // 'confetti' | 'petals' | null
    const winCountRef = useRef(0);

    const [cooldowns, setCooldowns] = useState({});
    const cooldownsRef = useRef({});

    const [log, setLog] = useState([]);
    const [busy, setBusy] = useState(false);
    const [attacking, setAttacking] = useState(null);
    const [hit, setHit] = useState(null);
    const [winner, setWinner] = useState(null);

    const teamHpRef = useRef([]);
    const activeIndexRef = useRef(0);
    const botTeamRef = useRef([]);
    const botTeamHpRef = useRef([]);
    const botActiveIndexRef = useRef(0);
    const winnerRef = useRef(null);
    const logEndRef = useRef(null);

    const addLog = (msg) => {
        setLog((prev) => [...prev, msg]);
        setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    useEffect(() => {
        fetch('/api/tarung/trainers')
            .then((res) => res.json())
            .then(setTrainers)
            .catch(() => setTrainers([]));
    }, []);

    useEffect(() => {
        if (phase !== 'result') {
            setResultRevealed(false);
            setCelebration(null);
            return;
        }

        setResultRevealed(false);
        setCelebration(null);

        const won = mode === 'battle' ? winner === 'player' : challengeResult === 'won';

        const timer = setTimeout(() => {
            setResultRevealed(true);
            setCelebration(won ? 'confetti' : 'petals');
            if (won) {
                playWinSound();
            } else {
                playLoseSound();
            }
        }, 900);

        return () => clearTimeout(timer);
    }, [phase]);

    const pickRivalTrainer = (excludeId) => {
        const pool = trainers.filter((t) => t.id !== excludeId);
        const source = pool.length > 0 ? pool : trainers;
        if (source.length === 0) return null;
        return source[Math.floor(Math.random() * source.length)];
    };

    const evolveTokens = Math.floor(winCount / 2) - evolvesUsed;

    // ---------- Navigasi awal ----------

    const confirmTrainer = () => {
        if (!trainer) { setError('Pilih trainer dulu ya!'); return; }
        setError('');
        setPhase('nickname');
    };

    const confirmNickname = () => {
        if (!nickname.trim()) { setError('Isi nickname dulu ya!'); return; }
        setError('');
        setPhase('mode');
    };

    const selectMode = async (chosenMode) => {
        setMode(chosenMode);
        setPhase('loading');
        try {
            if (chosenMode === 'battle') {
                const res = await fetch('/api/tarung/random?count=3');
                setChoices(await res.json());
                setPhase('select');
            } else {
                const res = await fetch('/api/tarung/random?count=6&evolvable_only=1');
                setChoices(await res.json());
                setTeamSelection([]);
                setPhase('team-select');
            }
        } catch (e) {
            setError('Gagal memuat Pokemon. Coba lagi.');
            setPhase('mode');
        }
    };

    // ---------- Mode Battle ----------

    const pickPokemon = async (picked) => {
        setPhase('loading');
        try {
            const res = await fetch(`/api/tarung/random?count=1&exclude=${picked.id}`);
            const data = await res.json();
            const botPokemon = data[0];
            const pHp = battleMaxHp(picked);
            const bHp = battleMaxHp(botPokemon);

            setTeam([picked]);
            teamHpRef.current = [pHp];
            setTeamHp([pHp]);
            activeIndexRef.current = 0;
            setActiveIndex(0);

            setBotTeam([botPokemon]);
            botTeamRef.current = [botPokemon];
            botTeamHpRef.current = [bHp];
            setBotTeamHp([bHp]);
            botActiveIndexRef.current = 0;
            setBotActiveIndex(0);
            setRivalTrainer(null);

            setLog([`Pertarungan dimulai! ${nickname} mengirim ${picked.name}, lawan mengirim ${botPokemon.name}!`]);
            setWinner(null);
            winnerRef.current = null;
            cooldownsRef.current = {};
            setCooldowns({});
            setPhase('battle');
        } catch (e) {
            setError('Gagal memuat lawan. Coba lagi.');
            setPhase('select');
        }
    };

    // ---------- Mode Challenge ----------

    const toggleTeamMember = (pokemon) => {
        setTeamSelection((prev) => {
            const exists = prev.find((p) => p.id === pokemon.id);
            if (exists) return prev.filter((p) => p.id !== pokemon.id);
            if (prev.length >= 3) return prev;
            return [...prev, pokemon];
        });
    };

    const fetchBotTeamForLevel = async (idx) => {
        const lvl = CHALLENGE_LEVELS[idx];
        if (lvl.isBoss) {
            const guaranteed = lvl.guaranteedBoss[Math.floor(Math.random() * lvl.guaranteedBoss.length)];
            const support = randomPick(lvl.supportPool, 2);
            const names = [guaranteed, ...support].join(',');
            const res = await fetch(`/api/tarung/find?names=${encodeURIComponent(names)}`);
            return await res.json();
        }
        const res = await fetch(`/api/tarung/random?count=3&min_bst=${lvl.minBst}&max_bst=${lvl.maxBst}`);
        return await res.json();
    };

    const startChallenge = async () => {
        if (teamSelection.length !== 3) return;
        const initialHp = teamSelection.map((p) => battleMaxHp(p));
        setTeam(teamSelection);
        teamHpRef.current = initialHp;
        setTeamHp(initialHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);
        setLevelIndex(0);
        setClearedLevels([]);
        winCountRef.current = 0;
        setWinCount(0);
        setEvolvesUsed(0);
        setChallengeResult(null);
        setLastOutcome(null);
        cooldownsRef.current = {};
        setCooldowns({});
        setPhase('challenge-lobby');
    };

    const startLevelFight = async (idx) => {
        setPhase('loading');
        try {
            setLevelIndex(idx);
            const botTeamN = await fetchBotTeamForLevel(idx);
            const bHps = botTeamN.map((p) => battleMaxHp(p));
            botTeamRef.current = botTeamN;
            setBotTeam(botTeamN);
            botTeamHpRef.current = bHps;
            setBotTeamHp(bHps);
            botActiveIndexRef.current = 0;
            setBotActiveIndex(0);

            const rival = pickRivalTrainer(trainer?.id);
            setRivalTrainer(rival);

            activeIndexRef.current = 0;
            setActiveIndex(0);
            cooldownsRef.current = {};
            setCooldowns({});

            setLog([
                `${CHALLENGE_LEVELS[idx].label}${rival ? ` — ${rival.name}` : ''} muncul!`,
                `${nickname} mengirim ${team[0].name}, lawan mengirim ${botTeamN[0].name}!`,
            ]);
            setWinner(null);
            winnerRef.current = null;
            setPhase('battle');
        } catch (e) {
            setError('Gagal memuat lawan. Coba lagi.');
            setPhase('challenge-lobby');
        }
    };

    const rollGachaTier = () => {
        const r = Math.random();
        if (r < GACHA_TIERS.legendary.chance) return 'legendary';
        if (r < GACHA_TIERS.legendary.chance + GACHA_TIERS.secondEvo.chance) return 'secondEvo';
        return 'common';
    };

    const fetchGachaPokemon = async (tierKey) => {
        if (tierKey === 'legendary') {
            const name = LEGENDARY_DROP_POOL[Math.floor(Math.random() * LEGENDARY_DROP_POOL.length)];
            const res = await fetch(`/api/tarung/find?names=${encodeURIComponent(name)}`);
            const data = await res.json();
            return data[0] || null;
        }
        if (tierKey === 'secondEvo') {
            const res = await fetch('/api/tarung/random?count=1&has_evolved=1');
            const data = await res.json();
            return data[0] || null;
        }
        const res = await fetch('/api/tarung/random?count=1&no_evolution=1');
        const data = await res.json();
        return data[0] || null;
    };

    const returnToLobbyAfterWin = async () => {
        setVictoryBurst({ title: `${rivalTrainer?.name || 'Trainer'} Terkalahkan!`, subtitle: 'Timmu dipulihkan sepenuhnya' });
        await sleep(1500);
        setVictoryBurst(null);

        setClearedLevels((prev) => (prev.includes(levelIndex) ? prev : [...prev, levelIndex]));
        winCountRef.current += 1;
        setWinCount(winCountRef.current);

        const healedHp = team.map((p) => battleMaxHp(p));
        teamHpRef.current = healedHp;
        setTeamHp(healedHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);

        setLastOutcome('won');

        if (winCountRef.current % DROP_EVERY_N_WINS === 0) {
            try {
                const tierKey = rollGachaTier();
                const pokemon = await fetchGachaPokemon(tierKey);
                if (pokemon) {
                    setDroppedPokemon(pokemon);
                    setDropTier(GACHA_TIERS[tierKey]);
                    setPhase('legendary-drop');
                    return;
                }
            } catch (e) {
                // Kalau gagal fetch drop, lanjut ke lobi seperti biasa
            }
        }

        setPhase('challenge-lobby');
    };

    const returnToLobbyAfterLoss = async () => {
        await sleep(800);
        const healedHp = team.map((p) => battleMaxHp(p));
        teamHpRef.current = healedHp;
        setTeamHp(healedHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);

        setLastOutcome('lost');
        setPhase('challenge-lobby');
    };

    // ---------- Evolusi ----------

    const openEvolveSelect = async () => {
        setPhase('loading');
        try {
            const dexList = team.map((p) => p.dex_number).join(',');
            const res = await fetch(`/api/tarung/evolutions?dex=${dexList}`);
            setEvolutionOptions(await res.json());
            setEvolveSelection(null);
            setPhase('evolve-select');
        } catch (e) {
            setError('Gagal memuat data evolusi.');
            setPhase('challenge-lobby');
        }
    };

    const confirmEvolve = () => {
        if (!evolveSelection) return;

        const newTeam = [...team];
        newTeam[evolveSelection.slotIndex] = evolveSelection.target;
        setTeam(newTeam);

        const healedHp = newTeam.map((p) => battleMaxHp(p));
        teamHpRef.current = healedHp;
        setTeamHp(healedHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);

        setEvolvesUsed((prev) => prev + 1);
        setLastOutcome(null);
        setEvolveSelection(null);
        setPhase('challenge-lobby');
    };

    // ---------- Drop Legendaris ----------

    const replaceWithDrop = (slotIndex) => {
        if (!droppedPokemon) return;

        const newTeam = [...team];
        newTeam[slotIndex] = droppedPokemon;
        setTeam(newTeam);

        const healedHp = newTeam.map((p) => battleMaxHp(p));
        teamHpRef.current = healedHp;
        setTeamHp(healedHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);

        setDroppedPokemon(null);
        setDropTier(null);
        setPhase('challenge-lobby');
    };

    const skipDrop = () => {
        setDroppedPokemon(null);
        setDropTier(null);
        setPhase('challenge-lobby');
    };

    // ---------- Engine pertarungan ----------

    const handleBotActiveFainted = async () => {
        if (mode === 'battle') {
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        const aliveIdx = botTeamHpRef.current.findIndex((hp) => hp > 0);
        if (aliveIdx === -1) {
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        botActiveIndexRef.current = aliveIdx;
        setBotActiveIndex(aliveIdx);
        addLog(`Lawan mengirim ${botTeamRef.current[aliveIdx].name}!`);
    };

    const handlePlayerActiveFainted = async () => {
        if (mode === 'battle') {
            winnerRef.current = 'bot';
            setWinner('bot');
            return;
        }

        const aliveIdx = teamHpRef.current.findIndex((hp) => hp > 0);
        if (aliveIdx === -1) {
            winnerRef.current = 'bot';
            setWinner('bot');
            return;
        }

        activeIndexRef.current = aliveIdx;
        setActiveIndex(aliveIdx);
        addLog(`${nickname} mengirim ${team[aliveIdx].name}!`);
    };

    const performAttack = async (side, move) => {
        const attacker = side === 'player' ? team[activeIndexRef.current] : botTeamRef.current[botActiveIndexRef.current];
        const defender = side === 'player' ? botTeamRef.current[botActiveIndexRef.current] : team[activeIndexRef.current];

        setAttacking(side);
        playAttackSound();
        addLog(`${side === 'player' ? nickname : 'Musuh'} (${attacker.name}) menggunakan ${move.name}!`);
        await sleep(500);
        setAttacking(null);

        const result = calculateDamage(attacker, defender, move);

        if (result.missed) {
            addLog('Serangan meleset!');
            await sleep(300);
            return false;
        }

        setHit(side === 'player' ? 'bot' : 'player');
        playHitSound();
        await sleep(150);

        if (side === 'player') {
            const idx = botActiveIndexRef.current;
            botTeamHpRef.current[idx] = Math.max(0, botTeamHpRef.current[idx] - result.damage);
            setBotTeamHp([...botTeamHpRef.current]);
        } else {
            const idx = activeIndexRef.current;
            teamHpRef.current[idx] = Math.max(0, teamHpRef.current[idx] - result.damage);
            setTeamHp([...teamHpRef.current]);
        }

        const effMsg = effectivenessLabel(result.effectiveness);
        addLog(`${defender.name} terkena ${result.damage} damage!${effMsg ? ' ' + effMsg : ''}`);
        await sleep(400);
        setHit(null);

        if (side === 'player' && botTeamHpRef.current[botActiveIndexRef.current] <= 0) {
            addLog(`${defender.name} pingsan!`);
            await sleep(400);
            await handleBotActiveFainted();
            return true;
        }

        if (side === 'bot' && teamHpRef.current[activeIndexRef.current] <= 0) {
            addLog(`${defender.name} pingsan!`);
            await sleep(400);
            await handlePlayerActiveFainted();
            return true;
        }

        return false;
    };

    const applyCooldown = (pokemonId, moveName) => {
        const current = { ...(cooldownsRef.current[pokemonId] || {}) };
        Object.keys(current).forEach((k) => {
            current[k] = Math.max(0, current[k] - 1);
        });
        current[moveName] = 1;
        cooldownsRef.current = { ...cooldownsRef.current, [pokemonId]: current };
        setCooldowns(cooldownsRef.current);
    };

    const handleMove = async (move) => {
        if (busy || winnerRef.current) return;
        unlockAudio();

        const activePlayerNow = team[activeIndexRef.current];
        const moveCooldown = cooldownsRef.current[activePlayerNow.id]?.[move.name] || 0;
        if (moveCooldown > 0) return;

        setBusy(true);
        applyCooldown(activePlayerNow.id, move.name);

        const activeBotNow = botTeamRef.current[botActiveIndexRef.current];
        const order = activePlayerNow.speed >= activeBotNow.speed ? ['player', 'bot'] : ['bot', 'player'];

        for (const side of order) {
            if (winnerRef.current) break;
            let interrupted;
            if (side === 'player') {
                interrupted = await performAttack('player', move);
            } else {
                const botMove = pickBotMove(activeBotNow, activePlayerNow);
                interrupted = await performAttack('bot', botMove);
            }
            if (interrupted) break;
        }

        setBusy(false);

        if (winnerRef.current === 'player') {
            if (mode === 'challenge') {
                await returnToLobbyAfterWin();
            } else {
                setPhase('result');
            }
        } else if (winnerRef.current === 'bot') {
            if (mode === 'challenge') {
                await returnToLobbyAfterLoss();
            } else {
                setPhase('result');
            }
        }
    };

    const playAgain = () => {
        setPhase('mode');
        setChoices([]);
        setTeamSelection([]);
        setTeam([]);
        setBotTeam([]);
        setRivalTrainer(null);
        setLog([]);
        setWinner(null);
        setChallengeResult(null);
        setVictoryBurst(null);
        winnerRef.current = null;
    };

    const backToStart = () => {
        setTrainer(null);
        setNickname('');
        setMode(null);
        playAgain();
        setPhase('trainer');
    };

    const activePlayer = team[activeIndex];
    const activePlayerHp = teamHp[activeIndex] ?? 0;
    const activeBot = botTeam[botActiveIndex];
    const activeBotHp = botTeamHp[botActiveIndex] ?? 0;
    const currentLevel = mode === 'challenge' ? CHALLENGE_LEVELS[levelIndex] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 text-slate-800">
            <Head title="Arena Tarung" />

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <a href="/" className="text-slate-500 hover:text-slate-700 text-sm">&larr; Kembali ke situs</a>
                    <span className="text-xs text-slate-400">{totalPokemon}+ Pokemon siap bertarung</span>
                </div>

                {phase === 'trainer' && (
                    <div className="max-w-lg mx-auto mt-8">
                        <h1 className="text-3xl font-extrabold text-center mb-1">⚔️ Arena Tarung</h1>
                        <p className="text-slate-500 text-center text-sm mb-6">Pilih avatar trainer-mu:</p>
                        <TrainerSelect trainers={trainers} selected={trainer} onSelect={setTrainer} />
                        {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
                        <button onClick={confirmTrainer} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-6 shadow-lg transition">
                            Lanjut
                        </button>
                    </div>
                )}

                {phase === 'nickname' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto mt-16">
                        <div
                            className="w-24 aspect-[4/6] rounded-xl flex items-center justify-center mx-auto mb-3 overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${trainer?.gradient_from || '#EF4444'}, ${trainer?.gradient_to || '#3B82F6'})` }}
                        >
                            {trainer?.image_url ? (
                                <img src={trainer.image_url} alt={trainer.name} className="w-full h-full object-cover" />
                            ) : (
                                <i className={`bi ${trainer?.icon || 'bi-person-fill'} text-3xl text-white`}></i>
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold mb-1">Siapa namamu, Trainer?</h1>
                        <p className="text-slate-500 text-sm mb-6">Nickname ini akan tampil selama pertarungan.</p>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmNickname()}
                            placeholder="Masukkan nickname..."
                            maxLength={20}
                            autoFocus
                            className="w-full rounded-lg px-4 py-3 mb-3 text-center font-semibold bg-white text-slate-800 border-2 border-slate-300 focus:border-red-400 focus:outline-none placeholder:text-slate-400"
                        />
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                        <button onClick={confirmNickname} className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-lg transition">
                            Masuk Lobi
                        </button>
                    </div>
                )}

                {phase === 'mode' && (
                    <div className="max-w-lg mx-auto mt-8">
                        <h2 className="text-xl font-bold text-center mb-1">Halo, {nickname}! 👋</h2>
                        <p className="text-slate-500 text-center text-sm mb-6">Pilih mode pertarungan:</p>
                        <ModeSelect onSelect={selectMode} />
                    </div>
                )}

                {phase === 'loading' && (
                    <div className="text-center mt-24">
                        <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Memuat...</p>
                    </div>
                )}

                {phase === 'select' && (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Pilih Pokemon-mu</h2>
                        <p className="text-slate-500 text-center text-sm mb-6">Satu Pokemon untuk bertarung melawan bot:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {choices.map((p) => (
                                <PokemonPickCard key={p.id} pokemon={p} onPick={pickPokemon} />
                            ))}
                        </div>
                    </div>
                )}

                {phase === 'team-select' && (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Susun Timmu ({teamSelection.length}/3)</h2>
                        <p className="text-slate-500 text-center text-sm mb-6">Pilih 3 Pokemon untuk menembus gauntlet 3v3:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            {choices.map((p) => (
                                <TeamPickCard
                                    key={p.id}
                                    pokemon={p}
                                    selected={!!teamSelection.find((t) => t.id === p.id)}
                                    disabled={teamSelection.length >= 3}
                                    onToggle={toggleTeamMember}
                                />
                            ))}
                        </div>
                        <button
                            onClick={startChallenge}
                            disabled={teamSelection.length !== 3}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg transition"
                        >
                            {teamSelection.length === 3 ? 'Masuk Lobi Challenge' : `Pilih ${3 - teamSelection.length} Pokemon lagi`}
                        </button>
                    </div>
                )}

                {phase === 'challenge-lobby' && (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Lobi Challenge</h2>
                        {lastOutcome === 'won' && <p className="text-green-600 text-center text-sm mb-1">🎉 Kamu menang! Timmu sudah dipulihkan.</p>}
                        {lastOutcome === 'lost' && <p className="text-red-500 text-center text-sm mb-1">💀 Timmu kalah, tapi sudah dipulihkan untuk coba lagi.</p>}
                        <p className="text-slate-500 text-center text-sm mb-4">Total kemenangan: <span className="font-bold text-slate-700">{winCount}</span></p>

                        {evolveTokens > 0 && (
                            <button
                                onClick={openEvolveSelect}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl mb-4 shadow-lg animate-pulse"
                            >
                                ✨ Evolusi Tersedia ({evolveTokens})! Klik untuk pilih Pokemon
                            </button>
                        )}

                        <div className="flex gap-2 mb-4 justify-center">
                            {team.map((p) => (
                                <div key={p.id} className="bg-white rounded-lg shadow px-2 py-1 flex items-center gap-1.5 text-xs">
                                    <img src={p.image} alt={p.name} className="w-6 h-6 object-contain" />
                                    {p.name}
                                </div>
                            ))}
                        </div>

                        <LevelTrack levels={CHALLENGE_LEVELS} clearedLevels={clearedLevels} onSelectLevel={startLevelFight} />

                        <button onClick={backToStart} className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg text-sm">
                            Keluar dari Challenge
                        </button>
                    </div>
                )}

                {phase === 'evolve-select' && (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Pilih Pokemon untuk Evolusi</h2>
                        <p className="text-slate-500 text-center text-sm mb-6">Progres levelmu tetap lanjut, timmu jadi lebih kuat.</p>
                        <EvolveSelect
                            team={team}
                            evolutions={evolutionOptions}
                            selected={evolveSelection}
                            onSelectTarget={(slotIndex, target) => setEvolveSelection({ slotIndex, target })}
                        />
                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={confirmEvolve}
                                disabled={!evolveSelection}
                                className="bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg"
                            >
                                Konfirmasi Evolusi
                            </button>
                            <button
                                onClick={() => { setEvolveSelection(null); setPhase('challenge-lobby'); }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'legendary-drop' && droppedPokemon && dropTier && (
                    <LegendaryDropCard
                        pokemon={droppedPokemon}
                        tier={dropTier}
                        team={team}
                        onReplace={replaceWithDrop}
                        onSkip={skipDrop}
                    />
                )}

                {(phase === 'battle' || phase === 'result') && activePlayer && activeBot && (
                    <div>
                        {mode === 'challenge' && <LevelBanner level={currentLevel} />}

                        <div className="relative bg-gradient-to-b from-sky-400 to-emerald-300 rounded-2xl overflow-hidden h-72 mb-4 border-4 border-white shadow-lg">
                            {victoryBurst && <VictoryBurst title={victoryBurst.title} subtitle={victoryBurst.subtitle} />}
                            {celebration === 'confetti' && <Confetti />}
                            {celebration === 'petals' && <PetalFall />}

                            <div className="absolute top-4 right-6 text-right">
                                {rivalTrainer && (
                                    <div className="flex justify-end mb-1.5">
                                        <TrainerAvatarTag trainer={rivalTrainer} align="right" />
                                    </div>
                                )}
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1"><span>{activeBot.name}</span></div>
                                    <HpBar current={activeBotHp} max={battleMaxHp(activeBot)} />
                                </div>
                            </div>
                            <img
                                src={activeBot.image}
                                alt={activeBot.name}
                                className={`absolute top-8 right-16 w-28 h-28 object-contain drop-shadow-xl ${attacking === 'bot' ? 'animate-lunge-left' : ''} ${hit === 'bot' ? 'animate-hit' : ''} ${winner === 'player' && phase === 'result' ? 'animate-faint' : ''}`}
                            />

                            <div className="absolute bottom-4 left-6">
                                {trainer && (
                                    <div className="mb-1.5"><TrainerAvatarTag trainer={trainer} align="left" /></div>
                                )}
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1"><span>{activePlayer.name}</span></div>
                                    <HpBar current={activePlayerHp} max={battleMaxHp(activePlayer)} />
                                </div>
                            </div>
                            <img
                                src={activePlayer.image}
                                alt={activePlayer.name}
                                className={`absolute bottom-8 left-16 w-32 h-32 object-contain drop-shadow-xl ${attacking === 'player' ? 'animate-lunge-right' : ''} ${hit === 'player' ? 'animate-hit' : ''} ${winner === 'bot' && phase === 'result' ? 'animate-faint' : ''}`}
                            />
                        </div>

                        {mode === 'challenge' && (
                            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                <div className="flex gap-1.5 flex-wrap">
                                    {team.map((p, i) => (
                                        <div key={p.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${teamHp[i] <= 0 ? 'bg-slate-200 text-slate-400 line-through' : i === activeIndex ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-600 shadow'}`}>
                                            <img src={p.image} alt={p.name} className="w-5 h-5 object-contain" />{p.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {botTeam.map((p, i) => (
                                        <div key={p.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${botTeamHp[i] <= 0 ? 'bg-slate-200 text-slate-400 line-through' : i === botActiveIndex ? 'bg-red-400 text-white' : 'bg-white text-slate-600 shadow'}`}>
                                            {p.name}<img src={p.image} alt={p.name} className="w-5 h-5 object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-800 rounded-xl p-3 h-24 overflow-y-auto text-sm mb-4 font-mono">
                            {log.map((line, i) => <div key={i} className="text-slate-100 mb-0.5">{line}</div>)}
                            <div ref={logEndRef} />
                        </div>

                        {phase === 'result' ? (
                            resultRevealed && (
                                <div className="text-center bg-white rounded-2xl shadow-lg p-6 animate-victory-pop">
                                    <h2 className="text-2xl font-extrabold mb-2">{winner === 'player' ? '🎉 Kamu Menang!' : '💀 Kamu Kalah!'}</h2>
                                    <p className="text-slate-500 mb-4">
                                        {winner === 'player' ? `${activePlayer.name} berhasil mengalahkan ${activeBot.name}!` : `${activeBot.name} milik lawan terlalu kuat. Coba lagi!`}
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button onClick={playAgain} className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg">Main Lagi</button>
                                        <button onClick={backToStart} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg">Ganti Trainer</button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {activePlayer.moves.map((move) => {
                                    const cd = cooldowns[activePlayer.id]?.[move.name] || 0;
                                    const disabled = busy || cd > 0;
                                    return (
                                        <button
                                            key={move.name}
                                            disabled={disabled}
                                            onClick={() => handleMove(move)}
                                            className="bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 rounded-lg px-4 py-3 text-left shadow transition relative"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm">{move.name}</span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: TYPE_COLORS[move.type] || '#777' }}>
                                                    {move.type}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Power {move.power ?? '-'} &middot; Akurasi {move.accuracy ?? '-'}%
                                            </div>
                                            {cd > 0 && (
                                                <span className="absolute top-1 left-1 bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">Cooldown</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
