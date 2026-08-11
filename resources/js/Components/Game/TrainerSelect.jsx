export default function TrainerSelect({ trainers, selected, onSelect }) {
    if (!trainers || trainers.length === 0) {
        return (
            <p className="text-center text-slate-400 text-sm py-8">
                Belum ada trainer tersedia. Admin situs perlu menambahkan trainer dulu di panel admin.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trainers.map((t) => {
                const isActive = selected?.id === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t)}
                        className={`rounded-2xl p-4 text-center transition-all ${
                            isActive ? 'ring-4 ring-amber-300 scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` }}
                    >
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                            {t.image_url ? (
                                <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                            ) : (
                                <i className={`bi ${t.icon} text-2xl text-white`}></i>
                            )}
                        </div>
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        <div className="text-white/70 text-xs">{t.subtitle}</div>
                    </button>
                );
            })}
        </div>
    );
}
