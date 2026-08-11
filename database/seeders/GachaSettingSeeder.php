<?php

namespace Database\Seeders;

use App\Models\GachaSetting;
use Illuminate\Database\Seeder;

class GachaSettingSeeder extends Seeder
{
    public function run(): void
    {
        if (GachaSetting::query()->count() === 0) {
            GachaSetting::create([
                'legendary_percent' => 10,
                'second_evo_percent' => 20,
                'non_evo_percent' => 30,
                'bonus_evolution_percent' => 50,
            ]);
        }
    }
}
