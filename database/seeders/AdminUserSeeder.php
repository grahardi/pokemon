<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@pokemon.id'],
            [
                'name' => 'Admin Pokemon.id',
                'password' => Hash::make('ubah-password-ini'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin default: admin@pokemon.id / ubah-password-ini — segera ganti password setelah login pertama.');
    }
}
