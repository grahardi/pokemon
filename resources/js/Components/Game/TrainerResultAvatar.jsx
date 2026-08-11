export default function TrainerResultAvatar({ trainer, won }) {
    if (!trainer) {
        return (
            <div className="w-20 aspect-[4/6] rounded-xl bg-white/20 flex items-center justify-center">
                <i className="bi bi-question-lg text-white text-2xl"></i>
            </div>
        );
    }

    return (
        <div className={`text-center transition-all ${won ? '' : 'opacity-50 grayscale'}`}>
            <div
                className={`w-20 aspect-[4/6] rounded-xl overflow-hidden mx-auto mb-2 border-4 ${won ? 'border-amber-300' : 'border-white/50'}`}
                style={{ background: `linear-gradient(135deg, ${trainer.gradient_from}, ${trainer.gradient_to})` }}
            >
                {trainer.image_url ? (
                    <img src={trainer.image_url} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <i className={`bi ${trainer.icon} text-3xl text-white`}></i>
                    </div>
                )}
            </div>
            <div className="text-white font-bold text-sm drop-shadow">{trainer.name}</div>
            <div className={`text-xs font-bold mt-0.5 ${won ? 'text-amber-300' : 'text-white/60'}`}>
                {won ? '🏆 MENANG' : 'KALAH'}
            </div>
        </div>
    );
}
