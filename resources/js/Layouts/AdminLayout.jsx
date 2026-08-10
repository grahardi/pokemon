import { Link, usePage, router } from '@inertiajs/react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/news', label: 'Berita', icon: '📰' },
    { href: '/admin/games', label: 'Game', icon: '🎮' },
    { href: '/admin/pokemon', label: 'Katalog Pokemon', icon: '📕' },
];

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const { auth, flash } = props;

    const logout = (e) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen flex bg-slate-100">
            <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0">
                <div className="px-5 py-4 border-b border-slate-800">
                    <span className="text-lg font-extrabold text-white">Pokemon<span className="text-amber-400">.id</span></span>
                    <p className="text-xs text-slate-400 mt-0.5">Panel Admin</p>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const active = item.href === '/admin'
                            ? url === '/admin'
                            : url.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    active
                                        ? 'bg-red-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-3 py-4 border-t border-slate-800">
                    <div className="px-3 py-2 text-xs text-slate-400 truncate">{auth?.user?.email}</div>
                    <a
                        href="/admin/logout"
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        🚪 Keluar
                    </a>
                    <Link href="/" className="block px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
                        &larr; Lihat situs publik
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b px-6 py-4 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                </header>

                <main className="flex-1 p-6">
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-3 text-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm">
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
