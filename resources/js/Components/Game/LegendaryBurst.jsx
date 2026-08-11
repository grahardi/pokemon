export default function LegendaryBurst() {
    const sparkles = ['✨', '⭐', '💫', '✨', '⭐', '💫', '✨'];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            {/* Rays berputar di belakang */}
            <div
                className="absolute w-[140%] aspect-square animate-legendary-rays opacity-40"
                style={{
                    background:
                        'repeating-conic-gradient(from 0deg, rgba(245,158,11,0.7) 0deg 8deg, transparent 8deg 20deg)',
                }}
            />
            {/* Partikel emas melayang */}
            {sparkles.map((s, i) => {
                const angle = (360 / sparkles.length) * i;
                const distance = 90 + (i % 3) * 20;
                return (
                    <span
                        key={i}
                        className="absolute text-2xl animate-sparkle"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${angle}deg) translate(${distance}px)`,
                            animationDelay: `${i * 0.15}s`,
                        }}
                    >
                        {s}
                    </span>
                );
            })}
        </div>
    );
}
