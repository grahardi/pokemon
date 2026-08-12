const STAT_LABELS = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    sp_attack: 'Sp. Attack',
    sp_defense: 'Sp. Defense',
    speed: 'Speed',
};

export default function StatBoostCard({ pokemon, changes, onContinue }) {
    return (
        <div className="max-w-md mx-auto text-center">
            <div className="bg-gradient-to-br from-sky-400 to-emerald-400 rounded-2xl p-1 shadow-xl mb-6">
                <div className="bg-white rounded-2xl p-6">
                    <div className="text-sm font-bold text-sky-500 mb-1">📈 STAT NAIK!</div>
                    <img src={pokemon.image} alt={pokemon.name} className="w-28 h-28 object-contain mx-auto" />
                    <h3 className="font-extrabold text-xl text-slate-800 mt-2">{pokemon.name}</h3>
                    <p className="text-slate-400 text-xs mb-4">Hasil kerja keras dari kemenangan ini!</p>

                    <div className="space-y-2">
                        {Object.entries(changes).map(([key, inc]) => (
                            <div key={key} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2 text-sm">
                                <span className="font-semibold text-slate-600">{STAT_LABELS[key] || key}</span>
                                <span className="text-green-600 font-bold">+{inc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={onContinue}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg"
            >
                Lanjut ke Lobi
            </button>
        </div>
    );
}
