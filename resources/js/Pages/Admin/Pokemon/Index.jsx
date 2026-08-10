import AdminLayout from '../../../Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ pokemons, filters }) {
    const [q, setQ] = useState(filters.q || '');

    const search = (e) => {
        e.preventDefault();
        router.get('/admin/pokemon', { q }, { preserveState: true });
    };

    return (
        <AdminLayout title="Kelola Katalog Pokemon">
            <form onSubmit={search} className="flex gap-2 mb-4 max-w-md">
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari nama Pokemon..."
                    className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Cari
                </button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3"></th>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Tipe</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {pokemons.data.map((p) => (
                            <tr key={p.id}>
                                <td className="px-4 py-3 text-slate-400">#{String(p.dex_number).padStart(3, '0')}</td>
                                <td className="px-4 py-3">
                                    <img src={p.display_image} alt={p.name} className="w-10 h-10 object-contain" loading="lazy" />
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                                <td className="px-4 py-3 text-slate-500">{p.types.join(' / ')}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={`/admin/pokemon/${p.slug}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                </td>
                            </tr>
                        ))}
                        {pokemons.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Tidak ada Pokemon ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pokemons.links.length > 3 && (
                <div className="flex flex-wrap gap-1 mt-4">
                    {pokemons.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm border ${
                                link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                            } ${!link.url ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-50'}`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
