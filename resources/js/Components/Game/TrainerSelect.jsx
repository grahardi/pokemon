import { useEffect, useRef, useState } from 'react';

export default function TrainerSelect({ trainers, onPick }) {
    const [drawnId, setDrawnId] = useState(null);
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const isJumping = useRef(false);
    const scrollTimeout = useRef(null);

    const hasMultiple = trainers && trainers.length > 1;
    // Klon trainer terakhir di depan & trainer pertama di belakang, biar bisa "loop"
    // tanpa terasa patah begitu geser melewati ujung.
    const list = hasMultiple
        ? [trainers[trainers.length - 1], ...trainers, trainers[0]]
        : (trainers || []);

    const jumpTo = (index, smooth = false) => {
        const container = scrollRef.current;
        const target = itemRefs.current[index];
        if (!container || !target) return;
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = (targetRect.left + targetRect.width / 2) - (containerRect.left + containerRect.width / 2);
        if (smooth) {
            container.scrollBy({ left: offset, behavior: 'smooth' });
        } else {
            container.scrollLeft += offset;
        }
    };

    useEffect(() => {
        if (!hasMultiple) return;
        // Posisikan awal ke trainer pertama asli (index 1), tanpa animasi,
        // supaya klon trainer terakhir sudah "mengintip" di sisi kiri sejak awal.
        const raf = requestAnimationFrame(() => jumpTo(1, false));
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainers]);

    const getCenterIndex = () => {
        const container = scrollRef.current;
        if (!container) return null;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        itemRefs.current.forEach((el, idx) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.left + rect.width / 2 - containerCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = idx;
            }
        });
        return closestIdx;
    };

    const handleScrollSettled = () => {
        if (!hasMultiple || isJumping.current) return;
        const idx = getCenterIndex();
        if (idx === null) return;

        if (idx === 0) {
            isJumping.current = true;
            jumpTo(list.length - 2, false); // klon terakhir -> trainer asli terakhir
            setTimeout(() => { isJumping.current = false; }, 50);
        } else if (idx === list.length - 1) {
            isJumping.current = true;
            jumpTo(1, false); // klon pertama -> trainer asli pertama
            setTimeout(() => { isJumping.current = false; }, 50);
        }
    };

    const onScroll = () => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(handleScrollSettled, 120);
    };

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
            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={() => scrollByCard(-1)}
                        className="flex absolute left-1 top-[7.5rem] z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600"
                        aria-label="Sebelumnya"
                    >
                        <i className="bi bi-chevron-left text-lg"></i>
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByCard(1)}
                        className="flex absolute right-1 top-[7.5rem] z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-slate-50 text-slate-600"
                        aria-label="Berikutnya"
                    >
                        <i className="bi bi-chevron-right text-lg"></i>
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                onScroll={onScroll}
                className="flex gap-4 overflow-x-auto pt-2 pb-3 snap-x snap-mandatory scrollbar-hide px-11 sm:px-12"
            >
                {list.map((t, i) => {
                    const isDrawn = drawnId === t.id;
                    return (
                        <div
                            key={`${t.id}-${i}`}
                            ref={(el) => (itemRefs.current[i] = el)}
                            className="snap-center shrink-0 w-60"
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

            {hasMultiple && (
                <p className="text-center text-xs text-slate-400 mt-1">
                    <span className="sm:hidden">👈 Geser atau ketuk panah 👉</span>
                    <span className="hidden sm:inline">Klik kartu untuk pilih, atau geser/pakai panah</span>
                </p>
            )}
        </div>
    );
}
