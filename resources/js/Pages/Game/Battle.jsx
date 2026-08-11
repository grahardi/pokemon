import { useState, useRef } from 'react';
import { Link, Head } from '@inertiajs/react';
import HpBar from '../../Components/Game/HpBar';
import PokemonPickCard from '../../Components/Game/PokemonPickCard';
import { TYPE_COLORS } from '../../data/typeChart';
import { battleMaxHp, calculateDamage, pickBotMove, effectivenessLabel } from '../../lib/battleEngine';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Battle({ totalPokemon }) {
    const [phase, setPhase] = useState('nickname'); // nickname | loading | select | battle | result
    const [nickname, setNickname] = useState('');
    const [choices, setChoices] = useState([]);
    const [error, setError] = useState('');

    const [player, setPlayer] = useState(null);
    const [bot, setBot] = useState(null);
    const [playerHp, setPlayerHp] = useState(0);
    const [botHp, setBotHp] = useState(0);
    const [log, setLog] = useState([]);
    const [busy, setBusy] = useState(false);
    const [attacking, setAttacking] = useState(null); // 'player' | 'bot' | null
    const [hit, setHit] = useState(null);
    const [winner, setWinner] = useState(null);

    const playerHpRef = useRef(0);
    const botHpRef = useRef(0);
    const winnerRef = useRef(null);
    const logEndRef = useRef(null);

    const addLog = (msg) => {
        setLog((prev) => [...prev, msg]);
        setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    const startGame = async () => {
        if (!nickname.trim()) {
            setError('Isi nickname dulu ya!');
            return;
        }
        setError('');
        setPhase('loading');
        try {
            const res = await fetch('/api/tarung/random?count=3');
            const data = await res.json();
            setChoices(data);
            setPhase('select');
        } catch (e) {
            setError('Gagal memuat Pokemon. Coba lagi.');
            setPhase('nickname');
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

            setPlayer(picked);
            setBot(botPokemon);
            playerHpRef.current = pHp;
            botHpRef.current = bHp;
            setPlayerHp(pHp);
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

    const performAttack = async (side, move, attacker, defender) => {
        setAttacking(side);
        addLog(`${side === 'player' ? nickname : 'Musuh'} (${attacker.name}) menggunakan ${move.name}!`);
        await sleep(500);
        setAttacking(null);

        const result = calculateDamage(attacker, defender, move);

        if (result.missed) {
            addLog('Serangan meleset!');
            await sleep(300);
            return;
        }

        setHit(side === 'player' ? 'bot' : 'player');
        await sleep(150);

        if (side === 'player') {
            botHpRef.current = Math.max(0, botHpRef.current - result.damage);
            setBotHp(botHpRef.current);
        } else {
            playerHpRef.current = Math.max(0, playerHpRef.current - result.damage);
            setPlayerHp(playerHpRef.current);
        }

        const effMsg = effectivenessLabel(result.effectiveness);
        addLog(`${defender.name} terkena ${result.damage} damage!${effMsg ? ' ' + effMsg : ''}`);
        await sleep(400);
        setHit(null);

        const defenderHpNow = side === 'player' ? botHpRef.current : playerHpRef.current;
        if (defenderHpNow <= 0) {
            addLog(`${defender.name} pingsan!`);
            winnerRef.current = side;
            setWinner(side);
            await sleep(600);
        }
    };

    const handleMove = async (move) => {
        if (busy || winnerRef.current) return;
        setBusy(true);

        const order = player.speed >= bot.speed ? ['player', 'bot'] : ['bot', 'player'];

        for (const side of order) {
            if (winnerRef.current) break;
            if (side === 'player') {
                await performAttack('player', move, player, bot);
            } else {
                const botMove = pickBotMove(bot, player);
                await performAttack('bot', botMove, bot, player);
            }
        }

        setBusy(false);
        if (winnerRef.current) setPhase('result');
    };

    const playAgain = () => {
        setPhase('nickname');
        setChoices([]);
        setPlayer(null);
        setBot(null);
        setLog([]);
        setWinner(null);
        winnerRef.current = null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-blue-800 text-white">
            <Head title="Arena Tarung" />

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-white/80 hover:text-white text-sm">&larr; Kembali ke situs</Link>
                    <span className="text-xs text-white/60">{totalPokemon}+ Pokemon siap bertarung</span>
                </div>

                {phase === 'nickname' && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center max-w-md mx-auto mt-16">
                        <h1 className="text-3xl font-extrabold mb-2">⚔️ Arena Tarung</h1>
                        <p className="text-white/70 text-sm mb-6">Pilih Pokemon-mu dan lawan bot dalam pertarungan seru!</p>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && startGame()}
                            placeholder="Masukkan nickname..."
                            maxLength={20}
                            className="w-full rounded-lg px-4 py-3 text-slate-800 mb-3 text-center font-semibold"
                        />
                        {error && <p className="text-red-200 text-sm mb-3">{error}</p>}
                        <button
                            onClick={startGame}
                            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-lg transition"
                        >
                            Masuk Lobi
                        </button>
                    </div>
                )}

                {phase === 'loading' && (
                    <div className="text-center mt-24">
                        <div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                        <p className="text-white/70">Memuat...</p>
                    </div>
                )}

                {phase === 'select' && (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Halo, {nickname}!</h2>
                        <p className="text-white/70 text-center text-sm mb-6">Pilih salah satu Pokemon untuk bertarung:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {choices.map((p) => (
                                <PokemonPickCard key={p.id} pokemon={p} onPick={pickPokemon} />
                            ))}
                        </div>
                    </div>
                )}

                {(phase === 'battle' || phase === 'result') && player && bot && (
                    <div>
                        {/* Battle field */}
                        <div className="relative bg-gradient-to-b from-sky-400 to-emerald-300 rounded-2xl overflow-hidden h-72 mb-4 border-4 border-white/20">
                            {/* Bot side (top right) */}
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
                                } ${hit === 'bot' ? 'animate-hit' : ''} ${winner === 'player' ? 'animate-faint' : ''}`}
                            />

                            {/* Player side (bottom left) */}
                            <div className="absolute bottom-4 left-6">
                                <div className="bg-white/90 rounded-lg px-3 py-1.5 text-slate-800 shadow mb-2 w-40">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                                        <span>{player.name}</span>
                                    </div>
                                    <HpBar current={playerHp} max={battleMaxHp(player)} />
                                </div>
                            </div>
                            <img
                                src={player.image}
                                alt={player.name}
                                className={`absolute bottom-8 left-16 w-32 h-32 object-contain drop-shadow-xl ${
                                    attacking === 'player' ? 'animate-lunge-right' : ''
                                } ${hit === 'player' ? 'animate-hit' : ''} ${winner === 'bot' ? 'animate-faint' : ''}`}
                            />
                        </div>

                        {/* Battle log */}
                        <div className="bg-black/30 rounded-xl p-3 h-24 overflow-y-auto text-sm mb-4 font-mono">
                            {log.map((line, i) => (
                                <div key={i} className="text-white/90 mb-0.5">{line}</div>
                            ))}
                            <div ref={logEndRef} />
                        </div>

                        {/* Result or moves */}
                        {phase === 'result' ? (
                            <div className="text-center bg-white/10 backdrop-blur rounded-2xl p-6">
                                <h2 className="text-2xl font-extrabold mb-2">
                                    {winner === 'player' ? '🎉 Kamu Menang!' : '💀 Kamu Kalah!'}
                                </h2>
                                <p className="text-white/70 mb-4">
                                    {winner === 'player'
                                        ? `${player.name} berhasil mengalahkan ${bot.name}!`
                                        : `${bot.name} milik lawan terlalu kuat. Coba lagi!`}
                                </p>
                                <button
                                    onClick={playAgain}
                                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg"
                                >
                                    Main Lagi
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {player.moves.map((move) => (
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
