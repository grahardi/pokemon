import { useRef, useState } from 'react';

export default function TrainerSelect({ trainers, onPick }) {
    const [drawnId, setDrawnId] = useState(null);
    const scrollRef = useRef(null);

    if (!trainers || trainers.length === 0) {
        return (
            <p className="text-center text-slate-400 text-sm py-8">
                Belum ada trainer tersedia. Admin situs perlu menambahkan trainer dulu di panel admin.
            </p>
        );
    }

    const scrollByCard = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 270, behavior: 'smooth' });
    };

    const handleCardClick = (t) => {
        if (drawnId === t.id) return;
        setDrawnId(t.id);
    };

    return (
        <div className="relative -mx-4 px-4">
            {trainers.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => scrollByCard(-1)}
                        className="hidden sm:flex absolute left-1 top-[7.5rem] z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600"
                        aria-label="Sebelumnya"
                    >
                        <i className="bi bi-chevron-left text-lg"></i>
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByCard(1)}
                        className="hidden sm:flex absolute right-1 top-[7.5rem] z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600"
                        aria-label="Berikutnya"
                    >
                        <i className="bi bi-chevron-right text-lg"></i>
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pt-2 pb-3 snap-x snap-mandatory scrollbar-hide sm:px-12"
            >
                {trainers.map((t) => {
                    const isDrawn = drawnId === t.id;
                    return (
                        <div
                            key={t.id}
                            className="snap-center shrink-0 w-60 first:ml-[calc(50%-7.5rem)] last:mr-[calc(50%-7.5rem)] sm:first:ml-0 sm:last:mr-0"
                        >
                            <div
                                onClick={() => handleCardClick(t)}
                                className={`relative w-full rounded-2xl p-5 text-center shadow-lg cursor-pointer transition-all duration-200 ${
                                    isDrawn ? '-translate-y-4 scale-105 shadow-2xl ring-4 ring-amber-300' : 'hover:-translate-y-1'
                                }`}
                                style={{ background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` }}
                            >
                                <div className="w-full aspect-[4/6] rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden relative">
                                    {t.image_url ? (
                                        <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <i className={`bi ${t.icon} text-5xl text-white`}></i>
                                    )}
                                    {isDrawn && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-victory-pop">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); onPick(t); }}
                                                className="bg-white text-slate-800 font-bold px-5 py-2.5 rounded-lg shadow-lg hover:bg-slate-50"
                                            >
                                                Pilih {t.name}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="font-bold text-white text-lg">{t.name}</div>
                                <div className="text-white/70 text-sm min-h-[1.25rem]">{t.subtitle}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {trainers.length > 1 && (
                <p className="text-center text-xs text-slate-400 mt-1">
                    <span className="sm:hidden">👈 Geser untuk lihat trainer lain 👉</span>
                    <span className="hidden sm:inline">Klik kartu untuk pilih, gunakan panah untuk geser</span>
                </p>
            )}
        </div>
    );
}
