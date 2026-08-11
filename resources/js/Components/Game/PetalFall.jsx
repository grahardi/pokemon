const PETAL_COLORS = ['#CBD5E1', '#94A3B8', '#E2E8F0', '#A8A29E'];

export default function PetalFall() {
    const pieces = Array.from({ length: 22 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
            {pieces.map((_, i) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 0.6;
                const duration = 2.4 + Math.random() * 1.8;
                const color = PETAL_COLORS[i % PETAL_COLORS.length];
                const size = 8 + Math.random() * 6;

                return (
                    <span
                        key={i}
                        className="absolute top-0 animate-petal-fall"
                        style={{
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: color,
                            borderRadius: '0 100% 0 100%',
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                        }}
                    />
                );
            })}
        </div>
    );
}
