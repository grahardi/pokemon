import { TYPE_COLORS } from '../../data/typeChart';

export default function TeamPickCard({ pokemon, selected, onToggle, disabled }) {
    return (
        <button
            onClick={() => onToggle(pokemon)}
            disabled={disabled && !selected}
            className={`bg-white rounded-2xl shadow-lg p-4 text-center transition-all border-2 relative ${
                selected
                    ? 'border-amber-400 ring-2 ring-amber-300'
                    : disabled
                    ? 'border-transparent opacity-40 cursor-not-allowed'
                    : 'border-transparent hover:-translate-y-1 hover:shadow-xl hover:border-slate-200'
            }`}
        >
            {selected && (
                <span className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    ✓
                </span>
            )}
            <div className="text-xs text-slate-400 font-semibold mb-1">
                #{String(pokemon.dex_number).padStart(3, '0')}
            </div>
            <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24 object-contain mx-auto" />
            <h3 className="font-bold text-sm text-slate-800 mt-1">{pokemon.name}</h3>
            <div className="flex justify-center gap-1 mt-1.5">
                {pokemon.types.map((t) => (
                    <span
                        key={t}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: TYPE_COLORS[t] || '#777' }}
                    >
                        {t}
                    </span>
                ))}
            </div>
        </button>
    );
}
