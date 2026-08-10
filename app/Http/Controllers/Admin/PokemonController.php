<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pokemon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PokemonController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pokemon::query();

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where('name', 'ilike', "%{$search}%");
        }

        return Inertia::render('Admin/Pokemon/Index', [
            'pokemons' => $query->orderBy('dex_number')->paginate(20)->withQueryString(),
            'filters' => ['q' => $request->get('q', '')],
        ]);
    }

    public function edit(Pokemon $pokemon): Response
    {
        return Inertia::render('Admin/Pokemon/Form', ['pokemon' => $pokemon]);
    }

    public function update(Request $request, Pokemon $pokemon): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'name_japanese' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:255'],
            'hp' => ['required', 'integer', 'min:0', 'max:999'],
            'attack' => ['required', 'integer', 'min:0', 'max:999'],
            'defense' => ['required', 'integer', 'min:0', 'max:999'],
            'sp_attack' => ['required', 'integer', 'min:0', 'max:999'],
            'sp_defense' => ['required', 'integer', 'min:0', 'max:999'],
            'speed' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        $pokemon->update($data);

        return redirect()->route('admin.pokemon.index')->with('success', "{$pokemon->name} berhasil diperbarui.");
    }
}
