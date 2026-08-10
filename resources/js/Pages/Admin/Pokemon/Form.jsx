import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Form({ pokemon }) {
    const { data, setData, put, processing, errors } = useForm({
        name: pokemon.name,
        name_japanese: pokemon.name_japanese || '',
        description: pokemon.description || '',
        image_url: pokemon.image_url || '',
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        sp_attack: pokemon.sp_attack,
        sp_defense: pokemon.sp_defense,
        speed: pokemon.speed,
    });

    const statFields = [
        ['hp', 'HP'],
        ['attack', 'Attack'],
        ['defense', 'Defense'],
        ['sp_attack', 'Sp. Attack'],
        ['sp_defense', 'Sp. Defense'],
        ['speed', 'Speed'],
    ];

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/pokemon/${pokemon.slug}`);
    };

    return (
        <AdminLayout title={`Edit Pokemon — ${pokemon.name}`}>
            <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-5">
                <div className="flex items-center gap-4">
                    <img src={data.image_url} alt={pokemon.name} className="w-20 h-20 object-contain bg-slate-50 rounded-lg" />
                    <div className="text-sm text-slate-500">#{String(pokemon.dex_number).padStart(3, '0')} &middot; {pokemon.types.join(' / ')}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Jepang</label>
                        <input
                            type="text"
                            value={data.name_japanese}
                            onChange={(e) => setData('name_japanese', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar</label>
                    <input
                        type="text"
                        value={data.image_url}
                        onChange={(e) => setData('image_url', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Statistik Dasar</label>
                    <div className="grid grid-cols-3 gap-3">
                        {statFields.map(([key, label]) => (
                            <div key={key}>
                                <label className="block text-xs text-slate-500 mb-1">{label}</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={data[key]}
                                    onChange={(e) => setData(key, Number(e.target.value))}
                                    className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>
                    <a href="/admin/pokemon" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700">
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
