import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ newsList }) {
    const destroy = (item) => {
        if (confirm(`Hapus berita "${item.title}"?`)) {
            router.delete(`/admin/news/${item.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Berita">
            <div className="flex justify-end mb-4">
                <Link
                    href="/admin/news/create"
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                    + Tulis Berita
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                        <tr>
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Tanggal Terbit</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {newsList.data.map((n) => (
                            <tr key={n.id}>
                                <td className="px-4 py-3 font-medium text-slate-800">{n.title}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{n.category}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {n.published_at ? new Date(n.published_at).toLocaleDateString('id-ID') : '-'}
                                </td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <Link href={`/admin/news/${n.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                    <button onClick={() => destroy(n)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {newsList.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">Belum ada berita.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {newsList.links.length > 3 && (
                <div className="flex flex-wrap gap-1 mt-4">
                    {newsList.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm border ${
                                link.active ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'
                            } ${!link.url ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-50'}`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
