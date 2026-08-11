import Confetti from './Confetti';
import PetalFall from './PetalFall';
import TrainerResultAvatar from './TrainerResultAvatar';

export default function TrainerDuelResult({ playerTrainer, rivalTrainer, playerWon, title, subtitle, onContinue }) {
    return (
        <div className="relative bg-gradient-to-b from-sky-400 to-emerald-300 rounded-2xl overflow-hidden border-4 border-white shadow-lg p-8 text-center min-h-[22rem] flex flex-col items-center justify-center">
            {playerWon ? <Confetti /> : <PetalFall />}

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-6 mb-6">
                    <TrainerResultAvatar trainer={playerTrainer} won={playerWon} />
                    <div className="text-3xl font-black text-white drop-shadow">VS</div>
                    <TrainerResultAvatar trainer={rivalTrainer} won={!playerWon} />
                </div>

                <h2 className="text-2xl font-extrabold text-white drop-shadow mb-1">{title}</h2>
                {subtitle && <p className="text-white/90 mb-6">{subtitle}</p>}

                <button
                    onClick={onContinue}
                    className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-3 rounded-lg shadow-lg"
                >
                    Lanjut ke Lobi
                </button>
            </div>
        </div>
    );
}
