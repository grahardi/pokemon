import { TYPE_COLORS } from '../../data/typeChart';

export default function EvolveSelect({ team, evolutions, selected, onSelectTarget }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {team.map((p, slotIndex) => {
                const options = evolutions[p.dex_number] || [];

                return (
                    <div key={p.id} className="bg-white rounded-2xl shadow p-4 text-center">
                        <img src={p.image} alt={p.name} className="w-20 h-20 object-contain mx-auto" />
                        <div className="font-bold text-sm text-slate-800">{p.name}</div>
                        <div className="flex justify-center gap-1 mt-1 mb-3">
                            {p.types.map((t) => (
                                <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: TYPE_COLORS[t] || '#777' }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        {options.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Sudah bentuk akhir</p>
                        ) : (
                            <div className="space-y-2">
                                {options.map((opt) => {
                                    const isSelected = selected?.slotIndex === slotIndex && selected?.target.id === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => onSelectTarget(slotIndex, opt)}
                                            className={`w-full flex items-center gap-2 rounded-lg p-2 border-2 transition ${
                                                isSelected ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className="text-xs">→</span>
                                            <img src={opt.image} alt={opt.name} className="w-10 h-10 object-contain" />
                                            <span className="text-sm font-semibold text-slate-700">{opt.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
