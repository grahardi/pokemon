import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ trainers }) {
    const destroy = (trainer) => {
        if (confirm(`Hapus trainer "${trainer.name}"?`)) {
            router.delete(`/admin/trainers/${trainer.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Trainer (Karakter Game)">
            <p className="text-sm text-slate-500 mb-4">
                Trainer di sini muncul sebagai avatar pilihan pemain di halaman{' '}
                <a href="/tarung" target="_blank" className="text-blue-600 hover:underline">Arena Tarung</a>.
                Kamu bebas pakai nama &amp; gambar sendiri di sini.
            </p>

            <div className="flex justify-end mb-4">
                <Link
                    href="/admin/trainers/create"
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                    + Tambah Trainer
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                        <tr>
                            <th className="px-4 py-3">Urutan</th>
                            <th className="px-4 py-3">Preview</th>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Subtitle</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {trainers.map((t) => (
                            <tr key={t.id}>
                                <td className="px-4 py-3 text-slate-400">{t.order}</td>
                                <td className="px-4 py-3">
                                    {t.image_url ? (
                                        <img src={t.image_url} alt={t.name} className="w-8 aspect-[4/6] rounded-md object-cover" />
                                    ) : (
                                        <div
                                            className="w-8 aspect-[4/6] rounded-md flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` }}
                                        >
                                            <i className={`bi ${t.icon} text-white text-xs`}></i>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                                <td className="px-4 py-3 text-slate-500">{t.subtitle}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {t.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <Link href={`/admin/trainers/${t.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                    <button onClick={() => destroy(t)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {trainers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">Belum ada trainer. Tambahkan minimal 1 supaya Arena Tarung bisa dimainkan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
