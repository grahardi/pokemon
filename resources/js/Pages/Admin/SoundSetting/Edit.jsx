import AdminLayout from '../../../Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';

const SLOTS = [
    { key: 'attack', label: 'Suara Serang', desc: 'Dimainkan tiap kali karakter melancarkan skill', field: 'attack_sound_url' },
    { key: 'hit', label: 'Suara Kena Hit', desc: 'Dimainkan saat damage masuk ke target', field: 'hit_sound_url' },
    { key: 'pick', label: 'Suara Pilih Trainer (default)', desc: 'Dipakai kalau trainer tidak punya suara sendiri', field: 'pick_sound_url' },
    { key: 'battle_start', label: 'Suara Mulai Battle', desc: 'Dimainkan tiap kali pertarungan baru dimulai', field: 'battle_start_sound_url' },
    { key: 'pokemon_faint', label: 'Suara Pokemon Sendiri Pingsan', desc: 'Dimainkan saat Pokemon di tim pemain pingsan', field: 'pokemon_faint_sound_url' },
    { key: 'enemy_faint', label: 'Suara Pokemon Lawan Pingsan', desc: 'Dimainkan saat Pokemon lawan pingsan', field: 'enemy_faint_sound_url' },
    { key: 'gacha', label: 'Suara Gacha (umum)', desc: 'Dimainkan saat dapat hasil gacha tier biasa', field: 'gacha_sound_url' },
    { key: 'gacha_legendary', label: 'Suara Gacha Legendaris', desc: 'Suara spesial saat dapat gacha tier Legendaris', field: 'gacha_legendary_sound_url' },
    { key: 'win', label: 'Suara Menang', desc: 'Dimainkan di layar hasil kemenangan', field: 'win_sound_url' },
    { key: 'lose', label: 'Suara Kalah', desc: 'Dimainkan di layar hasil kekalahan', field: 'lose_sound_url' },
];

export default function Edit({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        attack: null,
        hit: null,
        pick: null,
        battle_start: null,
        pokemon_faint: null,
        enemy_faint: null,
        gacha: null,
        gacha_legendary: null,
        win: null,
        lose: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/sound');
    };

    const resetSlot = (slot) => {
        if (confirm('Kembalikan ke suara default (sintesis otomatis)?')) {
            router.post('/admin/sound/reset', { slot });
        }
    };

    return (
        <AdminLayout title="Pengaturan Suara Arena Tarung">
            <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                Upload file suara sendiri untuk tiap efek (opsional). Format yang didukung: <strong>MP3</strong> (disarankan,
                paling ringan &amp; kompatibel di semua browser), WAV, atau OGG. Maks 2MB per file. Kalau tidak diisi,
                situs otomatis pakai suara sintesis bawaan (tanpa file).
            </p>

            <form onSubmit={submit} className="space-y-4 max-w-2xl">
                {SLOTS.map((slot) => (
                    <div key={slot.key} className="bg-white rounded-xl shadow p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-slate-800">{slot.label}</h3>
                                <p className="text-xs text-slate-400">{slot.desc}</p>
                            </div>
                            {setting[slot.field] && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full shrink-0">Custom aktif</span>
                            )}
                        </div>

                        {setting[slot.field] && (
                            <div className="flex items-center gap-3 mb-3 bg-slate-50 rounded-lg p-2">
                                <audio controls src={setting[slot.field]} className="h-8 flex-1" />
                                <button
                                    type="button"
                                    onClick={() => resetSlot(slot.key)}
                                    className="text-xs text-red-500 hover:underline shrink-0"
                                >
                                    Reset ke default
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                            onChange={(e) => setData(slot.key, e.target.files?.[0] || null)}
                            className="w-full text-sm rounded-lg border border-slate-300 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-slate-100 file:text-slate-700 file:font-medium hover:file:bg-slate-200"
                        />
                        {errors[slot.key] && <p className="text-red-600 text-xs mt-1">{errors[slot.key]}</p>}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                >
                    Simpan Semua Perubahan
                </button>
            </form>
        </AdminLayout>
    );
}
