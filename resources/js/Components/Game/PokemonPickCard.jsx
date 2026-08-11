import { TYPE_COLORS } from '../../data/typeChart';

export default function PokemonPickCard({ pokemon, onPick }) {
    return (
        <button
            onClick={() => onPick(pokemon)}
            className="bg-white rounded-2xl shadow-lg p-5 text-center hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-transparent hover:border-amber-400"
        >
            <div className="text-xs text-slate-400 font-semibold mb-1">
                #{String(pokemon.dex_number).padStart(3, '0')}
            </div>
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-contain mx-auto" />
            <h3 className="font-bold text-lg text-slate-800 mt-2">{pokemon.name}</h3>
            <div className="flex justify-center gap-1 mt-2">
                {pokemon.types.map((t) => (
                    <span
                        key={t}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: TYPE_COLORS[t] || '#777' }}
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-1 mt-3 text-xs text-slate-500">
                <div><span className="font-bold text-slate-700">{pokemon.hp}</span><br />HP</div>
                <div><span className="font-bold text-slate-700">{pokemon.attack}</span><br />ATK</div>
                <div><span className="font-bold text-slate-700">{pokemon.speed}</span><br />SPD</div>
            </div>
        </button>
    );
}
