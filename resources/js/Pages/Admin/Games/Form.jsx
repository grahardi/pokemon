import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Form({ game }) {
    const isEdit = !!game;

    const { data, setData, post, put, processing, errors } = useForm({
        title: game?.title || '',
        platform: game?.platform || '',
        generation: game?.generation || '',
        release_date: game?.release_date ? game.release_date.substring(0, 10) : '',
        cover_image: game?.cover_image || '',
        description: game?.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/games/${game.id}`);
        } else {
            post('/admin/games');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Game' : 'Tambah Game'}>
            <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Judul Game</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                        <input
                            type="text"
                            value={data.platform}
                            onChange={(e) => setData('platform', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Generasi</label>
                        <input
                            type="text"
                            value={data.generation}
                            onChange={(e) => setData('generation', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Rilis</label>
                    <input
                        type="date"
                        value={data.release_date}
                        onChange={(e) => setData('release_date', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar Cover (opsional)</label>
                    <input
                        type="text"
                        value={data.cover_image}
                        onChange={(e) => setData('cover_image', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Game'}
                    </button>
                    <a href="/admin/games" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700">
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
