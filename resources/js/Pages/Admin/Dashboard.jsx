import AdminLayout from '../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({ stats, latestNews }) {
    const cards = [
        { label: 'Total Pokemon', value: stats.pokemon, color: 'bg-blue-600', href: '/admin/pokemon' },
        { label: 'Total Berita', value: stats.news, color: 'bg-red-600', href: '/admin/news' },
        { label: 'Total Game', value: stats.games, color: 'bg-amber-500', href: '/admin/games' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {cards.map((c) => (
                    <Link
                        key={c.label}
                        href={c.href}
                        className={`${c.color} text-white rounded-xl p-5 shadow hover:opacity-90 transition`}
                    >
                        <p className="text-sm opacity-80">{c.label}</p>
                        <p className="text-3xl font-bold mt-1">{c.value}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-slate-800">Berita Terbaru</h2>
                    <Link href="/admin/news" className="text-sm text-red-600 hover:underline">Kelola semua &rarr;</Link>
                </div>
                <div className="divide-y">
                    {latestNews.length === 0 && (
                        <p className="text-sm text-slate-500 py-3">Belum ada berita.</p>
                    )}
                    {latestNews.map((n) => (
                        <div key={n.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">{n.title}</p>
                                <span className="text-xs text-slate-500">{n.category}</span>
                            </div>
                            <Link href={`/admin/news/${n.id}/edit`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
