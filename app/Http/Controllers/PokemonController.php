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

        return view('pokemon.show', compact('pokemon', 'prev', 'next'));
    }
}
