import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Edit({ setting }) {
    const { data, setData, put, processing, errors } = useForm({
        legendary_percent: setting.legendary_percent,
        second_evo_percent: setting.second_evo_percent,
        non_evo_percent: setting.non_evo_percent,
        bonus_evolution_percent: setting.bonus_evolution_percent,
    });

    const total = Number(data.legendary_percent) + Number(data.second_evo_percent) + Number(data.non_evo_percent) + Number(data.bonus_evolution_percent);

    const submit = (e) => {
        e.preventDefault();
        put('/admin/gacha');
    };

    const fields = [
        { key: 'legendary_percent', label: 'Legendaris', desc: 'Pokemon legendaris/mitos (Mewtwo, Rayquaza, dll)', color: 'bg-amber-500' },
        { key: 'second_evo_percent', label: 'Evolusi Tahap 2', desc: 'Pokemon yang sudah pernah evolusi (mis. Ivysaur)', color: 'bg-purple-500' },
        { key: 'non_evo_percent', label: 'Non-Evolusi', desc: 'Pokemon yang sama sekali tidak punya evolusi', color: 'bg-slate-500' },
        { key: 'bonus_evolution_percent', label: 'Bonus Evolusi', desc: 'Kesempatan evolusikan Pokemon di tim pemain', color: 'bg-green-500' },
    ];

    return (
        <AdminLayout title="Pengaturan Gacha Arena Tarung">
            <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                Tiap kelipatan 3x menang di Mode Challenge, pemain dapat 1x kesempatan gacha berdasarkan bobot di bawah ini.
                Angka <strong>tidak wajib total 100%</strong> — sistem otomatis menghitung proporsinya (mis. kalau totalnya 110%,
                masing-masing tetap dihitung relatif terhadap total itu). Silakan eksperimen sampai dapat rasa yang pas.
            </p>

            <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-5">
                {fields.map((f) => (
                    <div key={f.key}>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-700">{f.label}</label>
                            <span className="text-sm font-bold text-slate-800">{data[f.key]}%</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{f.desc}</p>
                        <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${f.color}`}></span>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={data[f.key]}
                                onChange={(e) => setData(f.key, Number(e.target.value))}
                                className="flex-1"
                            />
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={data[f.key]}
                                onChange={(e) => setData(f.key, Number(e.target.value))}
                                className="w-20 rounded-lg border-slate-300 text-center focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        {errors[f.key] && <p className="text-red-600 text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                ))}

                <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total bobot</span>
                    <span className={`font-bold ${total === 100 ? 'text-green-600' : 'text-amber-600'}`}>{total}%</span>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        Simpan Pengaturan
                    </button>
                    <a href="/tarung" target="_blank" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700">
                        Coba di Arena Tarung ↗
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
