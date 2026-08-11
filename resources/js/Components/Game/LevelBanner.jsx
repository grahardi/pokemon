export default function LevelBanner({ level }) {
    if (!level) return null;

    return (
        <div
            className="rounded-xl px-4 py-2 mb-3 text-center font-bold text-white shadow"
            style={{ backgroundColor: level.color }}
        >
            {level.isBoss ? '👑 ' : `Level ${level.level} — `}
            {level.label}
        </div>
    );
}
