export default function VictoryBurst({ title, subtitle }) {
    const sparkles = ['✨', '⭐', '🎉', '✨', '⭐'];

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden">
            {sparkles.map((s, i) => (
                <span
                    key={i}
                    className="absolute text-2xl animate-sparkle"
                    style={{
                        left: `${15 + i * 18}%`,
                        top: '55%',
                        animationDelay: `${i * 0.1}s`,
                    }}
                >
                    {s}
                </span>
            ))}
            <div className="animate-victory-pop bg-white rounded-2xl px-8 py-6 text-center shadow-2xl">
                <div className="text-4xl mb-1">🏆</div>
                <div className="font-extrabold text-lg text-slate-800">{title}</div>
                {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
            </div>
        </div>
    );
}
