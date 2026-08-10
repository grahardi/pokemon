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

        $pokemons = $query->orderBy('dex_number')->paginate(24)->withQueryString();

        $types = [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
            'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
            'Dragon', 'Dark', 'Steel', 'Fairy',
        ];

        return view('pokemon.index', compact('pokemons', 'types'));
    }

    public function show(Pokemon $pokemon)
    {
        $prev = Pokemon::where('dex_number', '<', $pokemon->dex_number)->orderByDesc('dex_number')->first();
        $next = Pokemon::where('dex_number', '>', $pokemon->dex_number)->orderBy('dex_number')->first();

        return view('pokemon.show', compact('pokemon', 'prev', 'next'));
    }
}
