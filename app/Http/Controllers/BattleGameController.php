<?php

namespace App\Http\Controllers;

use App\Models\GachaSetting;
use App\Models\Pokemon;
use App\Models\SoundSetting;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BattleGameController extends Controller
{
    public function index()
    {
        return Inertia::render('Game/Battle', [
            'totalPokemon' => Pokemon::count(),
        ]);
    }

    /**
     * Daftar trainer aktif untuk dipilih pemain (dikelola admin).
     */
    public function trainers()
    {
        return response()->json(
            Trainer::query()->active()->orderBy('order')->get()
        );
    }

    /**
     * URL suara custom yang di-upload admin (kalau ada), dipakai frontend
     * sebagai pengganti suara sintesis default.
     */
    public function sounds()
    {
        $setting = SoundSetting::current();

        return response()->json([
            'attack' => $setting->attack_sound_url,
            'hit' => $setting->hit_sound_url,
            'win' => $setting->win_sound_url,
            'lose' => $setting->lose_sound_url,
        ]);
    }

    /**
     * Roll tier gacha server-side berdasarkan persentase yang diatur admin
     * (/admin/gacha). Dipakai mode Challenge tiap kelipatan 3x menang.
     */
    public function gachaRoll()
    {
        $settings = GachaSetting::current();

        $weights = [
            'legendary' => max(0, $settings->legendary_percent),
            'secondEvo' => max(0, $settings->second_evo_percent),
            'nonEvo' => max(0, $settings->non_evo_percent),
            'bonusEvolution' => max(0, $settings->bonus_evolution_percent),
        ];

        $total = array_sum($weights);

        if ($total <= 0) {
            $weights = ['legendary' => 10, 'secondEvo' => 20, 'nonEvo' => 30, 'bonusEvolution' => 50];
            $total = 110;
        }

        $roll = mt_rand(1, $total);
        $cumulative = 0;
        $tier = 'nonEvo';

        foreach ($weights as $key => $weight) {
            $cumulative += $weight;
            if ($roll <= $cumulative) {
                $tier = $key;
                break;
            }
        }

        return response()->json(['tier' => $tier]);
    }

    /**
     * Ambil N Pokemon acak dengan data siap-tarung (stats, tipe, gambar, 4 skill terkuat).
     * Support filter min_bst/max_bst (total base stat) untuk level difficulty di mode Challenge.
     */
    public function randomPokemon(Request $request)
    {
        $count = min(10, max(1, (int) $request->get('count', 3)));
        $excludeIds = array_filter(explode(',', $request->get('exclude', '')));
        $minBst = $request->get('min_bst');
        $maxBst = $request->get('max_bst');
        $evolvableOnly = $request->boolean('evolvable_only');
        $hasEvolved = $request->boolean('has_evolved');
        $noEvolution = $request->boolean('no_evolution');

        $query = Pokemon::query()
            ->when($excludeIds, fn ($q) => $q->whereNotIn('id', $excludeIds));

        if ($minBst || $maxBst) {
            $query->whereRaw(
                '(hp + attack + defense + sp_attack + sp_defense + speed) BETWEEN ? AND ?',
                [$minBst ?: 0, $maxBst ?: 9999]
            );
        }

        if ($evolvableOnly) {
            // Hanya Pokemon bentuk dasar (belum pernah evolusi) yang masih punya
            // evolusi berikutnya — supaya pilihan tim awal selalu "level 1" murni,
            // bukan Pokemon yang sudah evolusi sebagian (mis. Ivysaur) atau legendaris.
            $evolvableDex = Pokemon::query()
                ->whereNotNull('evolves_from')
                ->pluck('evolves_from')
                ->unique();

            $query->whereIn('dex_number', $evolvableDex)
                ->whereNull('evolves_from');
        }

        if ($hasEvolved) {
            // Pokemon yang sudah evolusi minimal 1x (tier "evolusi tahap 2" di gacha).
            $query->whereNotNull('evolves_from');
        }

        if ($noEvolution) {
            // Pokemon yang sama sekali tidak punya rantai evolusi (tier "non-evolusi" di gacha).
            $evolvableDex = Pokemon::query()
                ->whereNotNull('evolves_from')
                ->pluck('evolves_from')
                ->unique();

            $query->whereNull('evolves_from')
                ->whereNotIn('dex_number', $evolvableDex);
        }

        $pokemons = $query->inRandomOrder()->take($count)->get();

        return response()->json(
            $pokemons->map(fn (Pokemon $p) => $this->formatForBattle($p))->values()
        );
    }

    /**
     * Cari Pokemon spesifik by nama (dipakai untuk boss fight, mis. Mewtwo/Arceus).
     */
    public function findByName(Request $request)
    {
        $names = array_filter(explode(',', $request->get('names', '')));

        if (empty($names)) {
            return response()->json([]);
        }

        $pokemons = Pokemon::query()
            ->where(function ($q) use ($names) {
                foreach ($names as $name) {
                    $q->orWhere('name', 'ilike', trim($name));
                }
            })
            ->get();

        return response()->json(
            $pokemons->map(fn (Pokemon $p) => $this->formatForBattle($p))->values()
        );
    }

    /**
     * Cek kemungkinan evolusi selanjutnya untuk beberapa Pokemon sekaligus (batch),
     * dipakai fitur Evolusi di mode Challenge. Return map dex_number => array opsi evolusi.
     */
    public function evolutions(Request $request)
    {
        $dexNumbers = array_filter(array_map('intval', explode(',', $request->get('dex', ''))));
        $result = [];

        foreach ($dexNumbers as $dex) {
            $current = Pokemon::where('dex_number', $dex)->first();

            if (! $current || ! $current->evolution_chain_id) {
                $result[$dex] = [];
                continue;
            }

            $nextForms = Pokemon::where('evolution_chain_id', $current->evolution_chain_id)
                ->where('evolves_from', $dex)
                ->get();

            $result[$dex] = $nextForms->map(fn (Pokemon $p) => $this->formatForBattle($p))->values();
        }

        return response()->json($result);
    }

    private function formatForBattle(Pokemon $pokemon): array
    {
        $moves = collect($pokemon->moves_level ?? [])
            ->merge($pokemon->moves_machine ?? [])
            ->filter(fn ($m) => ! empty($m['power']) && in_array($m['category'], ['Physical', 'Special'], true))
            ->unique('name')
            ->sortByDesc('power')
            ->take(4)
            ->values()
            ->all();

        if (empty($moves)) {
            $moves = [[
                'name' => 'Tackle',
                'type' => 'Normal',
                'category' => 'Physical',
                'power' => 40,
                'accuracy' => 100,
                'pp' => 35,
            ]];
        }

        return [
            'id' => $pokemon->id,
            'dex_number' => $pokemon->dex_number,
            'name' => $pokemon->name,
            'types' => $pokemon->types,
            'image' => $pokemon->display_image,
            'hp' => $pokemon->hp,
            'attack' => $pokemon->attack,
            'defense' => $pokemon->defense,
            'sp_attack' => $pokemon->sp_attack,
            'sp_defense' => $pokemon->sp_defense,
            'speed' => $pokemon->speed,
            'moves' => $moves,
        ];
    }
}
