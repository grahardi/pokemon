<?php

namespace Database\Seeders;

use App\Models\Pokemon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PokemonSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/pokedex.json');

        if (! file_exists($path)) {
            $this->command->warn("File data pokedex.json tidak ditemukan di {$path}");
            return;
        }

        $data = json_decode(file_get_contents($path), true);

        $rows = [];
        $now = now();
        $usedSlugs = [];

        foreach ($data as $item) {
            $baseSlug = Str::slug($item['name']);
            $slug = $baseSlug;

            if (isset($usedSlugs[$slug])) {
                $slug = $baseSlug . '-' . $item['dex_number'];
            }
            $usedSlugs[$slug] = true;

            $rows[] = [
                'dex_number' => $item['dex_number'],
                'slug' => $slug,
                'name' => $item['name'],
                'name_japanese' => $item['name_japanese'] ?? null,
                'types' => json_encode($item['types']),
                'generation' => $item['generation'] ?? 1,
                'genus' => $item['genus'] ?? null,
                'height_m' => $item['height_m'] ?? null,
                'weight_kg' => $item['weight_kg'] ?? null,
                'evolution_chain_id' => $item['evolution_chain_id'] ?? null,
                'evolves_from' => $item['evolves_from'] ?? null,
                'abilities' => json_encode($item['abilities'] ?? []),
                'moves_level' => json_encode($item['moves_level'] ?? []),
                'moves_machine' => json_encode($item['moves_machine'] ?? []),
                'hp' => $item['hp'],
                'attack' => $item['attack'],
                'defense' => $item['defense'],
                'sp_attack' => $item['sp_attack'],
                'sp_defense' => $item['sp_defense'],
                'speed' => $item['speed'],
                'description' => $item['description'] ?? null,
                'image_url' => sprintf(
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/%d.png',
                    $item['dex_number']
                ),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Insert per chunk supaya aman untuk driver PostgreSQL (chunk kecil karena payload JSON moveset cukup besar)
        foreach (array_chunk($rows, 50) as $chunk) {
            Pokemon::query()->upsert(
                $chunk,
                ['dex_number'],
                ['slug', 'name', 'name_japanese', 'types', 'generation', 'genus', 'height_m', 'weight_kg', 'evolution_chain_id', 'evolves_from', 'abilities', 'moves_level', 'moves_machine', 'description', 'hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed', 'image_url', 'updated_at']
            );
        }

        $this->command->info(count($rows) . ' pokemon berhasil di-seed.');
    }
}
