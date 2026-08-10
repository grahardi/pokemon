<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use Illuminate\Http\Request;

class PokemonController extends Controller
{
    public function index(Request $request)
    {
        $query = Pokemon::query();

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('dex_number', 'like', "%{$search}%");
            });
        }

        if ($type = $request->string('type')->trim()->toString()) {
            $query->whereJsonContains('types', $type);
        }

        if ($generation = $request->string('generation')->trim()->toString()) {
            $query->where('generation', $generation);
        }

        $pokemons = $query->orderBy('dex_number')->paginate(24)->withQueryString();

        $types = [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
            'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
            'Dragon', 'Dark', 'Steel', 'Fairy',
        ];

        $generations = [
            1 => 'Gen 1 (Kanto)', 2 => 'Gen 2 (Johto)', 3 => 'Gen 3 (Hoenn)',
            4 => 'Gen 4 (Sinnoh)', 5 => 'Gen 5 (Unova)', 6 => 'Gen 6 (Kalos)',
            7 => 'Gen 7 (Alola)', 8 => 'Gen 8 (Galar/Hisui)',
        ];

        return view('pokemon.index', compact('pokemons', 'types', 'generations'));
    }

    public function show(Pokemon $pokemon)
    {
        $prev = Pokemon::where('dex_number', '<', $pokemon->dex_number)->orderByDesc('dex_number')->first();
        $next = Pokemon::where('dex_number', '>', $pokemon->dex_number)->orderBy('dex_number')->first();

        $evolutions = $this->buildEvolutionChain($pokemon);

        return view('pokemon.show', compact('pokemon', 'prev', 'next', 'evolutions'));
    }

    /**
     * Susun rantai evolusi jadi array bertingkat (stage), tiap stage berisi
     * satu atau lebih Pokemon (untuk kasus evolusi bercabang seperti Eevee).
     *
     * @return array<int, \Illuminate\Support\Collection>
     */
    private function buildEvolutionChain(Pokemon $pokemon): array
    {
        if (! $pokemon->evolution_chain_id) {
            return [];
        }

        $family = Pokemon::where('evolution_chain_id', $pokemon->evolution_chain_id)
            ->orderBy('dex_number')
            ->get(['id', 'dex_number', 'slug', 'name', 'types', 'evolves_from', 'image_url']);

        if ($family->count() < 2) {
            return [];
        }

        $stages = [];
        $current = $family->whereNull('evolves_from')->values();
        $seen = [];

        while ($current->isNotEmpty()) {
            $stages[] = $current;
            foreach ($current as $p) {
                $seen[$p->dex_number] = true;
            }

            $current = $family->filter(
                fn ($p) => in_array($p->evolves_from, array_keys($seen), true) && ! isset($seen[$p->dex_number])
            )->values();
        }

        return $stages;
    }
}
