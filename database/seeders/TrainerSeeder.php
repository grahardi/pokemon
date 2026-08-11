<?php

namespace Database\Seeders;

use App\Models\Trainer;
use Illuminate\Database\Seeder;

class TrainerSeeder extends Seeder
{
    public function run(): void
    {
        $trainers = [
            ['name' => 'Ash', 'subtitle' => 'Trainer Kanto', 'icon' => 'bi-award-fill', 'gradient_from' => '#EF4444', 'gradient_to' => '#3B82F6', 'order' => 1],
            ['name' => 'Blue', 'subtitle' => 'Rival Tangguh', 'icon' => 'bi-shield-fill', 'gradient_from' => '#A855F7', 'gradient_to' => '#4F46E5', 'order' => 2],
            ['name' => 'Red', 'subtitle' => 'Juara Legendaris', 'icon' => 'bi-mountain', 'gradient_from' => '#334155', 'gradient_to' => '#B91C1C', 'order' => 3],
            ['name' => 'Team Rocket', 'subtitle' => 'Trio Pengacau', 'icon' => 'bi-lightning-charge-fill', 'gradient_from' => '#0F172A', 'gradient_to' => '#7F1D1D', 'order' => 4],
        ];

        foreach ($trainers as $t) {
            Trainer::query()->updateOrCreate(['name' => $t['name']], $t);
        }
    }
}
