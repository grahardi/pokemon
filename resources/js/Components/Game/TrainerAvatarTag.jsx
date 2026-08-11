export default function TrainerAvatarTag({ trainer, align = 'left' }) {
    if (!trainer) return null;

    return (
        <div className={`flex items-center gap-1.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow"
                style={{ background: `linear-gradient(135deg, ${trainer.gradient_from}, ${trainer.gradient_to})` }}
            >
                {trainer.image_url ? (
                    <img src={trainer.image_url} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                    <i className={`bi ${trainer.icon} text-white text-xs`}></i>
                )}
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                {trainer.name}
            </span>
        </div>
    );
}
