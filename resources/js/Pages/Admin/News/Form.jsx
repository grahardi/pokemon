import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Form({ news }) {
    const isEdit = !!news;

    const { data, setData, post, put, processing, errors } = useForm({
        title: news?.title || '',
        category: news?.category || 'Berita',
        excerpt: news?.excerpt || '',
        body: news?.body || '',
        cover_image: news?.cover_image || '',
        published_at: news?.published_at ? news.published_at.substring(0, 10) : '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/news/${news.id}`);
        } else {
            post('/admin/news');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}>
            <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 max-w-3xl space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        >
                            <option>Berita</option>
                            <option>Info</option>
                            <option>Game</option>
                            <option>Pengumuman</option>
                            <option>Event</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Terbit</label>
                        <input
                            type="date"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                            className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar Cover (opsional)</label>
                    <input
                        type="text"
                        value={data.cover_image}
                        onChange={(e) => setData('cover_image', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ringkasan Singkat</label>
                    <textarea
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Isi Berita</label>
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        rows={10}
                        className="w-full rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.body && <p className="text-red-600 text-xs mt-1">{errors.body}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {isEdit ? 'Simpan Perubahan' : 'Publikasikan'}
                    </button>
                    <a href="/admin/news" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700">
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
