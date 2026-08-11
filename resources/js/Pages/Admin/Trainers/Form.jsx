import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const ICON_OPTIONS = [
    'bi-award-fill', 'bi-shield-fill', 'bi-mountain', 'bi-lightning-charge-fill',
    'bi-person-fill', 'bi-star-fill', 'bi-fire', 'bi-lightning-fill',
    'bi-gem', 'bi-trophy-fill', 'bi-skull', 'bi-emoji-sunglasses-fill',
];

export default function Form({ trainer }) {
    const isEdit = !!trainer;
    const [previewUrl, setPreviewUrl] = useState(trainer?.image_url || '');

    const { data, setData, post, put, processing, errors } = useForm({
        name: trainer?.name || '',
        subtitle: trainer?.subtitle || '',
        icon: trainer?.icon || 'bi-person-fill',
        gradient_from: trainer?.gradient_from || '#EF4444',
        gradient_to: trainer?.gradient_to || '#3B82F6',
        image: null,
        image_url: trainer?.image_url || '',
        pick_sound: null,
        order: trainer?.order ?? 0,
        is_active: trainer?.is_active ?? true,
    });

    useEffect(() => {
        if (data.image) {
            const url = URL.createObjectURL(data.image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(data.image_url || '');
    }, [data.image, data.image_url]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setData('image', file);
    };

    const removeUploadedImage = () => {
        setData('image', null);
        setData('image_url', '');
    };

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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Foto Avatar (opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm rounded-lg border border-slate-300 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-slate-100 file:text-slate-700 file:font-medium hover:file:bg-slate-200"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            Bisa foto full body — rasio potret seperti 4:6 cocok. Maks 4MB. Kosongkan untuk pakai ikon + gradient di bawah.
                        </p>
                        {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={removeUploadedImage}
                                className="text-xs text-red-500 hover:underline mt-1"
                            >
                                Hapus gambar, pakai ikon saja
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Atau isi URL Gambar (alternatif upload)</label>
                        <input
                            type="text"
                            value={data.image_url}
                            onChange={(e) => setData('image_url', e.target.value)}
                            placeholder="https://..."
                            disabled={!!data.image}
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Suara Saat Dipilih (opsional)</label>
                        <p className="text-xs text-slate-400 mb-2">
                            Dimainkan saat pemain memilih trainer ini. Kosongkan untuk pakai suara default global (diatur di{' '}
                            <a href="/admin/sound" className="text-blue-600 hover:underline">Pengaturan Suara</a>).
                        </p>
                        {trainer?.pick_sound_url && !data.pick_sound && (
                            <div className="flex items-center gap-3 mb-2 bg-slate-50 rounded-lg p-2">
                                <audio controls src={trainer.pick_sound_url} className="h-8 flex-1" />
                                <a
                                    href={`/admin/trainers/${trainer.id}/reset-sound`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (confirm('Hapus suara custom, pakai default global?')) {
                                            router.post(`/admin/trainers/${trainer.id}/reset-sound`);
                                        }
                                    }}
                                    className="text-xs text-red-500 hover:underline shrink-0"
                                >
                                    Reset ke default
                                </a>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                            onChange={(e) => setData('pick_sound', e.target.files?.[0] || null)}
                            className="w-full text-sm rounded-lg border border-slate-300 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-slate-100 file:text-slate-700 file:font-medium hover:file:bg-slate-200"
                        />
                        {errors.pick_sound && <p className="text-red-600 text-xs mt-1">{errors.pick_sound}</p>}
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
                        <div className="w-28 aspect-[4/6] rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                            {previewUrl ? (
                                <img src={previewUrl} alt={data.name} className="w-full h-full object-cover" />
                            ) : (
                                <i className={`bi ${data.icon} text-4xl text-white`}></i>
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
