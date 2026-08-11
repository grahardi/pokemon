const COLORS = ['#FDE047', '#F87171', '#60A5FA', '#4ADE80', '#C084FC', '#FB923C', '#F472B6'];

export default function Confetti() {
    const pieces = Array.from({ length: 36 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
            {pieces.map((_, i) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 0.4;
                const duration = 1.6 + Math.random() * 1.3;
                const color = COLORS[i % COLORS.length];
                const size = 6 + Math.random() * 6;
                const rotate = Math.random() * 360;

                return (
                    <span
                        key={i}
                        className="absolute top-0 animate-confetti-fall rounded-sm"
                        style={{
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size * 1.6}px`,
                            backgroundColor: color,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                            '--rotate-from': `${rotate}deg`,
                        }}
                    />
                );
            })}
        </div>
    );
}
