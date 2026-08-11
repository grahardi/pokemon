import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

const ICON_OPTIONS = [
    'bi-award-fill', 'bi-shield-fill', 'bi-mountain', 'bi-lightning-charge-fill',
    'bi-person-fill', 'bi-star-fill', 'bi-fire', 'bi-lightning-fill',
    'bi-gem', 'bi-trophy-fill', 'bi-skull', 'bi-emoji-sunglasses-fill',
];

export default function Form({ trainer }) {
    const isEdit = !!trainer;

    const { data, setData, post, put, processing, errors } = useForm({
        name: trainer?.name || '',
        subtitle: trainer?.subtitle || '',
        icon: trainer?.icon || 'bi-person-fill',
        gradient_from: trainer?.gradient_from || '#EF4444',
        gradient_to: trainer?.gradient_to || '#3B82F6',
        image_url: trainer?.image_url || '',
        order: trainer?.order ?? 0,
        is_active: trainer?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/trainers/${trainer.id}`);
        } else {
            post('/admin/trainers');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Trainer' : 'Tambah Trainer'}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
                <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Karakter</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="mis. Ash, Misty, atau nama buatanmu sendiri"
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle / Julukan</label>
                        <input
                            type="text"
                            value={data.subtitle}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            placeholder="mis. Trainer Kanto"
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar Avatar (opsional)</label>
                        <input
                            type="text"
                            value={data.image_url}
                            onChange={(e) => setData('image_url', e.target.value)}
                            placeholder="https://... (kosongkan untuk pakai ikon + gradient)"
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        />
                        <p className="text-xs text-slate-400 mt-1">Kalau diisi, gambar ini dipakai menggantikan ikon di bawah.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ikon (dipakai kalau tidak ada gambar)</label>
                        <div className="grid grid-cols-6 gap-2">
                            {ICON_OPTIONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setData('icon', icon)}
                                    className={`aspect-square rounded-lg flex items-center justify-center border-2 ${
                                        data.icon === icon ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <i className={`bi ${icon} text-lg`}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Warna Gradient Awal</label>
                            <input
                                type="color"
                                value={data.gradient_from}
                                onChange={(e) => setData('gradient_from', e.target.value)}
                                className="w-full h-10 rounded-lg border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Warna Gradient Akhir</label>
                            <input
                                type="color"
                                value={data.gradient_to}
                                onChange={(e) => setData('gradient_to', e.target.value)}
                                className="w-full h-10 rounded-lg border-slate-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil</label>
                            <input
                                type="number"
                                min={0}
                                value={data.order}
                                onChange={(e) => setData('order', Number(e.target.value))}
                                className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300"
                            />
                            <label htmlFor="is_active" className="text-sm text-slate-700">Aktif (tampil di Arena Tarung)</label>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                        >
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Trainer'}
                        </button>
                        <a href="/admin/trainers" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700">
                            Batal
                        </a>
                    </div>
                </form>

                <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Preview</p>
                    <div
                        className="rounded-2xl p-5 text-center shadow"
                        style={{ background: `linear-gradient(135deg, ${data.gradient_from}, ${data.gradient_to})` }}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                            {data.image_url ? (
                                <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
                            ) : (
                                <i className={`bi ${data.icon} text-3xl text-white`}></i>
                            )}
                        </div>
                        <div className="font-bold text-white">{data.name || 'Nama Trainer'}</div>
                        <div className="text-white/70 text-sm">{data.subtitle || 'Subtitle'}</div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
