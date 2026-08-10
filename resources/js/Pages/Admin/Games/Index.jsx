import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ games }) {
    const destroy = (game) => {
        if (confirm(`Hapus game "${game.title}"?`)) {
            router.delete(`/admin/games/${game.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Game">
            <div className="flex justify-end mb-4">
                <Link
                    href="/admin/games/create"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                    + Tambah Game
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                        <tr>
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Platform</th>
                            <th className="px-4 py-3">Generasi</th>
                            <th className="px-4 py-3">Rilis</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {games.map((g) => (
                            <tr key={g.id}>
                                <td className="px-4 py-3 font-medium text-slate-800">{g.title}</td>
                                <td className="px-4 py-3 text-slate-500">{g.platform}</td>
                                <td className="px-4 py-3 text-slate-500">{g.generation}</td>
                                <td className="px-4 py-3 text-slate-500">
                                    {g.release_date ? new Date(g.release_date).toLocaleDateString('id-ID') : '-'}
                                </td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <Link href={`/admin/games/${g.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                    <button onClick={() => destroy(g)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {games.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Belum ada game.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
