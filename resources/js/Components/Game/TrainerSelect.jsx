export default function TrainerSelect({ trainers, onPick }) {
    if (!trainers || trainers.length === 0) {
        return (
            <p className="text-center text-slate-400 text-sm py-8">
                Belum ada trainer tersedia. Admin situs perlu menambahkan trainer dulu di panel admin.
            </p>
        );
    }

    return (
        <div className="-mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                {trainers.map((t) => (
                    <div key={t.id} className="snap-center shrink-0 w-60 first:ml-[calc(50%-7.5rem)] last:mr-[calc(50%-7.5rem)]">
                        <button
                            onClick={() => onPick(t)}
                            className="w-full rounded-2xl p-5 text-center shadow-lg transition-transform duration-150 active:scale-95 hover:-translate-y-1"
                            style={{ background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` }}
                        >
                            <div className="w-full aspect-[4/6] rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                                {t.image_url ? (
                                    <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                ) : (
                                    <i className={`bi ${t.icon} text-5xl text-white`}></i>
                                )}
                            </div>
                            <div className="font-bold text-white text-lg">{t.name}</div>
                            <div className="text-white/70 text-sm mb-4 min-h-[1.25rem]">{t.subtitle}</div>
                            <div className="bg-white text-slate-800 font-bold py-2.5 rounded-lg">
                                Pilih {t.name}
                            </div>
                        </button>
                    </div>
                ))}
            </div>
            {trainers.length > 1 && (
                <p className="text-center text-xs text-slate-400 mt-1">👈 Geser untuk lihat trainer lain 👉</p>
            )}
        </div>
    );
}
