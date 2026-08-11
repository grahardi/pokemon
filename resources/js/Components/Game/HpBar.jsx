export default function HpBar({ current, max }) {
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    const color = pct > 50 ? '#4ADE80' : pct > 20 ? '#FACC15' : '#F87171';

    return (
        <div className="w-full">
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-900">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
            <div className="text-right text-xs text-slate-300 mt-0.5">{Math.max(0, current)}/{max}</div>
        </div>
    );
}
