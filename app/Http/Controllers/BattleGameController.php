<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
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
     * Ambil N Pokemon acak dengan data siap-tarung (stats, tipe, gambar, 4 skill terkuat).
     * Support filter min_bst/max_bst (total base stat) untuk level difficulty di mode Challenge.
     */
    public function randomPokemon(Request $request)
    {
        $count = min(10, max(1, (int) $request->get('count', 3)));
        $excludeIds = array_filter(explode(',', $request->get('exclude', '')));
        $minBst = $request->get('min_bst');
        $maxBst = $request->get('max_bst');

        $query = Pokemon::query()
            ->when($excludeIds, fn ($q) => $q->whereNotIn('id', $excludeIds));

        if ($minBst || $maxBst) {
            $query->whereRaw(
                '(hp + attack + defense + sp_attack + sp_defense + speed) BETWEEN ? AND ?',
                [$minBst ?: 0, $maxBst ?: 9999]
            );
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
