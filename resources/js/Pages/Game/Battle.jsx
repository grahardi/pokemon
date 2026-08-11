import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import HpBar from '../../Components/Game/HpBar';
import PokemonPickCard from '../../Components/Game/PokemonPickCard';
import TeamPickCard from '../../Components/Game/TeamPickCard';
import TrainerSelect from '../../Components/Game/TrainerSelect';
import ModeSelect from '../../Components/Game/ModeSelect';
import LevelBanner from '../../Components/Game/LevelBanner';
import { TYPE_COLORS } from '../../data/typeChart';
import { CHALLENGE_LEVELS } from '../../data/challengeLevels';
import { battleMaxHp, calculateDamage, pickBotMove, effectivenessLabel } from '../../lib/battleEngine';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Battle({ totalPokemon }) {
    const [phase, setPhase] = useState('trainer'); // trainer | nickname | mode | select | team-select | battle | result
    const [trainers, setTrainers] = useState([]);
    const [trainer, setTrainer] = useState(null);
    const [nickname, setNickname] = useState('');
    const [mode, setMode] = useState(null); // battle | challenge
    const [choices, setChoices] = useState([]);
    const [teamSelection, setTeamSelection] = useState([]); // dipakai saat pilih tim challenge
    const [error, setError] = useState('');

    const [team, setTeam] = useState([]); // array pokemon (1 utk battle, 3 utk challenge)
    const [teamHp, setTeamHp] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [bot, setBot] = useState(null);
    const [botHp, setBotHp] = useState(0);
    const [levelIndex, setLevelIndex] = useState(0);
    const [challengeResult, setChallengeResult] = useState(null); // won | lost | null

    const [log, setLog] = useState([]);
    const [busy, setBusy] = useState(false);
    const [attacking, setAttacking] = useState(null);
    const [hit, setHit] = useState(null);
    const [winner, setWinner] = useState(null);

    const teamHpRef = useRef([]);
    const activeIndexRef = useRef(0);
    const botHpRef = useRef(0);
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
            setBot(botPokemon);
            botHpRef.current = bHp;
            setBotHp(bHp);
            setLog([`Pertarungan dimulai! ${nickname} mengirim ${picked.name}, lawan mengirim ${botPokemon.name}!`]);
            setWinner(null);
            winnerRef.current = null;
            setPhase('battle');
        } catch (e) {
            setError('Gagal memuat lawan. Coba lagi.');
            setPhase('select');
        }
    };

    const toggleTeamMember = (pokemon) => {
        setTeamSelection((prev) => {
            const exists = prev.find((p) => p.id === pokemon.id);
            if (exists) return prev.filter((p) => p.id !== pokemon.id);
            if (prev.length >= 3) return prev;
            return [...prev, pokemon];
        });
    };

    const fetchBotForLevel = async (idx) => {
        const lvl = CHALLENGE_LEVELS[idx];
        if (lvl.isBoss) {
            const bossName = lvl.bossNames[Math.floor(Math.random() * lvl.bossNames.length)];
            const res = await fetch(`/api/tarung/find?names=${encodeURIComponent(bossName)}`);
            const data = await res.json();
            return data[0];
        }
        const res = await fetch(`/api/tarung/random?count=1&min_bst=${lvl.minBst}&max_bst=${lvl.maxBst}`);
        const data = await res.json();
        return data[0];
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

            const bot0 = await fetchBotForLevel(0);
            const bHp = battleMaxHp(bot0);
            setBot(bot0);
            botHpRef.current = bHp;
            setBotHp(bHp);
            setLog([
                `${CHALLENGE_LEVELS[0].label} dimulai!`,
                `${nickname} mengirim ${teamSelection[0].name}, lawan mengirim ${bot0.name}!`,
            ]);
            setWinner(null);
            winnerRef.current = null;
            setPhase('battle');
        } catch (e) {
            setError('Gagal memulai challenge. Coba lagi.');
            setPhase('team-select');
        }
    };

    const handleBotFainted = async () => {
        if (mode === 'battle') {
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        const nextLevelIdx = levelIndexRef.current + 1;
        if (nextLevelIdx >= CHALLENGE_LEVELS.length) {
            setChallengeResult('won');
            winnerRef.current = 'player';
            setWinner('player');
            return;
        }

        levelIndexRef.current = nextLevelIdx;
        setLevelIndex(nextLevelIdx);
        addLog(`Naik ke ${CHALLENGE_LEVELS[nextLevelIdx].label}!`);

        const newBot = await fetchBotForLevel(nextLevelIdx);
        const bHp = battleMaxHp(newBot);
        botHpRef.current = bHp;
        setBot(newBot);
        setBotHp(bHp);
        addLog(`Lawan mengirim ${newBot.name}!`);
    };

    const handlePlayerFainted = async () => {
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
        const attacker = side === 'player' ? team[activeIndexRef.current] : bot;
        const defender = side === 'player' ? bot : team[activeIndexRef.current];

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
            botHpRef.current = Math.max(0, botHpRef.current - result.damage);
            setBotHp(botHpRef.current);
        } else {
            const idx = activeIndexRef.current;
            teamHpRef.current[idx] = Math.max(0, teamHpRef.current[idx] - result.damage);
            setTeamHp([...teamHpRef.current]);
        }

        const effMsg = effectivenessLabel(result.effectiveness);
        addLog(`${defender.name} terkena ${result.damage} damage!${effMsg ? ' ' + effMsg : ''}`);
        await sleep(400);
        setHit(null);

        if (side === 'player' && botHpRef.current <= 0) {
            addLog(`${bot.name} pingsan!`);
            await sleep(400);
            await handleBotFainted();
            return true;
        }

        if (side === 'bot' && teamHpRef.current[activeIndexRef.current] <= 0) {
            addLog(`${team[activeIndexRef.current].name} pingsan!`);
            await sleep(400);
            await handlePlayerFainted();
            return true;
        }

        return false;
    };

    const handleMove = async (move) => {
        if (busy || winnerRef.current) return;
        setBusy(true);

        const activePlayerNow = team[activeIndexRef.current];
        const order = activePlayerNow.speed >= bot.speed ? ['player', 'bot'] : ['bot', 'player'];

        for (const side of order) {
            if (winnerRef.current) break;
            let interrupted;
            if (side === 'player') {
                interrupted = await performAttack('player', move);
            } else {
                const botMove = pickBotMove(bot, activePlayerNow);
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
        setLog([]);
        setWinner(null);
        setChallengeResult(null);
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
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden"
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
                        <p className="text-slate-500 text-center text-sm mb-6">Pilih 3 Pokemon untuk menembus gauntlet:</p>
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

                {(phase === 'battle' || phase === 'result') && activePlayer && bot && (
                    <div>
                        {mode === 'challenge' && <LevelBanner level={currentLevel} />}

                        <div className="relative bg-gradient-to-b from-sky-400 to-emerald-300 rounded-2xl overflow-hidden h-72 mb-4 border-4 border-white shadow-lg">
                            <div className="absolute top-4 right-6 text-right">
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                                        <span>{bot.name}</span>
                                    </div>
                                    <HpBar current={botHp} max={battleMaxHp(bot)} />
                                </div>
                            </div>
                            <img
                                src={bot.image}
                                alt={bot.name}
                                className={`absolute top-8 right-16 w-28 h-28 object-contain drop-shadow-xl ${
                                    attacking === 'bot' ? 'animate-lunge-left' : ''
                                } ${hit === 'bot' ? 'animate-hit' : ''} ${winner === 'player' && phase === 'result' ? 'animate-faint' : ''}`}
                            />

                            <div className="absolute bottom-4 left-6">
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
                            <div className="flex gap-2 mb-3 justify-center flex-wrap">
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
                                                ? `${activePlayer.name} berhasil mengalahkan ${bot.name}!`
                                                : `${bot.name} milik lawan terlalu kuat. Coba lagi!`}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-extrabold mb-2">
                                            {challengeResult === 'won' ? '🏆 Juara Liga!' : '💀 Challenge Gagal'}
                                        </h2>
                                        <p className="text-slate-500 mb-4">
                                            {challengeResult === 'won'
                                                ? `${nickname} berhasil menembus seluruh gauntlet dan mengalahkan ${bot.name}!`
                                                : `Timmu gugur di ${currentLevel?.label}. Terus berlatih, ${nickname}!`}
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
