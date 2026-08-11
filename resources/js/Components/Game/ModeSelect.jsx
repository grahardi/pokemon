export default function ModeSelect({ onSelect }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                onClick={() => onSelect('battle')}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400"
            >
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-lg text-slate-800">Mode Battle</h3>
                <p className="text-slate-500 text-sm mt-1">Pilih 1 Pokemon, lawan 1 bot secara acak. Cepat &amp; santai.</p>
            </button>
            <button
                onClick={() => onSelect('challenge')}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-transparent hover:border-red-400"
            >
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold text-lg text-slate-800">Mode Challenge</h3>
                <p className="text-slate-500 text-sm mt-1">Susun tim 3 Pokemon, tembus gauntlet berjenjang sampai boss Mewtwo/Arceus.</p>
            </button>
        </div>
    );
}
