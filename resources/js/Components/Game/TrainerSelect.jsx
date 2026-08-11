import { TRAINERS } from '../../data/trainers';

export default function TrainerSelect({ selected, onSelect }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRAINERS.map((t) => {
                const isActive = selected?.id === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t)}
                        className={`rounded-2xl p-4 text-center transition-all bg-gradient-to-br ${t.gradient} ${
                            isActive ? `ring-4 ${t.ring} scale-105` : 'opacity-80 hover:opacity-100'
                        }`}
                    >
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${t.icon} text-2xl text-white`}></i>
                        </div>
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        <div className="text-white/70 text-xs">{t.subtitle}</div>
                    </button>
                );
            })}
        </div>
    );
}
