<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PokemonSeeder::class,
            GameSeeder::class,
            NewsSeeder::class,
        ]);
    }
}
