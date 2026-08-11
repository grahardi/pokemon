import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import HpBar from '../../Components/Game/HpBar';
import PokemonPickCard from '../../Components/Game/PokemonPickCard';
import TeamPickCard from '../../Components/Game/TeamPickCard';
import TrainerSelect from '../../Components/Game/TrainerSelect';
import TrainerAvatarTag from '../../Components/Game/TrainerAvatarTag';
import ModeSelect from '../../Components/Game/ModeSelect';
import LevelBanner from '../../Components/Game/LevelBanner';
import VictoryBurst from '../../Components/Game/VictoryBurst';
import { TYPE_COLORS } from '../../data/typeChart';
import { CHALLENGE_LEVELS } from '../../data/challengeLevels';
import { battleMaxHp, calculateDamage, pickBotMove, effectivenessLabel } from '../../lib/battleEngine';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomPick(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

export default function Battle({ totalPokemon }) {
    const [phase, setPhase] = useState('trainer'); // trainer | nickname | mode | select | team-select | battle | result
    const [trainers, setTrainers] = useState([]);
    const [trainer, setTrainer] = useState(null);
    const [rivalTrainer, setRivalTrainer] = useState(null);
    const [nickname, setNickname] = useState('');
    const [mode, setMode] = useState(null); // battle | challenge
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
    const [challengeResult, setChallengeResult] = useState(null); // won | lost | null
    const [victoryBurst, setVictoryBurst] = useState(null); // {title, subtitle} | null

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
    const levelIndexRef = useRef(0);
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

    const pickRivalTrainer = (excludeId) => {
        const pool = trainers.filter((t) => t.id !== excludeId);
        const source = pool.length > 0 ? pool : trainers;
        if (source.length === 0) return null;
        return source[Math.floor(Math.random() * source.length)];
    };

    // ---------- Navigasi awal ----------

    const confirmTrainer = () => {
        if (!trainer) {
            setError('Pilih trainer dulu ya!');
            return;
        }
        setError('');
        setPhase('nickname');
    };

    const confirmNickname = () => {
        if (!nickname.trim()) {
            setError('Isi nickname dulu ya!');
            return;
        }
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
                const res = await fetch('/api/tarung/random?count=6');
                setChoices(await res.json());
                setTeamSelection([]);
                setPhase('team-select');
            }
        } catch (e) {
            setError('Gagal memuat Pokemon. Coba lagi.');
            setPhase('mode');
        }
    };

    // ---------- Mode Battle (1 lawan 1, tanpa trainer lawan) ----------

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
            setPhase('battle');
        } catch (e) {
            setError('Gagal memuat lawan. Coba lagi.');
            setPhase('select');
        }
    };

    // ---------- Mode Challenge (3v3 vs trainer, gauntlet sampai boss) ----------

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
        setPhase('loading');
        try {
            const initialHp = teamSelection.map((p) => battleMaxHp(p));
            setTeam(teamSelection);
            teamHpRef.current = initialHp;
            setTeamHp(initialHp);
            activeIndexRef.current = 0;
            setActiveIndex(0);
            levelIndexRef.current = 0;
            setLevelIndex(0);
            setChallengeResult(null);

            const botTeam0 = await fetchBotTeamForLevel(0);
            const bHps = botTeam0.map((p) => battleMaxHp(p));
            botTeamRef.current = botTeam0;
            setBotTeam(botTeam0);
            botTeamHpRef.current = bHps;
            setBotTeamHp(bHps);
            botActiveIndexRef.current = 0;
            setBotActiveIndex(0);

            const rival = pickRivalTrainer(trainer?.id);
            setRivalTrainer(rival);

            setLog([
                `${CHALLENGE_LEVELS[0].label}${rival ? ` — ${rival.name}` : ''} muncul!`,
                `${nickname} mengirim ${teamSelection[0].name}, lawan mengirim ${botTeam0[0].name}!`,
            ]);
            setWinner(null);
            winnerRef.current = null;
            setPhase('battle');
        } catch (e) {
            setError('Gagal memulai challenge. Coba lagi.');
            setPhase('team-select');
        }
    };

    // ---------- Engine pertarungan ----------

    const advanceStageOrFinish = async () => {
        const nextIdx = levelIndexRef.current + 1;

        if (nextIdx >= CHALLENGE_LEVELS.length) {
            setVictoryBurst({ title: 'Juara Liga! 🏆', subtitle: `${nickname} menembus seluruh gauntlet!` });
            await sleep(1600);
            setVictoryBurst(null);
            setChallengeResult('won');
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        setVictoryBurst({ title: `${rivalTrainer?.name || 'Trainer'} Terkalahkan!`, subtitle: 'Timmu dipulihkan sepenuhnya' });
        await sleep(1500);
        setVictoryBurst(null);

        // Heal penuh tim pemain begitu ganti trainer
        const healedHp = team.map((p) => battleMaxHp(p));
        teamHpRef.current = healedHp;
        setTeamHp(healedHp);
        activeIndexRef.current = 0;
        setActiveIndex(0);

        levelIndexRef.current = nextIdx;
        setLevelIndex(nextIdx);

        const newBotTeam = await fetchBotTeamForLevel(nextIdx);
        const newBotHps = newBotTeam.map((p) => battleMaxHp(p));
        botTeamRef.current = newBotTeam;
        setBotTeam(newBotTeam);
        botTeamHpRef.current = newBotHps;
        setBotTeamHp(newBotHps);
        botActiveIndexRef.current = 0;
        setBotActiveIndex(0);

        const newRival = pickRivalTrainer(trainer?.id);
        setRivalTrainer(newRival);

        addLog(`${CHALLENGE_LEVELS[nextIdx].label}${newRival ? ` — ${newRival.name}` : ''} muncul!`);
        addLog(`Lawan mengirim ${newBotTeam[0].name}!`);
    };

    const handleBotActiveFainted = async () => {
        if (mode === 'battle') {
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        const aliveIdx = botTeamHpRef.current.findIndex((hp) => hp > 0);
        if (aliveIdx === -1) {
            await advanceStageOrFinish();
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
            setChallengeResult('lost');
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

    const handleMove = async (move) => {
        if (busy || winnerRef.current) return;
        setBusy(true);

        const activePlayerNow = team[activeIndexRef.current];
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
        if (winnerRef.current) setPhase('result');
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
                        <button
                            onClick={confirmTrainer}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-6 shadow-lg transition"
                        >
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
                        <button
                            onClick={confirmNickname}
                            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-lg transition"
                        >
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
                            {teamSelection.length === 3 ? 'Mulai Challenge!' : `Pilih ${3 - teamSelection.length} Pokemon lagi`}
                        </button>
                    </div>
                )}

                {(phase === 'battle' || phase === 'result') && activePlayer && activeBot && (
                    <div>
                        {mode === 'challenge' && <LevelBanner level={currentLevel} />}

                        <div className="relative bg-gradient-to-b from-sky-400 to-emerald-300 rounded-2xl overflow-hidden h-72 mb-4 border-4 border-white shadow-lg">
                            {victoryBurst && <VictoryBurst title={victoryBurst.title} subtitle={victoryBurst.subtitle} />}

                            <div className="absolute top-4 right-6 text-right">
                                {rivalTrainer && (
                                    <div className="flex justify-end mb-1.5">
                                        <TrainerAvatarTag trainer={rivalTrainer} align="right" />
                                    </div>
                                )}
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                                        <span>{activeBot.name}</span>
                                    </div>
                                    <HpBar current={activeBotHp} max={battleMaxHp(activeBot)} />
                                </div>
                            </div>
                            <img
                                src={activeBot.image}
                                alt={activeBot.name}
                                className={`absolute top-8 right-16 w-28 h-28 object-contain drop-shadow-xl ${
                                    attacking === 'bot' ? 'animate-lunge-left' : ''
                                } ${hit === 'bot' ? 'animate-hit' : ''} ${winner === 'player' && phase === 'result' ? 'animate-faint' : ''}`}
                            />

                            <div className="absolute bottom-4 left-6">
                                {trainer && mode === 'challenge' && (
                                    <div className="mb-1.5">
                                        <TrainerAvatarTag trainer={trainer} align="left" />
                                    </div>
                                )}
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                                        <span>{activePlayer.name}</span>
                                    </div>
                                    <HpBar current={activePlayerHp} max={battleMaxHp(activePlayer)} />
                                </div>
                            </div>
                            <img
                                src={activePlayer.image}
                                alt={activePlayer.name}
                                className={`absolute bottom-8 left-16 w-32 h-32 object-contain drop-shadow-xl ${
                                    attacking === 'player' ? 'animate-lunge-right' : ''
                                } ${hit === 'player' ? 'animate-hit' : ''} ${winner === 'bot' && phase === 'result' ? 'animate-faint' : ''}`}
                            />
                        </div>

                        {mode === 'challenge' && (
                            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                <div className="flex gap-1.5 flex-wrap">
                                    {team.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                                                teamHp[i] <= 0
                                                    ? 'bg-slate-200 text-slate-400 line-through'
                                                    : i === activeIndex
                                                    ? 'bg-amber-400 text-slate-900'
                                                    : 'bg-white text-slate-600 shadow'
                                            }`}
                                        >
                                            <img src={p.image} alt={p.name} className="w-5 h-5 object-contain" />
                                            {p.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {botTeam.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                                                botTeamHp[i] <= 0
                                                    ? 'bg-slate-200 text-slate-400 line-through'
                                                    : i === botActiveIndex
                                                    ? 'bg-red-400 text-white'
                                                    : 'bg-white text-slate-600 shadow'
                                            }`}
                                        >
                                            {p.name}
                                            <img src={p.image} alt={p.name} className="w-5 h-5 object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-800 rounded-xl p-3 h-24 overflow-y-auto text-sm mb-4 font-mono">
                            {log.map((line, i) => (
                                <div key={i} className="text-slate-100 mb-0.5">{line}</div>
                            ))}
                            <div ref={logEndRef} />
                        </div>

                        {phase === 'result' ? (
                            <div className="text-center bg-white rounded-2xl shadow-lg p-6">
                                {mode === 'battle' ? (
                                    <>
                                        <h2 className="text-2xl font-extrabold mb-2">
                                            {winner === 'player' ? '🎉 Kamu Menang!' : '💀 Kamu Kalah!'}
                                        </h2>
                                        <p className="text-slate-500 mb-4">
                                            {winner === 'player'
                                                ? `${activePlayer.name} berhasil mengalahkan ${activeBot.name}!`
                                                : `${activeBot.name} milik lawan terlalu kuat. Coba lagi!`}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-extrabold mb-2">
                                            {challengeResult === 'won' ? '🏆 Juara Liga!' : '💀 Challenge Gagal'}
                                        </h2>
                                        <p className="text-slate-500 mb-4">
                                            {challengeResult === 'won'
                                                ? `${nickname} berhasil menembus seluruh gauntlet trainer!`
                                                : `Timmu gugur di ${currentLevel?.label}${rivalTrainer ? ` melawan ${rivalTrainer.name}` : ''}. Terus berlatih, ${nickname}!`}
                                        </p>
                                    </>
                                )}
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={playAgain}
                                        className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg"
                                    >
                                        Main Lagi
                                    </button>
                                    <button
                                        onClick={backToStart}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg"
                                    >
                                        Ganti Trainer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {activePlayer.moves.map((move) => (
                                    <button
                                        key={move.name}
                                        disabled={busy}
                                        onClick={() => handleMove(move)}
                                        className="bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 rounded-lg px-4 py-3 text-left shadow transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm">{move.name}</span>
                                            <span
                                                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                                                style={{ backgroundColor: TYPE_COLORS[move.type] || '#777' }}
                                            >
                                                {move.type}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Power {move.power ?? '-'} &middot; Akurasi {move.accuracy ?? '-'}%
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
