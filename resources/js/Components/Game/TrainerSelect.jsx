import { useState } from 'react';

function CardFace({ trainer, size = 'main' }) {
    const isMain = size === 'main';
    return (
        <div
            className="w-full rounded-2xl p-4 text-center"
            style={{ background: `linear-gradient(135deg, ${trainer.gradient_from}, ${trainer.gradient_to})` }}
        >
            <div className={`w-full aspect-[4/6] rounded-xl bg-white/20 flex items-center justify-center mx-auto overflow-hidden ${isMain ? 'mb-3' : 'mb-2'}`}>
                {trainer.image_url ? (
                    <img src={trainer.image_url} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                    <i className={`bi ${trainer.icon} ${isMain ? 'text-5xl' : 'text-2xl'} text-white`}></i>
                )}
            </div>
            <div className={`font-bold text-white ${isMain ? 'text-lg' : 'text-xs'}`}>{trainer.name}</div>
            {isMain && <div className="text-white/70 text-sm min-h-[1.25rem]">{trainer.subtitle}</div>}
        </div>
    );
}

export default function TrainerSelect({ trainers, onPick }) {
    const [index, setIndex] = useState(0);
    const [drawn, setDrawn] = useState(false);

    if (!trainers || trainers.length === 0) {
        return (
            <p className="text-center text-slate-400 text-sm py-8">
                Belum ada trainer tersedia. Admin situs perlu menambahkan trainer dulu di panel admin.
            </p>
        );
    }

    const len = trainers.length;
    const current = trainers[index];
    const prevIdx = (index - 1 + len) % len;
    const nextIdx = (index + 1) % len;

    const goPrev = () => { setIndex(prevIdx); setDrawn(false); };
    const goNext = () => { setIndex(nextIdx); setDrawn(false); };
    const goTo = (i) => { setIndex(i); setDrawn(false); };

    return (
        <div>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={len < 2}
                    className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600 shrink-0 disabled:opacity-30"
                    aria-label="Trainer sebelumnya"
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                {len > 2 && (
                    <button
                        type="button"
                        onClick={goPrev}
                        className="hidden sm:block w-24 opacity-50 hover:opacity-80 transition-opacity scale-90 shrink-0"
                        aria-label={`Lihat ${trainers[prevIdx].name}`}
                    >
                        <CardFace trainer={trainers[prevIdx]} size="mini" />
                    </button>
                )}

                <div className="w-60 shrink-0 relative">
                    <div
                        onClick={() => setDrawn(true)}
                        className={`relative cursor-pointer transition-all duration-200 rounded-2xl ${
                            drawn ? '-translate-y-4 scale-105 shadow-2xl ring-4 ring-amber-300' : 'shadow-lg hover:-translate-y-1'
                        }`}
                    >
                        <CardFace trainer={current} size="main" />
                        {drawn && (
                            <div className="absolute inset-4 bottom-16 bg-black/40 rounded-xl flex items-center justify-center animate-victory-pop">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onPick(current); }}
                                    className="bg-white text-slate-800 font-bold px-5 py-2.5 rounded-lg shadow-lg hover:bg-slate-50"
                                >
                                    Pilih {current.name}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {len > 2 && (
                    <button
                        type="button"
                        onClick={goNext}
                        className="hidden sm:block w-24 opacity-50 hover:opacity-80 transition-opacity scale-90 shrink-0"
                        aria-label={`Lihat ${trainers[nextIdx].name}`}
                    >
                        <CardFace trainer={trainers[nextIdx]} size="mini" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={goNext}
                    disabled={len < 2}
                    className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600 shrink-0 disabled:opacity-30"
                    aria-label="Trainer berikutnya"
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            {len > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {trainers.map((t, i) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Pilih ${t.name}`}
                            className={`h-2 rounded-full transition-all ${i === index ? 'bg-red-500 w-5' : 'bg-slate-300 w-2'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
