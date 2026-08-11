import { TYPE_COLORS } from '../../data/typeChart';

export default function LegendaryDropCard({ pokemon, tier, team, onReplace, onSkip }) {
    return (
        <div className="max-w-lg mx-auto">
            <div
                className="rounded-2xl p-1 shadow-xl mb-6"
                style={{ background: `linear-gradient(135deg, ${tier.color}, #FEF3C7)` }}
            >
                <div className="bg-white rounded-2xl p-6 text-center">
                    <div className="text-sm font-bold mb-1" style={{ color: tier.color }}>
                        {tier.emoji} {tier.label.toUpperCase()} DITEMUKAN! {tier.emoji}
                    </div>
                    <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-contain mx-auto" />
                    <h3 className="font-extrabold text-xl text-slate-800 mt-2">{pokemon.name}</h3>
                    <div className="flex justify-center gap-1 mt-2">
                        {pokemon.types.map((t) => (
                            <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: TYPE_COLORS[t] || '#777' }}>
                                {t}
                            </span>
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm mt-3">Pilih Pokemon di timmu yang mau digantikan:</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {team.map((p, i) => (
                    <button
                        key={p.id}
                        onClick={() => onReplace(i)}
                        className="bg-white rounded-xl shadow p-3 text-center hover:-translate-y-1 hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-400"
                    >
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-contain mx-auto" />
                        <div className="text-xs font-semibold text-slate-700 mt-1">{p.name}</div>
                        <div className="text-[10px] text-red-500 mt-0.5">Ganti dengan {pokemon.name}</div>
                    </button>
                ))}
            </div>

            <button onClick={onSkip} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg text-sm">
                Lewati, pertahankan tim saat ini
            </button>
        </div>
    );
}
