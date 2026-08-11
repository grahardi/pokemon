export default function LevelTrack({ levels, clearedLevels, onSelectLevel }) {
    return (
        <div className="space-y-2">
            {levels.map((lvl, i) => {
                const cleared = clearedLevels.includes(i);
                const unlocked = i === 0 || clearedLevels.includes(i - 1);
                const status = cleared ? 'cleared' : unlocked ? 'available' : 'locked';

                return (
                    <div
                        key={lvl.level}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                            status === 'locked' ? 'bg-slate-100 opacity-60' : 'bg-white shadow'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                style={{ backgroundColor: status === 'locked' ? '#CBD5E1' : lvl.color }}
                            >
                                {cleared ? '✓' : lvl.level}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-800">
                                    {lvl.isBoss ? '👑 ' : ''}{lvl.label}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {cleared ? 'Sudah dikalahkan' : unlocked ? 'Siap ditantang' : 'Terkunci'}
                                </div>
                            </div>
                        </div>
                        {status !== 'locked' && (
                            <button
                                onClick={() => onSelectLevel(i)}
                                className={`text-xs font-bold px-3 py-2 rounded-lg ${
                                    cleared ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            >
                                {cleared ? 'Ulangi' : 'Mulai'}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
